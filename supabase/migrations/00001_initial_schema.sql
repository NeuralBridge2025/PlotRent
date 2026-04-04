-- PlotRent MVP — Initial Schema
-- Tables, enums, RLS policies, triggers, and storage

-- ============================================================
-- ENUMS
-- ============================================================

create type public.user_role as enum ('renter', 'host', 'both');
create type public.booking_status as enum ('pending', 'confirmed', 'active', 'completed', 'cancelled');

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'renter',
  level text,
  member_since date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Plots (garden listings)
create table public.plots (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  price_per_month numeric(10,2) not null check (price_per_month > 0),
  size_sqm numeric(8,2) not null check (size_sqm > 0),
  latitude double precision not null,
  longitude double precision not null,
  address text not null,
  city text not null,
  country text not null default 'Portugal',
  soil_type text,
  sun_exposure text,
  utilities text[],
  tags text[],
  images text[] not null default '{}',
  rating numeric(2,1) check (rating >= 0 and rating <= 5),
  review_count integer not null default 0,
  is_active boolean not null default true,
  instant_book boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  plot_id uuid not null references public.plots(id) on delete cascade,
  renter_id uuid not null references public.profiles(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status public.booking_status not null default 'pending',
  monthly_price numeric(10,2) not null,
  service_fee numeric(10,2) not null,
  insurance_fee numeric(10,2),
  security_deposit numeric(10,2) not null,
  total_amount numeric(10,2) not null,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_dates_check check (end_date > start_date)
);

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  text text,
  image_url text,
  read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint messages_content_check check (text is not null or image_url is not null)
);

-- Services (marketplace items)
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric(10,2) not null check (price > 0),
  image_url text not null,
  category text not null,
  unit text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  plot_id uuid not null references public.plots(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  constraint reviews_unique_per_user unique (plot_id, reviewer_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_plots_host_id on public.plots(host_id);
create index idx_plots_city on public.plots(city);
create index idx_plots_is_active on public.plots(is_active) where is_active = true;
create index idx_bookings_plot_id on public.bookings(plot_id);
create index idx_bookings_renter_id on public.bookings(renter_id);
create index idx_bookings_status on public.bookings(status);
create index idx_messages_sender_id on public.messages(sender_id);
create index idx_messages_receiver_id on public.messages(receiver_id);
create index idx_messages_created_at on public.messages(created_at);
create index idx_reviews_plot_id on public.reviews(plot_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger plots_updated_at
  before update on public.plots
  for each row execute function public.handle_updated_at();

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON AUTH SIGNUP
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.plots enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;
alter table public.services enable row level security;
alter table public.reviews enable row level security;

-- PROFILES --
-- Anyone can read profiles (for display names/avatars)
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- PLOTS --
-- Active plots are viewable by everyone
create policy "Active plots are viewable by everyone"
  on public.plots for select
  using (is_active = true or host_id = auth.uid());

-- Hosts can insert their own plots
create policy "Hosts can create plots"
  on public.plots for insert
  with check (auth.uid() = host_id);

-- Hosts can update their own plots
create policy "Hosts can update own plots"
  on public.plots for update
  using (auth.uid() = host_id)
  with check (auth.uid() = host_id);

-- Hosts can delete their own plots
create policy "Hosts can delete own plots"
  on public.plots for delete
  using (auth.uid() = host_id);

-- BOOKINGS --
-- Users can see bookings they're part of (renter or host of the plot)
create policy "Users can view own bookings"
  on public.bookings for select
  using (
    auth.uid() = renter_id
    or auth.uid() in (
      select host_id from public.plots where id = plot_id
    )
  );

-- Renters can create bookings
create policy "Renters can create bookings"
  on public.bookings for insert
  with check (auth.uid() = renter_id);

-- Participants can update booking status
create policy "Participants can update bookings"
  on public.bookings for update
  using (
    auth.uid() = renter_id
    or auth.uid() in (
      select host_id from public.plots where id = plot_id
    )
  );

-- MESSAGES --
-- Users can see messages they sent or received
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Users can send messages
create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Receivers can mark messages as read
create policy "Receivers can update messages"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- SERVICES --
-- Services are viewable by everyone
create policy "Services are viewable by everyone"
  on public.services for select
  using (true);

-- REVIEWS --
-- Reviews are viewable by everyone
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

-- Authenticated users can create reviews
create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = reviewer_id);

-- Users can update their own reviews
create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = reviewer_id)
  with check (auth.uid() = reviewer_id);

-- Users can delete their own reviews
create policy "Users can delete own reviews"
  on public.reviews for delete
  using (auth.uid() = reviewer_id);

-- ============================================================
-- STORAGE BUCKET FOR PLOT IMAGES
-- ============================================================

insert into storage.buckets (id, name, public)
values ('plot-images', 'plot-images', true)
on conflict (id) do nothing;

-- Anyone can view plot images
create policy "Plot images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'plot-images');

-- Authenticated users can upload plot images
create policy "Authenticated users can upload plot images"
  on storage.objects for insert
  with check (bucket_id = 'plot-images' and auth.role() = 'authenticated');

-- Users can delete their own uploaded images
create policy "Users can delete own plot images"
  on storage.objects for delete
  using (bucket_id = 'plot-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- REALTIME (enable for messages table)
-- ============================================================

alter publication supabase_realtime add table public.messages;
