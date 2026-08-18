import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { REFUNDABLE_DEPOSIT_NOTICE } from '../../data/pricing';

interface Props {
  variant?: 'compact' | 'full';
}

export const RefundableBanner: React.FC<Props> = ({ variant = 'full' }) => {
  if (variant === 'compact') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0, 122, 135, 0.08)',
        border: '1px solid rgba(0, 122, 135, 0.25)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '0.85rem',
        color: '#03252A',
        fontWeight: 500
      }}>
        <ShieldCheck size={18} style={{ color: '#007A87', flexShrink: 0 }} />
        <span>{REFUNDABLE_DEPOSIT_NOTICE}</span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(3, 37, 42, 0.04) 0%, rgba(0, 122, 135, 0.08) 100%)',
      border: '1px solid rgba(0, 122, 135, 0.3)',
      borderRadius: '16px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      boxShadow: '0 4px 12px rgba(0, 122, 135, 0.05)'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: '#007A87',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 122, 135, 0.35)'
      }}>
        <ShieldCheck size={20} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#03252A', margin: 0 }}>
            100% Risk-Free Refundable Deposit
          </h4>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            background: '#9BC83B',
            color: '#03252A',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            GUARANTEED
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
          {REFUNDABLE_DEPOSIT_NOTICE}
        </p>
      </div>
    </div>
  );
};
