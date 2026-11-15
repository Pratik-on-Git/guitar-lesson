# Individual accounts

The app uses Better Auth with MongoDB for email/password accounts, Google OAuth, and seven-day database-backed sessions. `/sign-up` and `/sign-in` are public standalone pages. All application routes require sign-in. `proxy.ts` checks the actual database session on every application request, including client navigation and prefetches, and redirects guests to `/sign-in?next=...`. Non-auth API routes return 401 to guests. Auth pages, auth endpoints (including Google callbacks), framework assets, and the favicon remain public. Session validation fails closed if the database is unavailable. `/account` also validates its session on the server. The toolbar links to the current account.

## Local setup

1. Set `MONGODB_URI` in `.env` to a MongoDB connection string with a database name. Use `MONGODB_DB_NAME` to override that name if needed. The database user needs read/write and index creation permissions.
2. Set `BETTER_AUTH_URL=http://localhost:3000` in `.env.development` to override the production URL in `.env` during `npm run dev`. Keep a random `BETTER_AUTH_SECRET` of at least 32 characters in `.env`. Generate it with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`. Keep the secret stable across restarts and instances.
3. Run `npm install` and `npm run dev`. Create an account at `/sign-up`.

MongoDB collections and indexes are managed by the adapter; no SQL migration is needed. Authentication initializes on the first request, not during builds. Passwords are hashed by Better Auth; sessions use HttpOnly cookies. Authentication requests have database-backed rate limiting. Credential endpoints retain Better Auth’s strict defaults; the read-only session endpoint has a separate limit of 1,000 requests per minute to accommodate navigation, prefetches, and shared networks. Do not place secrets in `NEXT_PUBLIC_` variables.

## Enable Google sign-up and sign-in

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select or create a project. In Google Auth Platform, configure Branding, Audience, and the OAuth consent screen. For a testing app, add your Google account as a test user.
2. Create an OAuth client with application type **Web application**.
3. Add `http://localhost:3000` as an authorized JavaScript origin and `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. Use the exact scheme, host, and port from `BETTER_AUTH_URL`.
4. Copy the client ID and client secret into `.env` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Restart the development server. For production, rebuild after setting them.
5. Choose **Continue with Google** on either auth page. Google creates a new individual account or signs into an existing Google account, then returns to the originally requested application page, or the overview by default. A cancellation or failed callback returns to the form with an error.

Without credentials the Google button is disabled with a clear explanation; email/password remains available. Never use placeholder Google credentials in production.

Follow the [Better Auth Google guide](https://better-auth.com/docs/authentication/google) for provider configuration and the [MongoDB adapter guide](https://better-auth.com/docs/adapters/mongo) for persistence details.

## Deployment

Set the same environment variables in your hosting environment, change `BETTER_AUTH_URL` to the public HTTPS origin, and register the corresponding Google origin and `/api/auth/callback/google` redirect URI. Ensure the MongoDB firewall permits connections from the host. All instances must use the same database and auth secret. Session and account responses must not be publicly cached.

The production domain is `https://guitar-lesson-nine.vercel.app`. In Vercel project settings, configure these variables for the **Production** environment, then redeploy:

| Variable | Value |
| --- | --- |
| `BETTER_AUTH_URL` | `https://guitar-lesson-nine.vercel.app` |
| `BETTER_AUTH_SECRET` | Your existing secret from `.env` |
| `MONGODB_URI` | Your existing MongoDB connection string |
| `MONGODB_DB_NAME` | Only if overriding the database in the connection string |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID, when configured |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret, when configured |

In Google Cloud, register `https://guitar-lesson-nine.vercel.app` as an authorized JavaScript origin and `https://guitar-lesson-nine.vercel.app/api/auth/callback/google` as an authorized redirect URI. Keep the localhost entries for development. The local `.env` files are ignored by Git and do not update Vercel settings automatically. Do not copy `.env.development` to Vercel.

Email verification and password recovery require a transactional email service and are not enabled. Email/password accounts therefore show “Not verified”; Google verifies its own email addresses. Study progress and practice sessions still use the existing browser storage and are not synced or isolated by account. The account pages disclose that behavior.

## Verification

`npx playwright test tests/e2e/auth.spec.ts` exercises validation, safe return paths, navigation, and guest protection across application routes and prefetch requests. To also exercise real account creation, sign-out, invalid credentials, and persistent sign-in against MongoDB, set `AUTH_E2E_LIVE=1`. Application tests use `tests/e2e/fixtures.ts` to create one real account per worker and revoke its session afterward. Live auth tests and application tests create uniquely named accounts in the configured database; use a development database. They do not delete user data. Google consent is tested manually with real credentials.

The browser session guard also hides cached application screens after session loss or cross-tab sign-out. Successful email sign-in and sign-out use a full navigation to clear the previous client route cache. Return destinations are restricted to local application paths and persist when switching between auth forms.
