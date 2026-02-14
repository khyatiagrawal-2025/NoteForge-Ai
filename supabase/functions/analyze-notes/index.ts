import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notes } = await req.json();
    if (!notes || typeof notes !== "string") {
      return new Response(JSON.stringify({ error: "Notes are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a meeting notes analyzer. Extract structured information from meeting notes/transcripts. You MUST respond by calling the extract_meeting_data function.`,
          },
          {
            role: "user",
            content: `Analyze these meeting notes and extract action items, decisions, and next steps:\n\n${notes}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_meeting_data",
              description: "Extract structured meeting data from notes",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "A brief 1-2 sentence summary of the meeting",
                  },
                  actionItems: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string", description: "The action item description" },
                        assignee: { type: "string", description: "Person responsible, or 'Team' if unclear" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                      },
                      required: ["text", "assignee", "priority"],
                      additionalProperties: false,
                    },
                  },
                  decisions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Key decisions made during the meeting",
                  },
                  nextSteps: {
                    type: "array",
                    items: { type: "string" },
                    description: "Upcoming steps, follow-ups, or scheduled meetings",
                  },
                },
                required: ["summary", "actionItems", "decisions", "nextSteps"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_meeting_data" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No structured response from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-notes error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
