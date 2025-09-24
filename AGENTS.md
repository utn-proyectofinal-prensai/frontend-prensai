# Repository Guidelines

## Project Structure & Module Organization
The Vite + React app lives in `src/`, with `pages/` for routed screens, `components/` for shared UI, `routes/index.tsx` for router config, `context/` for providers such as `AuthContext`, `services/` for Axios clients, and `hooks/`, `utils/`, `constants/`, and `types/` for reusable logic. Place translation bundles in `locales/` and static images in `src/assets/` (bundled) or `public/` (served verbatim). Build artifacts land in `dist/`. The standalone `routes/news.js` implements the news ingestion endpoint consumed by the dashboard.

## Build, Test, and Development Commands
Run `npm install` once per clone. Use `npm run dev` for a live-reload dev server on Vite. `npm run build` performs a TypeScript project build and Vite production bundle; inspect the output under `dist/`. `npm run preview` serves the production bundle locally for QA. `npm run lint` runs ESLint with the shared TypeScript/React configuration.

## Coding Style & Naming Conventions
Write components in TypeScript with 2-space indentation and ES module imports. Use `PascalCase` for React components and hooks directories, `camelCase` for functions and variables, and `SCREAMING_SNAKE_CASE` only for exported constants. Prefer functional components with hooks, keep side effects in `useEffect`, and centralize API URLs within `services/`. Tailwind utility classes are available; augment them with the scoped styles in `src/styles/` when layout demands it. Always resolve lint warnings before pushing.

## Testing Guidelines
Automated tests are not yet established. When introducing coverage, add Vitest + React Testing Library and colocate specs as `*.test.tsx` next to the component or under `src/__tests__/`. Smoke-test new API integrations with fixture responses, and include minimal regression checks for shared hooks.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commits (`feat:`, `fix:`, etc.); continue using clear scopes when relevant. Limit commits to focused changes and run `npm run lint` beforehand. Pull requests should describe the user-facing impact, reference Linear/Jira/GitHub issues, and attach UI screenshots or GIFs for visual updates. Note any configuration or migration steps in the PR body so reviewers can reproduce locally.
