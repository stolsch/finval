# Contributing to FinVal

Thanks for your interest in improving FinVal.

## Development Setup

1. Install Node.js 18+.
2. Install dependencies:
   - `pnpm install`
3. Run checks:
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm lint`

## Contribution Guidelines

- Keep runtime code dependency-free.
- Use strict TypeScript (no `any`).
- Ensure each validator returns a `ValidationResult`.
- Add machine-readable error codes in `SCREAMING_SNAKE_CASE`.
- Add JSDoc to every exported function.
- Include Vitest coverage for happy path, error paths, and edge cases.

## Pull Requests

- Keep PRs focused and small.
- Include tests for behavioral changes.
- Update README or docs when public API changes.
