## Odd Ones World

### Sanity types

`studio/sanity.types.ts` is generated from the Studio schema and GROQ queries. Do not edit it by hand.

Run `bun run sanity:types` from the repository root after changing `studio/schemaTypes` or `studio/queries`. The root `dev` and `build` scripts run this automatically before starting Next.js.

### Metadata

Route-level pages own their own metadata so Sanity lookups can be scoped to the expected content type. The homepage calls `getMetadata` with `contentType: "page"`, while article routes call it with `contentType: "article"`.

Metadata resolves in this order:

1. Content-level SEO fields.
2. Content title, excerpt, and cover image.
3. Global SEO defaults.

### Sanity revalidation

Production uses cached Sanity reads with explicit Next.js cache tags and a signed Sanity webhook for on-demand invalidation.

The homepage fetch is tagged with `sanity:home`, article pages with `sanity:article` and `sanity:article:{slug}`, global navigation/settings with `sanity:site-settings`, and metadata with `sanity:seo` plus `sanity:metadata:{slug}`. The webhook at `/api/revalidate` verifies Sanity's signature with `SANITY_REVALIDATE_SECRET`, waits for Content Lake consistency via `next-sanity/webhook`, then calls `revalidateTag` for the affected tags.

Set up the Sanity webhook:

1. Add `SANITY_REVALIDATE_SECRET` to the deployed Next.js environment.
2. In Sanity, create a webhook for the production dataset that sends `POST` requests to `https://<your-site>/api/revalidate`.
3. Use the same secret as `SANITY_REVALIDATE_SECRET`.
4. Use this projection so the route can target article and page tags:

```groq
{
  "_type": _type,
  "slug": slug.current
}
```

### Planned optimisations

- Refactor local modal/gate state into a custom hook with `useReducer` for clearer state transitions and maintainability.

bun outdated v1.2.23 (cf136713)
[0.11ms] ".env.local", ".env"

│ Package           │ Current  │ Update   │ Latest │
|-------------------|----------|----------|--------|
│ @types/node (dev) │ 20.19.39 │ 20.19.39 │ 25.6.0 │
│ typescript (dev)  │ 5.9.3    │ 5.9.3    │ 6.0.3  │
