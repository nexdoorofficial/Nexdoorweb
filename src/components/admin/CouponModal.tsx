import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Check } from 'lucide-react';
import type { Coupon } from '../../types/admin';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: Omit<Coupon, 'id' | 'usageCount' | 'createdAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Coupon>) => void;
  editingCoupon?: Coupon | null;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingCoupon
}) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<string>('300');
  const [minOrderAmount, setMinOrderAmount] = useState<number>(499);
  const [applicableServices, setApplicableServices] = useState<'all' | 'house-cleaning' | 'car-wash' | 'laundry'>('all');
  
  // Optional expiry date state
  const [hasExpiry, setHasExpiry] = useState<boolean>(true);
  const [expiryDate, setExpiryDate] = useState<string>('2026-12-31');

  // Optional 1 use per mobile phone state
  const [oncePerCustomerPhone, setOncePerCustomerPhone] = useState<boolean>(true);

  const [usageLimit, setUsageLimit] = useState<string>('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    if (editingCoupon) {
      setCode(editingCoupon.code);
      setTitle(editingCoupon.title);
      setDescription(editingCoupon.description);
      setDiscountType(editingCoupon.discountType);
      setDiscountValue(editingCoupon.discountValue);
      setMaxDiscountAmount(editingCoupon.maxDiscountAmount ? String(editingCoupon.maxDiscountAmount) : '');
      setMinOrderAmount(editingCoupon.minOrderAmount || 0);
      setApplicableServices(editingCoupon.applicableServices || 'all');
      
      if (editingCoupon.expiryDate && editingCoupon.expiryDate.trim()) {
        setHasExpiry(true);
        setExpiryDate(editingCoupon.expiryDate);
      } else {
        setHasExpiry(false);
        setExpiryDate('');
      }

      setOncePerCustomerPhone(!!editingCoupon.oncePerCustomerPhone);
      setUsageLimit(editingCoupon.usageLimit ? String(editingCoupon.usageLimit) : '');
      setStatus(editingCoupon.status);
    } else {
      setCode('');
      setTitle('');
      setDescription('');
      setDiscountType('percentage');
      setDiscountValue(20);
      setMaxDiscountAmount('300');
      setMinOrderAmount(499);
      setApplicableServices('all');
      setHasExpiry(false);
      setExpiryDate('');
      setOncePerCustomerPhone(true);
      setUsageLimit('');
      setStatus('active');
    }
  }, [editingCoupon, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim() || discountValue <= 0) {
      alert('Please fill out code, title, and valid discount value.');
      return;
    }

    const payload: Omit<Coupon, 'id' | 'usageCount' | 'createdAt'> = {
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      maxDiscountAmount: discountType === 'percentage' && maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      minOrderAmount: Number(minOrderAmount) || 0,
      applicableServices,
      expiryDate: hasExpiry && expiryDate ? expiryDate : '',
      oncePerCustomerPhone,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      status
    };

    if (editingCoupon && onUpdate) {
      onUpdate(editingCoupon.id, payload);
    } else {
      onSave(payload);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          overflowY: 'auto'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '580px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              background: 'linear-gradient(135deg, #03252A 0%, #004D56 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(0, 122, 135, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0, 122, 135, 0.4)'
                }}
              >
                <Tag size={22} style={{ color: '#9BC83B' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  {editingCoupon ? 'Edit Coupon Code' : 'Create Promo Code'}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                  Configure discounts, limits, and service applicability
                </span>
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

          {/* Form */}
          <form
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}
          >
            
            {/* Row 1: Code & Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WELCOME20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: '#007A87',
                    letterSpacing: '0.05em'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% Off Welcome Offer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Offer Description / Subtext
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Get 20% discount up to ₹300 on your first booking with NEXDOOR!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Row 2: Discount Type & Value */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Discount Type *
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    fontWeight: 700
                  }}
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Amount Discount (Flat ₹)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  {discountType === 'percentage' ? 'Discount Percentage (%) *' : 'Flat Discount Amount (₹) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontWeight: 800
                  }}
                />
              </div>
            </div>

            {/* Row 3: Max Discount & Min Order */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {discountType === 'percentage' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 300 (Optional)"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Leave blank for no upper cap</span>
                </div>
              )}

              <div style={{ gridColumn: discountType === 'fixed' ? 'span 2' : 'auto' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Minimum Order Amount (₹) *
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 499"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            {/* Applicable Services */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Applicable Service Category *
              </label>
              <select
                value={applicableServices}
                onChange={(e) => setApplicableServices(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem'
                }}
              >
                <option value="all">All Services (Universal)</option>
                <option value="house-cleaning">House Cleaning Only</option>
                <option value="car-wash">Car Wash & Detailing Only</option>
                <option value="laundry">Laundry & Garment Care Only</option>
              </select>
            </div>

            {/* OPTION 1: Optional Expiry Date */}
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: hasExpiry ? '10px' : 0 }}>
                <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasExpiry}
                    onChange={(e) => {
                      setHasExpiry(e.target.checked);
                      if (!e.target.checked) setExpiryDate('');
                      else if (!expiryDate) setExpiryDate('2026-12-31');
                    }}
                    style={{ width: '16px', height: '16px', accentColor: '#007A87', cursor: 'pointer' }}
                  />
                  Set Expiry Date for this Coupon
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: hasExpiry ? '#B45309' : '#059669' }}>
                  {hasExpiry ? 'Expires on Date' : '✨ Never Expires (Perpetual)'}
                </span>
              </div>

              {hasExpiry && (
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem'
                  }}
                />
              )}
            </div>

            {/* OPTION 2: Optional Single Use Per Mobile Number */}
            <div style={{ background: '#EFF6FF', padding: '14px', borderRadius: '12px', border: '1px solid #BFDBFE', marginBottom: '20px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={oncePerCustomerPhone}
                  onChange={(e) => setOncePerCustomerPhone(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#1E40AF', cursor: 'pointer' }}
                />
                Limit 1 Redemption Per Customer Mobile Number
              </label>
              <div style={{ fontSize: '0.75rem', color: '#3B82F6', marginTop: '4px', paddingLeft: '24px' }}>
                When enabled, the system verifies customer phone numbers during checkout to prevent duplicate redemptions.
              </div>
            </div>

            {/* Usage Limit & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Total Redemptions Limit
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500 (Optional)"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Coupon Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: status === 'active' ? '#059669' : '#DC2626'
                  }}
                >
                  <option value="active">Active (Visible to users)</option>
                  <option value="inactive">Inactive (Disabled)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #007A87, #0093A2)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 122, 135, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Check size={18} /> {editingCoupon ? 'Update Coupon' : 'Save Coupon'}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
