import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Leaf,
  MapPin,
  CheckCircle2,
  Pause,
  Play
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { RecentWork } from '../../types/admin';

const FALLBACK_RECENT_WORKS: RecentWork[] = [
  {
    id: 'work-1',
    title: 'Luxury Villa Deep Cleaning & Floor Buffing',
    category: 'House Cleaning',
    location: 'Kakkanad, Kochi',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    highlight: 'Polished Marble & Upholstery',
    summary: 'Restored floor gloss and deep vacuumed multi-level villa.',
    status: 'active',
    orderIndex: 0,
    createdAt: '2026-08-10T10:00:00.000Z'
  },
  {
    id: 'work-2',
    title: 'Premium Exterior Foam & Ceramic Detailing',
    category: 'Car Detailing',
    location: 'Marine Drive, Kochi',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80',
    highlight: 'High-Gloss Ceramic Finish',
    summary: 'Decontaminated paintwork with hydrophobic coating protection.',
    status: 'active',
    orderIndex: 1,
    createdAt: '2026-08-11T11:00:00.000Z'
  },
  {
    id: 'work-3',
    title: 'Modern Bathroom Descaling & Glass Polishing',
    category: 'Sanitization Care',
    location: 'Panampilly Nagar, Kochi',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    highlight: 'Acid-Free Tile Scrub',
    summary: 'Removed mineral water stains & treated glass partition.',
    status: 'active',
    orderIndex: 2,
    createdAt: '2026-08-12T12:00:00.000Z'
  },
  {
    id: 'work-4',
    title: 'Fabric Sofa & Carpet Deep Stain Extraction',
    category: 'Upholstery Care',
    location: 'Edappally, Kochi',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    highlight: 'UV Sanitized & Extracted',
    summary: 'Deep-fibre dirt extraction with fabric-safe disinfectant.',
    status: 'active',
    orderIndex: 3,
    createdAt: '2026-08-13T13:00:00.000Z'
  },
  {
    id: 'work-5',
    title: 'Kitchen Chimney & Thermal Stove Degreasing',
    category: 'Kitchen Deep Clean',
    location: 'Aluva, Kochi',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    highlight: '140°C Steam Treatment',
    summary: 'Full grease extraction across hood, ducting, and cooking zones.',
    status: 'active',
    orderIndex: 4,
    createdAt: '2026-08-14T14:00:00.000Z'
  },
  {
    id: 'work-6',
    title: 'Delicate Garment Care & Steam Pressing',
    category: 'Laundry & Fabric Care',
    location: 'Vyttila, Kochi',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80',
    highlight: 'Anti-Bacterial Wash',
    summary: 'Gentle organic wash with crisp industrial steam finishing.',
    status: 'active',
    orderIndex: 5,
    createdAt: '2026-08-15T15:00:00.000Z'
  }
];

