import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Leaf
} from 'lucide-react';

interface TransformationTab {
  id: 'living' | 'kitchen' | 'bathroom' | 'bedroom';
  label: string;
  icon: string;
  beforeImg: string;
  afterImg: string;
  beforeTag: string;
  afterTag: string;
  summary: string;
}

const TABS: TransformationTab[] = [
  {
    id: 'living',
    label: 'Living Room',
    icon: '🏠',
    beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    beforeTag: 'Dust & Dull Floor',
    afterTag: 'Polished Marble',
    summary: 'Restored floor gloss and deep vacuumed upholstery'
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    icon: '🍳',
    beforeImg: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    beforeTag: 'Grease & Scale',
    afterTag: 'Degreased Hob',
    summary: '140°C thermal steam sanitization on chimney & stove'
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    icon: '🚿',
    beforeImg: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    beforeTag: 'Water Stains',
    afterTag: 'Descaled Glass',
    summary: 'Acid-free tile grout scrub and shower glass polish'
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    icon: '🛏',
    beforeImg: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    beforeTag: 'Dust Mites',
    afterTag: 'UV Vacuumed',
    summary: 'Allergen extraction and deep frame dusting'
  }
];

export const BeforeAfterSlider: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<TransformationTab['id']>('living');
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  const handleTabChange = (tabId: TransformationTab['id']) => {
    setActiveTabId(tabId);
    setSliderPos(50); // Reset slider to center
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let pos = (x / rect.width) * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;
      setSliderPos(pos);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  return (
    <section
      style={{
        padding: '72px 0',
        background: 'radial-gradient(80% 80% at 50% 50%, #FFFFFF 0%, #F8FAFC 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle turquoise decorative background glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(41, 195, 190, 0.14) 0%, rgba(41, 195, 190, 0) 70%)',
          filter: 'blur(60px)',
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
          className="before-after-grid"
        >
          {/* Left Column: Heading & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-tag" style={{ marginBottom: '14px' }}>
              <Sparkles size={14} style={{ color: '#29C3BE' }} /> REAL CLEANING RESULTS
            </span>

            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#1C2677',
                marginBottom: '16px',
                letterSpacing: '-0.03em',
                wordBreak: 'break-word'
              }}
            >
              See the NEXDOOR Difference
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '480px'
              }}
            >
              Watch how our professional cleaning experts transform homes into spotless, fresh and hygienic living spaces. Drag the slider to compare before and after results.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }} className="cta-button-group">
              <Link to="/book" className="btn-primary cta-btn" style={{ padding: '14px 24px', fontSize: '0.925rem', textDecoration: 'none', justifyContent: 'center' }}>
                Book House Cleaning <ArrowRight size={16} />
              </Link>
              <Link to="/pricing" className="btn-outline cta-btn" style={{ padding: '14px 24px', fontSize: '0.925rem', textDecoration: 'none', justifyContent: 'center' }}>
                View Pricing
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Tabbed Interactive Before & After Slider */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', minWidth: 0 }}
          >
            {/* Horizontal Scrollable Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '6px',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none'
              }}
              className="tabs-container"
            >
              {TABS.map((tab) => {
                const isActive = activeTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '14px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: isActive ? '#1C2677' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#475569',
                      border: isActive ? '1.5px solid #1C2677' : '1px solid #E2E8F0',
                      boxShadow: isActive ? '0 6px 20px rgba(28, 38, 119, 0.2)' : '0 2px 6px rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Comparison Image Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 40px rgba(27, 34, 54, 0.12)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  userSelect: 'none',
                  touchAction: 'none',
                  cursor: isDragging ? 'ew-resize' : 'default'
                }}
                ref={containerRef}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onTouchMove={handleTouchMove}
              >
                {/* 1. AFTER IMAGE (Base Layer) */}
                <img
                  src={activeTab.afterImg}
                  alt={`${activeTab.label} After`}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* AFTER BADGE Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(28, 38, 119, 0.88)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 2,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#29C3BE', flexShrink: 0 }} />
                  AFTER • {activeTab.afterTag}
                </div>

                {/* 2. BEFORE IMAGE (Clipped Overlay Layer) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${sliderPos}%`,
                    overflow: 'hidden',
                    zIndex: 1
                  }}
                >
                  <img
                    src={activeTab.beforeImg}
                    alt={`${activeTab.label} Before`}
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                      maxWidth: 'none',
                      objectFit: 'cover'
                    }}
                  />

                  {/* BEFORE BADGE Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(27, 34, 54, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      letterSpacing: '0.05em',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
                    BEFORE • {activeTab.beforeTag}
                  </div>
                </div>

                {/* 3. VERTICAL DIVIDER LINE & HANDLE */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${sliderPos}%`,
                    transform: 'translateX(-50%)',
                    width: '3px',
                    background: '#FFFFFF',
                    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                    zIndex: 10,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Circular Draggable Handle */}
                  <motion.div
                    animate={{ scale: isDragging ? 1.15 : 1 }}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      border: '2.5px solid #29C3BE',
                      boxShadow: '0 4px 16px rgba(41, 195, 190, 0.4), 0 0 0 5px rgba(41, 195, 190, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1C2677',
                      cursor: 'grab',
                      pointerEvents: 'auto'
                    }}
                  >
                    <ChevronLeft size={15} />
                    <ChevronRight size={15} style={{ marginLeft: '-6px' }} />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Feature Chips */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
                marginTop: '4px'
              }}
            >
              {[
                { icon: <Sparkles size={15} style={{ color: '#29C3BE', flexShrink: 0 }} />, label: 'Professional Equipment' },
                { icon: <Leaf size={15} style={{ color: '#10B981', flexShrink: 0 }} />, label: 'Safe Eco Products' },
                { icon: <ShieldCheck size={15} style={{ color: '#F59E0B', flexShrink: 0 }} />, label: '100% Guaranteed' }
              ].map((chip, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3, boxShadow: '0 6px 16px rgba(27, 34, 54, 0.08)' }}
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
                    color: '#1C2677',
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
        .tabs-container::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 992px) {
          .before-after-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
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
