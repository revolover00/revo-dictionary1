import { motion } from "motion/react";
import { Sparkles, Palette, BookOpen, Music, Feather, Quote } from "lucide-react";

interface RhetoricItem {
  النوع: string;
  التصنيف?: string;
  الموضع: string;
  الشرح: string;
  الأثر_البلاغي?: string;
  النوع_الفرعي?: string;
  الغرض?: string;
}

interface MorphItem {
  الكلمة: string;
  الوزن: string;
  الجذر: string;
  النوع: string;
  ملاحظة?: string;
}

interface RhetoricData {
  النص: string;
  التحليل_العام: string;
  المحسنات_البديعية: RhetoricItem[];
  الصور_البيانية: RhetoricItem[];
  الأساليب: RhetoricItem[];
  التحليل_الصرفي: MorphItem[];
  الموسيقى_الداخلية: string;
  بيت_شعر_مشابه?: {
    البيت: string;
    الشاعر: string;
    وجه_الشبه: string;
  };
}

function SectionHeader({ icon: Icon, title, count }: { icon: any; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
        <Icon size={16} className="text-primary" />
      </div>
      <h2 className="text-foreground font-semibold text-lg">{title}</h2>
      {count !== undefined && count > 0 && (
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{count}</span>
      )}
    </div>
  );
}

function RhetoricItemCard({ item, index, color }: { item: RhetoricItem; index: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={`bg-secondary/10 border border-border rounded-2xl p-5 space-y-3`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${color}`}>
          {item.النوع}
        </span>
        {item.التصنيف && (
          <span className="text-xs text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full">
            {item.التصنيف}
          </span>
        )}
        {item.النوع_الفرعي && (
          <span className="text-xs text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full">
            {item.النوع_الفرعي}
          </span>
        )}
      </div>
      <div className="bg-secondary/20 rounded-xl p-3 border border-border/50">
        <p className="font-serif text-lg text-foreground italic">"{item.الموضع}"</p>
      </div>
      <p className="text-muted-foreground leading-relaxed text-sm">{item.الشرح}</p>
      {item.الأثر_البلاغي && (
        <p className="text-amber-400/80 text-sm italic flex items-start gap-2">
          <Sparkles size={14} className="mt-1 shrink-0" />
          {item.الأثر_البلاغي}
        </p>
      )}
      {item.الغرض && (
        <p className="text-emerald-400/80 text-sm italic flex items-start gap-2">
          <Sparkles size={14} className="mt-1 shrink-0" />
          الغرض: {item.الغرض}
        </p>
      )}
    </motion.div>
  );
}

export default function RhetoricCard({ data }: { data: RhetoricData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 pb-20"
    >
      {/* Original Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-3xl md:text-4xl font-serif italic text-foreground leading-relaxed">
          "{data.النص}"
        </p>
      </motion.div>

      {/* General Analysis */}
      {data.التحليل_العام && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-l from-primary/5 to-transparent border border-border rounded-2xl p-6"
        >
          <p className="text-muted-foreground leading-relaxed text-base">{data.التحليل_العام}</p>
        </motion.div>
      )}

      {/* المحسنات البديعية */}
      {data.المحسنات_البديعية?.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <SectionHeader icon={Sparkles} title="المحسنات البديعية" count={data.المحسنات_البديعية.length} />
          <div className="grid md:grid-cols-2 gap-4">
            {data.المحسنات_البديعية.map((item, idx) => (
              <RhetoricItemCard key={idx} item={item} index={idx} color="border-amber-500/30 text-amber-400 bg-amber-500/10" />
            ))}
          </div>
        </motion.section>
      )}

      {/* الصور البيانية */}
      {data.الصور_البيانية?.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <SectionHeader icon={Palette} title="الصور البيانية" count={data.الصور_البيانية.length} />
          <div className="grid md:grid-cols-2 gap-4">
            {data.الصور_البيانية.map((item, idx) => (
              <RhetoricItemCard key={idx} item={item} index={idx} color="border-sky-500/30 text-sky-400 bg-sky-500/10" />
            ))}
          </div>
        </motion.section>
      )}

      {/* الأساليب */}
      {data.الأساليب?.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <SectionHeader icon={BookOpen} title="الأساليب البلاغية" count={data.الأساليب.length} />
          <div className="grid md:grid-cols-2 gap-4">
            {data.الأساليب.map((item, idx) => (
              <RhetoricItemCard key={idx} item={item} index={idx} color="border-emerald-500/30 text-emerald-400 bg-emerald-500/10" />
            ))}
          </div>
        </motion.section>
      )}

      {/* التحليل الصرفي */}
      {data.التحليل_الصرفي?.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <SectionHeader icon={Feather} title="التحليل الصرفي" count={data.التحليل_الصرفي.length} />
          <div className="overflow-x-auto bg-secondary/5 rounded-2xl border border-border p-4">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-foreground/80 font-medium text-sm">الكلمة</th>
                  <th className="py-3 text-muted-foreground font-light text-sm">الوزن</th>
                  <th className="py-3 text-muted-foreground font-light text-sm">الجذر</th>
                  <th className="py-3 text-muted-foreground font-light text-sm">النوع</th>
                  <th className="py-3 text-muted-foreground font-light text-sm">ملاحظة</th>
                </tr>
              </thead>
              <tbody>
                {data.التحليل_الصرفي.map((item, idx) => (
                  <tr key={idx} className="border-b border-border/30 hover:bg-secondary/10 transition-colors">
                    <td className="py-4 font-serif font-semibold text-foreground">{item.الكلمة}</td>
                    <td className="py-4 text-muted-foreground text-sm">{item.الوزن}</td>
                    <td className="py-4 text-muted-foreground text-sm">{item.الجذر}</td>
                    <td className="py-4 text-muted-foreground text-sm">{item.النوع}</td>
                    <td className="py-4 text-muted-foreground text-sm">{item.ملاحظة || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      )}

      {/* الموسيقى الداخلية */}
      {data.الموسيقى_الداخلية && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <SectionHeader icon={Music} title="الموسيقى الداخلية" />
          <div className="bg-secondary/10 border border-border rounded-2xl p-6">
            <p className="text-muted-foreground leading-relaxed italic">{data.الموسيقى_الداخلية}</p>
          </div>
        </motion.section>
      )}

      {/* بيت شعر مشابه */}
      {data.بيت_شعر_مشابه?.البيت && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <SectionHeader icon={Quote} title="بيت شعر مشابه" />
          <div className="bg-gradient-to-l from-amber-900/10 to-transparent border border-amber-500/20 rounded-2xl p-6 space-y-3">
            <p className="font-serif text-xl text-foreground italic leading-relaxed">"{data.بيت_شعر_مشابه.البيت}"</p>
            <p className="text-amber-400/70 text-sm">— {data.بيت_شعر_مشابه.الشاعر}</p>
            <p className="text-muted-foreground text-sm">{data.بيت_شعر_مشابه.وجه_الشبه}</p>
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
