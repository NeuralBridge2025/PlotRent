# PlotRent — Claude Code Instructions

## Project Overview
PlotRent is a garden plot rental marketplace — the "Airbnb for cultivation land." City dwellers rent garden plots from landowners to grow food. Launching in Southern Europe (Portugal first).

## Tech Stack
- **Framework**: React Native + Expo (TypeScript strict mode)
- **Routing**: Expo Router (file-based, `app/` directory)
- **Styling**: NativeWind v2 (NOT v4 — v4 breaks with Expo SDK 52-54)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage + RLS)
- **Payments**: Stripe Connect via `@stripe/stripe-react-native` + Supabase Edge Functions
- **Maps**: Leaflet + OpenStreetMap via `react-native-webview`
- **Animations**: `react-native-reanimated`
- **Icons**: `lucide-react-native`
- **Calendar**: `react-native-calendars`
- **Sessions**: `expo-sqlite` localStorage polyfill (NOT AsyncStorage)

## Architecture
```
Screens (app/) → Hooks (src/hooks/) → Services (src/services/) → Supabase Client (src/lib/supabase.ts)
```

**Rules:**
- Screens NEVER import `supabase` directly — always go through services
- Services are the only files that import from `src/lib/supabase.ts`
- Custom hooks wrap services with loading/error state management
- Screens consume hooks and render UI

## File Organization
```
app/                              # Expo Router screens (file-based routing)
  _layout.tsx                     # Root layout with AuthProvider + ErrorBoundary
  index.tsx                       # Onboarding (first-launch flow)
  role-select.tsx                 # Role selection (host vs renter)
  booking.tsx                     # Booking review & confirmation
  create-plot.tsx                 # Create new plot listing
  services.tsx                    # Services marketplace
  (tabs)/                         # Tab navigator group
    _layout.tsx                   # Tab bar configuration
    index.tsx                     # Explore (map + plot list)
    host.tsx                      # Host dashboard (stats + listings)
    messages.tsx                  # Messages (stub — not yet implemented)
    profile.tsx                   # User profile + settings
  plot/[id].tsx                   # Plot detail page
  chat/[id].tsx                   # 1:1 chat conversation
src/
  lib/supabase.ts                 # Supabase client (single instance)
  lib/database.types.ts           # Generated DB types (do not edit manually)
  types.ts                        # Shared TypeScript interfaces
  services/                       # Data access layer (one file per domain)
    plotService.ts                # CRUD for plots + filtering
    bookingService.ts             # Booking create/fetch/status
    hostService.ts                # Host dashboard aggregation
    messageService.ts             # Conversations & messages
    profileService.ts             # User profiles
    serviceService.ts             # Add-on services marketplace
    paymentService.ts             # Stripe payment intents
    imageService.ts               # Supabase Storage image uploads
    notificationService.ts        # Push notification registration
  hooks/                          # Custom React hooks (wrap services with loading/error state)
    usePlots.ts                   # Plot list with filters
    usePlot.ts                    # Single plot by ID
    useBookings.ts                # Renter & host bookings
    useHostDashboard.ts           # Host stats + listings
    useMessages.ts                # Chat messages + partner
    useServices.ts                # Available add-on services
    useNotifications.ts           # Push notification setup
    useNetworkStatus.ts           # Online/offline detection
  components/                     # Reusable UI components
    PlotCard.tsx                  # Card for plot listings
    ErrorBoundary.tsx             # Error boundary (class component — React requires this)
    OfflineBanner.tsx             # Offline indicator bar
  contexts/                       # React Contexts
    AuthContext.tsx                # Auth state + session management
    ToastContext.tsx               # Toast notification system
_reference/                       # Archived web pages (design reference only, DO NOT import)
supabase/
  migrations/                     # SQL migrations
  functions/                      # Edge Functions (Stripe, etc.)
  seed.sql                        # Sample data
```

## Path Aliases
- `@/*` → `src/*` (configured in `tsconfig.json`)
- Example: `import { useAuth } from "@/contexts/AuthContext"`

## Design System
**Colors (Material Design 3):**
- Primary: `#32632e` (green) — use NativeWind class `bg-primary`, `text-primary`
- Primary Container: `#4a7c44`
- Secondary: `#a03f29` (rust)
- Surface: `#fcf9f4` (off-white)
- On-Primary: `#ffffff`
- On-Surface: `#1c1b18`
- On-Surface-Variant: `#49454f`
- Outline: `#7a757f`