export const BeforeAfterSlider: React.FC = () => {
  const { recentWorks, gallerySettings } = useAdminData();

  // Active items from admin or fallback
  const activeWorks = (recentWorks && recentWorks.length > 0
    ? recentWorks.filter((w) => w.status === 'active')
    : FALLBACK_RECENT_WORKS.filter((w) => w.status === 'active'));

  const displayWorks = activeWorks.length > 0 ? activeWorks : FALLBACK_RECENT_WORKS;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalWorks = displayWorks.length;

  // Reset index if out of bounds after list deletion
  useEffect(() => {
    if (currentIndex >= totalWorks) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalWorks]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalWorks);
  }, [totalWorks]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalWorks) % totalWorks);
  }, [totalWorks]);

  // Automatic slide rotation configured via gallerySettings
  const slideIntervalMs = (gallerySettings?.slideIntervalSeconds || 4) * 1000;
  const isAutoPlayEnabled = gallerySettings?.autoPlay !== false;
  const pauseOnHoverEnabled = gallerySettings?.pauseOnHover !== false;

  useEffect(() => {
    if (isAutoPlayEnabled && !isPaused) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, slideIntervalMs);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlayEnabled, isPaused, handleNext, slideIntervalMs]);

  // Touch Swipe Handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
    if (pauseOnHoverEnabled) setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) {
      if (pauseOnHoverEnabled) setIsPaused(false);
      return;
    }
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    if (pauseOnHoverEnabled) setIsPaused(false);
  };

  const currentWork = displayWorks[currentIndex] || displayWorks[0] || FALLBACK_RECENT_WORKS[0];

  return (
    <section
      style={{
        padding: '72px 0',
        background: 'radial-gradient(80% 80% at 50% 50%, #FFFFFF 0%, #F8FAFC 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle teal brand glow */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          right: '5%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 122, 135, 0.10) 0%, rgba(0, 122, 135, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '0 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: '48px',
            alignItems: 'center'
          }}
          className="recent-works-grid"
        >
          {/* Left Column: Heading, Description & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-tag" style={{ marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} style={{ color: '#007A87' }} /> {gallerySettings?.badgeText || 'OUR RECENT WORKS'}
            </span>

            <h2
              style={{
                fontSize: 'clamp(1.85rem, 3.8vw, 2.9rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#03252A',
                marginBottom: '16px',
                letterSpacing: '-0.03em',
                wordBreak: 'break-word'
              }}
            >
              {gallerySettings?.headline || 'See Our Recent Works in Action'}
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#475569',
                lineHeight: 1.65,
                marginBottom: '28px',
                maxWidth: '480px'
              }}
            >
              {gallerySettings?.description ||
                'Explore real results from our recent cleaning, sanitization, and detailing projects. From luxury villas and vehicles to delicate fabrics, our certified crew delivers flawless hygiene every time.'}
            </p>

            {/* Quick trust metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '32px',
                paddingBottom: '24px',
                borderBottom: '1px solid #E2E8F0',
                maxWidth: '480px'
              }}
              className="quick-metrics-row"
            >
              <div>
                <strong style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: '#007A87' }}>
                  {gallerySettings?.statJobsCount || '15k+'}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                  {gallerySettings?.statJobsLabel || 'Completed Jobs'}
                </span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: '#9BC83B' }}>
                  {gallerySettings?.statRating || '4.9 ★'}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                  {gallerySettings?.statRatingLabel || 'Customer Rating'}
                </span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: '#03252A' }}>
                  {gallerySettings?.statEcoPercent || '100%'}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                  {gallerySettings?.statEcoLabel || 'Eco Chemicals'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }} className="cta-button-group">
              <Link to="/book" className="btn-primary cta-btn" style={{ padding: '14px 24px', fontSize: '0.925rem', textDecoration: 'none', justifyContent: 'center' }}>
                Book a Service <ArrowRight size={16} />
              </Link>
              <Link to="/pricing" className="btn-outline cta-btn" style={{ padding: '14px 24px', fontSize: '0.925rem', textDecoration: 'none', justifyContent: 'center' }}>
                View Pricing
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Auto-Sliding Mixed Gallery */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', minWidth: 0 }}
          >
            {/* Main Carousel Frame */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 10',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 45px rgba(3, 37, 42, 0.12)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                background: '#03252A',
                userSelect: 'none'
              }}
              className="gallery-frame"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Image Transition Layer */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWork.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <img
                    src={currentWork.image}
                    alt={currentWork.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Enhanced dark gradient overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(3, 37, 42, 0.35) 0%, rgba(3, 37, 42, 0.05) 30%, rgba(3, 37, 42, 0.75) 70%, rgba(3, 37, 42, 0.94) 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Top-Left Category Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(3, 37, 42, 0.85)',
                  backdropFilter: 'blur(10px)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  letterSpacing: '0.04em',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                className="top-category-badge"
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9BC83B', flexShrink: 0 }} />
                <span>{currentWork.category}</span>
              </div>

              {/* Top-Right Verified Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  color: '#007A87',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                className="top-verified-badge"
              >
                <CheckCircle2 size={13} style={{ color: '#007A87' }} />
                <span>Verified Work</span>
              </div>

              {/* Desktop-Only Side Floating Navigation Arrows */}
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '14px',
                  right: '14px',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  pointerEvents: 'none',
                  zIndex: 3
                }}
                className="desktop-side-arrows"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous project"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.90)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#03252A',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  className="carousel-nav-btn"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next project"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.90)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#03252A',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  className="carousel-nav-btn"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Bottom Caption Overlay Bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '22px 20px 14px 20px',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
                className="gallery-bottom-caption"
              >
                {/* Title & Location Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <h3
                    style={{
                      fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      margin: 0,
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      lineHeight: 1.28,
                      flex: '1 1 auto'
                    }}
                    className="gallery-work-title"
                  >
                    {currentWork.title}
                  </h3>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#D1EAEF',
                      background: 'rgba(0, 122, 135, 0.55)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(209, 234, 239, 0.25)',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    <MapPin size={11} style={{ color: '#9BC83B' }} />
                    {currentWork.location}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'rgba(255, 255, 255, 0.88)',
                    margin: 0,
                    lineHeight: 1.4,
                    maxWidth: '92%',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                  }}
                  className="caption-summary"
                >
                  {currentWork.summary}
                </p>

                {/* Bottom Control Bar: Indicators + Mobile Nav + Play/Pause */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginTop: '8px',
                    paddingTop: '6px'
                  }}
                >
                  {/* Left: Indicator Dots */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {displayWorks.map((_, idx) => {
                      const isActive = currentIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          aria-label={`Go to slide ${idx + 1}`}
                          style={{
                            height: '6px',
                            width: isActive ? '22px' : '6px',
                            borderRadius: '10px',
                            background: isActive ? '#9BC83B' : 'rgba(255, 255, 255, 0.4)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Right: Integrated Controls (Mobile Nav + Play/Pause) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Mobile-Only Nav Buttons (Hidden on Desktop to prevent duplication) */}
                    <div className="mobile-nav-buttons" style={{ alignItems: 'center', gap: '6px' }}>
                      {/* Compact Prev Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        aria-label="Previous work"
                        style={{
                          background: 'rgba(255, 255, 255, 0.20)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          color: '#FFFFFF',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        className="bottom-nav-btn"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {/* Compact Next Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        aria-label="Next work"
                        style={{
                          background: 'rgba(255, 255, 255, 0.20)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          color: '#FFFFFF',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        className="bottom-nav-btn"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Play / Pause toggle */}
                    <button
                      type="button"
                      onClick={() => setIsPaused(!isPaused)}
                      aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
                      style={{
                        background: 'rgba(255, 255, 255, 0.20)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                        color: '#FFFFFF',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      className="bottom-nav-btn"
                    >
                      {isPaused ? <Play size={11} /> : <Pause size={11} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Feature Badges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
                marginTop: '4px'
              }}
            >
              {[
                { icon: <Sparkles size={15} style={{ color: '#007A87', flexShrink: 0 }} />, label: 'Professional Equipment' },
                { icon: <Leaf size={15} style={{ color: '#9BC83B', flexShrink: 0 }} />, label: 'Safe Eco Products' },
                { icon: <ShieldCheck size={15} style={{ color: '#007A87', flexShrink: 0 }} />, label: '100% Guaranteed' }
              ].map((chip, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(3, 37, 42, 0.08)' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#03252A',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {chip.icon}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{chip.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .carousel-nav-btn:hover {
          background: #FFFFFF !important;
          transform: scale(1.08);
          color: #007A87 !important;
        }
        .bottom-nav-btn:hover {
          background: rgba(255, 255, 255, 0.40) !important;
          transform: scale(1.06);
        }
        .bottom-nav-btn:active {
          transform: scale(0.95);
        }
        .mobile-nav-buttons {
          display: none !important;
        }
        @media (max-width: 992px) {
          .recent-works-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .gallery-frame {
            aspect-ratio: 16 / 11 !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-side-arrows {
            display: none !important;
          }
          .mobile-nav-buttons {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .gallery-frame {
            aspect-ratio: 4 / 3.4 !important;
            border-radius: 18px !important;
          }
          .gallery-bottom-caption {
            padding: 16px 14px 12px 14px !important;
          }
          .gallery-work-title {
            font-size: 1.05rem !important;
            line-height: 1.25 !important;
          }
          .top-category-badge {
            top: 12px !important;
            left: 12px !important;
            padding: 5px 10px !important;
            font-size: 0.7rem !important;
          }
          .top-verified-badge {
            top: 12px !important;
            right: 12px !important;
            padding: 5px 10px !important;
            font-size: 0.7rem !important;
          }
          .caption-summary {
            display: none !important;
          }
          .quick-metrics-row {
            margin-bottom: 24px !important;
            padding-bottom: 16px !important;
          }
          .cta-button-group {
            width: 100% !important;
          }
          .cta-btn {
            flex: 1 1 calc(50% - 6px) !important;
            min-width: 140px !important;
            padding: 12px 14px !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </section>
  );
};
