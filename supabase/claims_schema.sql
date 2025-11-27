-- Create Claims table
CREATE TABLE IF NOT EXISTS claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft', -- draft, sent, paid
  refund_amount NUMERIC,
  email_body TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view claims for their contracts
CREATE POLICY "Users can view own claims"
ON claims FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM contracts 
    WHERE contracts.id = claims.contract_id 
    AND contracts.org_id = auth.uid()
  )
);

-- Policy: Users can insert claims (for simulation/testing)
CREATE POLICY "Users can insert own claims"
ON claims FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM contracts 
    WHERE contracts.id = claims.contract_id 
    AND contracts.org_id = auth.uid()
  )
);
