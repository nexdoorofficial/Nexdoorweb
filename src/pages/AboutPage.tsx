import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/team';

export const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '80px 0', background: 'radial-gradient(100% 100% at 50% 0%, rgba(41, 195, 190, 0.12) 0%, rgba(248, 250, 252, 0) 100%)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <span className="badge-tag">ABOUT NEXDOOR</span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#1C2677', marginTop: '16px', marginBottom: '20px' }}>
            Reinventing Home & Auto Cleaning with Technology & Trust
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6 }}>
            NEXDOOR Cleaning Solutions was founded with a clear mandate: replace fragmented, unorganized local maid and car wash services with an enterprise-grade SaaS technology platform.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div className="glass-card" style={{ padding: '32px' }}>
              <ShieldCheck size={36} style={{ color: '#29C3BE', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                100% Verified Specialists
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every technician undergoes criminal background verification, medical health checks, and 80+ hours of rigorous industrial machinery training.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <Award size={36} style={{ color: '#1C2677', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                German Machinery & Eco-Chemicals
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                We deploy single-disc floor scrubbers, 140°C thermal steamers, and non-toxic bio-degradable chemical solutions safe for pets and children.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <Sparkles size={36} style={{ color: '#F59E0B', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                Refundable Deposit Guarantee
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Transparent pricing with full booking deposit protection. Adjust deposit against your final invoice with zero risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            <span className="badge-secondary">LEADERSHIP TEAM</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
              Meet the Minds Behind NEXDOOR
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <img src={member.image} alt={member.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C2677', marginBottom: '4px' }}>{member.name}</h4>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#29C3BE', marginBottom: '8px' }}>{member.role}</div>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>{member.bio}</p>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '12px' }}>
                  {member.experience}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
