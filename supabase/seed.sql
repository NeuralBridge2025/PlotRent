-- PlotRent MVP — Seed Data
-- Realistic development data for Lisbon, Portugal area
--
-- NOTE: Profiles reference auth.users. In development, create test users
-- via Supabase dashboard or auth API first, then run this seed.
-- The UUIDs below are stable placeholders — replace with real auth user IDs.

-- ============================================================
-- TEST USERS (profiles)
-- Create these in Supabase Auth first, then insert profiles:
--   host1@plotrent.dev  / password123
--   host2@plotrent.dev  / password123
--   renter1@plotrent.dev / password123
--   renter2@plotrent.dev / password123
-- ============================================================

-- Use fixed UUIDs so foreign keys work consistently
do $$
declare
  host1_id uuid := '11111111-1111-1111-1111-111111111111';
  host2_id uuid := '22222222-2222-2222-2222-222222222222';
  renter1_id uuid := '33333333-3333-3333-3333-333333333333';
  renter2_id uuid := '44444444-4444-4444-4444-444444444444';
  plot1_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  plot2_id uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  plot3_id uuid := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  plot4_id uuid := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
  plot5_id uuid := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
  plot6_id uuid := 'ffffffff-ffff-ffff-ffff-ffffffffffff';
begin

-- ============================================================
-- PROFILES
-- ============================================================

insert into public.profiles (id, email, full_name, role, level, member_since) values
  (host1_id,    'host1@plotrent.dev',    'Maria Santos',    'host',   'Super Host',       '2024-03-15'),
  (host2_id,    'host2@plotrent.dev',    'João Ferreira',   'both',   'Verified Host',    '2024-06-01'),
  (renter1_id,  'renter1@plotrent.dev',  'Ana Costa',       'renter', 'Beginner Grower',  '2025-01-10'),
  (renter2_id,  'renter2@plotrent.dev',  'David Oliveira',  'renter', 'Green Thumb',      '2024-09-20')
on conflict (id) do nothing;

-- ============================================================
-- PLOTS (6 listings across Lisbon area)
-- ============================================================

insert into public.plots (id, host_id, title, description, price_per_month, size_sqm, latitude, longitude, address, city, country, soil_type, sun_exposure, utilities, tags, images, rating, review_count, is_active, instant_book) values
(
  plot1_id, host1_id,
  'The Secret Garden',
  'A hidden gem in the heart of Alfama. This terraced plot gets beautiful morning light and is perfect for Mediterranean herbs and tomatoes. Toolshed on-site with everything you need.',
  45.00, 25.0,
  38.7114, -9.1305,
  'Rua de São Miguel 42', 'Lisbon', 'Portugal',
  'Loamy', 'Full Sun',
  array['Water Access', 'Toolshed'],
  array['Organic Certified', 'Beginner Friendly'],
  array[]::text[],
  4.9, 12, true, true
),
(
  plot2_id, host1_id,
  'Urban Oasis Terrace',
  'Rooftop garden plot in Príncipe Real with stunning views over the Tagus. Rich compost soil, drip irrigation included. Ideal for leafy greens and edible flowers.',
  62.00, 18.0,
  38.7169, -9.1497,
  'Rua da Escola Politécnica 15', 'Lisbon', 'Portugal',
  'Clay Loam', 'Full Sun',
  array['Water Access', 'Compost'],
  array['Rooftop', 'City Views'],
  array[]::text[],
  4.7, 8, true, false
),
(
  plot3_id, host1_id,
  'Riverside Allotment',
  'Generous plot along the Tejo riverbank with natural irrigation potential. Sandy loam is perfect for root vegetables — carrots, beets, and potatoes thrive here.',
  35.00, 40.0,
  38.7007, -9.1793,
  'Rua da Junqueira 88', 'Lisbon', 'Portugal',
  'Sandy Loam', 'Partial Shade',
  array['Water Access', 'Fencing'],
  array['Riverside', 'Large Plot'],
  array[]::text[],
  4.5, 5, true, true
),
(
  plot4_id, host2_id,
  'Sintra Hilltop Plot',
  'Misty mountain plot in the foothills of Serra de Sintra. Cool microclimate ideal for berries, lettuce, and brassicas. Natural spring water available.',
  30.00, 50.0,
  38.7873, -9.3907,
  'Estrada da Pena 12', 'Sintra', 'Portugal',
  'Peaty', 'Partial Shade',
  array['Water Access', 'Electricity'],
  array['Mountain', 'Spring Water', 'Child-Friendly'],
  array[]::text[],
  4.8, 15, true, false
),
(
  plot5_id, host2_id,
  'Cascais Beach Garden',
  'Sun-drenched coastal plot just 500m from the beach. Sandy soil enriched with seaweed compost — great for drought-resistant herbs, peppers, and artichokes.',
  55.00, 22.0,
  38.6967, -9.4214,
  'Rua Frederico Arouca 30', 'Cascais', 'Portugal',
  'Sandy', 'Full Sun',
  array['Water Access', 'Toolshed', 'Compost'],
  array['Coastal', 'Organic Certified'],
  array[]::text[],
  4.6, 9, true, true
),
(
  plot6_id, host2_id,
  'Almada Community Garden',
  'Part of a vibrant community garden with shared composting and monthly workshops. South-facing with rich clay soil. Perfect for families and first-time growers.',
  25.00, 30.0,
  38.6790, -9.1590,
  'Rua Capitão Leitão 5', 'Almada', 'Portugal',
  'Clay', 'Full Sun',
  array['Water Access', 'Compost', 'Fencing', 'Electricity'],
  array['Community Garden', 'Workshops', 'Beginner Friendly', 'Child-Friendly'],
  array[]::text[],
  4.4, 22, true, true
);

