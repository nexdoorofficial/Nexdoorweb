import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { VEHICLE_CATEGORIES } from '../../data/categories';
import { useAdminData } from '../../context/AdminContext';
import type { VehicleCategoryKey } from '../../types';
import { useNavigate } from 'react-router-dom';

const SERVICEABLE_LOCATIONS = [
  { id: 'Kakkanad', name: 'Kakkanad' },
  { id: 'Edappally', name: 'Edappally' },
  { id: 'Kalamassery', name: 'Kalamassery' },
  { id: 'Marine Drive & MG Road', name: 'Marine Drive & MG Road' },
  { id: 'Vytila & Thripunithura', name: 'Vytila & Thripunithura' },
  { id: 'Aluva & Angamaly', name: 'Aluva & Angamaly' }
];

interface CarWashCalculatorProps {
  initialVehicle?: VehicleCategoryKey;
  selectedPackage?: 'basic' | 'premium' | 'interior' | 'complete';
  onSelectPackage?: (pkgKey: 'basic' | 'premium' | 'interior' | 'complete') => void;
  hideHeader?: boolean;
}

export const CarWashCalculator: React.FC<CarWashCalculatorProps> = ({
  initialVehicle = 'sedan',
  selectedPackage: propSelectedPackage,
  onSelectPackage,
  hideHeader = false
}) => {
  const navigate = useNavigate();
  let vehicleCategoriesList = VEHICLE_CATEGORIES;
  let rawLocationsList: any[] = SERVICEABLE_LOCATIONS;

  try {
    const adminData = useAdminData();
    if (adminData && adminData.vehicleCategories && adminData.vehicleCategories.length > 0) {
      vehicleCategoriesList = adminData.vehicleCategories;
    }
    if (adminData && adminData.locations && adminData.locations.length > 0) {
      rawLocationsList = adminData.locations;
    }
  } catch (e) {}

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategoryKey>(initialVehicle);
  const [selectedPkgKey, setSelectedPkgKey] = useState<'basic' | 'premium' | 'interior' | 'complete'>(propSelectedPackage || 'premium');
  const [location, setLocation] = useState<string>('Kakkanad');

  // Independent Mobile Accordion open states map (allows multiple plans open together)
  const [openIncPkgs, setOpenIncPkgs] = useState<Record<string, boolean>>({});
  const [openExcPkgs, setOpenExcPkgs] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (initialVehicle) setSelectedVehicle(initialVehicle);
  }, [initialVehicle]);

  React.useEffect(() => {
    if (propSelectedPackage) setSelectedPkgKey(propSelectedPackage);
  }, [propSelectedPackage]);

  const activeVehicle = vehicleCategoriesList.find((v) => v.id === selectedVehicle) || vehicleCategoriesList[0] || vehicleCategoriesList[1];

  // Dynamic location list filtered by active system locations & vehicle category-specific availability
  const availableLocationsList = React.useMemo(() => {
    const activeLocs = rawLocationsList.filter((l: any) => !l.status || l.status === 'active');
    const baseLocs = activeLocs.length > 0 ? activeLocs : rawLocationsList;

    if (activeVehicle?.availableLocations && activeVehicle.availableLocations.length > 0) {
      const avail = activeVehicle.availableLocations;
      const filtered = baseLocs.filter((l: any) =>
        avail.some(
          (locName: string) => locName.toLowerCase().trim() === l.name.toLowerCase().trim()
        )
      );
      return filtered.length > 0 ? filtered : baseLocs;
    }

    return baseLocs;
  }, [rawLocationsList, activeVehicle]);

  // Automatically sync selected location if current location is no longer valid for this vehicle category
  React.useEffect(() => {
    if (availableLocationsList && availableLocationsList.length > 0) {
      const isValid = availableLocationsList.some((l: any) => l.name.toLowerCase() === location.toLowerCase());
      if (!isValid) {
        setLocation(availableLocationsList[0].name);
      }
    }
  }, [availableLocationsList]);
  const packageKeys = Object.keys(activeVehicle?.packages || {});
  const activePackage = (activeVehicle?.packages as any)?.[selectedPkgKey] || Object.values(activeVehicle?.packages || {})[0];

  const handleSelectPkg = (pkgKey: any) => {
    setSelectedPkgKey(pkgKey);
    if (onSelectPackage) onSelectPackage(pkgKey);
  };

  const handleBookCarService = () => {
    navigate(`/book?service=car-wash&vehicle=${selectedVehicle}&package=${selectedPkgKey}&location=${encodeURIComponent(location)}&step=4`);
  };

  const toggleMobileAccordion = (pkgKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenIncPkgs((prev) => ({ ...prev, [pkgKey]: !prev[pkgKey] }));
  };

  const toggleMobileExcAccordion = (pkgKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenExcPkgs((prev) => ({ ...prev, [pkgKey]: !prev[pkgKey] }));
  };

  const carLocationRef = React.useRef<HTMLDivElement>(null);

  const handleVehicleClick = (vId: VehicleCategoryKey) => {
    setSelectedVehicle(vId);
    if (window.innerWidth <= 992 && carLocationRef.current) {
      setTimeout(() => {
        carLocationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!hideHeader && (
        <>
          {/* Vehicle Category Selector Bar */}
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
            {vehicleCategoriesList.map((v) => (
              <button
                key={v.id}
                onClick={() => handleVehicleClick(v.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  background: selectedVehicle === v.id ? '#1C2677' : 'transparent',
                  color: selectedVehicle === v.id ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Car size={15} />
                {v.label}
              </button>
            ))}
          </div>

          {/* Location Selector Bar */}
          <div
            ref={carLocationRef}
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

          <div style={{ textAlign: 'center', margin: '0' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C2677', margin: 0 }}>
              {activeVehicle?.label} Car Wash & Detailing
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Examples: {activeVehicle?.examples}
            </p>
          </div>
        </>
      )}

      {/* Dynamic Package Cards Grid */}
      <div className="car-packages-grid" style={{ alignItems: 'start' }}>
        {packageKeys.map((pkgKey) => {
          const pkg = (activeVehicle?.packages as any)?.[pkgKey];
          if (!pkg) return null;
          const isSelected = selectedPkgKey === pkgKey;
          const isAccordionOpen = !!openIncPkgs[pkgKey];
          const isExcAccordionOpen = !!openExcPkgs[pkgKey];

          return (
            <div
              key={pkgKey}
              onClick={() => handleSelectPkg(pkgKey)}
              className="glass-card pkg-card"
              style={{
                padding: '16px 14px',
                cursor: 'pointer',
                border: isSelected ? '2px solid #29C3BE' : '1px solid #E2E8F0',
                background: isSelected ? 'rgba(41, 195, 190, 0.06)' : '#FFFFFF',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="pkg-badge-title" style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isSelected ? '#1C2677' : '#64748B',
                    letterSpacing: '0.03em'
                  }}>
                    {pkg.name}
                  </span>
                  {pkgKey === 'complete' && (
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, background: '#F59E0B', color: '#FFF', padding: '2px 6px', borderRadius: '6px' }}>
                      360° SPA
                    </span>
                  )}
                </div>

                <div className="pkg-price-text" style={{ fontSize: '1.6rem', fontWeight: 800, color: isSelected ? '#29C3BE' : '#1C2677', marginBottom: '2px', lineHeight: 1 }}>
                  ₹{pkg.price}
                </div>
                
                {/* Service Description on Mobile */}
                <div className="pkg-desc-text" style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '10px', lineHeight: 1.35 }}>
                  {pkg.tagline}
                </div>

                <div className="pkg-duration-text" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#475569', marginBottom: '10px', fontWeight: 600 }}>
                  <Clock size={13} style={{ color: '#29C3BE' }} /> {pkg.duration}
                </div>

                {/* DESKTOP ONLY INLINE CHECKLIST (INCLUDED & EXCLUDED) */}
                <div className="desktop-features-list">
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1C2677', textTransform: 'uppercase', marginBottom: '4px' }}>What's Included:</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#334155' }}>
                      {pkg.included.map((inc: string, i: number) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <CheckCircle2 size={13} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {pkg.excluded && pkg.excluded.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>What's Excluded:</div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.775rem', color: '#94A3B8' }}>
                        {pkg.excluded.map((exc: string, i: number) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <XCircle size={13} style={{ color: '#CBD5E1', flexShrink: 0, marginTop: '2px' }} />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* MOBILE ONLY INDEPENDENT ACCORDION EXPANDABLE DRAWERS */}
                <div className="mobile-features-accordion">
                  {/* Included Accordion */}
                  <button
                    onClick={(e) => toggleMobileAccordion(pkgKey, e)}
                    style={{
                      width: '100%',
                      padding: '7px 8px',
                      borderRadius: '10px',
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#047857',
                      fontWeight: 700,
                      fontSize: '0.725rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      marginBottom: isAccordionOpen ? '6px' : '6px'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: '#10B981', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                        {isAccordionOpen ? '−' : '+'}
                      </span>
                      Included ({pkg.included.length})
                    </span>
                    <ChevronDown size={14} style={{ transform: isAccordionOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </button>

                  <AnimatePresence>
                    {isAccordionOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden', marginBottom: '8px' }}
                      >
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.725rem', padding: '8px', background: '#F8FAFC', borderRadius: '8px' }}>
                          {pkg.included.map((inc: string, i: number) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', color: '#334155' }}>
                              <CheckCircle2 size={12} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                              <span style={{ lineHeight: 1.35 }}>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Excluded Accordion */}
                  {pkg.excluded && pkg.excluded.length > 0 && (
                    <>
                      <button
                        onClick={(e) => toggleMobileExcAccordion(pkgKey, e)}
                        style={{
                          width: '100%',
                          padding: '7px 8px',
                          borderRadius: '10px',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          color: '#64748B',
                          fontWeight: 600,
                          fontSize: '0.725rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: '#94A3B8', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                            {isExcAccordionOpen ? '−' : '+'}
                          </span>
                          Excluded ({pkg.excluded.length})
                        </span>
                        <ChevronDown size={14} style={{ transform: isExcAccordionOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                      </button>

                      <AnimatePresence>
                        {isExcAccordionOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden', marginTop: '6px' }}
                          >
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.725rem', padding: '8px', background: '#F8FAFC', borderRadius: '8px' }}>
                              {pkg.excluded.map((exc: string, i: number) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', color: '#64748B' }}>
                                  <XCircle size={12} style={{ color: '#CBD5E1', flexShrink: 0, marginTop: '2px' }} />
                                  <span style={{ lineHeight: 1.35 }}>{exc}</span>
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

              <div style={{ marginTop: '14px' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '8px 6px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    background: isSelected ? '#29C3BE' : 'transparent',
                    color: isSelected ? '#FFFFFF' : '#1C2677',
                    border: isSelected ? 'none' : '1px solid #1C2677',
                    boxShadow: isSelected ? '0 4px 12px rgba(41, 195, 190, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {isSelected ? 'Selected ✓' : 'Select Package'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Package Deep Breakdown */}
      <div style={{
        background: '#1C2677',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#29C3BE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            Selected Specification Breakdown
          </div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, marginBottom: '6px', color: '#FFFFFF' }}>
            {activePackage.name} for {activeVehicle.label}
          </h4>
          <p style={{ fontSize: '0.825rem', color: '#CBD5E1', margin: 0, marginBottom: '12px', lineHeight: 1.4 }}>
            {activePackage.overview}
          </p>

          <div style={{ display: 'flex', gap: '14px', fontSize: '0.775rem', color: '#94A3B8', flexWrap: 'wrap' }}>
            <div>⏱️ Duration: <strong style={{ color: '#FFF' }}>{activePackage.duration}</strong></div>
            <div>🗓️ Frequency: <strong style={{ color: '#FFF' }}>{activePackage.frequency}</strong></div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>Package Price</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#29C3BE' }}>₹{activePackage.price}</div>
          </div>
          <button onClick={handleBookCarService} className="btn-primary" style={{ padding: '12px 18px', fontSize: '0.875rem' }}>
            Book Car Service <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .car-packages-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .category-scroll-bar::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 992px) {
          .car-packages-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            align-items: flex-start !important;
          }
          .pkg-card {
            padding: 10px 8px !important;
          }
          .pkg-badge-title {
            font-size: 0.675rem !important;
          }
          .pkg-price-text {
            font-size: 1.35rem !important;
          }
          .pkg-desc-text {
            font-size: 0.725rem !important;
            line-height: 1.35 !important;
            color: #64748B !important;
            margin-bottom: 8px !important;
          }
          .pkg-duration-text {
            font-size: 0.675rem !important;
            margin-bottom: 8px !important;
          }
          .desktop-features-list {
            display: none !important;
          }
          .mobile-features-accordion {
            display: block !important;
          }
        }

        @media (min-width: 993px) {
          .desktop-features-list {
            display: block !important;
          }
          .mobile-features-accordion {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
