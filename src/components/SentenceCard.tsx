import { motion } from "motion/react";

interface SentenceData {
  الجملة_الأصلية: string;
  الجملة_مشكولة: string;
  نوع_الجملة: string;
  التحليل_العام: string;
  الإعراب: Array<{
    الكلمة: string;
    نوعها: string;
    الإعراب: string;
    الموقع?: string;
  }>;
  ملاحظات_نحوية?: string[];
}

export default function SentenceCard({ data }: { data: SentenceData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 pb-20"
    >
      <div className="text-center">
        <p className="text-3xl md:text-5xl font-serif leading-loose text-foreground drop-shadow-lg">
          {data.الجملة_مشكولة}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <span className="bg-secondary/50 px-5 py-2 rounded-full border border-border backdrop-blur-md text-foreground">
          {data.نوع_الجملة}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-secondary/10 border border-border rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-muted-foreground text-sm uppercase tracking-[0.2em] mb-3">التحليل العام</h3>
        <p className="text-lg leading-relaxed text-foreground">{data.التحليل_العام}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-secondary/5 rounded-3xl p-6 md:p-8 border border-border shadow-2xl backdrop-blur-xl"
      >
        <h3 className="text-muted-foreground text-sm uppercase tracking-[0.2em] mb-6">الإعراب التفصيلي</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 font-medium text-foreground/80 w-1/5">الكلمة</th>
                <th className="py-4 font-medium text-foreground/80 w-1/6">النوع</th>
                <th className="py-4 font-light text-muted-foreground">الإعراب</th>
              </tr>
            </thead>
            <tbody>
              {data.الإعراب?.map((item, idx) => (
                <tr key={idx} className="border-b border-border/30 hover:bg-secondary/10 transition-colors">
                  <td className="py-5 font-serif font-semibold text-lg text-foreground">{item.الكلمة}</td>
                  <td className="py-5 text-amber-300/80 text-sm">{item.نوعها}</td>
                  <td className="py-5 text-muted-foreground leading-relaxed">
                    {item.الإعراب}
                    {item.الموقع && (
                      <span className="block text-xs text-emerald-300/60 mt-1">({item.الموقع})</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {data.ملاحظات_نحوية && data.ملاحظات_نحوية.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-950/10 border border-amber-500/20 rounded-2xl p-6"
        >
          <h3 className="text-amber-200/70 text-sm uppercase tracking-[0.2em] mb-4">ملاحظات نحوية</h3>
          <ul className="space-y-2">
            {data.ملاحظات_نحوية.map((n, i) => (
              <li key={i} className="text-foreground/90 leading-relaxed flex gap-3">
                <span className="text-amber-400/60">◆</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
