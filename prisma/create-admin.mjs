import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before running this command.",
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_EMAIL must be a valid email address.");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
  }

  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });
  if (existingAdmin) {
    throw new Error(
      "An admin account already exists. Sign in and create additional users from the Users page.",
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error(
      "That email already belongs to an account. Choose another email for the first admin.",
    );
  }

  const admin = await prisma.user.create({
    data: { name, email, passwordHash: hashPassword(password), role: "ADMIN" },
    select: { name: true, email: true, role: true },
  });
  console.log(
    `Created ${admin.role} account for ${admin.email}. You can now sign in.`,
  );
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
