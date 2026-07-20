"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const waitlistSchema = z.object({
    email: z.string().email("Indtast en gyldig email"),
    name: z.string().optional(),
    source: z.string().optional(),
});

export type WaitlistFormState = {
    success: boolean;
    message: string;
};

export async function subscribeToWaitlist(
    _prevState: WaitlistFormState | null,
    formData: FormData
): Promise<WaitlistFormState> {
    const rawData = {
        email: formData.get("email"),
        name: formData.get("name"),
        source: formData.get("source") ?? "landing_page",
    };

    const parsed = waitlistSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            message: parsed.error.issues[0]?.message ?? "Ugyldig data",
        };
    }

    try {
        // Check if already subscribed
        const existing = await db.waitlistSubscriber.findUnique({
            where: { email: parsed.data.email },
        });

        if (existing) {
            return {
                success: true,
                message: "Du er allerede tilmeldt ventelisten! 🎮",
            };
        }

        await db.waitlistSubscriber.create({
            data: {
                email: parsed.data.email,
                name: parsed.data.name,
                source: parsed.data.source,
            },
        });

        return {
            success: true,
            message: "Du er nu tilmeldt ventelisten! Vi skriver når vi åbner 🎮",
        };
    } catch {
        return {
            success: false,
            message: "Der opstod en fejl. Prøv igen senere.",
        };
    }
}
