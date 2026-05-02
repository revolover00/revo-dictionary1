import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpLeft, Loader2 } from "lucide-react";
import WordCard from "@/components/WordCard";
import RhetoricCard from "@/components/RhetoricCard";
import SentenceCard from "@/components/SentenceCard";
import FloatingElements from "@/components/FloatingElements";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [word, setWord] = useState("");
  const [mode, setMode] = useState<"word" | "sentence" | "rhetoric">("word");
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [sentenceData, setSentenceData] = useState<any>(null);
  const [error, setError] = useState("");
  const [rhetoricText, setRhetoricText] = useState("");
  const [rhetoricData, setRhetoricData] = useState<any>(null);
  const { toast } = useToast();

  const resetAll = () => {
    setData(null);
    setSentenceData(null);
    setRhetoricData(null);
    setError("");
  };

  const handleAnalyzeWord = async (targetWord: string, targetSentence?: string) => {
    if (!targetWord.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke("analyze-word", {
        body: { word: targetWord, sentence: targetSentence },
      });

      if (fnError) {
        setError("حدث خطأ في البحث عن المعنى.");
        toast({ title: "خطأ", description: fnError.message, variant: "destructive" });
      } else if (result?.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ في البحث عن المعنى.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSentence = async () => {
    if (!sentence.trim()) return;
    setLoading(true);
    setError("");
    setSentenceData(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke("analyze-sentence", {
        body: { sentence },
      });

      if (fnError) {
        setError("حدث خطأ في إعراب الجملة.");
        toast({ title: "خطأ", description: fnError.message, variant: "destructive" });
      } else if (result?.error) {
        setError(result.error);
      } else {
        setSentenceData(result);
      }
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ في إعراب الجملة.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeRhetoric = async () => {
    if (!rhetoricText.trim()) return;
    setLoading(true);
    setError("");
    setRhetoricData(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke("analyze-rhetoric", {
        body: { text: rhetoricText },
      });

      if (fnError) {
        setError("حدث خطأ في التحليل البلاغي.");
        toast({ title: "خطأ", description: fnError.message, variant: "destructive" });
      } else if (result?.error) {
        setError(result.error);
      } else {
        setRhetoricData(result);
      }
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ في التحليل البلاغي.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative font-sans">
      <FloatingElements />
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b from-amber-900/10 to-transparent blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex justify-center items-center p-6 md:p-8">
          <img src="/logo.svg" alt="Rivo logo" className="h-44 object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]" />
        </header>

        <main className="flex-1 flex flex-col items-center mt-12 md:mt-24 px-4 w-full relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl z-10"
          >
            <h1 className="font-serif text-6xl md:text-8xl leading-tight mb-2 tracking-tight text-foreground">
              اغص في بحر لغتنا
              <br />
              <span className="italic opacity-90">وحلّق في معانيها</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mt-6 font-light max-w-2xl mx-auto">
              اكتشف مكنونات العربية وروح مفرداتها بطريقة لم تعهدها من قبل. ذكاؤنا الاصطناعي يفكك الكلمة ويعيد صياغتها لتلامس وجدانك.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 z-20 w-full flex flex-col items-center relative"
          >
            <div className="flex flex-wrap justify-center bg-secondary/20 p-1 rounded-full backdrop-blur-md mb-8 border border-border">
              <button
                onClick={() => { setMode('word'); resetAll(); }}
                className={`px-6 py-2 rounded-full text-sm transition-all ${mode === 'word' ? 'bg-foreground text-background font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                بحث عن معنى
              </button>
              <button
                onClick={() => { setMode('sentence'); resetAll(); }}
                className={`px-6 py-2 rounded-full text-sm transition-all ${mode === 'sentence' ? 'bg-foreground text-background font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                إعراب من سياق
              </button>
              <button
                onClick={() => { setMode('rhetoric'); resetAll(); }}
                className={`px-6 py-2 rounded-full text-sm transition-all ${mode === 'rhetoric' ? 'bg-foreground text-background font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                تحليل بلاغي
              </button>
            </div>

            {mode === 'word' && (
              <form onSubmit={(e) => { e.preventDefault(); handleAnalyzeWord(word); }} className="relative group w-full max-w-md">
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="ابحث عن معنى كلمة..."
                  className="w-full bg-transparent border border-border rounded-full py-4 px-12 text-center text-lg outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all text-foreground placeholder:text-muted-foreground backdrop-blur-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpLeft size={20} />}
                </button>
              </form>
            )}

            {mode === 'sentence' && (
              <form onSubmit={(e) => { e.preventDefault(); handleAnalyzeSentence(); }} className="w-full max-w-2xl flex flex-col items-center gap-4">
                <textarea
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  placeholder="أدخل جملة عربية لإعرابها كاملةً..."
                  rows={3}
                  className="w-full bg-transparent border border-border rounded-2xl py-4 px-6 text-right text-lg outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all text-foreground placeholder:text-muted-foreground backdrop-blur-sm resize-none font-serif"
                />
                <button
                  type="submit"
                  disabled={loading || !sentence.trim()}
                  className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-80 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {loading ? "يعرب الجملة..." : "إعراب الجملة"}
                </button>
              </form>
            )}

            {mode === 'rhetoric' && (
              <form onSubmit={(e) => { e.preventDefault(); handleAnalyzeRhetoric(); }} className="w-full max-w-2xl flex flex-col items-center gap-4">
                <textarea
                  value={rhetoricText}
                  onChange={(e) => setRhetoricText(e.target.value)}
                  placeholder="أدخل نصاً عربياً (جملة، بيت شعر، آية...) لتحليله بلاغياً..."
                  rows={4}
                  className="w-full bg-transparent border border-border rounded-2xl py-4 px-6 text-right text-lg outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all text-foreground placeholder:text-muted-foreground backdrop-blur-sm resize-none font-serif"
                />
                <button
                  type="submit"
                  disabled={loading || !rhetoricText.trim()}
                  className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-80 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {loading ? "يحلّل النص..." : "تحليل بلاغي"}
                </button>
              </form>
            )}

            {loading && mode !== 'word' && (
              <div className="mt-8 flex items-center gap-3 text-muted-foreground">
                <Loader2 size={24} className="animate-spin" />
                <span>{mode === 'rhetoric' ? 'يحلّل البلاغة والمحسنات البديعية...' : 'يعرب الجملة كاملةً...'}</span>
              </div>
            )}
          </motion.div>

          {error && <p className="text-destructive mt-4 z-20">{error}</p>}

          <div className="w-full max-w-5xl mt-16 z-20 relative px-4">
            <AnimatePresence mode="wait">
              {data && mode === 'word' && (
                <div className="glass-card rounded-3xl p-8 border border-border backdrop-blur-xl">
                  <WordCard data={data} />
                </div>
              )}
              {sentenceData && mode === 'sentence' && (
                <div className="glass-card rounded-3xl p-8 border border-border backdrop-blur-xl">
                  <SentenceCard data={sentenceData} />
                </div>
              )}
              {rhetoricData && mode === 'rhetoric' && (
                <div className="glass-card rounded-3xl p-8 border border-border backdrop-blur-xl">
                  <RhetoricCard data={rhetoricData} />
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute top-[400px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] z-0 opacity-80 pointer-events-none">
            <div className="iridescent-bubble w-full h-full" />
          </div>
        </main>
      </div>
    </div>
  );
}
