import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

// Reuse the connection pool during development hot reloads. Initialize only at
// request time so builds never need a database connection or production secrets.
const globalAuth = globalThis as unknown as { authMongo?: MongoClient };

function createAuth() {
  const uri = process.env.MONGODB_URI;
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!uri || !secret) throw new Error("Authentication configuration is incomplete.");
  const client = globalAuth.authMongo ?? new MongoClient(uri, {
    serverSelectionTimeoutMS: 10_000,
  });
  globalAuth.authMongo = client;
  return betterAuth({
    appName: "Guitar Notes",
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret,
    database: mongodbAdapter(client.db(process.env.MONGODB_DB_NAME || undefined)),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        prompt: "select_account",
      },
    } : {},
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      // Navigation and prefetches validate sessions frequently. Keep credential
      // endpoints on Better Auth's strict defaults, with a separate read budget.
      customRules: { "/get-session": { window: 60, max: 1000 } },
    },
  });
}

let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  return instance ??= createAuth();
}
