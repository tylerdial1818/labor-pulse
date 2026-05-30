# Security/Auth Agent Task

## Objective

Implement and review authentication, authorization, secret handling, and data exposure controls.

## Scope

- Auth provider setup
- Session and role checks
- Environment variable safety
- Security documentation
- Sensitive data review

## Allowed Files

- `src/lib/auth/**`
- `src/server/**`
- `src/app/api/**`
- `.env.example`
- `docs/security-model.md`
- `docs/deployment.md`

## Forbidden Files

- UI redesigns
- Metric formula changes
- Real secret values
- Client data fixtures unless anonymized

## Implementation Steps

1. Identify the access model from the product brief.
2. Configure provider and server-side authorization checks.
3. Ensure secrets are server-only and documented.
4. Review data exposure in routes, exports, and logs.
5. Update security docs.

## Test Commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Handoff Requirements

- Auth model implemented
- Env vars added
- Authorization assumptions
- Security risks and mitigations