-- ============================================================
-- BOOKINGS
-- ============================================================

insert into public.bookings (plot_id, renter_id, start_date, end_date, status, monthly_price, service_fee, insurance_fee, security_deposit, total_amount) values
(plot1_id, renter1_id, '2026-04-01', '2026-09-30', 'active',   45.00, 3.60, 5.00, 50.00, 103.60),
(plot4_id, renter1_id, '2026-05-01', '2026-08-31', 'confirmed', 30.00, 2.40, null, 50.00, 82.40),
(plot5_id, renter2_id, '2026-04-15', '2026-10-15', 'active',   55.00, 4.40, 5.00, 50.00, 114.40),
(plot6_id, renter2_id, '2025-10-01', '2026-03-31', 'completed', 25.00, 2.00, null, 50.00, 77.00),
(plot3_id, renter2_id, '2026-03-01', '2026-04-01', 'cancelled', 35.00, 2.80, null, 50.00, 87.80);

-- ============================================================
-- MESSAGES (sample conversation)
-- ============================================================

insert into public.messages (sender_id, receiver_id, text, created_at) values
(renter1_id, host1_id, 'Hi Maria! I just booked The Secret Garden. Is there a specific gate code for access?', now() - interval '3 days'),
(host1_id, renter1_id, 'Welcome Ana! The code is 4521. The toolshed key is hanging on the hook just inside the gate on the left.', now() - interval '3 days' + interval '45 minutes'),
(renter1_id, host1_id, 'Perfect, thank you! Any tips on what grows well this time of year?', now() - interval '2 days'),
(host1_id, renter1_id, 'April is great for tomatoes, basil, and peppers. I left some starter seedlings in the toolshed for you!', now() - interval '2 days' + interval '1 hour'),
(renter1_id, host1_id, 'That is so kind! I will head over this weekend to get started.', now() - interval '1 day'),
(renter2_id, host2_id, 'João, is the Cascais plot available for a visit before I commit to the full season?', now() - interval '5 days'),
(host2_id, renter2_id, 'Of course David! I am free Saturday morning if you want to come by. I can show you the composting station too.', now() - interval '5 days' + interval '2 hours'),
(renter2_id, host2_id, 'Saturday works great. See you at 10am!', now() - interval '4 days');

-- ============================================================
-- REVIEWS
-- ============================================================

insert into public.reviews (plot_id, reviewer_id, rating, comment, created_at) values
(plot1_id, renter1_id, 5, 'Absolutely magical spot. The morning light through the old walls is stunning, and the soil is incredibly rich. Maria is the most helpful host!', now() - interval '14 days'),
(plot4_id, renter2_id, 5, 'The Sintra plot is unreal — misty mornings, natural spring water, and the berries just grow themselves. Highly recommend for anyone wanting a peaceful growing experience.', now() - interval '30 days'),
(plot5_id, renter2_id, 4, 'Great coastal plot with amazing sun exposure. The seaweed compost really works wonders. Only downside is parking can be tricky in summer.', now() - interval '20 days'),
(plot6_id, renter1_id, 5, 'The community vibe here is incredible. Monthly workshops taught me so much as a beginner. The shared composting system is genius.', now() - interval '60 days'),
(plot6_id, renter2_id, 4, 'Solid community garden with great amenities. Gets a bit crowded on weekends but the shared knowledge and camaraderie make up for it.', now() - interval '45 days');

-- ============================================================
-- SERVICES (marketplace items)
-- ============================================================

insert into public.services (title, description, price, image_url, category, unit, is_active) values
('Starter Tool Kit', 'Everything you need to begin: trowel, transplanter, hand rake, and pruning shears. Delivered to your plot.', 25.00, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', 'Tools', null, true),
('Seasonal Seed Box', 'Curated collection of heirloom seeds chosen for current Lisbon climate conditions. Includes planting guide.', 15.00, 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600', 'Tools', null, true),
('Video Coaching Session', 'One-on-one video call with a master gardener to solve your specific plot challenges and plan your season.', 30.00, 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600', 'Consulting', '/hr', true),
('Soil Analysis Report', 'Professional lab analysis of your plot soil — pH, nutrients, contaminants, and personalized amendment recommendations.', 40.00, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600', 'Consulting', null, true),
('Monthly Plot Maintenance', 'Weekly watering, weeding, and pest check when you are away. Includes photo updates sent to your inbox.', 65.00, 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600', 'Maintenance', '/mo', true),
('Organic Compost Delivery', '50L bag of premium organic compost delivered to your plot. Rich in nutrients, locally sourced from Lisbon cafes.', 12.00, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600', 'Tools', null, true),
('Drip Irrigation Setup', 'Professional installation of a timer-controlled drip irrigation system for your plot. Water-saving and hands-free.', 85.00, 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600', 'Maintenance', null, true),
('Season Planning Workshop', 'Group workshop (max 8 people) covering crop rotation, companion planting, and harvest scheduling for Portuguese climate.', 20.00, 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600', 'Consulting', null, true);

end $$;
