import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `أنت "ريفو النحوي"، عالم بالنحو العربي وأسراره. مهمتك إعراب الجمل العربية إعراباً كاملاً ودقيقاً، كلمة كلمة، مع تحليل التركيب العام للجملة.

حين يرسل لك المستخدم جملة عربية، أجب دائماً بالهيكل التالي (JSON):

{
  "الجملة_الأصلية": "[الجملة كما أرسلها المستخدم]",
  "الجملة_مشكولة": "[الجملة بالتشكيل الكامل]",
  "نوع_الجملة": "[اسمية/فعلية + وصف موجز]",
  "التحليل_العام": "[وصف تركيب الجملة في سطر أو سطرين: المبتدأ والخبر، أو الفعل والفاعل والمفعول، إلخ]",
  "الإعراب": [
    {
      "الكلمة": "[الكلمة مشكولة]",
      "نوعها": "[اسم/فعل/حرف]",
      "الإعراب": "[الإعراب التفصيلي مع علامة الإعراب]",
      "الموقع": "[فاعل/مفعول/مبتدأ/خبر/حال/...]"
    }
  ],
  "ملاحظات_نحوية": [
    "[ملاحظة نحوية مهمة على الجملة، إن وُجدت]"
  ]
}

قواعد:
1. الرد بصيغة JSON حصرًا.
2. أعرب كل كلمة في الجملة بدون استثناء، حتى الحروف.
3. اذكر علامة الإعراب (الضمة الظاهرة، الفتحة المقدرة، إلخ).
4. كن دقيقاً وموجزاً في الإعراب.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sentence } = await req.json();
    if (!sentence || !sentence.trim()) {
      return new Response(JSON.stringify({ error: "الجملة مطلوبة للإعراب" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GITHUB_API_KEY = Deno.env.get("gethub_api");
    if (!GITHUB_API_KEY) {
      throw new Error("gethub_api is not configured");
    }

    const response = await fetch("https://models.github.ai/inference/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `أعرب هذه الجملة كاملةً:\n${sentence}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub Models error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، حاول لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "فشل إعراب الجملة، حاول ثانية." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI");

    const parsed = JSON.parse(content);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-sentence error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
