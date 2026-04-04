# PlotRent — Ralph Fix Plan

## Phase 0: Foundation (do these first, in order)

- [ ] **0.1** Scaffold Expo + React Native project (create-expo-app, install deps, NativeWind v2, archive old web code to _reference/)
- [ ] **0.2** Set up EAS Build (eas-cli, eas.json, development build profile)
- [ ] **0.3** Create Supabase client (src/lib/supabase.ts with expo-sqlite localStorage polyfill, .env)
- [ ] **0.4** Expand type definitions (src/types.ts — User, HostProfile, Plot, Booking, Review, Message, Conversation, PlotInspection, Dispute, Contract, ServiceOrder)
- [ ] **0.5** Create Supabase database schema (supabase/migrations/001_initial_schema.sql — 12 tables, RLS, triggers, storage buckets, indexes)
- [ ] **0.6** Create service layer (src/services/ — auth, plots, bookings, messages, reviews, storage, disputes, inspections)
- [ ] **0.7** Auth context + navigation guards (AuthContext, useAuth hook, app/_layout.tsx with auth redirect)

## Phase 1: Auth + Core Screens

- [ ] **1.1** Port Onboarding screen (app/index.tsx — hero, CTAs, Google/Apple OAuth, email signup)
- [ ] **1.2** Tab navigation (app/(tabs)/_layout.tsx — Explore, Listings, Messages, Profile tabs)
- [ ] **1.3** Role selection (app/role-select.tsx — renter/host/both, updates profiles.role)
- [ ] **1.4** Profile screen (app/(tabs)/profile.tsx — real user data, edit form, avatar upload, logout)

## Phase 2: Plot Discovery & Listings

- [ ] **2.1** Map component (src/components/MapView.tsx — Leaflet in WebView, markers, geolocation)
- [ ] **2.2** Explore screen (app/(tabs)/explore.tsx — MapView + plot cards, filters, usePlots hook)
- [ ] **2.3** PlotDetails screen (app/plot/[id].tsx — DB fetch, photo gallery, reviews, booking CTA)
- [ ] **2.4** Create Plot host flow (app/create-plot.tsx — multi-step form, photo upload)
- [ ] **2.5** Seed database (supabase/seed.sql — Lisbon/Porto plots, EUR pricing, sample data)

## Phase 3: Booking & Payments

- [ ] **3.1** Availability calendar (src/components/AvailabilityCalendar.tsx — react-native-calendars)
- [ ] **3.2** Booking review screen (app/booking.tsx — dynamic pricing, summary)
- [ ] **3.3** Stripe Connect (Edge Functions + payments.service.ts + PaymentSheet)
- [ ] **3.4** Booking confirmation + management (confirmation screen + my-bookings list)
- [ ] **3.5** Simple rental agreement (RentalAgreement component — text terms, "I Agree" signing)

## Phase 4: Real-Time Messaging

- [ ] **4.1** Chat system (conversations list + individual chat with Supabase Realtime)
- [ ] **4.2** Photo sharing in chat (image picker -> storage -> image message)
- [ ] **4.3** Wire "Message Host" everywhere (PlotDetails, BookingConfirmation, HostBookings)

## Phase 5: Host Dashboard

- [ ] **5.1** Host dashboard (app/(tabs)/host.tsx — earnings, plots, occupancy)
- [ ] **5.2** Host booking management (approve/decline requests)
- [ ] **5.3** Stripe Connect onboarding for hosts (bank account, payouts)
- [ ] **5.4** Occupancy calendar (real booking data, month navigation)

## Phase 6: Trust & Safety

- [ ] **6.1** Two-way reviews (ReviewForm + WriteReview screen)
- [ ] **6.2** Check-in/check-out photos (camera, timestamp, geolocation)
- [ ] **6.3** Dispute filing (reason, description, photo evidence)

## Phase 7: Services & Polish

- [ ] **7.1** Services screen (DB-driven, category filters, ordering)
- [ ] **7.2** Loading/error states (skeleton loaders, error boundary, empty states)
- [ ] **7.3** In-app toasts + push notification setup
- [ ] **7.4** Cleanup (remove _reference/, constants.ts, verify all screens use service layer)

## Completed
- [x] P.1: Ralph installed and configured
- [x] P.2: CLAUDE.md created
- [x] P.3: Claude Code pre-commit hook configured (tsc + eslint)
- [x] P.4: Supabase MCP server configured in .claude/mcp.json

## Notes
- NativeWind v2 only (v4 has breaking bugs with Expo SDK 52-54)
- Supabase sessions use expo-sqlite localStorage polyfill (NOT AsyncStorage)
- Stripe requires EAS Build (won't work in Expo Go)
- Seed data targets Lisbon/Porto (Portugal), EUR pricing
- Old web pages archived in _reference/ as design blueprints
- Contracts simplified to text agreement for MVP (no PDF)
- Dispute resolution is manual/admin for MVP
