-- Run in Supabase Dashboard → SQL Editor
--
-- Auth model:
--   verify-subscription / cancel-subscription → user session + RLS below
--   PayPal webhook → SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)

create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  paypal_subscription_id text not null,
  plan text not null check (plan in ('pro', 'team')),
  status text not null default 'active'
           check (status in ('active', 'cancelled', 'suspended', 'expired')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

alter table subscriptions enable row level security;

drop policy if exists "Users can read own subscription" on subscriptions;
create policy "Users can read own subscription"
  on subscriptions for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own subscription" on subscriptions;
create policy "Users can insert own subscription"
  on subscriptions for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own subscription" on subscriptions;
create policy "Users can update own subscription"
  on subscriptions for update using (auth.uid() = user_id);
