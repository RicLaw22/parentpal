// ──────────────────────────────────────────────────────────────────────────────
// ParentPal — AI Analysis API Route
// Receives a base64-encoded homework image, calls Claude Vision API,
// returns structured bilingual JSON: answer, steps, explanation, parent scripts.
// ──────────────────────────────────────────────────────────────────────────────

const PARENTPAL_PROMPT = `You are ParentPal — a warm, friendly Indian school teacher helping a parent understand their child's Class 2-8 homework. Look at the image carefully. Find the homework question. Then respond ONLY in this exact JSON format (no markdown, no code blocks, no extra text outside JSON):

{
  "subject": "Math",
  "classLevel": "Class 5",
  "questionDetected": "What is 48 divided by 6?",
  "answer": "8",
  "steps": [
    "We need to find how many times 6 fits into 48",
    "Count: 6 × 1=6, 6 × 2=12 … 6 × 8=48 ✓",
    "So 48 ÷ 6 = 8"
  ],
  "explanation": "Division means sharing equally. Imagine 48 mangoes divided equally among 6 baskets — each basket gets 8 mangoes!",
  "parentScript_en": "Beta, think of it like this: uou have 48 chocolates and 6 friends. If you give the same number to each friend, how many does each one get? Count in 6s — 6, 12, 18, 24, 30, 36, 42, 48 — that's 8 jumps, so the answer is 8!",
  "parentScript_hi": "बेटा, ऐसे सोचो — तुम्हारे पास 48 चॉकलेट हैं और 6 दोस्त। हर दोस्त को बराबर देना है। 6-6 करके गिनो — 6, 12, 18, 24, 30, 36, 42, 48 — यानी 8 बार। तो जवाब है 8!"
}

STRICT RULES — follow exactly:
- subject: one of "Math", "English", "Science", or "Other"
- classLevel: e.g. "Class 3", "Class 6" — estimate from question difficulty
- questionDetected: copy or summarise the exact question from the image
- answer: the final correct answer only (concise)
- steps: array of 2–5 strings, each one clear calculation/reasoning step. NO step numbering (e.g. "Step 1:") — just the text.
  • Math: show every arithmetic operation with numbers
  • English: state grammar rule first, then apply it
  • Science: give a real-life Indian analogy first, then explain
- explanation: 1–2 sentences, simple language a child understands. Use Indian examples (chai, cricket, roti, mangoes, rupees, festivals).
- parentScript_en: warm English, like a kind teacher. Occasionally use "Beta". 3–5 sentences.
- parentScript_hi: conversational Devanagari Hindi — NOT Romanised. Use everyday words (dekho, samjho, sochte hain). 3–5 sentences. Avoid formal Sanskrit-heavy Hindi.
- NEVER output anything outside the JSON object.
- If you cannot read the image, still return valid JSON with questionDetected: "Could not read the question clearly" and a helpful message in explanation.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageBase64, imageType } = body;

    if (!imageBase64) {
      return Response.json(
        { error: 'No image provided. Please upload a homework photo.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error:
            'API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.',
        },
        { status: 500 }
      );
    }

    // Validate media type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const mediaType = validTypes.includes(imageType) ? imageType : 'image/jpeg';

    // Call Claude Vision API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1400,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: PARENTPAL_PROMPT,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errBody = await response.json();
        errorDetails = errBody?.error?.message || JSON.stringify(errBody);
      } catch {}
      console.error(`Anthropic API error ${response.status}:`, errorDetails);
      return Response.json(
        {
          error: `AI service error (${response.status}). Please try again.`,
          details: errorDetails,
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawText = data?.content?.[0]?.text;

    if (!rawText) {
      return Response.json(
        { error: 'Empty response from AI. Please try again.' },
        { status: 502 }
      );
    }

    // Parse JSON — handle cases where model wraps in markdown code blocks
    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      // Try stripping markdown code fences
      const stripped = rawText
        .replace(/^```(?:json)?\n?/m, '')
        .replace(/\n?```$/m, '')
        .trim();
      try {
        result = JSON.parse(stripped);
      } catch {
        // Last resort: extract first JSON object
        const match = stripped.match(/\{[\s\S]*\}/);
        if (match) {
          result = JSON.parse(match[0]);
        } else {
          console.error('Could not parse AI response:', rawText.slice(0, 500));
          return Response.json(
            { error: 'Could not understand the AI response. Please try again.' },
            { status: 502 }
          );
        }
      }
    }

    // Sanitise / ensure required fields
    const sanitised = {
      subject: result.subject || 'Other',
      classLevel: result.classLevel || '',
      questionDetected: result.questionDetected || 'Question detected from image',
      answer: result.answer || '—',
      steps: Array.isArray(result.steps) ? result.steps.filter(Boolean) : [],
      explanation: result.explanation || '',
      parentScript_en: result.parentScript_en || '',
      parentScript_hi: result.parentScript_hi || '',
    };

    return Response.json(sanitised);
  } catch (err) {
    console.error('Unexpected error in /api/analyze:', err);
    return Response.json(
      { error: err.message || 'Unexpected server error. Please try again.' },
      { status: 500 }
    );
  }
}
