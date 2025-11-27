const pageText = textContentItem.items.map((item: any) => item.str).join(' ');
textContent += pageText + '\n';
            }

if (!textContent || textContent.trim().length === 0) {
    throw new Error("OCR not yet supported, please upload a digital PDF (text-selectable).");
}
        } else {
    console.log("Parsing Text File...");
    textContent = await fileData.text();
}

// 4. Call Gemini API
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
if (!geminiApiKey) throw new Error('GEMINI_API_KEY not set')

const prompt = `
      Analyze the following contract text. 
      Extract any Service Level Agreements (SLAs) regarding uptime, latency, or support response time. 
      Return ONLY a JSON array with this format: 
      [{ "logic": "uptime < 99.9%", "penalty": "10% credit" }]
      
      Contract Text:
      ${textContent.substring(0, 10000)}
    `

const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
    })
})

const geminiData = await geminiResponse.json()
const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '[]'

// Clean up markdown code blocks if present
const jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
let extractedRules = []
try {
    extractedRules = JSON.parse(jsonString)
} catch (e) {
    console.error("Failed to parse Gemini JSON:", jsonString)
    // Fallback
    extractedRules = [{ logic: "Parse Error", penalty: "Could not extract structured data" }]
}

// 5. Get Authenticated User
const authHeader = req.headers.get('Authorization')
if (!authHeader) throw new Error('No authorization header')

const token = authHeader.replace('Bearer ', '')
const { data: { user }, error: userError } = await supabase.auth.getUser(token)

if (userError || !user) throw new Error('Unauthorized')

// 6. Create Contract Record
const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
        org_id: user.id, // Use actual authenticated user ID
        file_url: file_path,
        extracted_data_json: extractedRules
    })
    .select()
    .maybeSingle() // Changed from .single() to prevent 406 errors

if (contractError) {
    console.error('Error creating contract:', contractError)
    // Still return extracted rules even if DB insert fails
}

return new Response(
    JSON.stringify(extractedRules),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
)

    } catch (error: any) {
    return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
}
})
