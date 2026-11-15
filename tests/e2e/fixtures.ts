import { test as base, expect, type APIRequestContext } from "@playwright/test";
import { randomUUID } from "node:crypto";

type SessionState = Awaited<ReturnType<APIRequestContext["storageState"]>>;

// Application tests enter through real auth. Each worker has its own account
// and session; authentication tests continue to use an unauthenticated context.
export const test = base.extend<object, { workerSession: SessionState }>({
  workerSession: [async ({ playwright }, provide, workerInfo) => {
    const baseURL = workerInfo.project.use.baseURL!;
    const api = await playwright.request.newContext({ baseURL });
    const response = await api.post("/api/auth/sign-up/email", {
      headers: { Origin: baseURL },
      data: { name: "Browser Test Musician", email: `browser-${randomUUID()}@example.com`, password: randomUUID() },
    });
    if (!response.ok()) throw new Error(`Could not create the browser test session (HTTP ${response.status()}). Check the development MongoDB and auth environment.`);
    await provide(await api.storageState());
    await api.post("/api/auth/sign-out", { headers: { Origin: baseURL }, data: {} });
    await api.dispose();
  }, { scope: "worker" }],
  storageState: async ({ workerSession }, provide) => { await provide(workerSession); },
});

export { expect };
