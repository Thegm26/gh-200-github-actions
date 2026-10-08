# Maintainer map

- `docs/` — course and release records; `examples/`, `exercises/`, `labs/`, `learning/`, `quiz/`, and `references/` — source curriculum.
- `scripts/`, `src/`, and `test/` — build, service, and regression tooling; `visual-source/` builds the static browser bundle.

Run `npm ci` first for the build/test dependencies, then `npm run check`, `npm run test:browser`, and `npm run verify:hands-on`. Rebuild browser assets with `npm run build:course`. The browser regression uses `GH200_BROWSER_EXECUTABLE` for an installed Chromium (or `GH200_PLAYWRIGHT_MODULE` for compatible Playwright); otherwise install Chromium with `npx playwright-core install chromium`.

After those gates, maintainers can publish the standalone static subtree with `git subtree push --prefix visual origin gh-pages`; then set/verify Pages from `gh-pages` `/` and smoke-test the live URL. Do not add a Pages workflow or dispatch learner/CI workflows.
