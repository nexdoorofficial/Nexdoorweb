import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, CheckCircle2, Send, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAdminData } from '../context/AdminContext';

export const ContactPage: React.FC = () => {
  const adminData = useAdminData();
  const [submitted, setSubmitted] = useState(false);
  const [inquiryRefId, setInquiryRefId] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: 'House Cleaning', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 80, spread: 60 });

    if (adminData && adminData.addInquiry) {
      try {
        const created = adminData.addInquiry({
          name: formData.name || 'Valued Customer',
          phone: formData.phone || '',
          email: formData.email || '',
          serviceInterest: formData.subject || 'General Inquiry',
          message: formData.message || ''
        });
        setInquiryRefId(created.referenceId);
      } catch (err) {
        console.error('Failed to submit inquiry', err);
      }
    }

    setSubmitted(true);
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px auto' }}>
          <span className="badge-tag"><MessageSquare size={14} /> GET IN TOUCH</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
            We're Here to Help
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '8px' }}>
            Have questions about specialized villa cleaning, enterprise corporate SLAs, or booking adjustments? Drop us a message or call our helpline.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px' }} className="contact-grid">
          {/* Left Column: Direct Info & Hub Locations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C2677', marginBottom: '20px' }}>
                Instant Support & Helpline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(41, 195, 190, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#29C3BE' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Customer Care Phone</div>
                    <strong style={{ color: '#1C2677' }}>{adminData?.siteSettings?.supportPhone || '+91 98765 43210'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(28, 38, 119, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C2677' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Email Inquiry</div>
                    <strong style={{ color: '#1C2677' }}>{adminData?.siteSettings?.supportEmail || 'support@nexdoorclean.com'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Operations Hours</div>
                    <strong style={{ color: '#1C2677' }}>{adminData?.siteSettings?.operatingHours || 'Monday - Sunday: 07:00 AM - 09:00 PM'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Hubs */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C2677', marginBottom: '16px' }}>
                Kochi Operations Hubs:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#475569' }}>
                {adminData?.locations && adminData.locations.filter(l => l.status === 'active').length > 0 ? (
                  adminData.locations.filter(l => l.status === 'active').map((loc) => (
                    <li key={loc.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <MapPin size={18} style={{ color: '#29C3BE', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: '#1C2677', display: 'block' }}>{loc.name} Hub</strong>
                        <span>{loc.description || `${loc.zone}, Kochi, ${loc.pincode}`}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <MapPin size={18} style={{ color: '#29C3BE', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: '#1C2677', display: 'block' }}>Kakkanad HQ Hub</strong>
                        <span>SmartCity Expressway, Kakkanad, Kochi, 682030</span>
                      </div>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <MapPin size={18} style={{ color: '#29C3BE', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: '#1C2677', display: 'block' }}>Edappally Service Fleet</strong>
                        <span>Near Lulu Bypass Junction, Edappally, Kochi, 682024</span>
                      </div>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <MapPin size={18} style={{ color: '#29C3BE', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: '#1C2677', display: 'block' }}>Kalamassery Unit</strong>
                        <span>Container Rd Belt, Kalamassery, Kochi, 683104</span>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="glass-card" style={{ padding: '40px', borderRadius: '24px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={48} style={{ color: '#10B981', margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C2677' }}>Inquiry Submitted!</h3>
                {inquiryRefId && (
                  <div style={{ background: '#EEF2FF', padding: '8px 16px', borderRadius: '12px', display: 'inline-block', margin: '12px 0', color: '#1C2677', fontWeight: 800, fontSize: '0.9rem' }}>
                    Reference ID: {inquiryRefId}
                  </div>
                )}
                <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '8px' }}>
                  Thank you for reaching out. Your inquiry has been sent directly to our operations panel. We will respond within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', subject: 'House Cleaning', message: '' });
                  }}
                  className="btn-primary"
                  style={{ marginTop: '24px' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                  Send an Instant Inquiry
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '24px' }}>
                  Fill out the details below and we will respond promptly.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Your Name *</label>
                    <input required type="text" placeholder="e.g. Rahul Nair" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                      <input required type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Email Address</label>
                      <input type="email" placeholder="rahul@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Service Interest</label>
                    <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFF' }}>
                      <option value="House Cleaning">House Cleaning (1 BHK to Villa)</option>
                      <option value="Car Wash">Car Wash & Detailing</option>
                      <option value="Laundry">Laundry Services</option>
                      <option value="Corporate SLA">Corporate / Office Cleaning SLA</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Your Message / Requirements *</label>
                    <textarea required rows={4} placeholder="Describe your property size, specific cleaning needs, or preferred date..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontFamily: 'inherit' }} />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                  Send Message <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
