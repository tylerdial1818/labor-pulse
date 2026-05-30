# Architecture

## Overview

This template separates routing, feature composition, reusable UI, analytics logic, data processing, server orchestration, and infrastructure configuration.

## Layers

| Layer | Path | Responsibility |
| --- | --- | --- |
| Routes | `src/app` | Next.js App Router pages, layouts, route-level states |
| Feature screens | `src/features` | Page composition and feature-specific orchestration |
| UI components | `src/components` | Reusable presentation components |
| Server orchestration | `src/server` | Server-only data loading and access control |
| Analytics logic | `src/lib/analytics` | Pure metric calculations |
| Data processing | `src/lib/data-processing` | Cleaning, shaping, fixture data, adapters |
| Auth | `src/lib/auth` | Identity provider and session configuration |
| DB/services | `src/lib/db` | Database or external service clients |
| Shared types | `src/types` | Domain contracts shared across layers |

## Data Flow

1. Route renders a feature shell from `src/features`.
2. Feature shell calls server functions from `src/server`.
3. Server functions fetch from `src/lib/db` or external APIs.
4. Data is validated, transformed, and calculated in `src/lib/data-processing` and `src/lib/analytics`.
5. Typed view models are passed to UI and chart components.

## Extension Points

- Replace sample data in `src/lib/data-processing/sample-data.ts`.
- Implement `src/lib/db/client.ts` using the selected database library.
- Add API routes under `src/app/api` only when client-side interactions require them.
- Add feature modules under `src/features/<feature-name>`.

## Integration Rule

When a data contract changes, update `src/types`, analytics tests, affected components, and docs in the same handoff.
