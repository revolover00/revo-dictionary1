import { motion } from "motion/react";
import { Quote, TreePalm, Info } from "lucide-react";

interface WordData {
  الكلمة: string;
  النطق: string;
  الجوهر: string;
  "في الحياة": string;
  "في سياق آخر": string;
  "من الطبيعة": string;
  الأصل: string;
  "إعراب مثال الحياة": {
    الجملة: string;
    الإعراب: Array<{ الكلمة: string; الإعراب: string }>;
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
          className="text-6xl md:text-8xl font-serif italic tracking-tighter pb-4 drop-shadow-lg"
          style={{ color: 'hsl(var(--foreground))' }}
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
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <span className="bg-secondary/50 px-5 py-2 rounded-full border border-border backdrop-blur-md text-foreground">
          {data.الجوهر}
        </span>
      </motion.div>

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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-secondary/5 rounded-3xl p-6 md:p-8 border border-border shadow-2xl backdrop-blur-xl"
      >
        <h3 className="text-muted-foreground text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          إعراب جملة: {data["إعراب مثال الحياة"]?.الجملة}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 font-medium text-foreground/80 w-1/4">الكلمة</th>
                <th className="py-4 font-light text-muted-foreground">الإعراب التفصيلي</th>
              </tr>
            </thead>
            <tbody>
              {data["إعراب مثال الحياة"]?.الإعراب?.map((item, idx) => (
                <tr key={idx} className="border-b border-border/30 hover:bg-secondary/10 transition-colors">
                  <td className="py-5 font-serif font-semibold text-lg text-foreground">{item.الكلمة}</td>
                  <td className="py-5 text-muted-foreground leading-relaxed">{item.الإعراب}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {data.الأصل && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center pt-8"
        >
          <div className="inline-flex items-center gap-2 text-amber-600/60 text-xs font-light">
            <Info size={14} />
            <span>{data.الأصل}</span>
          </div>
        </motion.footer>
      )}
    </motion.div>
  );
}
