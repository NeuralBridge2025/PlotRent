<div align="center">
  <img src="assets/icon.png" alt="PlotRent" width="120" height="120" />
  <h1>PlotRent</h1>
  <p><strong>The Airbnb for cultivation land</strong></p>
  <p>A garden plot rental marketplace connecting city dwellers with landowners. Rent a plot, grow your food.</p>

  ![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react)
  ![Expo](https://img.shields.io/badge/Expo_SDK-54-000020?logo=expo)
  ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)
  ![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)
  ![Stripe](https://img.shields.io/badge/Stripe_Connect-Payments-635BFF?logo=stripe)
</div>

---

## About

PlotRent makes it easy for urban residents to find and rent garden plots from landowners who have unused cultivation land. Think of it as Airbnb, but for growing food. Launching first in Portugal, expanding across Southern Europe.

**For Renters:**
- Browse available garden plots on an interactive map
- Filter by size, price, amenities, and location
- Book plots with secure Stripe payments
- Message landowners directly

**For Hosts (Landowners):**
- List your land with photos, pricing, and availability
- Manage bookings from a dedicated dashboard
- Track earnings and occupancy stats
- Offer add-on services (tools, watering, soil prep)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native + Expo (SDK 54) |
| **Language** | TypeScript (strict mode) |
| **Routing** | Expo Router (file-based) |
| **Styling** | NativeWind v2 (Tailwind for RN) |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime, Storage, RLS) |
| **Payments** | Stripe Connect via Edge Functions |
| **Maps** | Leaflet + OpenStreetMap (WebView) |
| **Animations** | react-native-reanimated |

## Architecture

```
Screens (app/) → Hooks (src/hooks/) → Services (src/services/) → Supabase Client (src/lib/supabase.ts)
```

- **Screens** render UI and consume hooks — never import Supabase directly
- **Hooks** wrap services with loading/error state management
- **Services** are the only layer that talks to the Supabase client

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **Expo CLI** — runs via `npx expo` (no global install needed)
- **EAS CLI** — `npm install -g eas-cli` (for dev/preview/production builds)
- **iOS Simulator** — Xcode (macOS only), then run `xcode-select --install`
- **Android Emulator** — Android Studio with an AVD configured
- **Expo Go** on a physical device (for quick testing without a dev build)

Optional:
- **Supabase CLI** — `brew install supabase/tap/supabase` (for local backend)
- **Maestro** — `brew install maestro` (for E2E tests)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/PlotRent.git
cd PlotRent

# 2. Install dependencies
npm install

# 3. Set up environment variables
#    Create a .env file in the project root:
cp .env.example .env
#    Then fill in your Supabase credentials:
#    EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
#    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 4. Start the development server
npx expo start
```

Once the dev server is running:
- Press **i** to open iOS Simulator
- Press **a** to open Android Emulator
- Press **w** to open in web browser
- Scan the **QR code** with Expo Go on your phone

### Development Builds

Expo Go doesn't support custom native modules (Stripe, Camera, Notifications). For full functionality, create a dev build:

```bash
eas build --profile development --platform ios    # or android
npx expo start --dev-client
```

### Supabase Local Development (Optional)

Requires Docker.

```bash
supabase start                # Start local Supabase
supabase db reset             # Apply migrations + seed data
supabase functions serve      # Run Edge Functions locally
```

Update your `.env` to point to `http://127.0.0.1:54321` and the local anon key from `supabase start` output.

## Scripts

| Command | Description |
|---------|-------------|
| `npx expo start` | Start dev server |
| `npx expo start --dev-client` | Start dev server (dev build) |
| `eas build --profile development` | Create development build |
| `npm test` | Run unit tests (Jest) |
| `npm run test:e2e` | Run E2E tests (Maestro) |
| `npx tsc --noEmit` | Type check |
| `npx eslint .` | Lint |

## Project Structure

```
app/                        # Screens (Expo Router, file-based routing)
  (tabs)/                   # Tab navigator (Explore, Host, Messages, Profile)
  plot/[id].tsx             # Plot detail page
  chat/[id].tsx             # Chat conversation
src/
  services/                 # Data access layer (Supabase queries)
  hooks/                    # React hooks (wrap services with state)
  components/               # Reusable UI components
  contexts/                 # React Contexts (Auth, Toast)
  lib/                      # Supabase client + generated types
supabase/
  migrations/               # SQL migrations
  functions/                # Edge Functions (Stripe, etc.)
  seed.sql                  # Sample data
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Stripe keys are stored as Supabase Edge Function secrets (never in client code).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is proprietary. All rights reserved.
