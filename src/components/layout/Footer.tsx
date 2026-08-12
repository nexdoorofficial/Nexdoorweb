import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Heart,
  PackageCheck
} from 'lucide-react';
import { REFUNDABLE_DEPOSIT_NOTICE } from '../../data/pricing';
import { TrackBookingModal } from '../common/TrackBookingModal';
import { useAdminData } from '../../context/AdminContext';

export const Footer: React.FC = () => {
  const adminData = useAdminData();
  const [isTrackModalOpen, setIsTrackModalOpen] = React.useState(false);

  const servicesList = adminData?.services ? adminData.services.filter((s) => s.status === 'active') : [];
  const locationsList = adminData?.locations ? adminData.locations : [];
  const activeLocations = locationsList.filter((l) => l.status === 'active');
  const comingSoonLocations = locationsList.filter((l) => l.status === 'coming_soon' || l.status !== 'active');
  const activeLocationNames = activeLocations.map((l) => l.name);
  return (
    <footer style={{ background: '#1C2677', color: '#FFFFFF', paddingTop: '80px', paddingBottom: '32px' }}>
      <div className="container">
        {/* Top Guarantee Strip */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '64px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#29C3BE',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(41, 195, 190, 0.4)'
            }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                NEXDOOR Booking Protection
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: 0, marginTop: '2px' }}>
                {REFUNDABLE_DEPOSIT_NOTICE}
              </p>
            </div>
          </div>
          <Link to="/book" className="btn-primary" style={{ textDecoration: 'none' }}>
            Book Service Online <ArrowRight size={18} />
          </Link>
        </div>

        {/* 4-Column Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '64px'
        }}>
          {/* Column 1: Brand & Contact Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#29C3BE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={22} style={{ color: '#FFFFFF' }} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                  NEXDOOR
                </span>
                <div style={{ fontSize: '0.6rem', color: '#29C3BE', fontWeight: 700, letterSpacing: '0.1em' }}>
                  CLEANING SOLUTIONS
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
              Enterprise-grade doorstep home cleaning, mobile car wash detailing, and weight-based laundry solutions engineered with SaaS precision.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: '#29C3BE' }} /> {adminData?.siteSettings?.supportPhone || '+91 98765 43210'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: '#29C3BE' }} /> {adminData?.siteSettings?.supportEmail || 'support@nexdoorclean.com'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} style={{ color: '#29C3BE' }} />{' '}
                {activeLocationNames.length > 0
                  ? activeLocationNames.join(', ') + ', Kochi'
                  : 'Kakkanad, Edappally & Kalamassery, Kochi'}
              </div>
            </div>
          </div>

          {/* Column 2: Main Services (Dynamic) */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              Our Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#CBD5E1' }}>
              {servicesList.length > 0 ? (
                servicesList.map((service) => {
                  const isHouse = service.category === 'house-cleaning';
                  const isCar = service.category === 'car-wash';
                  const isLaundry = service.category === 'laundry';

                  const targetPath = isHouse
                    ? '/services/house-cleaning'
                    : isCar
                    ? '/services/car-wash'
                    : isLaundry
                    ? '/services/laundry'
                    : `/book?service=${service.id}`;

                  return (
                    <li key={service.id}>
                      <Link to={targetPath} style={{ transition: 'color 0.2s' }} className="footer-link">
                        {service.title}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <>
                  <li><Link to="/services/house-cleaning" className="footer-link">House Cleaning (1 BHK to Villa)</Link></li>
                  <li><Link to="/services/car-wash" className="footer-link">Mobile Car Wash & Detailing</Link></li>
                  <li><Link to="/services/laundry" className="footer-link">Laundry (Weight-based)</Link></li>
                </>
              )}
              <li>
                <Link to="/pricing" style={{ transition: 'color 0.2s', fontWeight: 700, color: '#29C3BE' }} className="footer-link">
                  Interactive Pricing Calculator →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Service Areas (Dynamic) */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              Service Areas
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#CBD5E1' }}>
              {activeLocations.length > 0 ? (
                activeLocations.map((loc) => (
                  <li key={loc.id}>
                    <span style={{ color: '#29C3BE', fontWeight: 600 }}>● {loc.name}</span>{' '}
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>({loc.zone || loc.description || `Pincode: ${loc.pincode}`})</span>
                  </li>
                ))
              ) : (
                <>
                  <li><span style={{ color: '#29C3BE', fontWeight: 600 }}>● Kakkanad</span> (SmartCity & Infopark)</li>
                  <li><span style={{ color: '#29C3BE', fontWeight: 600 }}>● Edappally</span> (Lulu Mall & Bypass)</li>
                  <li><span style={{ color: '#29C3BE', fontWeight: 600 }}>● Kalamassery</span> (CUSAT & KINFRA)</li>
                </>
              )}

              {comingSoonLocations.length > 0 && (
                <li style={{ marginTop: '8px', fontSize: '0.8rem', color: '#94A3B8' }}>
                  <em>Coming Soon: {comingSoonLocations.map((l) => l.name).join(', ')}</em>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Quick Links & Legal */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              Company & Policies
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#CBD5E1' }}>
              <li>
                <button
                  type="button"
                  onClick={() => setIsTrackModalOpen(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    color: '#29C3BE',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  className="footer-link"
                >
                  <PackageCheck size={14} /> Track Booking Status
                </button>
              </li>
              <li><Link to="/about" className="footer-link">About NEXDOOR</Link></li>
              <li><Link to="/careers" className="footer-link">Careers & Hiring</Link></li>
              <li><Link to="/faq" className="footer-link">Frequently Asked Questions</Link></li>
              <li><Link to="/blog" className="footer-link">Blog & Maintenance Guides</Link></li>
              <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="footer-link">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="footer-link">Refund Policy</Link></li>
              <li><Link to="/cancellation-policy" className="footer-link">Cancellation Policy</Link></li>
              <li style={{ marginTop: '4px' }}><Link to="/admin" className="footer-link" style={{ color: '#29C3BE', fontWeight: 700 }}>⚡ Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.85rem',
          color: '#94A3B8'
        }}>
          <div>
            © {new Date().getFullYear()} NEXDOOR Cleaning Solutions. All rights reserved. Built with modern technology.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Made with <Heart size={14} style={{ color: '#29C3BE', fill: '#29C3BE' }} /> for Pristine Homes & Cars.
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: #29C3BE !important;
          text-decoration: underline;
        }
      `}</style>
      <TrackBookingModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
    </footer>
  );
};
