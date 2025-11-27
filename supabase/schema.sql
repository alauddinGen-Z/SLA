-- Create organizations table
create table organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  commission_rate numeric not null default 0.1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create contracts table
create table contracts (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) not null,
  file_url text not null,
  extracted_data_json jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create incidents table
create table incidents (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references contracts(id) not null,
  downtime_duration interval,
  penalty_amount numeric,
  status text default 'detected',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
