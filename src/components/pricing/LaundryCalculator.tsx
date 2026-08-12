import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Truck,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  XCircle,
  ChevronDown
} from 'lucide-react';
import { calculateLaundryPrice } from '../../data/pricing';
import { useAdminData } from '../../context/AdminContext';
import type { LaundryPackageKey, LaundrySpeedKey, LaundryQualityKey } from '../../types';
import { useNavigate } from 'react-router-dom';

const SERVICEABLE_LOCATIONS = [
  { id: 'Kakkanad', name: 'Kakkanad', zone: 'SmartCity & Infopark' },
  { id: 'Edappally', name: 'Edappally', zone: 'Lulu Mall Belt' },
  { id: 'Kalamassery', name: 'Kalamassery', zone: 'CUSAT Zone' },
  { id: 'Marine Drive & MG Road', name: 'Marine Drive & MG Road', zone: 'Ernakulam Central' },
  { id: 'Vytila & Thripunithura', name: 'Vytila & Thripunithura', zone: 'Mobility Hub' },
  { id: 'Aluva & Angamaly', name: 'Aluva & Angamaly', zone: 'Airport Highway' }
];

interface LaundryCalculatorProps {
  initialWeight?: number;
  selectedPackage?: LaundryPackageKey;
  onSelectPackage?: (pkgKey: LaundryPackageKey) => void;
  hideHeader?: boolean;
}

