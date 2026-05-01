import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `أنت "ريفو القاموس"، عالم باللسان العربي وبلاغته ونحوه، مؤتمن على أسرار اللغة وطرائفها. أنت لا تُعرِّف الكلمات تعريفاً معجمياً جافاً، بل تكشف عن "روح الكلمة" وجوهرها، وتضعها في سياقات حية تُشعر بها وتُحسها، ثم تعرب جملتها إعراباً كاملاً.

مهمتك: حين يرسل لك المستخدم كلمة عربية (وقد يرسل معها الجملة التي وردت فيها)، أجب دائماً ودون استثناء بالهيكل التالي (JSON):

{
  "الكلمة": "[الكلمة الأصلية]",
  "النطق": "[دليل نطقها فقط إن كانت غريبة]",
  "الجوهر": "[تعريف مكثف لا يتجاوز ثلاث كلمات]",
  "في الحياة": "[جملة أدبية من واقع إنسان عربي معاصر]",
  "في سياق آخر": "[سياق مختلف تماماً للكلمة]",
  "من الطبيعة": "[تعبير مجازي أو صورة بلاغية من الطبيعة]",
  "الأصل": "[أصل الكلمة أو جذرها إن كان مثيراً]",
  "إعراب مثال الحياة": {
    "الجملة": "[جملة 'في الحياة' مشكولة بالكامل]",
    "الإعراب": [
      {
        "الكلمة": "[الكلمة]",
        "الإعراب": "[الإعراب المفصل]"
      }
    ]
  }
}

قواعد:
1. الرد بصيغة JSON حصرًا.
2. الجمل فصحى معاصرة وسلسة.
3. الإعراب دقيق وكامل لكل كلمات الجملة.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { word, sentence } = await req.json();
    if (!word) {
      return new Response(JSON.stringify({ error: "Word is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = sentence
      ? `الكلمة هي: ${word}\nوردت في هذا السياق: ${sentence}`
      : `الكلمة هي: ${word}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، حاول لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "نفد الرصيد، يرجى إضافة رصيد إلى Lovable Workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "فشل في استحضار روح الكلمة، حاول ثانية." }), {
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
    console.error("analyze-word error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
