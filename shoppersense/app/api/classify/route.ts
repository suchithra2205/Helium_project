import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { processEvents } from "@/lib/behaviorProcessor";
import { SessionEvent, BehaviorSignals, ClassificationResult } from "@/types";

// Client is instantiated lazily inside the handler to avoid build-time errors
// when OPENAI_API_KEY env var is not present.
let openaiClient: OpenAI | null = null;
function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

function buildPrompt(signals: BehaviorSignals): string {
  return `You are a world-class ecommerce personalization AI. Analyze the following behavioral signals from a single shopper session and classify the shopper into exactly one state.

## Behavioral Signals (preprocessed from raw events):
${JSON.stringify(signals, null, 2)}

## Shopper States (choose exactly one):
- **Browser**: Home page, category browsing, short session, no product focus
- **Comparer**: Multiple product views of similar products, multiple categories
- **Discount Seeker**: Coupon searches, sale collections, price sorting, discount clicks
- **Cart Abandoner**: Added to cart, may have started checkout, but no purchase and abandoned cart
- **Loyal Customer**: Purchase completed, high engagement, wishlist adds, repeat behavior
- **High Intent Buyer**: Focused session, product view → add to cart → checkout, minimal distractions
- **Returning Visitor**: Has previous session signals, recently viewed items

## Task:
1. Analyze the signals carefully
2. Infer the most likely shopper intent and state
3. Return ONLY a valid JSON object with this exact structure:

{
  "state": "<one of the 7 states above>",
  "confidence": <integer 0-100>,
  "reasoning": "<1-2 sentence natural language explanation of why this state was chosen>",
  "evidence": ["<specific signal that supports this classification>", ...],
  "recommended_actions": ["<specific personalization action>", ...]
}

Rules:
- confidence should reflect how clearly the signals point to this state (>85 = very clear, 60-85 = probable, <60 = uncertain)
- evidence must be 2-4 specific bullet points derived from the signals
- recommended_actions must be 2-4 concrete, actionable personalization suggestions
- Return ONLY the JSON with no markdown, no preamble, no trailing text`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { events }: { events: SessionEvent[] } = body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "Invalid session: events array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // Preprocess events into derived signals
    const signals: BehaviorSignals = processEvents(events);

    // Build prompt and call OpenAI
    const prompt = buildPrompt(signals);

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an ecommerce personalization AI. Always respond with valid JSON only, no markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      return NextResponse.json(
        { error: "Empty response from AI model" },
        { status: 500 }
      );
    }

    let result: ClassificationResult;
    try {
      // Strip any accidental markdown code fences
      const cleaned = raw.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON", raw },
        { status: 500 }
      );
    }

    return NextResponse.json({ result, signals });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