**Typography:**
- Headlines: Manrope (bold, tight tracking)
- Body/Labels: Inter

**Components:** Card-based layouts, gradients, rounded corners, subtle shadows matching MD3 elevation.

## Code Conventions
- Functional components only (except `ErrorBoundary.tsx` — React requires class components for error boundaries)
- TypeScript strict: typed props, no `any`, explicit return types on services
- NativeWind v2 classes for styling (no `StyleSheet.create`; inline styles only for dynamic safe-area inset padding via `useSafeAreaInsets()`)
- Custom hooks for all data fetching (`usePlots`, `useBooking`, `useMessages`, etc.)
- Every screen must handle: loading state, error state, empty state
- Use `react-native-reanimated` for animations (not Animated API)

## Do NOT
- Use NativeWind v4 (breaking bugs)
- Use AsyncStorage for Supabase sessions (use expo-sqlite)
- Import supabase client in screen files
- Use class components (except ErrorBoundary) or inline styles (except safe-area insets)
- Hardcode data (all data from Supabase)
- Skip TypeScript types
- Use `any` type
- Import from `_reference/` directory (it's for visual reference only)

## Getting Started

### Prerequisites
- **Node.js** >= 18 (project currently uses v25; Expo SDK 54 requires 18+)
- **npm** (comes with Node)
- **Expo CLI**: installed via `npx expo` (no global install needed)
- **EAS CLI**: `npm install -g eas-cli` (for building dev/preview/production builds)
- **Supabase CLI** (optional, for local backend dev): `brew install supabase/tap/supabase`
- **iOS Simulator**: Xcode (macOS only) — install from Mac App Store, then `xcode-select --install`
- **Android Emulator**: Android Studio with an AVD configured
- **Expo Go** app on a physical device (for quick testing without a dev build)
- **Maestro** (optional, for E2E tests): `brew install maestro`

### Setup
```bash
# 1. Clone and install dependencies
git clone <repo-url> && cd PlotRent-main
npm install

# 2. Configure environment variables
#    Copy .env.example or create .env in the project root:
#    EXPO_PUBLIC_SUPABASE_URL=<your-supabase-url>
#    EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# 3. Start the dev server
npx expo start

# 4. Run on a platform (press in terminal or use flags):
#    i → iOS Simulator
#    a → Android Emulator
#    w → Web browser
#    Scan QR code → Expo Go on physical device
```

### Dev Builds (required for native modules like Stripe, Camera, Notifications)
Expo Go doesn't support custom native modules. You need a development build:
```bash
eas build --profile development --platform ios    # or android
npx expo start --dev-client                       # start with dev client
```

### Supabase Local Development (optional)
```bash
supabase start                          # Starts local Supabase (Docker required)
supabase db reset                       # Applies migrations + seed data
supabase functions serve                # Runs Edge Functions locally
```
When running locally, update `.env` to point to `http://127.0.0.1:54321` and the local anon key printed by `supabase start`.

## Common Commands
```bash
npx expo start                          # Dev server
npx expo start --dev-client             # Dev server (dev build with native modules)
eas build --profile development         # Dev build (needed for native modules)
npm test                                # Run tests (Jest)
npm run test:e2e                        # Run all E2E tests (Maestro)
npx tsc --noEmit                        # Type check
npx eslint .                            # Lint (flat config, no --ext needed)
```

## Environment Variables
```
EXPO_PUBLIC_SUPABASE_URL=               # Supabase project URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=          # Supabase anon/public key
```
Stripe keys are in Supabase Edge Function secrets (never in client code).

## Testing
- **Status: No tests exist yet.** Testing infrastructure is configured but zero test files have been written.
- Stack: Jest + `jest-expo` + `@testing-library/react-native`
- Priority when writing tests: services first (pure data logic), then hooks (state management)
- Don't unit test every component — focus on logic, not rendering
- Run `npm test` to execute; jest config is in `package.json`

## Known Technical Debt
- **Messages screen is a stub**: `app/(tabs)/messages.tsx` renders placeholder UI — not wired to `messageService` or `useMessages` yet.
- **TODOs in code**:
  - `src/services/hostService.ts:81` — earnings trend comparison with previous month
  - `app/(tabs)/profile.tsx:268` — settings screen navigation
- **No tests**: See Testing section above.
