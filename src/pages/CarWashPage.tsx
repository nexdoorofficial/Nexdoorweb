import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { CarWashCalculator } from '../components/pricing/CarWashCalculator';
import { FEATURED_CAR_SERVICES } from '../data/services';
import { RefundableBanner } from '../components/common/RefundableBanner';

export const CarWashPage: React.FC = () => {
  const [activeCarServiceId, setActiveCarServiceId] = useState<string>(FEATURED_CAR_SERVICES[0].id);

  const activeService = FEATURED_CAR_SERVICES.find((s) => s.id === activeCarServiceId) || FEATURED_CAR_SERVICES[0];

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(180deg, rgba(28, 38, 119, 0.08) 0%, rgba(248, 250, 252, 0) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '750px' }}>
            <span className="badge-secondary"><Car size={14} /> SERVICE 02</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1C2677', marginTop: '12px', marginBottom: '16px' }}>
              Mobile Doorstep Car Wash & Detailing
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
              Professional vehicle spa brought to your basement or driveway. From quick pH-neutral foam washes to 3-stage orbital machine paint polishing and ceramic protection.
            </p>
            <RefundableBanner variant="compact" />
          </div>
        </div>
      </section>

      {/* Interactive Configurator */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1C2677' }}>
              Vehicle Pricing & Package Matrix
            </h2>
            <p style={{ color: '#64748B' }}>
              Select your vehicle category and package level to calculate doorstep quote.
            </p>
          </div>

          <CarWashCalculator />
        </div>
      </section>

      {/* THREE DETAILED CAR SERVICES */}
      <section className="section-padding" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px auto' }}>
            <span className="badge-tag">DETAILED SERVICES</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
              3 Signature Detailing Protocols
            </h2>
          </div>

          {/* Service Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
            {FEATURED_CAR_SERVICES.map((feat) => (
              <button
                key={feat.id}
                onClick={() => setActiveCarServiceId(feat.id)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: activeCarServiceId === feat.id ? '#29C3BE' : '#FFFFFF',
                  color: activeCarServiceId === feat.id ? '#FFFFFF' : '#475569',
                  border: '1px solid #E2E8F0',
                  boxShadow: activeCarServiceId === feat.id ? '0 6px 20px rgba(41, 195, 190, 0.3)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {feat.title}
              </button>
            ))}
          </div>

          {/* Detailed Service Card */}
          <div className="glass-card" style={{ padding: '40px', borderRadius: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }} className="car-detail-grid">
              <div>
                <span className="badge-secondary">From {activeService.startingPrice}</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C2677', marginTop: '12px', marginBottom: '8px' }}>
                  {activeService.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748B', fontStyle: 'italic', marginBottom: '16px' }}>
                  {activeService.subtitle}
                </p>
                <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: '24px' }}>
                  {activeService.overview}
                </p>

                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C2677', marginBottom: '6px' }}>Key Benefits:</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#475569' }}>
                    {activeService.benefits.map((b, i) => (
                      <li key={i}>• {b}</li>
                    ))}
                  </ul>
                </div>

                <Link to="/book" className="btn-primary">
                  {activeService.ctaText} <ArrowRight size={18} />
                </Link>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C2677', marginBottom: '16px' }}>
                  What's Included:
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '24px' }}>
                  {activeService.included.map((inc, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
                      <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C2677', marginBottom: '12px' }}>
                  Gallery & FAQs:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  {activeService.gallery.map((img, i) => (
                    <img key={i} src={img} alt="Car detailing" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .car-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
