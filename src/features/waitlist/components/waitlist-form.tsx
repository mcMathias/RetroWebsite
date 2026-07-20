"use client";

import { useActionState } from "react";
import { subscribeToWaitlist, type WaitlistFormState } from "../actions";

export function WaitlistForm() {
    const [state, formAction, isPending] = useActionState<WaitlistFormState | null, FormData>(
        subscribeToWaitlist,
        null
    );

    return (
        <form action={formAction} className="w-full max-w-md">
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    name="email"
                    placeholder="Din email adresse"
                    required
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-purple-500/30 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <input type="hidden" name="source" value="landing_page" />
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                    {isPending ? "Tilmelder..." : "Tilmeld mig! 💜"}
                </button>
            </div>
            {state && (
                <p
                    className={`mt-3 text-sm ${state.success ? "text-green-400" : "text-red-400"
                        }`}
                >
                    {state.message}
                </p>
            )}
        </form>
    );
}