export const LaundryCalculator: React.FC<LaundryCalculatorProps> = ({
  initialWeight = 5,
  selectedPackage: propSelectedPackage,
  onSelectPackage,
  hideHeader = false
}) => {
  const navigate = useNavigate();
  let laundryConfig: any = null;
  let rawLocationsList: any[] = SERVICEABLE_LOCATIONS;

  try {
    const adminData = useAdminData();
    if (adminData && adminData.laundryConfig) {
      laundryConfig = adminData.laundryConfig;
    }
    if (adminData && adminData.locations && adminData.locations.length > 0) {
      rawLocationsList = adminData.locations;
    }
  } catch (e) {}

  const [weightKg, setWeightKg] = useState<number>(initialWeight);
  const [pkg, setPkg] = useState<LaundryPackageKey>(propSelectedPackage || 'wash-iron');
  const [speed, setSpeed] = useState<LaundrySpeedKey>('normal');
  const [quality, setQuality] = useState<LaundryQualityKey>('premium');
  const [location, setLocation] = useState<string>('Kakkanad');

  // Dynamic location list filtered by active system locations & laundry-specific availability
  const availableLocationsList = React.useMemo(() => {
    const activeLocs = rawLocationsList.filter((l: any) => !l.status || l.status === 'active');
    const baseLocs = activeLocs.length > 0 ? activeLocs : rawLocationsList;

    if (laundryConfig?.availableLocations && laundryConfig.availableLocations.length > 0) {
      const filtered = baseLocs.filter((l: any) =>
        laundryConfig.availableLocations.some(
          (locName: string) => locName.toLowerCase().trim() === l.name.toLowerCase().trim()
        )
      );
      return filtered.length > 0 ? filtered : baseLocs;
    }

    return baseLocs;
  }, [rawLocationsList, laundryConfig]);

  // Automatically sync selected location if current location is no longer valid for laundry
  React.useEffect(() => {
    if (availableLocationsList && availableLocationsList.length > 0) {
      const isValid = availableLocationsList.some((l: any) => l.name.toLowerCase() === location.toLowerCase());
      if (!isValid) {
        setLocation(availableLocationsList[0].name);
      }
    }
  }, [availableLocationsList]);

  React.useEffect(() => {
    if (initialWeight) setWeightKg(initialWeight);
  }, [initialWeight]);

  React.useEffect(() => {
    if (propSelectedPackage) setPkg(propSelectedPackage);
  }, [propSelectedPackage]);

  // Accordion open states matching site-wide standard
  const [laundryIncOpen, setLaundryIncOpen] = useState(false);
  const [laundryExcOpen, setLaundryExcOpen] = useState(false);

  const calculation = calculateLaundryPrice(weightKg, pkg, speed, quality, laundryConfig);

  const handleSelectPkg = (newPkg: LaundryPackageKey) => {
    setPkg(newPkg);
    if (onSelectPackage) onSelectPackage(newPkg);
  };

  const handleBookNow = () => {
    navigate(`/book?service=laundry&weight=${weightKg}&pkg=${pkg}&speed=${speed}&quality=${quality}&location=${encodeURIComponent(location)}&step=5`);
  };

  return (
    <div className="glass-card laundry-calculator-card" style={{ padding: '24px', borderRadius: '24px' }}>
      {!hideHeader && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F59E0B'
          }}>
            <Scale size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#1B2236' }}>
              Interactive Laundry Price Estimator
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
              Adjust weight, package type, delivery speed, fabric care tier, and location for instant quote.
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }} className="laundry-calc-grid">
        {/* Left Column: Interactive Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 1. Weight Selection */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C2677', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scale size={18} style={{ color: '#29C3BE' }} /> Total Weight (Kg)
              </label>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#29C3BE' }}>
                {weightKg} Kg
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#29C3BE',
                height: '8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            />

            {/* Quick Weight Buttons */}
            {(() => {
              const minWeight = laundryConfig?.freePickupMinWeight ?? 2;
              const pickupFeeAmt = laundryConfig?.pickupFee ?? 80;

              return (
                <>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {[1, 2, 3, 5, 10, 15, 20].map((w) => (
                      <button
                        key={w}
                        onClick={() => setWeightKg(w)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          background: weightKg === w ? '#1C2677' : '#F1F5F9',
                          color: weightKg === w ? '#FFFFFF' : '#475569',
                          border: 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {w} kg {w === minWeight && '🌟 Free Delivery'}
                      </button>
                    ))}
                  </div>

                  {/* Pickup Fee Indicator Badge */}
                  <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: calculation.isPickupFree ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${calculation.isPickupFree ? '#10B981' : '#F59E0B'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: calculation.isPickupFree ? '#065F46' : '#92400E'
                  }}>
                    <Truck size={18} />
                    {calculation.isPickupFree ? (
                      <span>🎉 <strong>FREE Pickup & Doorstep Delivery</strong> on above {minWeight}kg</span>
                    ) : (
                      <span>⚠️ Order under {minWeight}kg applies ₹{pickupFeeAmt} Pickup & Delivery charge. Add {Math.max(1, minWeight - weightKg)}kg for FREE delivery!</span>
                    )}
                  </div>
                </>
              );
            })()}
          </div>

          {/* 2. Location Selection */}
          <div>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C2677', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <MapPin size={18} style={{ color: '#29C3BE' }} /> Select Pickup & Delivery Location
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {availableLocationsList.map((loc) => {
                const isSelected = location.toLowerCase().includes(loc.name.toLowerCase()) || loc.name.toLowerCase().includes(location.toLowerCase());
                return (
                  <button
                    key={loc.id || loc.name}
                    onClick={() => setLocation(loc.name)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      textAlign: 'left',
                      background: isSelected ? 'rgba(41, 195, 190, 0.12)' : '#F8FAFC',
                      border: `2px solid ${isSelected ? '#29C3BE' : '#E2E8F0'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? '#1C2677' : '#1B2236' }}>
                      📍 {loc.name}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#64748B' }}>{loc.zone || `Pincode: ${loc.pincode}`}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Package Selection */}
          <div>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C2677', display: 'block', marginBottom: '10px' }}>
              Select Service Package
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { id: 'laundry-only', label: laundryConfig?.packages?.['laundry-only']?.name || 'Laundry Only', desc: laundryConfig?.packages?.['laundry-only']?.description || 'Wash & Tumble Dry' },
                { id: 'wash-iron', label: laundryConfig?.packages?.['wash-iron']?.name || 'Wash + Iron', desc: laundryConfig?.packages?.['wash-iron']?.description || 'Wash, Dry & Steam Press' },
                { id: 'iron-only', label: laundryConfig?.packages?.['iron-only']?.name || 'Iron Only', desc: laundryConfig?.packages?.['iron-only']?.description || 'Crisp Steam Pressing' },
                { id: 'dry-cleaning', label: laundryConfig?.packages?.['dry-cleaning']?.name || 'Dry Cleaning', desc: laundryConfig?.packages?.['dry-cleaning']?.description || 'Solvent Dry Wash & Press' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectPkg(item.id as LaundryPackageKey)}
                  style={{
                    padding: '12px',
                    borderRadius: '14px',
                    textAlign: 'left',
                    background: pkg === item.id ? 'rgba(41, 195, 190, 0.12)' : '#F8FAFC',
                    border: `2px solid ${pkg === item.id ? '#29C3BE' : '#E2E8F0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: pkg === item.id ? '#1C2677' : '#1B2236' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Delivery Speed */}
          <div>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C2677', display: 'block', marginBottom: '10px' }}>
              Delivery Speed
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => setSpeed('normal')}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  textAlign: 'left',
                  background: speed === 'normal' ? 'rgba(28, 38, 119, 0.08)' : '#F8FAFC',
                  border: `2px solid ${speed === 'normal' ? '#1C2677' : '#E2E8F0'}`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C2677' }}>
                  {laundryConfig?.standardSpeedLabel || 'Standard (2 Days)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {laundryConfig?.standardSpeedDesc || 'Included Free'}
                </div>
              </button>

              <button
                onClick={() => setSpeed('express')}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  textAlign: 'left',
                  background: speed === 'express' ? 'rgba(245, 158, 11, 0.12)' : '#F8FAFC',
                  border: `2px solid ${speed === 'express' ? '#F59E0B' : '#E2E8F0'}`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#B45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} /> {laundryConfig?.expressSpeedLabel || 'Express (Same Day)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  +{laundryConfig?.expressSurcharge ? `₹${laundryConfig.expressSurcharge}` : '₹199'} Rush Dispatch
                </div>
              </button>
            </div>
          </div>

          {/* 5. Quality Package Tier */}
          <div>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C2677', display: 'block', marginBottom: '10px' }}>
              Detergent & Care Quality
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => setQuality('standard')}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  textAlign: 'left',
                  background: quality === 'standard' ? '#F1F5F9' : '#F8FAFC',
                  border: `2px solid ${quality === 'standard' ? '#64748B' : '#E2E8F0'}`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1B2236' }}>Standard Care</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  {laundryConfig?.standardCareDesc || 'Regular detergent, commercial machine wash'}
                </div>
              </button>

              <button
                onClick={() => setQuality('premium')}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  textAlign: 'left',
                  background: quality === 'premium' ? 'rgba(41, 195, 190, 0.12)' : '#F8FAFC',
                  border: `2px solid ${quality === 'premium' ? '#29C3BE' : '#E2E8F0'}`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C2677', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} style={{ color: '#29C3BE' }} /> Premium Luxury Care
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  {laundryConfig?.premiumCareDesc || 'Imported liquid, fabric conditioner, luxury fragrance (+₹35/kg)'}
                </div>
              </button>
            </div>
          </div>

          {/* 6. Laundry Service Coverage Accordions (MIRRORING HOUSE CLEANING DESIGN PATTERN 100%) */}
          <div>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C2677', display: 'block', marginBottom: '10px' }}>
              Service Coverage & Guarantees
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* Included Accordion */}
              {(() => {
                const includedItems = (laundryConfig && laundryConfig.included && laundryConfig.included.length > 0)
                  ? laundryConfig.included
                  : [
                      'Eco-friendly liquid detergent wash & fabric softener',
                      'Free anti-bacterial germ-kill garment misting',
                      'Wrinkle-free steam pressing & custom hanger packaging',
                      'Free doorstep pickup & delivery on orders > 2 kg'
                    ];

                const excludedItems = (laundryConfig && laundryConfig.excluded && laundryConfig.excluded.length > 0)
                  ? laundryConfig.excluded
                  : [
                      'Heavy genuine leather & suede jacket dry cleaning',
                      'Deep carpet, floor rug & heavy door mat washing',
                      'Chemical bleaching guarantee for old permanent dye marks'
                    ];

                return (
                  <>
                    <button
                      onClick={() => setLaundryIncOpen(!laundryIncOpen)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#047857',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#10B981', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                          {laundryIncOpen ? '−' : '+'}
                        </span>
                        Included in Laundry Service ({includedItems.length})
                      </span>
                      <ChevronDown size={14} style={{ transform: laundryIncOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </button>

                    <AnimatePresence>
                      {laundryIncOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                            {includedItems.map((inc: string, i: number) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: '#334155' }}>
                                <CheckCircle2 size={14} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Excluded Accordion */}
                    <button
                      onClick={() => setLaundryExcOpen(!laundryExcOpen)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        color: '#64748B',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#94A3B8', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                          {laundryExcOpen ? '−' : '+'}
                        </span>
                        Excluded in Laundry Service ({excludedItems.length})
                      </span>
                      <ChevronDown size={14} style={{ transform: laundryExcOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </button>

                    <AnimatePresence>
                      {laundryExcOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                            {excludedItems.map((exc: string, i: number) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: '#64748B' }}>
                                <XCircle size={14} style={{ color: '#CBD5E1', flexShrink: 0, marginTop: '2px' }} />
                                <span>{exc}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                );
              })()}

            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Invoice Summary */}
        <div style={{
          background: 'linear-gradient(180deg, #1C2677 0%, #151D5C 100%)',
          borderRadius: '20px',
          padding: '24px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 12px 30px rgba(28, 38, 119, 0.25)'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#29C3BE', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Estimated Price Breakdown
            </div>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, marginBottom: '20px', color: '#FFFFFF' }}>
              Laundry Order Summary
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#CBD5E1', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Location:</span>
                <span style={{ fontWeight: 600, color: '#29C3BE' }}>{location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Weight ({weightKg} kg):</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>₹{calculation.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Quality Tier ({quality}):</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>+₹{calculation.qualityExtra}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Speed ({speed}):</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>+₹{calculation.speedExtra}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Pickup & Delivery:</span>
                <span style={{ fontWeight: 600, color: calculation.isPickupFree ? '#10B981' : '#FFFFFF' }}>
                  {calculation.isPickupFree ? 'FREE' : `₹${calculation.pickupFee}`}
                </span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.15)', margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>Estimated Total:</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#29C3BE' }}>
                  ₹{calculation.total}
                </span>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '0.8rem',
              color: '#94A3B8',
              lineHeight: 1.4,
              marginBottom: '20px'
            }}>
              <ShieldCheck size={16} style={{ color: '#29C3BE', display: 'inline', marginRight: '4px' }} />
              Fully refundable booking deposit of ₹299 applies at checkout, adjustable against your final bill.
            </div>
          </div>

          <button onClick={handleBookNow} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            Book Laundry Service <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .laundry-calc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
