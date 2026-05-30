# Integration Checklist

Use this checklist before final merge, preview deployment, or client handoff.

## Context And Contracts

- [ ] `docs/context-brief.md` reflects current workstreams, priorities, risks, and file ownership.
- [ ] `docs/decision-log.md` includes new architecture, security, data, or deployment decisions.
- [ ] `docs/api-contracts.md` reflects endpoint/server-function changes.
- [ ] `docs/data-contracts.md` reflects source, schema, transformation, and metric changes.
- [ ] `docs/metric-definitions.md` matches UI labels and analytics code.
- [ ] `docs/security-model.md` reflects auth, authorization, and data exposure changes.
- [ ] `docs/deployment.md` reflects target platform and environment variables.

## Quality Gates

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

- [ ] Typecheck passes.
- [ ] Lint passes.
- [ ] Tests pass.
- [ ] Production build passes.
- [ ] New analytics logic has edge-case tests.
- [ ] UI changes are checked on mobile and desktop.

## Compatibility Gates

- [ ] API compatibility confirmed for all consumers.
- [ ] Data contract compatibility confirmed for all metrics and views.
- [ ] Shared TypeScript types are updated.
- [ ] Backward-incompatible changes are documented in handoff notes.
- [ ] Loading, empty, and error states still work.

## Environment And Deployment

- [ ] `.env.example` includes all required variables with safe placeholders.
- [ ] No secrets, tokens, credentials, or client data are committed.
- [ ] Deployment variables are configured in the target platform.
- [ ] Auth callback URLs and allowed domains are verified.
- [ ] Preview deployment is smoke-tested.
- [ ] Rollback plan is documented.

## Final Handoff

- [ ] Summary of changes is clear.
- [ ] Files changed are listed with reasons.
- [ ] Validation commands and results are included.
- [ ] Contract changes are called out.
- [ ] Known risks and follow-ups are listed.
