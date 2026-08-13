import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home as HomeIcon,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { HousePricingCalculator } from '../components/pricing/HousePricingCalculator';
import { FEATURED_HOUSE_SERVICES } from '../data/services';
import { RefundableBanner } from '../components/common/RefundableBanner';

export const HouseCleaningPage: React.FC = () => {
  const [activeFeaturedId, setActiveFeaturedId] = useState<string>(FEATURED_HOUSE_SERVICES[0].id);

  const activeFeatured = FEATURED_HOUSE_SERVICES.find((s) => s.id === activeFeaturedId) || FEATURED_HOUSE_SERVICES[0];

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(180deg, rgba(41, 195, 190, 0.12) 0%, rgba(248, 250, 252, 0) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '750px' }}>
            <span className="badge-tag"><HomeIcon size={14} /> SERVICE 01</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1C2677', marginTop: '12px', marginBottom: '16px' }}>
              Professional House Cleaning Solutions
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
              From 1 BHK compact apartments to multi-story estate villas. Choose between Standard general deep cleaning and Premium ultra machine buffing & steam protocols.
            </p>
            <RefundableBanner variant="compact" />
          </div>
        </div>
      </section>

      {/* Interactive Size Category Pricing Section */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1C2677' }}>
              House Category Pricing & Plans
            </h2>
            <p style={{ color: '#64748B' }}>
              Price updates automatically based on house size and plan tier.
            </p>
          </div>

          <HousePricingCalculator />
        </div>
      </section>

      {/* THREE FEATURED SERVICES SHOWCASE */}
      <section id="featured" className="section-padding" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px auto' }}>
            <span className="badge-secondary">FEATURED DEEP SERVICES</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
              Specialized Deep Cleaning Solutions
            </h2>
            <p style={{ color: '#64748B' }}>
              Deep dive into our 3 most requested high-precision home cleaning programs.
            </p>
          </div>

          {/* Service Selector Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
            {FEATURED_HOUSE_SERVICES.map((feat) => (
              <button
                key={feat.id}
                onClick={() => setActiveFeaturedId(feat.id)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: activeFeaturedId === feat.id ? '#1C2677' : '#FFFFFF',
                  color: activeFeaturedId === feat.id ? '#FFFFFF' : '#475569',
                  border: '1px solid #E2E8F0',
                  boxShadow: activeFeaturedId === feat.id ? '0 6px 20px rgba(28, 38, 119, 0.2)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {feat.title}
              </button>
            ))}
          </div>

          {/* Active Featured Service Card */}
          <div className="glass-card" style={{ padding: '40px', borderRadius: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }} className="featured-grid">
              <div>
                <span className="badge-tag">Starting from {activeFeatured.startingPrice}</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C2677', marginTop: '12px', marginBottom: '8px' }}>
                  {activeFeatured.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748B', fontStyle: 'italic', marginBottom: '16px' }}>
                  {activeFeatured.subtitle}
                </p>
                <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: '24px' }}>
                  {activeFeatured.overview}
                </p>

                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C2677', marginBottom: '6px' }}>Recommended For:</div>
                  <div style={{ fontSize: '0.875rem', color: '#475569' }}>{activeFeatured.recommendedFor}</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1C2677', textTransform: 'uppercase', marginBottom: '12px' }}>
                    What's Included:
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                    {activeFeatured.included.map((inc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
                        <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/book?service=house-cleaning&step=4" className="btn-primary">
                  {activeFeatured.ctaText} <ArrowRight size={18} />
                </Link>
              </div>

              {/* Gallery & FAQ Column */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C2677', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={18} style={{ color: '#29C3BE' }} /> Demo Gallery & Results
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  {activeFeatured.gallery.map((img, i) => (
                    <img key={i} src={img} alt="Service demo" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '14px' }} />
                  ))}
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C2677', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={18} style={{ color: '#29C3BE' }} /> Service FAQ
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeFeatured.faq.map((f, i) => (
                    <div key={i} style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem' }}>
                      <strong style={{ color: '#1C2677', display: 'block', marginBottom: '4px' }}>Q: {f.question}</strong>
                      <span style={{ color: '#475569' }}>{f.answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .featured-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
