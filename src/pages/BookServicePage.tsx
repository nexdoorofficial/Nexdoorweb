import React from 'react';
import { BookingWizard } from '../components/booking/BookingWizard';

export const BookServicePage: React.FC = () => {
  return (
    <div style={{ padding: '48px 0 96px 0', background: 'radial-gradient(100% 100% at 50% 0%, rgba(0, 122, 135, 0.08) 0%, rgba(248, 250, 252, 0) 100%)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px auto' }}>
          <span className="badge-tag">ONLINE BOOKING SYSTEM</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#03252A', marginTop: '8px' }}>
            Book Your Service Online
          </h1>
          <p className="hide-mobile" style={{ color: '#64748B', fontSize: '1rem' }}>
            Configure your cleaning scope, pick arrival date & time slot, and confirm with refundable deposit.
          </p>
        </div>

        <BookingWizard />
      </div>
    </div>
  );
};
