import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Truck,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface ProcessStep {
  id: string;
  stepNum: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  metrics: { label: string; value: string }[];
  highlights: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'step-1',
    stepNum: '01',
    badge: 'INSTANT BOOKING',
    title: 'Select Service & Custom Scope',
    subtitle: 'Book online in under 60 seconds with instant time-slot reservation.',
    description: 'Choose your house size, car detailing tier, or laundry load. Input any custom instructions and reserve your preferred arrival slot.',
    icon: CalendarCheck,
    metrics: [
      { label: 'Booking Time', value: '< 60 Sec' },
      { label: 'Deposit Guarantee', value: '100% Refundable' }
    ],
    highlights: [
      'Transparent upfront pricing breakdown',
      'Select active Kochi dispatch hub',
      'Specify custom cleaning needs & instructions'
    ]
  },
  {
    id: 'step-2',
    stepNum: '02',
    badge: 'DISPATCH HUB',
    title: 'Certified Team Dispatch',
    subtitle: 'Background-checked specialists dispatched with 140°C steam kit.',
    description: 'Our certified cleaning crew arrives on-time with commercial single-disc scrubbers, HEPA extractors, and eco-friendly solutions.',
    icon: Truck,
    metrics: [
      { label: 'Arrival Accuracy', value: '99.4%' },
      { label: 'Staff Verification', value: '100% Verified' }
    ],
    highlights: [
      'Uniformed, ID-verified staff',
      'Industrial grade 140°C steam sanitization kit',
      'Live SMS & WhatsApp dispatch tracking'
    ]
  },
  {
    id: 'step-3',
    stepNum: '03',
    badge: 'DEEP CLEANING',
    title: '360° Steam & Deep Sanitization',
    subtitle: 'Non-toxic, hypoallergenic solutions for floors, upholstery & glass.',
    description: 'Deep scrubbing, high-pressure steam injection, stain pre-treatment, and moisture extraction restoring original freshness.',
    icon: Sparkles,
    metrics: [
      { label: 'Germ Elimination', value: '99.9%' },
      { label: 'Chemical Safety', value: '100% Non-Toxic' }
    ],
    highlights: [
      'Single-disc floor scrubbing & tile grout restoration',
      'Pet hair & deep allergen extraction',
      'High-pressure window & balcony cleaning'
    ]
  },
  {
    id: 'step-4',
    stepNum: '04',
    badge: 'QUALITY CHECK',
    title: 'Final Walkthrough & Deposit Adjust',
    subtitle: '100% satisfaction guarantee. Deposit adjusted on final invoice.',
    description: 'Inspect every cleaned zone with our team lead. Your ₹299 booking deposit is seamlessly deducted from your final bill.',
    icon: ShieldCheck,
    metrics: [
      { label: 'Satisfaction Rate', value: '100% Assured' },
      { label: 'Final Billing', value: 'Deposit Adjusted' }
    ],
    highlights: [
      'Room-by-room quality checklist audit',
      'Adjustable or fully refundable deposit policy',
      'Digital invoice & post-service care support'
    ]
  }
];

