import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `أنت "ريفو البلاغي"، خبير بعلوم البلاغة العربية الثلاثة: علم البيان، وعلم المعاني، وعلم البديع. مهمتك تحليل النصوص العربية تحليلاً بلاغياً شاملاً وعميقاً.

حين يرسل لك المستخدم نصاً عربياً (جملة، بيت شعر، آية، أو فقرة)، أجب دائماً بالهيكل التالي (JSON):

{
  "النص": "[النص الأصلي]",
  "التحليل_العام": "[نظرة شاملة موجزة على جماليات النص في 2-3 أسطر]",
  "المحسنات_البديعية": [
    {
      "النوع": "[اسم المحسن: طباق، جناس، سجع، تورية، مقابلة، إلخ]",
      "التصنيف": "[لفظي أو معنوي]",
      "الموضع": "[الكلمات أو العبارة التي تحتوي المحسن]",
      "الشرح": "[شرح وافٍ للمحسن وأثره في المعنى والجمال]",
      "الأثر_البلاغي": "[ما يضيفه هذا المحسن للنص من قوة وجمال]"
    }
  ],
  "الصور_البيانية": [
    {
      "النوع": "[تشبيه، استعارة، كناية، مجاز مرسل، إلخ]",
      "النوع_الفرعي": "[تشبيه بليغ، استعارة مكنية، إلخ - إن وُجد]",
      "الموضع": "[العبارة التي تحتوي الصورة]",
      "الشرح": "[تفكيك الصورة]",
      "الأثر_البلاغي": "[جمالية الصورة وأثرها في النفس]"
    }
  ],
  "الأساليب": [
    {
      "النوع": "[خبري، إنشائي، قصر، توكيد، إلخ]",
      "الموضع": "[العبارة]",
      "الغرض": "[الغرض البلاغي]",
      "الشرح": "[شرح الأسلوب وسبب اختياره]"
    }
  ],
  "التحليل_الصرفي": [
    {
      "الكلمة": "[كلمة مهمة في النص]",
      "الوزن": "[الوزن الصرفي]",
      "الجذر": "[الجذر الثلاثي أو الرباعي]",
      "النوع": "[اسم فاعل، مصدر، فعل ماضٍ، إلخ]",
      "ملاحظة": "[أي ملاحظة صرفية مثيرة]"
    }
  ],
  "الموسيقى_الداخلية": "[تحليل الإيقاع والموسيقى الداخلية للنص إن وُجدت]",
  "بيت_شعر_مشابه": {
    "البيت": "[بيت شعر عربي شهير يحمل محسنات أو صوراً مشابهة]",
    "الشاعر": "[اسم الشاعر]",
    "وجه_الشبه": "[ما يجمع بين النصين بلاغياً]"
  }
}

قواعد:
1. الرد بصيغة JSON حصرًا.
2. كن دقيقاً في تحديد نوع كل محسن وصورة بيانية.
3. إن لم يحتوِ النص على محسن معين، اترك المصفوفة فارغة.
4. اشرح بأسلوب أدبي سلس يُقرّب البلاغة من القارئ.
5. أضف التحليل الصرفي فقط للكلمات المهمة (3-5 كلمات).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: "النص مطلوب للتحليل البلاغي" }), {
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
          { role: "user", content: `حلّل هذا النص بلاغياً:\n${text}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، حاول لاحقاً." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "نفد الرصيد، يرجى إضافة رصيد إلى Lovable Workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "فشل التحليل البلاغي، حاول ثانية." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    console.error("analyze-rhetoric error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
