import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PenTool, Book, Feather, ScrollText } from 'lucide-react';

const ARABIC_LETTERS = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'];
const ICONS = [PenTool, Book, Feather, ScrollText];

interface FloatingElement {
  id: number;
  content: React.ReactNode;
  isLetter: boolean;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotationStart: number;
  rotationEnd: number;
  opacity: number;
}

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const generated: FloatingElement[] = Array.from({ length: 40 }).map((_, i) => {
      const isLetter = Math.random() > 0.35;
      let content;
      if (isLetter) {
        content = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
      } else {
        const Icon = ICONS[Math.floor(Math.random() * ICONS.length)];
        content = <Icon strokeWidth={1} />;
      }

      return {
        id: i,
        content,
        isLetter,
        left: Math.random() * 100,
        size: Math.random() * 24 + 16,
        duration: Math.random() * 30 + 35,
        delay: -Math.random() * 60,
        rotationStart: Math.random() * 360,
        rotationEnd: Math.random() * 360 + (Math.random() > 0.5 ? 360 : -360),
        opacity: Math.random() * 0.15 + 0.05,
      };
    });
    setElements(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute text-amber-100"
          initial={{
            top: "110vh",
            left: `${el.left}vw`,
            rotate: el.rotationStart,
            opacity: 0,
          }}
          animate={{
            top: "-20vh",
            rotate: el.rotationEnd,
            opacity: [0, el.opacity, el.opacity, 0],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear",
          }}
        >
          {el.isLetter ? (
            <span
              className="font-serif font-bold drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]"
              style={{ fontSize: `${el.size * 1.5}px` }}
            >
              {el.content}
            </span>
          ) : (
            React.cloneElement(el.content as React.ReactElement, {
              size: el.size * 1.2,
              className: 'drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]',
            })
          )}
        </motion.div>
      ))}
    </div>
  );
}
