import React, { useState } from 'react';
import {
  Home,
  Car,
  Shirt,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { HousePricingCalculator } from '../components/pricing/HousePricingCalculator';
import { CarWashCalculator } from '../components/pricing/CarWashCalculator';
import { LaundryCalculator } from '../components/pricing/LaundryCalculator';
import { PLAN_COMPARISON_MATRIX } from '../data/plans';
import { RefundableBanner } from '../components/common/RefundableBanner';

export const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'house' | 'car' | 'laundry'>('house');

  return (
    <div>
      {/* Hero Header */}
      <section style={{ padding: '48px 0 32px 0', background: 'linear-gradient(180deg, rgba(41, 195, 190, 0.1) 0%, rgba(248, 250, 252, 0) 100%)' }}>
        <div className="container" style={{ padding: '0 16px' }}>
          <div style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
            <span className="badge-tag">TRANSPARENT SAAS-STYLE PRICING</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1C2677', marginTop: '12px', marginBottom: '14px', lineHeight: 1.2 }}>
              Interactive Pricing & Estimator Matrix
            </h1>
            <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.5, marginBottom: '20px' }}>
              Zero hidden fees, zero surprise charges. All rates are calculated upfront according to house size, vehicle type, and load weight.
            </p>
            <RefundableBanner variant="compact" />
          </div>
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="section-padding" style={{ background: '#FFFFFF', paddingTop: '16px' }}>
        <div className="container" style={{ padding: '0 16px' }}>

          {/* Desktop Service Selector Tabs */}
          <div className="desktop-pricing-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('house')}
              style={{
                padding: '14px 28px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeTab === 'house' ? '#1C2677' : '#F8FAFC',
                color: activeTab === 'house' ? '#FFFFFF' : '#475569',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                boxShadow: activeTab === 'house' ? '0 6px 20px rgba(28, 38, 119, 0.25)' : 'none'
              }}
            >
              <Home size={18} /> House Cleaning Pricing
            </button>

            <button
              onClick={() => setActiveTab('car')}
              style={{
                padding: '14px 28px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeTab === 'car' ? '#1C2677' : '#F8FAFC',
                color: activeTab === 'car' ? '#FFFFFF' : '#475569',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                boxShadow: activeTab === 'car' ? '0 6px 20px rgba(28, 38, 119, 0.25)' : 'none'
              }}
            >
              <Car size={18} /> Car Wash Pricing
            </button>

            <button
              onClick={() => setActiveTab('laundry')}
              style={{
                padding: '14px 28px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeTab === 'laundry' ? '#1C2677' : '#F8FAFC',
                color: activeTab === 'laundry' ? '#FFFFFF' : '#475569',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                boxShadow: activeTab === 'laundry' ? '0 6px 20px rgba(28, 38, 119, 0.25)' : 'none'
              }}
            >
              <Shirt size={18} /> Laundry Pricing
            </button>
          </div>

          {/* Mobile Sleek Segmented Control Bar */}
          <div className="mobile-pricing-tabs" style={{ display: 'none', marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              gap: '4px',
              background: '#F1F5F9',
              padding: '5px',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              width: '100%'
            }}>
              <button
                onClick={() => setActiveTab('house')}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'house' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'house' ? '#1C2677' : '#64748B',
                  fontWeight: activeTab === 'house' ? 800 : 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  boxShadow: activeTab === 'house' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <Home size={14} style={{ color: activeTab === 'house' ? '#29C3BE' : '#64748B', flexShrink: 0 }} />
                <span>House</span>
              </button>

              <button
                onClick={() => setActiveTab('car')}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'car' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'car' ? '#1C2677' : '#64748B',
                  fontWeight: activeTab === 'car' ? 800 : 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  boxShadow: activeTab === 'car' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <Car size={14} style={{ color: activeTab === 'car' ? '#1C2677' : '#64748B', flexShrink: 0 }} />
                <span>Car Wash</span>
              </button>

              <button
                onClick={() => setActiveTab('laundry')}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'laundry' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'laundry' ? '#1C2677' : '#64748B',
                  fontWeight: activeTab === 'laundry' ? 800 : 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  boxShadow: activeTab === 'laundry' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <Shirt size={14} style={{ color: activeTab === 'laundry' ? '#F59E0B' : '#64748B', flexShrink: 0 }} />
                <span>Laundry</span>
              </button>
            </div>
          </div>

          {/* Calculator Output */}
          <div>
            {activeTab === 'house' && <HousePricingCalculator />}
            {activeTab === 'car' && <CarWashCalculator />}
            {activeTab === 'laundry' && <LaundryCalculator />}
          </div>

        </div>
      </section>

      {/* PLAN COMPARISON MATRIX */}
      <section className="section-padding" style={{ background: '#F8FAFC' }}>
        <div className="container" style={{ padding: '0 16px' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 32px auto' }}>
            <span className="badge-secondary">DETAILED COMPARISON</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
              Standard vs Premium Protocol Matrix
            </h2>
          </div>

          <div className="glass-card" style={{ padding: '20px', overflowX: 'auto', borderRadius: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', minWidth: '550px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #CBD5E1', color: '#1C2677' }}>
                  <th style={{ padding: '12px', fontSize: '0.95rem' }}>Service Feature</th>
                  <th style={{ padding: '12px', fontSize: '0.95rem', color: '#475569' }}>Standard Plan</th>
                  <th style={{ padding: '12px', fontSize: '0.95rem', color: '#29C3BE' }}>Premium Plan</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#1B2236' }}>{row.feature}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>
                      {typeof row.standard === 'boolean' ? (
                        row.standard ? <CheckCircle2 size={16} style={{ color: '#10B981' }} /> : <XCircle size={16} style={{ color: '#CBD5E1' }} />
                      ) : row.standard}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#1C2677' }}>
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <CheckCircle2 size={16} style={{ color: '#29C3BE' }} /> : <XCircle size={16} style={{ color: '#CBD5E1' }} />
                      ) : row.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .desktop-pricing-tabs {
            display: none !important;
          }
          .mobile-pricing-tabs {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
