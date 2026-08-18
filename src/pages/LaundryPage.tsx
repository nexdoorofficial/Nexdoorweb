import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shirt,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { LaundryCalculator } from '../components/pricing/LaundryCalculator';
import { FEATURED_LAUNDRY_SERVICES } from '../data/services';
import { LAUNDRY_WEIGHT_TIERS } from '../data/categories';
import { RefundableBanner } from '../components/common/RefundableBanner';
import { useAdminData } from '../context/AdminContext';

export const LaundryPage: React.FC = () => {
  const [activeLaundryServiceId, setActiveLaundryServiceId] = useState<string>(FEATURED_LAUNDRY_SERVICES[0].id);

  const activeService = FEATURED_LAUNDRY_SERVICES.find((s) => s.id === activeLaundryServiceId) || FEATURED_LAUNDRY_SERVICES[0];

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(248, 250, 252, 0) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '750px' }}>
            <span className="badge-tag" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#B45309', borderColor: '#F59E0B' }}>
              <Shirt size={14} /> SERVICE 03
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#03252A', marginTop: '12px', marginBottom: '16px' }}>
              Weight-Based Laundry & Garment Care
            </h1>
            {(() => {
              let lConfig: any = null;
              try {
                const adminData = useAdminData();
                lConfig = adminData?.laundryConfig;
              } catch (e) {}
              const minW = lConfig?.freePickupMinWeight ?? 2;

              return (
                <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                  Doorstep pickup and delivery for daily clothes, curtains, heavy blankets, and designer sneakers. 100% FREE delivery on orders {minW}kg or more.
                </p>
              );
            })()}
            <RefundableBanner variant="compact" />
          </div>
        </div>
      </section>

      {/* Interactive Laundry Estimator */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#03252A' }}>
              Interactive Weight & Service Configurator
            </h2>
            <p style={{ color: '#64748B' }}>
              Adjust weight in kg, package type, and delivery speed for real-time calculation.
            </p>
          </div>

          <LaundryCalculator />
        </div>
      </section>

      {/* DEMO PRICING TABLES */}
      <section className="section-padding" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px auto' }}>
            <span className="badge-secondary">TRANSPARENT RATES</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#03252A', marginTop: '8px' }}>
              Weight Tier Rate Card
            </h2>
          </div>

          <div className="glass-card" style={{ padding: '32px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #CBD5E1', color: '#03252A' }}>
                  <th style={{ padding: '12px 16px' }}>Weight Bracket</th>
                  <th style={{ padding: '12px 16px' }}>Estimated Load Items</th>
                  <th style={{ padding: '12px 16px' }}>Base Rate / Kg</th>
                  <th style={{ padding: '12px 16px' }}>Doorstep Pickup Fee</th>
                </tr>
              </thead>
              <tbody>
                {LAUNDRY_WEIGHT_TIERS.map((tier) => (
                  <tr key={tier.weightKg} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#1B2236' }}>{tier.label}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{tier.estItems}</td>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#007A87' }}>₹{tier.basePricePerKg} / kg</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: tier.weightKg >= 2 ? '#9BC83B' : '#F59E0B' }}>
                      {tier.weightKg >= 2 ? '🎉 FREE PICKUP' : '₹80 Charge'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* THREE SPECIALIZED LAUNDRY SERVICES */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px auto' }}>
            <span className="badge-tag">SPECIALIZED CARE</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#03252A', marginTop: '8px' }}>
              Curtains, Blankets & Footwear Spa
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
            {FEATURED_LAUNDRY_SERVICES.map((feat) => (
              <button
                key={feat.id}
                onClick={() => setActiveLaundryServiceId(feat.id)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: activeLaundryServiceId === feat.id ? '#007A87' : '#FFFFFF',
                  color: activeLaundryServiceId === feat.id ? '#FFFFFF' : '#475569',
                  border: '1px solid #E2E8F0',
                  boxShadow: activeLaundryServiceId === feat.id ? '0 6px 20px rgba(0, 122, 135, 0.25)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {feat.title}
              </button>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '40px', borderRadius: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }} className="laundry-spec-grid">
              <div>
                <span className="badge-tag">Starting from {activeService.startingPrice}</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#03252A', marginTop: '12px', marginBottom: '8px' }}>
                  {activeService.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748B', fontStyle: 'italic', marginBottom: '16px' }}>
                  {activeService.subtitle}
                </p>
                <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: '24px' }}>
                  {activeService.overview}
                </p>

                <Link to="/book?service=laundry&step=4" className="btn-primary">
                  {activeService.ctaText} <ArrowRight size={18} />
                </Link>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#03252A', marginBottom: '16px' }}>
                  What's Included:
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '24px' }}>
                  {activeService.included.map((inc, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
                      <CheckCircle2 size={16} style={{ color: '#9BC83B', flexShrink: 0 }} />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .laundry-spec-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
