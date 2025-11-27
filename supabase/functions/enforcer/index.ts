import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { incident_id, contract_id, downtime_minutes } = await req.json()

        // 1. Initialize Supabase Client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        // 2. Fetch Contract Rules
        const { data: contract, error: contractError } = await supabase
            .from('contracts')
            .select('extracted_data_json, file_url')
            .eq('id', contract_id)
            .maybeSingle() // Changed from .single() to prevent 406 errors

        if (contractError || !contract) throw new Error("Contract not found")

        // 3. Call Gemini to Enforce Rules
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
        if (!geminiApiKey) throw new Error('GEMINI_API_KEY not set')

        const prompt = `
      You are "The Enforcer", a top-tier FinOps lawyer agent.
      
      CONTEXT:
      A downtime incident occurred for ${downtime_minutes} minutes.
      
      CONTRACT RULES (SLA):
      ${JSON.stringify(contract.extracted_data_json)}
      
      TASK:
      1. Calculate the refund amount based on the rules. If no specific rule matches, estimate a fair penalty (e.g. $1000/hr).
      2. Draft a formal, aggressive, but professional email to the vendor demanding the credit.
      
      RETURN JSON ONLY:
      {
        "refund_amount": 500.00,
        "email_body": "Subject: Urgent: SLA Breach Notice\\n\\nDear Vendor,\\n\\n..."
      }
    `

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        })

        const geminiData = await geminiResponse.json()
        const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
        const jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim()

        let result = { refund_amount: 0, email_body: "Error generating claim." }
        try {
            result = JSON.parse(jsonString)
        } catch (e) {
            console.error("Failed to parse Gemini JSON:", jsonString)
        }

        // 4. Insert into Claims Table
        const { data: claim, error: claimError } = await supabase
            .from('claims')
            .insert({
                incident_id: incident_id,
                contract_id: contract_id,
                refund_amount: result.refund_amount,
                email_body: result.email_body,
                status: 'draft'
            })
            .select()
            .maybeSingle() // Changed from .single() to prevent 406 errors

        if (claimError || !claim) throw new Error('Failed to create claim')

        return new Response(
            JSON.stringify(claim),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    }
})
