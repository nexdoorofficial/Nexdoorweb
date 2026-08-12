import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Home as HomeIcon,
  Car,
  Shirt,
  Star,
  ArrowRight,
  Clock,
  ChevronDown
} from 'lucide-react';

import { PRIMARY_SERVICE_AREAS, COMING_SOON_AREAS } from '../data/serviceAreas';
import { TESTIMONIALS } from '../data/testimonials';
import { FAQS } from '../data/faqs';
import { HousePricingCalculator } from '../components/pricing/HousePricingCalculator';
import { BeforeAfterSlider } from '../components/common/BeforeAfterSlider';
import { ScrollTransformationHero } from '../components/home/ScrollTransformationHero';
import { ServiceProcessMotionSection } from '../components/home/ServiceProcessMotionSection';
import { TextEffect } from '../components/core/text-effect';
import { useAdminData } from '../context/AdminContext';

export const Home: React.FC = () => {
  const adminData = useAdminData();
  const [openFaq, setOpenFaq] = useState<string | null>(FAQS[0].id);
  const [activeServiceTab, setActiveServiceTab] = useState<'house' | 'car' | 'laundry'>('house');

  const getHousePrice = (catKey: string, planType: 'standard' | 'premium', defaultVal: number) => {
    const cat = adminData?.houseCategories?.find((c) => c.id === catKey);
    if (!cat) return defaultVal;
    const plan = planType === 'standard' ? cat.standard : cat.premium;
    return plan?.priceNumeric ?? defaultVal;
  };

  const getCarPrice = (pkgKey: 'basic' | 'premium' | 'interior' | 'complete', defaultVal: number) => {
    const vCat = adminData?.vehicleCategories?.[0];
    if (!vCat || !vCat.packages) return defaultVal;
    const pkg = vCat.packages[pkgKey];
    return pkg?.price ?? defaultVal;
  };

  return (
    <div>
      {/* 0. SCROLL-DRIVEN ROOM CLEANING TRANSFORMATION HERO */}
      <ScrollTransformationHero />

      {/* 1. ORIGINAL HERO SECTION */}
      <section style={{
        position: 'relative',
        paddingTop: '60px',
        paddingBottom: '96px',
        background: 'radial-gradient(100% 100% at 50% 0%, rgba(41, 195, 190, 0.12) 0%, rgba(28, 38, 119, 0.03) 60%, rgba(248, 250, 252, 0) 100%)',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="badge-tag" style={{ marginBottom: '20px' }}>
                <span className="pulse-dot" /> NEXT-GEN HOME & AUTO CARE IN KOCHI
              </div>

              <TextEffect
                per="word"
                as="h1"
                preset="reveal-3d"
                viewport={{ once: false, amount: 0.25 }}
                style={{
                  fontSize: 'clamp(1.85rem, 4.5vw, 3.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: '#1C2677',
                  marginBottom: '16px',
                  letterSpacing: '-0.03em',
                  justifyContent: 'center'
                }}
              >
                Enterprise Cleaning,{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #29C3BE 0%, #1C2677 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Delivered Like Modern Tech.
                </span>
              </TextEffect>

              <p style={{
                fontSize: '0.95rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '680px',
                margin: '0 auto 28px auto'
              }}>
                Book professional deep home cleaning, mobile car wash detailing, and weight-based laundry online. Transparent pricing, trained specialists & instant booking.
              </p>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
                <Link to="/book" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
                  <Sparkles size={20} /> Book Service Online
                </Link>
                <Link to="/pricing" className="btn-outline" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
                  Explore Pricing Calculator
                </Link>
              </div>
            </motion.div>

            {/* Live Stats Ticker Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '20px',
                background: '#FFFFFF',
                padding: '24px',
                borderRadius: '24px',
                boxShadow: '0 12px 36px rgba(27, 34, 54, 0.06)',
                border: '1px solid #E2E8F0'
              }}
            >
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C2677' }}>
                  {adminData?.siteSettings?.statCleanedCount || '15,000+'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
                  {adminData?.siteSettings?.statCleanedLabel || 'Cleaned Homes & Cars'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#29C3BE', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {adminData?.siteSettings?.statRating || '4.9★'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
                  {adminData?.siteSettings?.statRatingLabel || 'Customer Rating'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C2677' }}>
                  {adminData?.siteSettings?.statHubsCount || '3 Primary'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
                  {adminData?.siteSettings?.statHubsLabel || 'Kochi Service Hubs'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981' }}>
                  {adminData?.siteSettings?.statEcoPercent || '100%'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
                  {adminData?.siteSettings?.statEcoLabel || 'Eco-Friendly Chemicals'}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. THREE MAIN SERVICES SHOWCASE */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span className="badge-secondary">OUR CORE OFFERINGS</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
              Three Specialized Service Pillars
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '8px' }}>
              Engineered with dedicated machinery, background-checked specialists, and transparent scope of work.
            </p>
          </div>

          {/* MOBILE ONLY: TABBED SERVICE SWITCHER (Matching 2nd Mock Screenshot) */}
          <div className="mobile-services-tabs" style={{ display: 'none', flexDirection: 'column', gap: '20px' }}>
            {/* Tab Navigation Header */}
            <div style={{
              display: 'flex',
              gap: '6px',
              background: '#F1F5F9',
              padding: '6px',
              borderRadius: '16px',
              border: '1px solid #E2E8F0'
            }}>
              <button
                onClick={() => setActiveServiceTab('house')}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeServiceTab === 'house' ? '#FFFFFF' : 'transparent',
                  color: activeServiceTab === 'house' ? '#1C2677' : '#64748B',
                  fontWeight: activeServiceTab === 'house' ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: activeServiceTab === 'house' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <HomeIcon size={16} style={{ color: activeServiceTab === 'house' ? '#29C3BE' : '#64748B' }} />
                <span>House</span>
              </button>

              <button
                onClick={() => setActiveServiceTab('car')}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeServiceTab === 'car' ? '#FFFFFF' : 'transparent',
                  color: activeServiceTab === 'car' ? '#1C2677' : '#64748B',
                  fontWeight: activeServiceTab === 'car' ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: activeServiceTab === 'car' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Car size={16} style={{ color: activeServiceTab === 'car' ? '#1C2677' : '#64748B' }} />
                <span>Car Wash</span>
              </button>

              <button
                onClick={() => setActiveServiceTab('laundry')}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeServiceTab === 'laundry' ? '#FFFFFF' : 'transparent',
                  color: activeServiceTab === 'laundry' ? '#1C2677' : '#64748B',
                  fontWeight: activeServiceTab === 'laundry' ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: activeServiceTab === 'laundry' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Shirt size={16} style={{ color: activeServiceTab === 'laundry' ? '#F59E0B' : '#64748B' }} />
                <span>Laundry</span>
              </button>
            </div>

            {/* Active Card Body */}
            <AnimatePresence mode="wait">
              {activeServiceTab === 'house' && (
                <motion.div
                  key="house"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card"
                  style={{ padding: '24px', borderRadius: '20px' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(41, 195, 190, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#29C3BE', marginBottom: '16px' }}>
                    <HomeIcon size={26} />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#29C3BE', letterSpacing: '0.05em' }}>SERVICE 01</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                    House Cleaning
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    Comprehensive deep cleaning from 1 BHK compact flats to multi-floor luxury villas with single-disc floor scrubbers & steam.
                  </p>
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '14px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C2677', marginBottom: '6px' }}>Category Tiers & Rates:</div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>• 1 BHK: Standard ₹{getHousePrice('1-bhk', 'standard', 1499).toLocaleString()} | Premium ₹{getHousePrice('1-bhk', 'premium', 2499).toLocaleString()}</div>
                      <div>• 2 BHK: Standard ₹{getHousePrice('2-bhk', 'standard', 1999).toLocaleString()} | Premium ₹{getHousePrice('2-bhk', 'premium', 3299).toLocaleString()}</div>
                      <div>• 3 BHK: Standard ₹{getHousePrice('3-bhk', 'standard', 2799).toLocaleString()} | Premium ₹{getHousePrice('3-bhk', 'premium', 4499).toLocaleString()}</div>
                      <div>• Villa / Custom: Custom Quote</div>
                    </div>
                  </div>
                  <Link to="/services/house-cleaning" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    Explore House Cleaning <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )}

              {activeServiceTab === 'car' && (
                <motion.div
                  key="car"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card"
                  style={{ padding: '24px', borderRadius: '20px' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(28, 38, 119, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C2677', marginBottom: '16px' }}>
                    <Car size={26} />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1C2677', letterSpacing: '0.05em' }}>SERVICE 02</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                    Car Wash & Detailing
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    Doorstep mobile detailing for Hatchback, Sedan, SUV, Luxury SUV & Premium sports cars. Clay bar & ceramic polish available.
                  </p>
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '14px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C2677', marginBottom: '6px' }}>4 Service Packages:</div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>• Basic Wash (From ₹{getCarPrice('basic', 399).toLocaleString()})</div>
                      <div>• Premium Wash (From ₹{getCarPrice('premium', 699).toLocaleString()})</div>
                      <div>• Interior Detailing (From ₹{getCarPrice('interior', 1199).toLocaleString()})</div>
                      <div>• Complete 360° Spa (From ₹{getCarPrice('complete', 1999).toLocaleString()})</div>
                    </div>
                  </div>
                  <Link to="/services/car-wash" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    Explore Car Detailing <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )}

              {activeServiceTab === 'laundry' && (
                <motion.div
                  key="laundry"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card"
                  style={{ padding: '24px', borderRadius: '20px' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '16px' }}>
                    <Shirt size={26} />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.05em' }}>SERVICE 03</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                    Laundry & Garment Care
                  </h3>
                  {(() => {
                    const minW = adminData?.laundryConfig?.freePickupMinWeight ?? 2;
                    const feeAmt = adminData?.laundryConfig?.pickupFee ?? 80;

                    return (
                      <>
                        <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                          Weight-based laundry starting from 1kg to 20kg loads. FREE pickup & delivery on orders {minW}kg or more!
                        </p>
                        <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '14px', marginBottom: '20px' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C2677', marginBottom: '6px' }}>Pickup Rules & Quality:</div>
                          <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div>• &lt; {minW}kg: ₹{feeAmt} Pickup Charge</div>
                            <div>• ≥ {minW}kg: FREE Pickup & Delivery</div>
                            <div>• Normal (2 Days) & Express (Same Day)</div>
                            <div>• Standard vs Premium Fragrance Care</div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                  <Link to="/services/laundry" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    Explore Laundry Care <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DESKTOP ONLY: 3-COLUMN GRID */}
          <div className="desktop-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>

            {/* Service 01: House Cleaning */}
            <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(41, 195, 190, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#29C3BE', marginBottom: '24px' }}>
                  <HomeIcon size={30} />
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#29C3BE', letterSpacing: '0.05em' }}>SERVICE 01</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C2677', marginBottom: '12px' }}>
                  House Cleaning
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Comprehensive deep cleaning from 1 BHK compact flats to multi-floor luxury villas with single-disc floor scrubbers & steam.
                </p>

                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C2677', marginBottom: '6px' }}>Category Tiers & Rates:</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>• 1 BHK: Standard ₹{getHousePrice('1-bhk', 'standard', 1499).toLocaleString()} | Premium ₹{getHousePrice('1-bhk', 'premium', 2499).toLocaleString()}</div>
                    <div>• 2 BHK: Standard ₹{getHousePrice('2-bhk', 'standard', 1999).toLocaleString()} | Premium ₹{getHousePrice('2-bhk', 'premium', 3299).toLocaleString()}</div>
                    <div>• 3 BHK: Standard ₹{getHousePrice('3-bhk', 'standard', 2799).toLocaleString()} | Premium ₹{getHousePrice('3-bhk', 'premium', 4499).toLocaleString()}</div>
                    <div>• Villa / Custom: Custom Quote</div>
                  </div>
                </div>
              </div>

              <Link to="/services/house-cleaning" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Explore House Cleaning <ArrowRight size={18} />
              </Link>
            </div>

            {/* Service 02: Car Wash */}
            <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(28, 38, 119, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C2677', marginBottom: '24px' }}>
                  <Car size={30} />
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C2677', letterSpacing: '0.05em' }}>SERVICE 02</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C2677', marginBottom: '12px' }}>
                  Car Wash & Detailing
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Doorstep mobile detailing for Hatchback, Sedan, SUV, Luxury SUV & Premium sports cars. Clay bar & ceramic polish available.
                </p>

                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C2677', marginBottom: '6px' }}>4 Service Packages:</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>• Basic Wash (From ₹{getCarPrice('basic', 399).toLocaleString()})</div>
                    <div>• Premium Wash (From ₹{getCarPrice('premium', 699).toLocaleString()})</div>
                    <div>• Interior Detailing (From ₹{getCarPrice('interior', 1199).toLocaleString()})</div>
                    <div>• Complete 360° Spa (From ₹{getCarPrice('complete', 1999).toLocaleString()})</div>
                  </div>
                </div>
              </div>

              <Link to="/services/car-wash" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Explore Car Detailing <ArrowRight size={18} />
              </Link>
            </div>

            {/* Service 03: Laundry */}
            <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {(() => {
                const minW = adminData?.laundryConfig?.freePickupMinWeight ?? 2;
                const feeAmt = adminData?.laundryConfig?.pickupFee ?? 80;

                return (
                  <div>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '24px' }}>
                      <Shirt size={30} />
                    </div>

                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.05em' }}>SERVICE 03</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C2677', marginBottom: '12px' }}>
                      Laundry & Garment Care
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                      Weight-based laundry starting from 1kg to 20kg loads. FREE pickup & delivery on orders {minW}kg or more!
                    </p>

                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', marginBottom: '24px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C2677', marginBottom: '6px' }}>Pickup Rules & Quality:</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>• &lt; {minW}kg: ₹{feeAmt} Pickup Charge</div>
                        <div>• ≥ {minW}kg: FREE Pickup & Delivery</div>
                        <div>• Normal (2 Days) & Express (Same Day)</div>
                        <div>• Standard vs Premium Fragrance Care</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <Link to="/services/laundry" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Explore Laundry Care <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* BEFORE & AFTER TRANSFORMATIONS SECTION */}
      <BeforeAfterSlider />

      {/* WEBGL MOTION SERVICE PROCESS SEQUENCE SECTION */}
      <ServiceProcessMotionSection />

      {/* 4. INTERACTIVE HOUSE PRICING CALCULATOR SECTION */}
      <section className="section-padding" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span className="badge-tag">INTERACTIVE CALCULATOR</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
              Compare House Cleaning Plans
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '8px' }}>
              Select your house size to view side-by-side Standard vs Premium inclusions and demo rates.
            </p>
          </div>

          <HousePricingCalculator />
        </div>
      </section>

      {/* 5. SERVICE AREAS SECTION */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span className="badge-secondary">COVERAGE ZONES</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
              Primary Service Hubs
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '8px' }}>
              Active dispatch units operating across {adminData?.locations ? adminData.locations.filter(l => l.status === 'active').map(l => l.name).join(', ') : 'Kakkanad, Edappally & Kalamassery'}.
            </p>
          </div>

          {/* Primary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {adminData?.locations && adminData.locations.filter(l => l.status === 'active').length > 0 ? (
              adminData.locations.filter(l => l.status === 'active').map((area) => (
                <div key={area.id} className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#065F46', padding: '4px 12px', borderRadius: '20px' }}>
                      ACTIVE HUB ●
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{area.pincode}</span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                    {area.name} HQ Hub
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                    {area.description || `Full doorstep coverage across ${area.zone} belt with single-disc floor scrubbers & steam detailing.`}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} style={{ color: '#29C3BE' }} /> 15-30 Mins Express Dispatch
                  </div>
                </div>
              ))
            ) : (
              PRIMARY_SERVICE_AREAS.map((area) => (
                <div key={area.id} className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#065F46', padding: '4px 12px', borderRadius: '20px' }}>
                      ACTIVE HUB ●
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{area.pincode}</span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                    {area.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                    {area.description}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} style={{ color: '#29C3BE' }} /> {area.estimatedArrival}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coming Soon Suburb Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(28, 38, 119, 0.04) 0%, rgba(41, 195, 190, 0.08) 100%)',
            borderRadius: '20px',
            padding: '28px',
            border: '1px dashed #29C3BE'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C2677', marginBottom: '12px' }}>
              🚀 Next Expansion Locations (Coming Soon):
            </h4>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {COMING_SOON_AREAS.map((item) => (
                <div key={item.id} style={{ background: '#FFFFFF', padding: '10px 18px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600, color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  📍 {item.name} ({item.estimatedArrival})
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="section-padding" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span className="badge-tag">CLIENT FEEDBACK</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
              Trusted by 15,000+ Homes & Auto Owners
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                  ))}
                </div>

                <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px' }}>
                  "{t.comment}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={t.avatar} alt={t.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C2677' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.location} • {t.serviceUsed}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-secondary">FREQUENTLY ASKED QUESTIONS</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FAQS.slice(0, 5).map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  style={{
                    background: '#F8FAFC',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer'
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, color: '#1C2677', fontSize: '1rem' }}>
                    <span>{faq.question}</span>
                    <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #CBD5E1', paddingTop: '12px' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #1C2677 0%, #151D5C 100%)', color: '#FFFFFF' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
            Ready to Experience Pristine Cleanliness?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', marginBottom: '32px' }}>
            Book your service online in under 60 seconds with 100% risk-free refundable deposit guarantee.
          </p>

          <Link to="/book" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem', margin: '0 auto' }}>
            Book Your Service Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .desktop-services-grid {
            display: none !important;
          }
          .mobile-services-tabs {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
