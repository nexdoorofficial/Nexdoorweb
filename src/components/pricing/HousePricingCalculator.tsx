import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronDown
} from 'lucide-react';
import { HOUSE_CATEGORIES } from '../../data/categories';
import { useAdminData } from '../../context/AdminContext';
import type { HouseCategoryKey, HousePlanDetails } from '../../types';
import { useNavigate } from 'react-router-dom';

const SERVICEABLE_LOCATIONS = [
  { id: 'Kakkanad', name: 'Kakkanad' },
  { id: 'Edappally', name: 'Edappally' },
  { id: 'Kalamassery', name: 'Kalamassery' },
  { id: 'Marine Drive & MG Road', name: 'Marine Drive & MG Road' },
  { id: 'Vytila & Thripunithura', name: 'Vytila & Thripunithura' },
  { id: 'Aluva & Angamaly', name: 'Aluva & Angamaly' }
];

interface HousePricingCalculatorProps {
  initialCategory?: HouseCategoryKey;
  selectedPlan?: string;
  onSelectPlan?: (planType: string) => void;
  hideHeader?: boolean;
}

export const HousePricingCalculator: React.FC<HousePricingCalculatorProps> = ({
  initialCategory = '2-bhk',
  selectedPlan = 'premium',
  onSelectPlan,
  hideHeader = false
}) => {
  const navigate = useNavigate();
  let houseCategoriesList = HOUSE_CATEGORIES;
  let rawLocationsList: any[] = SERVICEABLE_LOCATIONS;

  try {
    const adminData = useAdminData();
    if (adminData && adminData.houseCategories && adminData.houseCategories.length > 0) {
      houseCategoriesList = adminData.houseCategories;
    }
    if (adminData && adminData.locations && adminData.locations.length > 0) {
      rawLocationsList = adminData.locations;
    }
  } catch (e) {}

  const [selectedCategory, setSelectedCategory] = useState<HouseCategoryKey>(initialCategory);
  const [location, setLocation] = useState<string>('Kakkanad');

  // Accordion drawer states per plan key
  const [openInc, setOpenInc] = useState<Record<string, boolean>>({});
  const [openExc, setOpenExc] = useState<Record<string, boolean>>({});

  // React to initialCategory changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const activeCategoryData = houseCategoriesList.find((c) => c.id === selectedCategory) || houseCategoriesList[0] || houseCategoriesList[1];

  // Dynamic location list filtered by active system locations & category-specific availability
  const availableLocationsList = React.useMemo(() => {
    // 1. Filter system locations where status === 'active' (default to all if status not set)
    const activeLocs = rawLocationsList.filter((l: any) => !l.status || l.status === 'active');
    const baseLocs = activeLocs.length > 0 ? activeLocs : rawLocationsList;

    // 2. Check if active category has specific availableLocations configured in Admin Panel
    if (activeCategoryData?.availableLocations && activeCategoryData.availableLocations.length > 0) {
      const avail = activeCategoryData.availableLocations;
      const filtered = baseLocs.filter((l: any) =>
        avail.some(
          (locName: string) => locName.toLowerCase().trim() === l.name.toLowerCase().trim()
        )
      );
      return filtered.length > 0 ? filtered : baseLocs;
    }

    return baseLocs;
  }, [rawLocationsList, activeCategoryData]);

  // Automatically sync selected location if current location is no longer valid for this category
  React.useEffect(() => {
    if (availableLocationsList && availableLocationsList.length > 0) {
      const isValid = availableLocationsList.some((l: any) => l.name.toLowerCase() === location.toLowerCase());
      if (!isValid) {
        setLocation(availableLocationsList[0].name);
      }
    }
  }, [availableLocationsList]);

  const handleSelectPlan = (planType: string) => {
    if (onSelectPlan) {
      onSelectPlan(planType);
    } else {
      navigate(`/book?service=house-cleaning&category=${selectedCategory}&plan=${planType}&location=${encodeURIComponent(location)}&step=4`);
    }
  };

  const locationRef = React.useRef<HTMLDivElement>(null);

  const handleCategoryClick = (catId: HouseCategoryKey) => {
    setSelectedCategory(catId);
    if (window.innerWidth <= 992 && locationRef.current) {
      setTimeout(() => {
        locationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  };

  const toggleInc = (key: string) => {
    setOpenInc((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExc = (key: string) => {
    setOpenExc((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Build dynamic plan list for active category
  const allPlans: (HousePlanDetails & { typeKey: string; isRecommended?: boolean; tagLabel: string; tagSub: string; priceColor: string; borderColor: string })[] = [];

  if (activeCategoryData?.standard && activeCategoryData.standard.priceNumeric !== null) {
    allPlans.push({
      ...activeCategoryData.standard,
      typeKey: 'standard',
      isRecommended: false,
      tagLabel: 'STANDARD PLAN',
      tagSub: 'Everyday General Clean',
      priceColor: '#1C2677',
      borderColor: '#E2E8F0'
    });
  }

  if (activeCategoryData?.premium && activeCategoryData.premium.priceNumeric !== null) {
    allPlans.push({
      ...activeCategoryData.premium,
      typeKey: 'premium',
      isRecommended: true,
      tagLabel: 'PREMIUM ULTRA',
      tagSub: 'Deep Restoration',
      priceColor: '#0D9488',
      borderColor: '#29C3BE'
    });
  }

  if (activeCategoryData?.customPlans && activeCategoryData.customPlans.length > 0) {
    activeCategoryData.customPlans.forEach((cp) => {
      allPlans.push({
        ...cp,
        typeKey: cp.id || cp.name,
        isRecommended: false,
        tagLabel: cp.name.toUpperCase(),
        tagSub: 'Custom Tier',
        priceColor: '#B45309',
        borderColor: '#FCD34D'
      });
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!hideHeader && (
        <>
          {/* Top Category Pills Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              background: '#FFFFFF',
              padding: '8px 12px',
              borderRadius: '18px',
              boxShadow: '0 4px 16px rgba(27, 34, 54, 0.05)',
              border: '1px solid #E2E8F0',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}
            className="category-scroll-bar"
          >
            {houseCategoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  background: selectedCategory === cat.id ? '#1C2677' : 'transparent',
                  color: selectedCategory === cat.id ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(28, 38, 119, 0.25)' : 'none'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Location Selector Bar */}
          <div
            ref={locationRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              padding: '12px 16px',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap', flexShrink: 0 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1C2677', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📍 Service Area:
              </span>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#059669', background: '#D1FAE5', border: '1px solid #6EE7B7', padding: '3px 9px', borderRadius: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                ● {availableLocationsList.length} Active {availableLocationsList.length === 1 ? 'Area' : 'Areas'}
              </span>
            </div>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '12px',
                border: '1.5px solid #29C3BE',
                background: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.85rem',
                color: '#1C2677',
                cursor: 'pointer',
                outline: 'none',
                flex: '1 1 200px',
                maxWidth: '100%',
                boxShadow: '0 2px 8px rgba(41, 195, 190, 0.12)'
              }}
            >
              {availableLocationsList.map((loc) => (
                <option key={loc.id || loc.name} value={loc.name}>
                  📍 {loc.name} {loc.zone ? `(${loc.zone})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Category Title */}
          <div style={{ textAlign: 'center', margin: '0' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C2677', margin: 0 }}>
              {activeCategoryData?.label} House Cleaning Plans
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              {activeCategoryData?.description} ({activeCategoryData?.sqftRange})
            </p>
          </div>
        </>
      )}

      {/* RESPONSIVE LAYOUT STYLES */}
      <style>{`
        /* ===== DESKTOP: Original full-width layout with inline features ===== */
        .house-plans-desktop-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .house-plan-card-desktop {
          padding: 28px 24px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #FFFFFF;
          position: relative;
        }
        .house-plan-desktop-features { display: block; }
        .house-plan-mobile-accordions { display: none; }

        /* ===== MOBILE: 2-column compact grid with accordions ===== */
        .house-plans-mobile-grid {
          display: none;
        }

        @media (max-width: 768px) {
          .house-plans-desktop-grid { display: none !important; }
          .house-plans-mobile-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            align-items: start !important;
          }
          .house-plan-mobile-card {
            padding: 14px 10px;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: #FFFFFF;
            position: relative;
            height: fit-content !important;
            align-self: start !important;
          }
        }
        @media (max-width: 420px) {
          .house-plans-mobile-grid {
            gap: 8px;
            align-items: start !important;
          }
          .house-plan-mobile-card {
            padding: 12px 8px;
            height: fit-content !important;
            align-self: start !important;
          }
        }
      `}</style>

      {/* ============================================================ */}
      {/* DESKTOP VIEW — Original full inline feature lists (no accordions) */}
      {/* ============================================================ */}
      <div className="house-plans-desktop-grid">
        {allPlans.map((plan) => {
          const isSelected = selectedPlan === plan.typeKey;

          return (
            <div
              key={plan.typeKey}
              className="house-plan-card-desktop"
              onClick={() => handleSelectPlan(plan.typeKey)}
              style={{
                cursor: 'pointer',
                border: isSelected
                  ? '3px solid #29C3BE'
                  : '1px solid #CBD5E1',
                boxShadow: isSelected
                  ? '0 10px 30px rgba(41, 195, 190, 0.35)'
                  : '0 4px 12px rgba(0,0,0,0.03)',
                background: isSelected ? '#FAFDFD' : '#FFFFFF',
                position: 'relative'
              }}
            >
              <div>
                {/* Floating Recommended / Selected Badge */}
                {isSelected ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      right: '18px',
                      background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 14px',
                      borderRadius: '20px',
                      letterSpacing: '0.05em',
                      boxShadow: '0 4px 10px rgba(41,195,190,0.4)',
                      zIndex: 2
                    }}
                  >
                    SELECTED ✓
                  </div>
                ) : plan.isRecommended ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      right: '18px',
                      background: '#1C2677',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 14px',
                      borderRadius: '20px',
                      letterSpacing: '0.05em',
                      boxShadow: '0 4px 10px rgba(28,38,119,0.3)',
                      zIndex: 2
                    }}
                  >
                    RECOMMENDED ★
                  </div>
                ) : null}

                {/* Plan Badge Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {plan.isRecommended && <Sparkles size={14} style={{ color: '#0D9488' }} />}
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: isSelected ? '#CCFBF1' : plan.isRecommended ? '#DCFCE7' : '#F1F5F9',
                        color: isSelected ? '#0F766E' : plan.isRecommended ? '#166534' : '#334155'
                      }}
                    >
                      {plan.tagLabel}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: isSelected ? '#0D9488' : plan.isRecommended ? '#0D9488' : '#64748B', fontWeight: 600 }}>
                    {plan.tagSub}
                  </span>
                </div>

                {/* Title */}
                <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1B2236', marginBottom: '6px' }}>
                  {plan.name}
                </h4>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: plan.priceColor, lineHeight: 1 }}>
                    {plan.priceDisplay}
                  </span>
                  {plan.priceNumeric && (
                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>/ service</span>
                  )}
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                  {plan.description}
                </p>

                {/* Quick Stats Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    background: '#F8FAFC',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    marginBottom: '18px',
                    fontSize: '0.85rem',
                    color: '#334155'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} style={{ color: '#29C3BE', flexShrink: 0 }} />
                    <span>{plan.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={15} style={{ color: '#29C3BE', flexShrink: 0 }} />
                    <span>{plan.professionals} Pros</span>
                  </div>
                </div>

                {/* DESKTOP: Full inline Included list */}
                <div className="house-plan-desktop-features">
                  <div style={{ marginBottom: '14px' }}>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      {plan.isRecommended ? 'Everything in Standard Plus:' : "What's Included:"}
                    </h5>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {plan.included.map((inc, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
                          <CheckCircle2 size={15} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.excluded && plan.excluded.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                      <h5 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        What's Excluded:
                      </h5>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {plan.excluded.map((exc, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#94A3B8' }}>
                            <XCircle size={15} style={{ color: '#CBD5E1', flexShrink: 0, marginTop: '2px' }} />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Select Button */}
              <button
                type="button"
                onClick={() => handleSelectPlan(plan.typeKey)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isSelected
                    ? 'linear-gradient(135deg, #1C2677, #29C3BE)'
                    : plan.isRecommended
                    ? 'linear-gradient(135deg, #0F172A, #1C2677)'
                    : '#FFFFFF',
                  color: isSelected || plan.isRecommended ? '#FFFFFF' : '#1C2677',
                  border: isSelected || plan.isRecommended ? 'none' : '1px solid #CBD5E1',
                  boxShadow: isSelected
                    ? '0 4px 14px rgba(41, 195, 190, 0.4)'
                    : plan.isRecommended
                    ? '0 4px 14px rgba(28, 38, 119, 0.3)'
                    : 'none'
                }}
              >
                {isSelected
                  ? `✓ Selected (${plan.name.split(' ').slice(0, 2).join(' ')})`
                  : `Select ${plan.name.split(' ').slice(0, 2).join(' ')}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* MOBILE VIEW — 2-column compact grid with accordion drawers   */}
      {/* ============================================================ */}
      <div className="house-plans-mobile-grid">
        {allPlans.map((plan) => {
          const isIncOpen = !!openInc[plan.typeKey];
          const isExcOpen = !!openExc[plan.typeKey];
          const isSelected = selectedPlan === plan.typeKey;

          return (
            <div
              key={plan.typeKey}
              className="house-plan-mobile-card"
              onClick={() => handleSelectPlan(plan.typeKey)}
              style={{
                cursor: 'pointer',
                border: isSelected
                  ? '3px solid #29C3BE'
                  : '1px solid #CBD5E1',
                boxShadow: isSelected
                  ? '0 6px 20px rgba(41, 195, 190, 0.25)'
                  : '0 2px 8px rgba(0,0,0,0.03)',
                background: isSelected ? '#FAFDFD' : '#FFFFFF',
                position: 'relative'
              }}
            >
              <div>
                {/* Floating Recommended / Selected Badge */}
                {isSelected ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '10px',
                      background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                      color: '#FFFFFF',
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '16px',
                      letterSpacing: '0.05em',
                      boxShadow: '0 3px 8px rgba(41,195,190,0.4)',
                      zIndex: 2
                    }}
                  >
                    SELECTED ✓
                  </div>
                ) : plan.isRecommended ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '10px',
                      background: '#1C2677',
                      color: '#FFFFFF',
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '16px',
                      letterSpacing: '0.05em',
                      boxShadow: '0 3px 8px rgba(28,38,119,0.3)',
                      zIndex: 2
                    }}
                  >
                    RECOMMENDED ★
                  </div>
                ) : null}

                {/* Plan Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      background: isSelected ? '#CCFBF1' : plan.isRecommended ? '#DCFCE7' : '#F1F5F9',
                      color: isSelected ? '#0F766E' : plan.isRecommended ? '#166534' : '#334155'
                    }}
                  >
                    {plan.tagLabel}
                  </span>
                </div>

                {/* Title */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1B2236', margin: '2px 0 4px 0', lineHeight: 1.2 }}>
                  {plan.name}
                </h4>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: plan.priceColor, lineHeight: 1 }}>
                    {plan.priceDisplay}
                  </span>
                  {plan.priceNumeric && (
                    <span style={{ fontSize: '0.7rem', color: '#64748B' }}>/ service</span>
                  )}
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.35, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {plan.description}
                </p>

                {/* Stats */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#F8FAFC',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    fontSize: '0.7rem',
                    color: '#334155'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} style={{ color: '#29C3BE', flexShrink: 0 }} />
                    <span>{plan.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} style={{ color: '#29C3BE', flexShrink: 0 }} />
                    <span>{plan.professionals} Pros</span>
                  </div>
                </div>

                {/* MOBILE: Accordion drawers */}
                <div style={{ marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInc(plan.typeKey);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      padding: '4px 0',
                      cursor: 'pointer',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#047857',
                      textTransform: 'uppercase'
                    }}
                  >
                    <span>{plan.isRecommended ? 'Everything in Standard Plus' : "What's Included"} ({plan.included.length})</span>
                    <ChevronDown
                      size={13}
                      style={{ transform: isIncOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    />
                  </button>

                  <AnimatePresence>
                    {isIncOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <ul style={{ listStyle: 'none', margin: '4px 0 8px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem' }}>
                          {plan.included.map((inc, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', color: '#334155' }}>
                              <CheckCircle2 size={11} style={{ color: '#10B981', flexShrink: 0, marginTop: '1px' }} />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {plan.excluded && plan.excluded.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExc(plan.typeKey);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'none',
                          border: 'none',
                          padding: '4px 0',
                          cursor: 'pointer',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: '#94A3B8',
                          textTransform: 'uppercase',
                          marginTop: '2px'
                        }}
                      >
                        <span>What's Excluded ({plan.excluded.length})</span>
                        <ChevronDown
                          size={13}
                          style={{ transform: isExcOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        />
                      </button>

                      <AnimatePresence>
                        {isExcOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <ul style={{ listStyle: 'none', margin: '4px 0 4px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem' }}>
                              {plan.excluded.map((exc, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', color: '#94A3B8' }}>
                                  <XCircle size={11} style={{ color: '#CBD5E1', flexShrink: 0, marginTop: '1px' }} />
                                  <span>{exc}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              </div>

              {/* Select Button */}
              <button
                type="button"
                onClick={() => handleSelectPlan(plan.typeKey)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isSelected
                    ? 'linear-gradient(135deg, #1C2677, #29C3BE)'
                    : plan.isRecommended
                    ? 'linear-gradient(135deg, #0F172A, #1C2677)'
                    : '#FFFFFF',
                  color: isSelected || plan.isRecommended ? '#FFFFFF' : '#1C2677',
                  border: isSelected || plan.isRecommended ? 'none' : '1px solid #CBD5E1',
                  boxShadow: isSelected ? '0 3px 10px rgba(41, 195, 190, 0.3)' : 'none'
                }}
              >
                {isSelected ? '✓ Selected' : 'Select'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
