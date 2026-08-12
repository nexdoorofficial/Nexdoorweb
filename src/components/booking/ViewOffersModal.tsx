import React from 'react';
import { createPortal } from 'react-dom';
import { Tag, X, AlertCircle } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';

interface ViewOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoupon: (code: string) => void;
  serviceId: string;
  orderTotal: number;
  customerPhone?: string;
  activeAppliedCode?: string;
}

export const ViewOffersModal: React.FC<ViewOffersModalProps> = ({
  isOpen,
  onClose,
  onSelectCoupon,
  serviceId,
  orderTotal,
  customerPhone,
  activeAppliedCode
}) => {
  const { coupons, validateCoupon } = useAdminData();

  if (!isOpen) return null;

  const activeCoupons = coupons.filter((c) => c.status === 'active');

  return createPortal(
    <div
      data-lenis-prevent="true"
      data-lenis-prevent-touch="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999999,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div
        data-lenis-prevent="true"
        data-lenis-prevent-touch="true"
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #1C2677 0%, #0F172A 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #29C3BE, #1C2677)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Tag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Available Coupons & Offers 🏷️
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: '2px 0 0 0' }}>
                Select an offer to apply instant savings on your invoice
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div
          data-lenis-prevent="true"
          data-lenis-prevent-touch="true"
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            flex: 1,
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y'
          }}
        >
          {activeCoupons.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeCoupons.map((coupon) => {
                const validation = validateCoupon(coupon.code, serviceId, orderTotal, customerPhone);
                const isSelected = activeAppliedCode?.toUpperCase() === coupon.code.toUpperCase();

                return (
                  <div
                    key={coupon.id}
                    style={{
                      padding: '16px 18px',
                      borderRadius: '18px',
                      border: `1.5px solid ${isSelected ? '#29C3BE' : validation.valid ? '#CBD5E1' : '#F1F5F9'}`,
                      background: isSelected
                        ? '#F0FDFA'
                        : validation.valid
                        ? '#FFFFFF'
                        : '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {/* Badge & Code */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            background: '#1C2677',
                            color: '#FFFFFF',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontWeight: 900,
                            fontSize: '0.85rem',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {coupon.code}
                        </span>

                        {validation.valid ? (
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', background: '#DCFCE7', padding: '3px 8px', borderRadius: '12px' }}>
                            ✨ Save ₹{validation.discountAmount}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '3px 8px', borderRadius: '12px' }}>
                            ⚠️ {validation.message.split('.')[0]}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                        {coupon.title}
                      </div>

                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 8px 0', lineHeight: 1.4 }}>
                        {coupon.description}
                      </p>

                      {/* Expiry & Constraints info */}
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.72rem', color: '#475569' }}>
                        <span>💰 Min order: <strong>₹{coupon.minOrderAmount}</strong></span>
                        <span>
                          📅 Expiry:{' '}
                          <strong style={{ color: coupon.expiryDate ? '#B45309' : '#059669' }}>
                            {coupon.expiryDate ? coupon.expiryDate : 'Never Expires'}
                          </strong>
                        </span>
                        {coupon.oncePerCustomerPhone && (
                          <span style={{ color: '#1E40AF', fontWeight: 700 }}>
                            📱 1 Use Per Mobile
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      type="button"
                      disabled={!validation.valid && !isSelected}
                      onClick={() => {
                        if (isSelected) {
                          onSelectCoupon('');
                        } else if (validation.valid) {
                          onSelectCoupon(coupon.code);
                          onClose();
                        }
                      }}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: isSelected
                          ? '#059669'
                          : validation.valid
                          ? 'linear-gradient(135deg, #1C2677, #29C3BE)'
                          : '#E2E8F0',
                        color: isSelected || validation.valid ? '#FFFFFF' : '#94A3B8',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: validation.valid || isSelected ? 'pointer' : 'not-allowed',
                        whiteSpace: 'nowrap',
                        boxShadow: validation.valid ? '0 4px 12px rgba(41, 195, 190, 0.2)' : 'none'
                      }}
                    >
                      {isSelected ? 'Applied ✓' : validation.valid ? 'Apply Offer' : 'Ineligible'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
              <AlertCircle size={36} style={{ color: '#94A3B8', marginBottom: '8px' }} />
              <p style={{ margin: 0, fontWeight: 700 }}>No promotional offers available right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
