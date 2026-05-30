# Security Model

## Access Patterns

Supported target patterns:

- Public URL with non-sensitive aggregate data
- Invite-only app with email/domain restrictions
- SSO through client identity provider
- Locked internal app behind VPN or platform access controls

## Current Template State

- Auth configuration placeholder: `src/lib/auth/auth-options.ts`
- Secret placeholders: `.env.example`
- Server-only data boundary: `src/server`
- Database placeholder: `src/lib/db/client.ts`

## Rules

- Do not store secrets in source control.
- Do not put privileged values in `NEXT_PUBLIC_` variables.
- Enforce authorization before fetching client-sensitive data.
- Validate and sanitize any user-provided filters before using them in queries.
- Prefer server components/server functions for sensitive data loading.
- Log operational details without exposing client data or credentials.

## Threat Checklist

- [ ] Auth provider configured and callback URLs verified.
- [ ] Role or tenant checks enforced server-side.
- [ ] Data source credentials stored in deployment secret manager.
- [ ] Export endpoints require authorization.
- [ ] Public dashboards contain only approved aggregate data.
