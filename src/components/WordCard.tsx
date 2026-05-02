import { motion } from "motion/react";
import { Quote, TreePalm, Info, BookOpen, Sparkles } from "lucide-react";

interface WordData {
  الكلمة: string;
  النطق?: string;
  الجوهر: string;
  المعنى_المعجمي?: string;
  الأصل?: string;
  النوع_الصرفي?: string;
  الوزن?: string;
  "في الحياة": string;
  "في سياق آخر": string;
  "من الطبيعة"?: string;
  المرادفات?: string[];
  الأضداد?: string[];
  المشتقات?: Array<{ الكلمة: string; النوع: string }>;
  استخدامات_شائعة?: string[];
  في_التراث?: {
    النص: string;
    المصدر: string;
    الدلالة: string;
  };
}

export default function WordCard({ data }: { data: WordData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 pb-20"
    >
      <div className="text-center relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-serif italic tracking-tighter pb-4 drop-shadow-lg text-foreground"
        >
          {data.الكلمة}
        </motion.h2>
        {data.النطق && (
          <p className="text-muted-foreground text-sm md:text-base mt-2 font-mono tracking-widest uppercase">
            {data.النطق}
          </p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3"
      >
        <span className="bg-secondary/50 px-5 py-2 rounded-full border border-border backdrop-blur-md text-foreground">
          {data.الجوهر}
        </span>
        {data.النوع_الصرفي && (
          <span className="bg-amber-950/30 px-5 py-2 rounded-full border border-amber-500/20 text-amber-200/90 text-sm">
            {data.النوع_الصرفي}
          </span>
        )}
        {data.الوزن && (
          <span className="bg-emerald-950/30 px-5 py-2 rounded-full border border-emerald-500/20 text-emerald-200/90 text-sm font-mono">
            وزن: {data.الوزن}
          </span>
        )}
      </motion.div>

      {data.المعنى_المعجمي && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary/10 border border-border rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-muted-foreground text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <BookOpen size={14} /> المعنى المعجمي
          </h3>
          <p className="text-lg md:text-xl leading-relaxed text-foreground">
            {data.المعنى_المعجمي}
          </p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-secondary/10 border border-border rounded-2xl p-6 md:p-8 relative"
        >
          <Quote className="absolute top-4 right-4 text-muted-foreground/30" size={32} />
          <p className="text-xl md:text-3xl font-serif leading-relaxed pr-10 italic text-foreground">
            "{data["في الحياة"]}"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-secondary/10 border border-border rounded-2xl p-6 relative flex items-center gap-4"
        >
          <div className="w-2 h-2 rounded-full bg-muted-foreground shadow-[0_0_8px_white]" />
          <p className="text-muted-foreground leading-relaxed text-lg">
            {data["في سياق آخر"]}
          </p>
        </motion.div>

        {data["من الطبيعة"] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl p-4 bg-emerald-950/20 border border-emerald-500/20 backdrop-blur-md flex items-center gap-3 text-emerald-300/90 text-sm italic"
          >
            <TreePalm size={18} />
            {data["من الطبيعة"]}
          </motion.div>
        )}
      </div>

      {(data.المرادفات?.length || data.الأضداد?.length) && (
        <div className="grid md:grid-cols-2 gap-6">
          {data.المرادفات && data.المرادفات.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-secondary/10 border border-border rounded-2xl p-6"
            >
              <h3 className="text-muted-foreground text-sm uppercase tracking-[0.2em] mb-4">المرادفات</h3>
              <div className="flex flex-wrap gap-2">
                {data.المرادفات.map((m, i) => (
                  <span key={i} className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-foreground text-sm font-serif">
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {data.الأضداد && data.الأضداد.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="bg-secondary/10 border border-border rounded-2xl p-6"
            >
              <h3 className="text-muted-foreground text-sm uppercase tracking-[0.2em] mb-4">الأضداد</h3>
              <div className="flex flex-wrap gap-2">
                {data.الأضداد.map((m, i) => (
                  <span key={i} className="bg-destructive/10 border border-destructive/20 px-4 py-2 rounded-full text-foreground text-sm font-serif">
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {data.المشتقات && data.المشتقات.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-secondary/10 border border-border rounded-2xl p-6"
        >
          <h3 className="text-muted-foreground text-sm uppercase tracking-[0.2em] mb-4">المشتقات</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.المشتقات.map((m, i) => (
              <div key={i} className="bg-secondary/20 border border-border rounded-xl p-3 text-center">
                <div className="font-serif text-lg text-foreground">{m.الكلمة}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.النوع}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {data.استخدامات_شائعة && data.استخدامات_شائعة.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="bg-secondary/10 border border-border rounded-2xl p-6"
        >
          <h3 className="text-muted-foreground text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Sparkles size={14} /> استخدامات شائعة
          </h3>
          <ul className="space-y-3">
            {data.استخدامات_شائعة.map((u, i) => (
              <li key={i} className="text-foreground/90 leading-relaxed flex gap-3">
                <span className="text-muted-foreground">•</span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {data.في_التراث?.النص && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-amber-950/10 border border-amber-500/20 rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-amber-200/70 text-sm uppercase tracking-[0.2em] mb-4">في التراث</h3>
          <p className="text-xl md:text-2xl font-serif italic text-foreground leading-loose mb-3">
            "{data.في_التراث.النص}"
          </p>
          <p className="text-amber-300/60 text-sm mb-3">— {data.في_التراث.المصدر}</p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {data.في_التراث.الدلالة}
          </p>
        </motion.div>
      )}

      {data.الأصل && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center pt-8"
        >
          <div className="inline-flex items-center gap-2 text-amber-600/60 text-sm font-light">
            <Info size={14} />
            <span>{data.الأصل}</span>
          </div>
        </motion.footer>
      )}
    </motion.div>
  );
}
