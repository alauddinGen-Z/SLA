-- MASTER SQL INITIALIZATION SCRIPT
-- Run this in the Supabase SQL Editor to fully reset/initialize the database.

-- 1. Enable Extensions
create extension if not exists "uuid-ossp";

-- 2. Create Tables

-- Organizations (Maps 1:1 to Auth User for MVP)
create table if not exists organizations (
  id uuid references auth.users not null primary key,
  name text,
  commission_rate numeric not null default 0.1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Contracts
create table if not exists contracts (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references organizations(id) not null,
  file_url text not null,
  extracted_data_json jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Incidents
create table if not exists incidents (
  id uuid default uuid_generate_v4() primary key,
  contract_id uuid references contracts(id) not null,
  downtime_duration interval,
  penalty_amount numeric,
  status text default 'detected',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Extracted Rules
create table if not exists extracted_rules (
  id uuid default uuid_generate_v4() primary key,
  contract_id uuid references contracts(id) not null,
  rule_logic text not null,
  penalty_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Claims
create table if not exists claims (
  id uuid default uuid_generate_v4() primary key,
  incident_id uuid references incidents(id) on delete cascade,
  contract_id uuid references contracts(id) on delete cascade,
  status text default 'draft', -- draft, sent, paid
  refund_amount numeric,
  email_body text,
  payment_link_url text, -- For Paddle/Stripe link
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS)
alter table organizations enable row level security;
alter table contracts enable row level security;
alter table incidents enable row level security;
alter table extracted_rules enable row level security;
alter table claims enable row level security;

-- 4. Create RLS Policies

-- Organizations: Users can only see/edit their own organization
create policy "Users can view own organization" on organizations 
  for select using (auth.uid() = id);
create policy "Users can insert own organization" on organizations 
  for insert with check (auth.uid() = id);
create policy "Users can update own organization" on organizations 
  for update using (auth.uid() = id);

-- Contracts: Users can only see contracts where org_id matches their auth uid
create policy "Users can view own contracts" on contracts 
  for select using (auth.uid() = org_id);
create policy "Users can insert own contracts" on contracts 
  for insert with check (auth.uid() = org_id);
create policy "Users can delete own contracts" on contracts 
  for delete using (auth.uid() = org_id);

-- Incidents: Access via Contract ownership
create policy "Users can view own incidents" on incidents 
  for select using (
    exists (select 1 from contracts where contracts.id = incidents.contract_id and contracts.org_id = auth.uid())
  );
create policy "Users can insert own incidents" on incidents 
  for insert with check (
    exists (select 1 from contracts where contracts.id = incidents.contract_id and contracts.org_id = auth.uid())
  );

-- Extracted Rules: Access via Contract ownership
create policy "Users can view own rules" on extracted_rules 
  for select using (
    exists (select 1 from contracts where contracts.id = extracted_rules.contract_id and contracts.org_id = auth.uid())
  );

-- Claims: Access via Contract ownership
create policy "Users can view own claims" on claims 
  for select using (
    exists (select 1 from contracts where contracts.id = claims.contract_id and contracts.org_id = auth.uid())
  );
create policy "Users can insert own claims" on claims 
  for insert with check (
    exists (select 1 from contracts where contracts.id = claims.contract_id and contracts.org_id = auth.uid())
  );
create policy "Users can update own claims" on claims 
  for update using (
    exists (select 1 from contracts where contracts.id = claims.contract_id and contracts.org_id = auth.uid())
  );

-- 5. Storage Setup
insert into storage.buckets (id, name, public) 
values ('contract_docs', 'contract_docs', true) 
on conflict (id) do nothing;

create policy "Public Access" on storage.objects 
  for select using ( bucket_id = 'contract_docs' );

create policy "Authenticated Uploads" on storage.objects 
  for insert with check ( 
    bucket_id = 'contract_docs' 
    and auth.role() = 'authenticated'
  );
