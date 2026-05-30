# Deployment/DevOps Agent Task

## Objective

Prepare reliable preview and production deployment with documented environment configuration.

## Scope

- Build configuration
- Deployment documentation
- Environment variable inventory
- Platform setup notes
- Release checklist

## Allowed Files

- `next.config.ts`
- `package.json`
- `.env.example`
- `docs/deployment.md`
- Platform config files when needed

## Forbidden Files

- Real secret values
- Product metrics or formulas
- UI redesigns
- Auth policy changes without Security/Auth approval

## Implementation Steps

1. Confirm target deployment platform.
2. Verify build and runtime commands.
3. Document environment variables and callback URLs.
4. Add platform config only when needed.
5. Produce release handoff with rollback notes.

## Test Commands

```bash
npm run check
npm run build
```

## Handoff Requirements

- Platform target
- Env vars required
- Build result
- Deployment URL or pending steps
- Rollback plan
