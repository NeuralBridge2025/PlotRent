# PlotRent MVP — Implementation Plan

## Phase 1: Foundation (CURRENT)
- [x] Project scaffold (Expo + dependencies)
- [x] **1.1** Supabase client + database types + auth context
- [x] **1.2** Root layout with AuthProvider, font loading, NativeWind
- [x] **1.3** Onboarding screen (proper — auth buttons, hero)

## Phase 2: Core Navigation & Screens
- [x] **2.1** Tab navigator layout (`app/(tabs)/_layout.tsx`)
- [x] **2.2** Explore screen — plot cards grid + filter bar
- [x] **2.3** Plot Details screen (`app/plot/[id].tsx`)
- [x] **2.4** Booking Review screen (`app/booking.tsx`)

## Phase 3: Host & Communication
- [x] **3.1** Host Dashboard screen (`app/(tabs)/host.tsx`)
- [x] **3.2** Chat screen (`app/chat/[id].tsx`)
- [x] **3.3** Create Plot screen (`app/create-plot.tsx`)

## Phase 4: Profile & Services
- [ ] **4.1** Profile screen (`app/(tabs)/profile.tsx`)
- [ ] **4.2** Services marketplace screen (`app/services.tsx`)
- [ ] **4.3** Role selection screen (`app/role-select.tsx`)

## Phase 5: Services & Hooks Layer
- [ ] **5.1** Plot service + usePlots hook
- [ ] **5.2** Booking service + useBooking hook
- [ ] **5.3** Message service + useMessages hook
- [ ] **5.4** Auth service (integrated in context)
- [ ] **5.5** Host service + useHostDashboard hook

## Phase 6: Backend & Integration
- [ ] **6.1** Supabase migrations (tables, RLS policies)
- [ ] **6.2** Seed data
- [ ] **6.3** Stripe Connect edge functions
- [ ] **6.4** Image upload via Supabase Storage
- [ ] **6.5** Push notifications setup

## Phase 7: Polish
- [ ] **7.1** Animations (reanimated entrance/exit)
- [ ] **7.2** Error boundaries & offline handling
- [ ] **7.3** Accessibility (a11y labels, contrast)
- [ ] **7.4** Performance (image caching, list virtualization)
