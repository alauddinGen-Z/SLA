-- Enable RLS on tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view own organization"
ON organizations FOR SELECT
USING (auth.uid() = id);

-- Contracts: Users can only see contracts belonging to their organization
CREATE POLICY "Users can view own contracts"
ON contracts FOR SELECT
USING (auth.uid() = org_id);

CREATE POLICY "Users can insert own contracts"
ON contracts FOR INSERT
WITH CHECK (auth.uid() = org_id);

-- Incidents: Users can only see incidents belonging to their contracts
-- Note: This requires a join or a simpler check if we trust the contract_id. 
-- For MVP, we'll assume if you can see the contract, you can see the incident.
-- Ideally: USING (EXISTS (SELECT 1 FROM contracts WHERE id = incidents.contract_id AND org_id = auth.uid()))
-- But for simplicity/performance in MVP, we might just check if the user is authenticated for now, 
-- OR we can add org_id to incidents to make it easier.
-- Let's do the proper join check.

CREATE POLICY "Users can view own incidents"
ON incidents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM contracts 
    WHERE contracts.id = incidents.contract_id 
    AND contracts.org_id = auth.uid()
  )
);
