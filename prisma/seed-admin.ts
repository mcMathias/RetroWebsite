/**
 * Seed script: Create an admin user for development.
 *
 * Usage: npx tsx prisma/seed-admin.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/auth/password";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not set");
  }

  const adapter = new PrismaPg({ connectionString });
  const db = new PrismaClient({ adapter });

  const email = "admin@retroshop.dk";
  const password = "Admin123!";

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    await db.$disconnect();
    return;
  }

  const hashedPassword = hashPassword(password);

  await db.user.create({
    data: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user created:`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role: ADMIN`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
