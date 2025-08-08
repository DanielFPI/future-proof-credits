# Future Proof Credits Web App — Instant Deploy (Vercel)

This repo is set up so you can deploy from the Vercel UI without touching the terminal.

## One‑click-ish Deploy (UI only)

1. Create a free account at **Vercel**.
2. Click **New Project** → **Import** → **Upload** and select this ZIP.
3. When asked for Environment Variables, add the following:
   - `DATABASE_URL` → **Paste the value of `POSTGRES_PRISMA_URL`** from the Vercel Postgres integration (next step).
4. In the same project, go to **Storage → Add → Postgres** (Vercel Postgres). This will create DB credentials automatically.
5. After adding Postgres, open the **Environment Variables** tab in the Vercel project and copy the value of `POSTGRES_PRISMA_URL` into `DATABASE_URL` (create it if missing).
6. Click **Deploy**.

During build, Vercel runs:

```
npm run vercel-build
# which does:
# prisma generate
# prisma db push  (creates the tables automatically)
# next build
```

## Try the Live API

- Home: `/`
- Health: `/api/health`
- Listings:
  - `GET /api/listings`
  - `POST /api/listings` with JSON `{ "title": "My Service", "price": 150 }`
- Booking (escrow hold):
  - `POST /api/bookings` with JSON `{ "listingId": "<id from listings>" }`

> Note: This is a prototype. Auth, billing, and RBAC are not wired yet in this build. We can add NextAuth + Stripe next.
