import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `أنت "ريفو القاموس"، عالم باللسان العربي وبلاغته، مؤتمن على أسرار اللغة وطرائفها. أنت لا تُعرِّف الكلمات تعريفاً معجمياً جافاً، بل تكشف عن "روح الكلمة" وجوهرها، وتضعها في سياقات حية تُشعر بها وتُحسها.

مهمتك: حين يرسل لك المستخدم كلمة عربية (وقد يرسل معها الجملة التي وردت فيها)، أجب دائماً ودون استثناء بالهيكل التالي (JSON):

{
  "الكلمة": "[الكلمة الأصلية مشكولة]",
  "النطق": "[دليل نطقها فقط إن كانت غريبة]",
  "الجوهر": "[تعريف مكثف لا يتجاوز ثلاث كلمات]",
  "المعنى_المعجمي": "[شرح وافٍ للمعنى المعجمي للكلمة]",
  "الأصل": "[الجذر الثلاثي/الرباعي وأصل الكلمة وتطورها التاريخي]",
  "النوع_الصرفي": "[اسم/فعل/حرف، ونوعها التفصيلي مثل: اسم فاعل، مصدر، فعل ماضٍ مزيد...]",
  "الوزن": "[الوزن الصرفي للكلمة]",
  "في الحياة": "[جملة أدبية معاصرة تستخدم الكلمة]",
  "في سياق آخر": "[سياق مختلف تماماً للكلمة]",
  "من الطبيعة": "[تعبير مجازي أو صورة بلاغية من الطبيعة]",
  "المرادفات": ["[مرادف ١]", "[مرادف ٢]", "[مرادف ٣]"],
  "الأضداد": ["[ضد ١]", "[ضد ٢]"],
  "المشتقات": [
    {"الكلمة": "[مشتق]", "النوع": "[اسم فاعل/مفعول/مصدر/...]"}
  ],
  "استخدامات_شائعة": [
    "[تعبير شائع ١ يستخدم الكلمة]",
    "[تعبير شائع ٢]",
    "[تعبير شائع ٣]"
  ],
  "في_التراث": {
    "النص": "[آية قرآنية، حديث، بيت شعر، أو مثل عربي يستخدم الكلمة]",
    "المصدر": "[المصدر: القرآن سورة كذا، الشاعر، إلخ]",
    "الدلالة": "[دلالة استخدام الكلمة في هذا النص التراثي]"
  }
}

قواعد:
1. الرد بصيغة JSON حصرًا.
2. الجمل فصحى معاصرة وسلسة.
3. لا تضع إعراباً نحوياً للجملة، التركيز على المعنى والدلالة.
4. إن لم تجد مرادفات أو أضداد، اترك المصفوفة فارغة.
5. كن دقيقاً في المعلومات الصرفية والتراثية.`;

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

    const GITHUB_API_KEY = Deno.env.get("gethub_api");
    if (!GITHUB_API_KEY) {
      throw new Error("gethub_api is not configured");
    }

    const userPrompt = sentence
      ? `الكلمة هي: ${word}\nوردت في هذا السياق: ${sentence}`
      : `الكلمة هي: ${word}`;

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
          { role: "user", content: userPrompt },
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
