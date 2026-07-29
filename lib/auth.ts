import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { nextCookies } from "better-auth/next-js";

const getBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

const baseUrl = getBaseUrl();

const trustedOrigins = [
  "http://localhost:3000",
  "https://*.vercel.app",
  "https://*.ngrok-free.app",
  "https://*.ngrok-free.dev",
  "https://*.ngrok.io",
];

if (baseUrl && !trustedOrigins.includes(baseUrl)) {
  trustedOrigins.push(baseUrl);
}

if (process.env.BETTER_AUTH_URL && !trustedOrigins.includes(process.env.BETTER_AUTH_URL)) {
  trustedOrigins.push(process.env.BETTER_AUTH_URL);
}

if (process.env.VERCEL_URL && !trustedOrigins.includes(`https://${process.env.VERCEL_URL}`)) {
  trustedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

export const auth = betterAuth({
  baseURL: baseUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
  logger: {
    level: "debug",
  },
});
