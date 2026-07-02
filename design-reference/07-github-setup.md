# 07 · GitHub setup (contributor-ready)

The repo will be public for other programmers to help. Make it welcoming and safe.

## Must-have files
- **README.md** (root) — one-paragraph pitch, screenshots/GIF of the app, the stack, and a copy-paste **Quickstart** (install pnpm → `pnpm install` → `pnpm --filter mobile start` → scan QR in Expo Go). Link to `design-reference/`.
- **CONTRIBUTING.md** — how to run app + api, branch naming, commit style (Conventional Commits), how to open a PR, code style (ESLint/Prettier), where features live (feature-first folders).
- **.env.example** — every variable with placeholder values and a comment. Never commit real `.env`.
- **.gitignore** — `node_modules`, `.env`, `.expo`, build output, `dist`.
- **LICENSE** — pick one (MIT is common for open contribution).
- **CODE_OF_CONDUCT.md** — standard Contributor Covenant.
- **.github/** — issue templates (bug / feature), a PR template, and a CI workflow that runs typecheck + lint + build on push.

## .env.example (contents)
```
# --- Mobile (apps/mobile) ---
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3000        # phone must reach your computer, not localhost
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# --- API (apps/api) ---
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server only — never in the app
SUPABASE_JWT_SECRET=
STRIPE_SECRET_KEY=              # server only
STRIPE_WEBHOOK_SECRET=          # server only
FCM_SERVER_KEY=                 # server only
```

## Security hygiene (state at scale)
- **No secrets in git.** Only `EXPO_PUBLIC_*` and Supabase **anon** keys live client-side (protected by RLS). Service-role, Stripe secret, and FCM keys are **server-only**.
- Turn on **Row Level Security** in Supabase from day one.
- Add a **secret scanner** (e.g. gitleaks) to CI so a leaked key fails the build.

## Suggested first issues (good-first-issue labels)
Break Phase 6+ into small tickets: a single screen's empty state, a new species SVG, a new Coin Shop item, a settings screen, notification preferences, localization (the app is bilingual EN/ES) — so contributors have bite-sized entry points.

## Milestones
Mirror the build order in `PROMPT.md` as GitHub milestones (Scaffold → Design system → Opening/Nav → Dive → Mini-games → Economy/Gear/Redeem → Other screens → Backend), so contributors see the roadmap.
