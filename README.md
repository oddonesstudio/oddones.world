## Odd Ones World

### Sanity types

`studio/sanity.types.ts` is generated from the Studio schema and GROQ queries. Do not edit it by hand.

Run `bun run sanity:types` from the repository root after changing `studio/schemaTypes` or `studio/queries`. The root `dev` and `build` scripts run this automatically before starting Next.js.

### Planned optimisations

- Refactor local modal/gate state into a custom hook with `useReducer` for clearer state transitions and maintainability.
