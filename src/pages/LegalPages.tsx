import React from 'react';
import { ShieldCheck, FileText, RefreshCw, XCircle } from 'lucide-react';
import { REFUNDABLE_DEPOSIT_NOTICE } from '../data/pricing';

export const PrivacyPolicyPage: React.FC = () => (
  <div className="section-padding">
    <div className="container" style={{ maxWidth: '800px' }}>
      <span className="badge-tag"><ShieldCheck size={14} /> LEGAL & SAFETY</span>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#03252A', marginTop: '8px', marginBottom: '24px' }}>
        Privacy Policy
      </h1>
      <div className="glass-card" style={{ padding: '36px', lineHeight: 1.8, color: '#334155' }}>
        <p><strong>Last Updated: August 1, 2026</strong></p>
        <p>At NEXDOOR Cleaning Solutions ("NEXDOOR", "we", "us"), we prioritize customer data confidentiality and security. This Privacy Policy outlines how your personal information is collected, used, and protected during service scheduling.</p>

        <h3 style={{ color: '#03252A', marginTop: '20px' }}>1. Information We Collect</h3>
        <p>We collect essential customer contact details including full name, phone number, physical address, and service preferences strictly to dispatch technician teams and calculate accurate invoice estimates.</p>

        <h3 style={{ color: '#03252A', marginTop: '20px' }}>2. Data Security & Storage</h3>
        <p>Customer data is never sold, leased, or rented to third-party telemarketers. All stored information is protected with industry-standard encryption protocols.</p>
      </div>
    </div>
  </div>
);

export const TermsConditionsPage: React.FC = () => (
  <div className="section-padding">
    <div className="container" style={{ maxWidth: '800px' }}>
      <span className="badge-tag"><FileText size={14} /> SERVICE AGREEMENT</span>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#03252A', marginTop: '8px', marginBottom: '24px' }}>
        Terms & Conditions
      </h1>
      <div className="glass-card" style={{ padding: '36px', lineHeight: 1.8, color: '#334155' }}>
        <p><strong>Last Updated: August 1, 2026</strong></p>
        <p>Welcome to NEXDOOR Cleaning Solutions. By accessing or using our platform, you agree to comply with the following service terms:</p>

        <h3 style={{ color: '#03252A', marginTop: '20px' }}>1. Service Scope & Inspection</h3>
        <p>All house cleaning, car detailing, and laundry orders are executed based on the scope selected during online booking. Customers are requested to perform a walkthrough inspection before technician departure.</p>

        <h3 style={{ color: '#03252A', marginTop: '20px' }}>2. Customer Property Preparation</h3>
        <p>Customers must secure high-value personal jewelry, sensitive cash, and fragile crystal glassware prior to team arrival.</p>
      </div>
    </div>
  </div>
);

export const RefundPolicyPage: React.FC = () => (
  <div className="section-padding">
    <div className="container" style={{ maxWidth: '800px' }}>
      <span className="badge-tag"><RefreshCw size={14} /> DEPOSIT PROTECTION</span>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#03252A', marginTop: '8px', marginBottom: '24px' }}>
        Refund Policy
      </h1>
      <div className="glass-card" style={{ padding: '36px', lineHeight: 1.8, color: '#334155' }}>
        <p><strong>Last Updated: August 1, 2026</strong></p>
        <div style={{ background: 'rgba(0, 122, 135, 0.08)', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #007A87', fontWeight: 600, color: '#03252A' }}>
          🛡️ {REFUNDABLE_DEPOSIT_NOTICE}
        </div>

        <h3 style={{ color: '#03252A', marginTop: '20px' }}>1. Booking Deposit Refundability</h3>
        <p>The ₹299 online booking deposit paid during slot reservation is 100% fully refundable if the service is cancelled at least 4 hours before the arrival window, or automatically deducted from your final invoice amount.</p>

        <h3 style={{ color: '#03252A', marginTop: '20px' }}>2. Quality Satisfaction Guarantee</h3>
        <p>If you are unsatisfied with any cleaned section, NEXDOOR offers a free priority re-clean within 24 hours of service completion.</p>
      </div>
    </div>
  </div>
);

export const CancellationPolicyPage: React.FC = () => (
  <div className="section-padding">
    <div className="container" style={{ maxWidth: '800px' }}>
      <span className="badge-tag"><XCircle size={14} /> FLEXIBLE CANCELLATION</span>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#03252A', marginTop: '8px', marginBottom: '24px' }}>
        Cancellation Policy
      </h1>
      <div className="glass-card" style={{ padding: '36px', lineHeight: 1.8, color: '#334155' }}>
        <p><strong>Last Updated: August 1, 2026</strong></p>
        <p>We understand plans change. NEXDOOR offers maximum flexibility for rescheduling or cancelling your booked cleaning slots.</p>

        <h3 style={{ color: '#03252A', marginTop: '20px' }}>1. Free Cancellation Window</h3>
        <p>You may cancel or reschedule your booking free of cost up to 4 hours prior to your scheduled time slot.</p>

        <h3 style={{ color: '#03252A', marginTop: '20px' }}>2. Late Cancellation</h3>
        <p>Cancellations made within 2 hours of arrival may incur a nominal ₹150 technician travel compensation fee.</p>
      </div>
    </div>
  </div>
);
