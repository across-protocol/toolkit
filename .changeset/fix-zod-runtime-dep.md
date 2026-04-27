---
"@across-protocol/app-sdk": patch
---

Fix unresolved `zod` import at build time by moving it from `devDependencies` to `dependencies`. The SDK imports `zod` at runtime (in `api/` modules), so consumers without `zod` transitively in their tree previously failed to build.
