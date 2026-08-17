import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value?: number;
  rawString?: string;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatComma?: boolean;
  once?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value: propValue,
  rawString,
  decimals: propDecimals,
  duration = 2.0,
  prefix: propPrefix,
  suffix: propSuffix,
  formatComma = true,
  once = false,
  style,
  className
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  const [displayVal, setDisplayVal] = useState<number>(0);

  // Parse rawString if provided (e.g. "15,000+", "4.9★", "5 Primary", "100%")
  let targetValue = propValue ?? 0;
  let targetDecimals = propDecimals ?? 0;
  let targetPrefix = propPrefix ?? '';
  let targetSuffix = propSuffix ?? '';

  if (rawString !== undefined) {
    const trimmed = rawString.trim();
    // Extract prefix if any
    const prefixMatch = trimmed.match(/^([^0-9.]+)/);
    const parsedPrefix = prefixMatch ? prefixMatch[1] : '';
    const withoutPrefix = parsedPrefix ? trimmed.slice(parsedPrefix.length) : trimmed;

    // Extract number
    const numMatch = withoutPrefix.match(/([0-9,]+(?:\.[0-9]+)?)/);
    if (numMatch) {
      const numStr = numMatch[1].replace(/,/g, '');
      const parsedNum = parseFloat(numStr);
      if (!isNaN(parsedNum)) {
        targetValue = parsedNum;
        targetDecimals = propDecimals !== undefined ? propDecimals : (numStr.includes('.') ? numStr.split('.')[1].length : 0);
      }
      targetSuffix = propSuffix !== undefined ? propSuffix : withoutPrefix.slice(numMatch.index! + numMatch[0].length);
    }
    if (propPrefix === undefined) {
      targetPrefix = parsedPrefix;
    }
  }

  useEffect(() => {
    if (!isInView) {
      if (!once) {
        setDisplayVal(0);
      }
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easeOutExpo curve for elegant increasing animation
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = easeProgress * targetValue;

      setDisplayVal(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, targetValue, duration, once]);

  const formattedNumber = targetDecimals > 0
    ? displayVal.toFixed(targetDecimals)
    : formatComma
    ? Math.round(displayVal).toLocaleString('en-US')
    : Math.round(displayVal).toString();

  return (
    <span ref={ref} style={style} className={className}>
      {targetPrefix}{formattedNumber}{targetSuffix}
    </span>
  );
};
