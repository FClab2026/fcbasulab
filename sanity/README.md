# Sanity Setup — What you need to do

Phase 0 code is in place. To activate it:

## 1. Create the Sanity project (5 min, browser)

1. Go to https://sanity.io/manage → **Create new project**
2. Pick a name (e.g. "Chem Web"), dataset: **production**
3. Copy the **Project ID** (looks like `abc12def`)
4. Settings → **API** → **Tokens** → **Add API token**
   - Name: "Migration script"
   - Permissions: **Editor**
   - Copy the token (shown once)

## 2. Add env vars to `.env.local`

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<paste project id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_WRITE_TOKEN=<paste editor token>
SANITY_REVALIDATE_SECRET=<any random string, you'll paste it in Sanity webhook config later>
```

## 3. Verify Studio works

```
npm run dev
```

Open http://localhost:3000/studio — you should see Sanity Studio with the 9 doc types in the sidebar. Empty for now.

## 4. Add CORS origin for Studio

In https://sanity.io/manage → your project → **API** → **CORS origins**:
- Add `http://localhost:3000` (allow credentials)
- Add your production URL when you deploy

## 5. Migrate data

```
npm run migrate:sanity alumni       # one type at a time, easiest first
npm run migrate:sanity awards
npm run migrate:sanity news
npm run migrate:sanity equipments
npm run migrate:sanity researchAreas
npm run migrate:sanity gallery
npm run migrate:sanity publications
npm run migrate:sanity projects
npm run migrate:sanity groupMembers

# or all at once:
npm run migrate:sanity all
```

The script is idempotent — re-running replaces docs in place.

## 6. Configure revalidation webhook (after first deploy)

In Sanity dashboard → **API** → **Webhooks** → **Create webhook**:
- URL: `https://<your-domain>/api/revalidate`
- Dataset: `production`
- Trigger on: Create, Update, Delete
- Filter: leave empty (all types)
- Secret: same value as `SANITY_REVALIDATE_SECRET` in your env
- HTTP method: POST
- API version: `2025-01-01`

## What's NOT done yet (Phase 1+)

Phase 0 only ships:
- Schemas + Studio at `/studio`
- Migration script
- Revalidation webhook receiver

The public site still reads from Prisma. Phase 1 swaps `lib/load_data/*` files one type at a time. Phase 2 builds the promote-to-alumni custom action. Phase 4 deletes the old admin.
