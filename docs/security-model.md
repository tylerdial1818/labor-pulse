# Security Model

## Access Patterns

Supported target patterns:

- Public URL with non-sensitive aggregate data
- Invite-only app with email/domain restrictions
- SSO through client identity provider
- Locked internal app behind VPN or platform access controls

## Current Template State

- Labor Pulse v1 is public and does not use user authentication.
- Secret placeholders belong in `.env.example`; real values stay in local/deployment secret stores.
- Server-only data boundary: `src/server`, `src/lib/db`, `src/lib/fred`, `src/lib/llm`.
- Browser-safe public variables only use `NEXT_PUBLIC_`.
- Service-only cron route requires `Authorization: Bearer $CRON_SECRET`.

## Rules

- Do not store secrets in source control.
- Do not put privileged values in `NEXT_PUBLIC_` variables.
- Enforce cron authorization before any refresh attempt.
- Validate and sanitize any user-provided filters before using them in queries.
- Prefer server components/server functions for sensitive data loading.
- Log operational details without exposing client data or credentials.
- Never call FRED, Neon, or OpenAI directly from browser code.
- LLM definitions must not include numbers, current statistics, or quantitative claims.

## Threat Checklist

- [x] No user auth in v1; public aggregate data only.
- [ ] Cron bearer secret enforced server-side.
- [ ] Data source credentials stored in deployment secret manager.
- [ ] Export endpoints expose only public aggregate indicator data.
- [ ] Public dashboards contain only approved public data and methodology notes.
