import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { TextEffect } from '../core/text-effect';

export const ScrollTransformationHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Map scroll progress (0.05 to 0.75) to scanline movement from 0% to 100%
  const sliderPos = useTransform(scrollYProgress, [0.05, 0.75], [0, 100]);
  const scanlineLeft = useTransform(scrollYProgress, [0.05, 0.75], ['0%', '100%']);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '240vh', // Mobile-optimized scroll track height
        background: '#0F172A',
        color: '#FFFFFF'
      }}
    >
      {/* Sticky Fullscreen Stage (Pinned Viewport) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '16px 0'
        }}
      >
        {/* Ambient Radial Background Glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '800px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(41, 195, 190, 0.2) 0%, rgba(28, 38, 119, 0) 70%)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 16px auto', padding: '0 12px' }}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(41, 195, 190, 0.15)',
                  border: '1px solid #29C3BE',
                  color: '#29C3BE',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '5px 14px',
                  borderRadius: '20px',
                  marginBottom: '10px',
                  letterSpacing: '0.05em'
                }}
              >
                <Sparkles size={14} /> SCROLL TO TRANSFORM ROOM
              </div>

              <TextEffect
                per="word"
                as="h1"
                preset="reveal-3d"
                viewport={{ once: false, amount: 0.25 }}
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 3.2rem)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  marginBottom: '8px',
                  justifyContent: 'center'
                }}
              >
                Watch Your Room Become{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #29C3BE 0%, #38BDF8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Spotless
                </span>
              </TextEffect>

              <p style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                Scroll down to sweep the cleaning scanline across the room.
              </p>
            </motion.div>
          </div>

          {/* PINNED TRANSFORMATION IMAGE STAGE */}
          <div
            className="transformation-stage"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(41, 195, 190, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              aspectRatio: '16 / 9',
              background: '#0F172A',
              touchAction: 'pan-y'
            }}
          >
            {/* 1. DIRTY ROOM IMAGE (Base Layer - Initial 100% View) */}
            <img
              src="/Assets/Dirty room.png"
              alt="Dirty Room Before Cleaning"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* 2. SPOTLESS CLEAN ROOM IMAGE (Revealed via clip-path: STATIC, ZERO-ZOOM) */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                clipPath: useTransform(sliderPos, (v) => `inset(0 ${100 - v}% 0 0)`),
                willChange: 'clip-path',
                zIndex: 2
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
                alt="Spotless Clean Room After NEXDOOR Service"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </motion.div>

            {/* 3. VERTICAL SCANNING LINE */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: scanlineLeft,
                transform: 'translateX(-50%)',
                width: '3px',
                background: '#29C3BE',
                boxShadow: '0 0 15px #29C3BE, 0 0 35px #29C3BE',
                zIndex: 10,
                pointerEvents: 'none',
                willChange: 'left'
              }}
            />
          </div>

          {/* Action Buttons & Mobile Scroll Cue */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/book" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
                <Sparkles size={16} /> Book House Cleaning
              </Link>
              <Link to="/pricing" className="btn-outline" style={{ padding: '12px 24px', fontSize: '0.95rem', color: '#FFFFFF', borderColor: '#475569' }}>
                <ShieldCheck size={16} /> Explore Pricing <ArrowRight size={14} />
              </Link>
            </div>
            
            <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>↓ Scroll down to complete transformation</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .transformation-stage {
            aspect-ratio: 4 / 3 !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};
