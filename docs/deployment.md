# Deployment

## Recommended Default

Use Vercel for standard Next.js analytical apps unless client requirements call for another platform.

## Required Checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Environment Variables

| Variable | Required | Scope | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Yes | Browser-safe | Display name |
| `NEXT_PUBLIC_APP_URL` | Yes | Browser-safe | Public app URL |
| `DATABASE_URL` | Production | Server secret | Neon Postgres connection string; local v1 falls back to `data/labor-pulse-store.json` |
| `FRED_API_KEY` | Yes | Server secret | FRED API key |
| `OPENAI_API_KEY` | Yes | Server secret | Used only for cached prose definitions |
| `OPENAI_MODEL_DEFINITIONS` | No | Server config | Defaults to `gpt-4o-mini` |
| `CRON_SECRET` | Yes | Server secret | Bearer token for `/api/cron/refresh-fred` |

## Vercel Steps

1. Import the GitHub repository.
2. Set framework preset to Next.js.
3. Add environment variables for preview and production.
4. Confirm public app URL and domain for each environment.
5. Configure Vercel Cron: `0 8 * * *` for `/api/cron/refresh-fred`.
6. Run a preview deployment and validate data freshness, cron auth, and exports.
7. Promote to production after stakeholder approval.

## Release Handoff

- Deployment URL:
- Commit SHA:
- Environment:
- Data source version/freshness:
- Known issues:
- Rollback plan:
