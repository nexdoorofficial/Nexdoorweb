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
        background: 'rgba(41, 195, 190, 0.1)',
        border: '1px solid rgba(41, 195, 190, 0.3)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '0.85rem',
        color: '#1C2677',
        fontWeight: 500
      }}>
        <ShieldCheck size={18} style={{ color: '#29C3BE', flexShrink: 0 }} />
        <span>{REFUNDABLE_DEPOSIT_NOTICE}</span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(28, 38, 119, 0.04) 0%, rgba(41, 195, 190, 0.08) 100%)',
      border: '1px solid rgba(41, 195, 190, 0.35)',
      borderRadius: '16px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      boxShadow: '0 4px 12px rgba(41, 195, 190, 0.05)'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: '#29C3BE',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(41, 195, 190, 0.4)'
      }}>
        <ShieldCheck size={20} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1C2677', margin: 0 }}>
            100% Risk-Free Refundable Deposit
          </h4>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            background: '#10B981',
            color: '#FFFFFF',
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
