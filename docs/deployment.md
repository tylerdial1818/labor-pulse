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
| `AUTH_SECRET` | Yes when auth enabled | Server secret | Generate per environment |
| `DATABASE_URL` | When DB enabled | Server secret | Use secret manager |
| `ANALYTICS_API_BASE_URL` | When API enabled | Server config | No credentials |
| `ANALYTICS_API_KEY` | When API enabled | Server secret | Never expose publicly |

## Vercel Steps

1. Import the GitHub repository.
2. Set framework preset to Next.js.
3. Add environment variables for preview and production.
4. Configure auth callback URLs for each deployment domain.
5. Run a preview deployment and validate data freshness, auth, and exports.
6. Promote to production after stakeholder approval.

## Release Handoff

- Deployment URL:
- Commit SHA:
- Environment:
- Data source version/freshness:
- Known issues:
- Rollback plan:
