import React from 'react';
import { motion, type Variants, type UseInViewOptions } from 'framer-motion';

export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide' | 'reveal-3d';
export type PerType = 'word' | 'char' | 'line';

export interface TextEffectProps {
  children: React.ReactNode;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  preset?: PresetType;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  viewport?: UseInViewOptions;
}

const presetVariants: Record<PresetType, Variants> = {
  blur: {
    hidden: {
      opacity: 0,
      filter: 'blur(16px)',
      y: 35,
      rotateX: -20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
      }
    },
  },
  'reveal-3d': {
    hidden: {
      opacity: 0,
      filter: 'blur(20px)',
      y: 50,
      rotateX: -45,
      transformOrigin: '50% 100%'
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  },
  'fade-in-blur': {
    hidden: { opacity: 0, filter: 'blur(14px)' },
    visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.5 } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5 } },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  },
  slide: {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } },
  },
};

interface WordToken {
  id: string;
  text: string;
  style?: React.CSSProperties;
  hasLineBreakAfter?: boolean;
}

export const TextEffect: React.FC<TextEffectProps> = ({
  children,
  per = 'word',
  as: Component = 'h1',
  preset = 'blur',
  className,
  style,
  delay = 0.1,
  viewport = { once: false, amount: 0.3 }
}) => {
  const selectedVariant = presetVariants[preset] || presetVariants.blur;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: per === 'char' ? 0.04 : 0.12,
        delayChildren: delay,
      },
    },
  };

  // Helper to extract word tokens recursively
  const extractWords = (node: React.ReactNode, inheritedStyle?: React.CSSProperties): WordToken[] => {
    const tokens: WordToken[] = [];

    const processNode = (n: React.ReactNode, currentStyle?: React.CSSProperties) => {
      if (typeof n === 'string' || typeof n === 'number') {
        const str = String(n);
        const lines = str.split('\n');
        lines.forEach((line, lineIdx) => {
          const words = line.split(' ').filter((w) => w.length > 0);
          words.forEach((word, wordIdx) => {
            const isLastInLine = wordIdx === words.length - 1 && lineIdx < lines.length - 1;
            tokens.push({
              id: `${tokens.length}-${word}`,
              text: word,
              style: currentStyle,
              hasLineBreakAfter: isLastInLine
            });
          });
        });
      } else if (Array.isArray(n)) {
        n.forEach((child) => processNode(child, currentStyle));
      } else if (React.isValidElement(n)) {
        const elem = n as React.ReactElement<any>;
        const combinedStyle = { ...currentStyle, ...elem.props.style };
        processNode(elem.props.children, combinedStyle);
      }
    };

    processNode(node, inheritedStyle);
    return tokens;
  };

  const wordTokens = extractWords(children);
  const MotionComponent = (motion as any)[Component] || motion.h1;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={containerVariants}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1000px',
        ...style
      }}
    >
      {wordTokens.map((token) => (
        <React.Fragment key={token.id}>
          <div
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              paddingBottom: '0.08em',
              marginRight: '0.28em'
            }}
          >
            <motion.span
              variants={selectedVariant}
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity, filter',
                ...token.style
              }}
            >
              {token.text}
            </motion.span>
          </div>
          {token.hasLineBreakAfter && <div style={{ flexBasis: '100%', height: 0 }} />}
        </React.Fragment>
      ))}
    </MotionComponent>
  );
};
