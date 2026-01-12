import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // Database adapter removed - Prisma has been removed from this project
  // You'll need to configure a database adapter if you want to use better-auth
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "change-this-secret-in-production",
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Session = typeof auth.$Infer.Session;