export const ServiceProcessMotionSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // WebGL / Canvas 3D Particle Matrix Effect with Mouse Pointer Sway
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes configuration matching design tokens (#007A87 Petrol Teal & Lime theme)
    const particleCount = 70;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    // Pointer sway interaction
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);

    // Canvas animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle nodes & connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particles
        p.x += p.vx + (mouseX - width / 2) * 0.00005;
        p.y += p.vy + (mouseY - height / 2) * 0.00005;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155, 200, 59, ${p.alpha})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 122, 135, ${(1 - dist / 110) * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const activeStep = PROCESS_STEPS[activeStepIndex];
  const StepIcon = activeStep.icon;

  return (
    <section
      style={{
        position: 'relative',
        padding: '96px 0',
        background: '#03252A',
        color: '#FFFFFF',
        overflow: 'hidden'
      }}
    >
      {/* WebGL Canvas Background Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Radial Theme Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155, 200, 59, 0.16) 0%, rgba(0, 122, 135, 0.12) 50%, rgba(3, 37, 42, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section Header Title */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(155, 200, 59, 0.15)',
                border: '1px solid #9BC83B',
                color: '#9BC83B',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '6px 16px',
                borderRadius: '9999px',
                marginBottom: '16px',
                letterSpacing: '0.08em'
              }}
            >
              <Zap size={14} /> MOTION PROCESS SEQUENCE
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '12px'
              }}
            >
              How NEXDOOR Transforms Your Space{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #007A87 0%, #9BC83B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                In 4 Steps
              </span>
            </h2>

            <p style={{ fontSize: '1rem', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
              From digital booking to certified dispatch and 100% deposit adjustment—explore our seamless service lifecycle.
            </p>
          </motion.div>
        </div>

        {/* Step Selector Navigation Bar (Skill 9999px Pill Family) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '40px',
            maxWidth: '960px',
            margin: '0 auto 40px auto'
          }}
        >
          {PROCESS_STEPS.map((stepItem, index) => {
            const isActive = index === activeStepIndex;
            return (
              <button
                key={stepItem.id}
                onClick={() => setActiveStepIndex(index)}
                style={{
                  padding: '14px 20px',
                  borderRadius: '9999px',
                  border: isActive ? '2px solid #9BC83B' : '1px solid rgba(255, 255, 255, 0.12)',
                  background: isActive ? 'rgba(155, 200, 59, 0.18)' : 'rgba(3, 37, 42, 0.6)',
                  backdropFilter: 'blur(12px)',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: isActive ? '0 0 20px rgba(155, 200, 59, 0.3)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isActive ? '#9BC83B' : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#03252A' : '#94A3B8',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {stepItem.stepNum}
                </span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {stepItem.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Motion Card Showcase Stage */}
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{
                background: 'linear-gradient(180deg, rgba(6, 48, 55, 0.85) 0%, rgba(3, 37, 42, 0.95) 100%)',
                backdropFilter: 'blur(24px)',
                borderRadius: '24px',
                border: '1px solid rgba(0, 122, 135, 0.35)',
                padding: '40px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 122, 135, 0.2)',
                display: 'grid',
                gridTemplateColumns: '1fr 320px',
                gap: '36px'
              }}
              className="process-motion-card-grid"
            >
              {/* Left Column: Step Overview & Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: 'rgba(0, 122, 135, 0.2)',
                        color: '#9BC83B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(0, 122, 135, 0.25)'
                      }}
                    >
                      <StepIcon size={26} />
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9BC83B', letterSpacing: '0.1em' }}>
                        STEP {activeStep.stepNum} — {activeStep.badge}
                      </span>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
                        {activeStep.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '1.05rem', color: '#9BC83B', fontWeight: 600, marginBottom: '12px' }}>
                    {activeStep.subtitle}
                  </p>

                  <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                    {activeStep.description}
                  </p>

                  {/* Highlights Bullet Points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {activeStep.highlights.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#CBD5E1' }}>
                        <CheckCircle2 size={18} style={{ color: '#9BC83B', flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Step Navigation Trigger */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Link to="/book" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
                    <Sparkles size={16} /> Book Service Now
                  </Link>

                  {activeStepIndex < PROCESS_STEPS.length - 1 ? (
                    <button
                      onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9BC83B',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Next Step <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveStepIndex(0)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9BC83B',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Replay Process Sequence ↺
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Glass Metric Badges & Status Card */}
              <div
                style={{
                  background: 'rgba(3, 37, 42, 0.8)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                    Key Performance Metrics
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {activeStep.metrics.map((metric, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(0, 122, 135, 0.12)',
                          border: '1px solid rgba(0, 122, 135, 0.25)',
                          padding: '16px',
                          borderRadius: '16px'
                        }}
                      >
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#9BC83B', marginBottom: '2px' }}>
                          {metric.value}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '14px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                    lineHeight: 1.4
                  }}
                >
                  <ShieldCheck size={14} style={{ color: '#9BC83B', display: 'inline', marginRight: '4px' }} />
                  NEXDOOR Service Guarantee: Certified personnel, eco-friendly formulas & refundable deposit assurance.
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <style>{`
        @media (max-width: 850px) {
          .process-motion-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
