# 03 · Preview on your phone (+ live reload)

The whole point of Expo: see the app on your real phone in ~2 minutes, and have it **auto-reload every time the code changes**.

## One-time setup
1. Install **Node 20+** and **pnpm** (`npm i -g pnpm`) on your computer.
2. On your **phone**, install the **Expo Go** app (App Store / Google Play).
3. Make sure your phone and computer are on the **same Wi-Fi**.

## Run it
```bash
pnpm install                 # from the repo root, once
pnpm --filter mobile start   # starts Expo; or: cd apps/mobile && npx expo start
```
A **QR code** appears in the terminal.
- **iPhone:** open the Camera app, point at the QR, tap the banner.
- **Android:** open **Expo Go** → *Scan QR code*.

The app opens on your phone. **Edit any file and save** → it reloads instantly (Fast Refresh). No rebuild, no app-store step.

> If QR/Wi-Fi is blocked (some networks isolate devices), run `npx expo start --tunnel` for a routable connection.

## Run the backend too
```bash
pnpm --filter api start:dev  # NestJS with watch mode; Swagger at http://localhost:3000/docs
```
Point the app at it via `EXPO_PUBLIC_API_URL` in `.env` (use your computer's LAN IP, e.g. `http://192.168.1.20:3000`, so the phone can reach it — not `localhost`).

## Later: standalone builds
When you want a real installable build (TestFlight / Play Store) use **EAS Build**: `npx eas build -p ios` / `-p android`. Not needed for day-to-day development — Expo Go covers that.

## Definition of "working preview"
Claude Code should not consider a phase done until:
- `npx expo start` runs with no red errors,
- the app boots in Expo Go on a phone,
- and Fast Refresh applies edits without a manual reload.
