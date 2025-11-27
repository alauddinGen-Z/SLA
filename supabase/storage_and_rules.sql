-- Create extracted_rules table
create table extracted_rules (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references contracts(id) not null,
  rule_logic text not null,
  penalty_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: Storage buckets are usually created via the Supabase Dashboard or API, 
-- but we can try to insert into storage.buckets if permissions allow.
-- For this MVP, we assume the bucket 'contract_docs' will be created manually or via this script if possible.

insert into storage.buckets (id, name, public)
values ('contract_docs', 'contract_docs', true)
on conflict (id) do nothing;

-- Policy to allow authenticated uploads (and public reads for simplicity in MVP)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'contract_docs' );

create policy "Authenticated Uploads"
  on storage.objects for insert
  with check ( bucket_id = 'contract_docs' );
