import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { CouponModal } from '../../components/admin/CouponModal';
import type { Coupon } from '../../types/admin';

export const AdminCoupons: React.FC = () => {
  const { coupons, bookings, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'percentage' | 'fixed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Stats calculation dynamically driven by live database bookings and usage counters
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.status === 'active').length;
  const totalRedemptions = coupons.reduce((sum, c) => {
    const actual = (bookings || []).filter((b) => b.notes && b.notes.toUpperCase().includes(c.code.toUpperCase())).length;
    return sum + Math.max(c.usageCount || 0, actual);
  }, 0);

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'active') return c.status === 'active';
    if (filterType === 'percentage') return c.discountType === 'percentage';
    if (filterType === 'fixed') return c.discountType === 'fixed';

    return true;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Coupon & Promotional Offers Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            Manage discount codes, percentage rates, service restrictions, and phone redemption rules
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCoupon(null);
            setIsModalOpen(true);
          }}
          style={{
            padding: '12px 20px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(41, 195, 190, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} /> Create New Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Coupons</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{totalCoupons}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>Configured in catalog</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Active Offers</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669' }}>{activeCoupons}</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px' }}>Ready for checkout redemption</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Redeemed</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{totalRedemptions}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>Customer bookings discount uses</div>
        </div>
      </div>

      {/* Controls Bar: Search & Filter */}
      <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '18px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '8px 14px', minWidth: '280px' }}>
          <Search size={16} color="#64748B" />
          <input
            type="text"
            placeholder="Search code or offer title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Coupons' },
            { id: 'active', label: 'Active Only' },
            { id: 'percentage', label: '% Percentage' },
            { id: 'fixed', label: 'Flat ₹ Amount' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: filterType === f.id ? 'none' : '1px solid #E2E8F0',
                background: filterType === f.id ? '#1C2677' : '#F8FAFC',
                color: filterType === f.id ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredCoupons.map((coupon) => {
          const isPercentage = coupon.discountType === 'percentage';
          const isExpired = coupon.expiryDate && new Date().toISOString().split('T')[0] > coupon.expiryDate;
          const actualRedemptions = (bookings || []).filter((b) => {
            const cleanCode = coupon.code.toUpperCase();
            return b.notes && b.notes.toUpperCase().includes(cleanCode);
          }).length;
          const displayRedemptions = Math.max(coupon.usageCount || 0, actualRedemptions);

          return (
            <div
              key={coupon.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: `1.5px solid ${coupon.status === 'active' ? (isExpired ? '#FCA5A5' : '#CBD5E1') : '#E2E8F0'}`,
                padding: '20px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                opacity: coupon.status === 'active' ? 1 : 0.75
              }}
            >
              <div>
                {/* Header Row: Code & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                      color: '#FFFFFF',
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontWeight: 900,
                      fontSize: '1rem',
                      letterSpacing: '0.05em',
                      boxShadow: '0 2px 8px rgba(41, 195, 190, 0.25)'
                    }}
                  >
                    {coupon.code}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      onClick={() => toggleCouponStatus(coupon.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        background: coupon.status === 'active' ? (isExpired ? '#FEE2E2' : '#DCFCE7') : '#F1F5F9',
                        color: coupon.status === 'active' ? (isExpired ? '#DC2626' : '#15803D') : '#64748B'
                      }}
                    >
                      {coupon.status === 'active' ? (isExpired ? 'Expired' : 'Active') : 'Inactive'}
                    </span>

                    <button
                      onClick={() => {
                        setEditingCoupon(coupon);
                        setIsModalOpen(true);
                      }}
                      style={{ background: '#F1F5F9', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#1E293B' }}
                      title="Edit Coupon"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete coupon ${coupon.code}?`)) {
                          deleteCoupon(coupon.id);
                        }
                      }}
                      style={{ background: '#FEE2E2', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#DC2626' }}
                      title="Delete Coupon"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Title & Discount Value Highlight */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1C2677', marginBottom: '2px' }}>
                    {isPercentage ? `${coupon.discountValue}% OFF` : `Flat ₹${coupon.discountValue} OFF`}
                    {isPercentage && coupon.maxDiscountAmount && (
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginLeft: '6px' }}>
                        (Up to ₹{coupon.maxDiscountAmount})
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px 0' }}>
                    {coupon.title}
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                    {coupon.description}
                  </p>
                </div>

                {/* Constraint Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📍 <strong>Service Scope:</strong></span>
                    <span style={{ textTransform: 'capitalize', fontWeight: 700, color: '#1C2677' }}>
                      {coupon.applicableServices === 'all' ? 'All Services' : coupon.applicableServices.replace('-', ' ')}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>💰 <strong>Min Order Amount:</strong></span>
                    <span style={{ fontWeight: 700 }}>₹{coupon.minOrderAmount}</span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={12} color="#64748B" />
                    <span><strong>Expiry:</strong></span>
                    <span style={{ fontWeight: 700, color: coupon.expiryDate ? '#B45309' : '#059669' }}>
                      {coupon.expiryDate ? coupon.expiryDate : '✨ Never Expires'}
                    </span>
                  </div>

                  {coupon.oncePerCustomerPhone && (
                    <div style={{ fontSize: '0.72rem', color: '#1E40AF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Smartphone size={12} /> Valid 1 time per customer mobile number
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Usage */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px', fontSize: '0.75rem', color: '#64748B' }}>
                <span>Redeemed: <strong>{displayRedemptions} {displayRedemptions === 1 ? 'time' : 'times'}</strong></span>
                {coupon.usageLimit ? <span>Limit: {coupon.usageLimit} max</span> : <span>Unlimited uses</span>}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCoupons.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', marginTop: '20px' }}>
          <Tag size={40} style={{ color: '#94A3B8', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>No Coupons Found</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Try searching for a different code or create a new promotional coupon.
          </p>
        </div>
      )}

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addCoupon}
        onUpdate={updateCoupon}
        editingCoupon={editingCoupon}
      />
    </div>
  );
};
