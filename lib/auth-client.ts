"use client";

import { createAuthClient } from "better-auth/react";

// Same-origin requests keep credentials and environment URLs out of the bundle.
export const authClient = createAuthClient();
