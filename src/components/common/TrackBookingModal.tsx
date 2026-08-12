import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  X,
  PackageCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  UserCheck,
  PhoneCall,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { BookingRecord, BookingStatus } from '../../types/admin';

interface TrackBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackBookingModal: React.FC<TrackBookingModalProps> = ({ isOpen, onClose }) => {
  // Safe context retrieval
  let adminData: any = null;
  try {
    adminData = useAdminData();
  } catch (e) {
    // context fallback
  }

  const bookings: BookingRecord[] = adminData?.bookings || [];

  // ALL HOOKS AT THE VERY TOP (unconditional execution order)
  const [searchInput, setSearchInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setSearchInput('');
      setHasSearched(false);
      setSelectedBooking(null);
    }
  }, [isOpen]);

  // Clean phone string helper (removes +91, spaces, hyphens)
  const cleanPhone = (str: string) => (str ? str.replace(/[^0-9]/g, '').slice(-10) : '');

  // Perform search matching phone number or reference ID (STRICT EXACT MATCH ONLY FOR PRIVACY)
  const matchedBookings = useMemo(() => {
    if (!hasSearched || !searchInput.trim()) return [];

    const query = searchInput.trim().toLowerCase();
    const queryDigits = cleanPhone(query);

    return bookings.filter((b) => {
      if (!b) return false;

      // 1. Exact Reference ID match (e.g. 'NEX-894210' or 'b-1')
      const isExactRefMatch =
        (b.referenceId && b.referenceId.trim().toLowerCase() === query) ||
        (b.id && b.id.trim().toLowerCase() === query);

      if (isExactRefMatch) return true;

      // 2. Exact 10-digit Phone Number match (e.g. '9876543210')
      if (queryDigits.length === 10) {
        const phoneDigits = cleanPhone(b.customerPhone || '');
        return phoneDigits === queryDigits;
      }

      return false;
    });
  }, [bookings, searchInput, hasSearched]);

  // Conditional render guard AFTER ALL HOOKS
  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchInput.trim();
    if (!cleanQuery) return;

    setHasSearched(true);
    
    // Find exact matches immediately
    const query = cleanQuery.toLowerCase();
    const queryDigits = cleanPhone(query);

    const matches = bookings.filter((b) => {
      if (!b) return false;
      const isExactRefMatch =
        (b.referenceId && b.referenceId.trim().toLowerCase() === query) ||
        (b.id && b.id.trim().toLowerCase() === query);

      if (isExactRefMatch) return true;

      if (queryDigits.length === 10) {
        const phoneDigits = cleanPhone(b.customerPhone || '');
        return phoneDigits === queryDigits;
      }

      return false;
    });

    if (matches.length === 1) {
      setSelectedBooking(matches[0]);
    } else {
      setSelectedBooking(null);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const statusMap: Record<BookingStatus, { label: string; bg: string; color: string }> = {
      pending: { label: 'Pending Approval', bg: '#FEF3C7', color: '#B45309' },
      confirmed: { label: 'Confirmed', bg: '#DBEAFE', color: '#1D4ED8' },
      'in-progress': { label: 'In Progress / On Way', bg: '#E0E7FF', color: '#4338CA' },
      completed: { label: 'Service Completed', bg: '#DCFCE7', color: '#15803D' },
      cancelled: { label: 'Cancelled', bg: '#FEE2E2', color: '#B91C1C' }
    };
    const s = statusMap[status] || statusMap.pending;
    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 800,
          background: s.bg,
          color: s.color,
          letterSpacing: '0.03em'
        }}
      >
        {s.label}
      </span>
    );
  };

  // Timeline step index (0 = placed, 1 = confirmed, 2 = in-progress, 3 = completed)
  const getStepIndex = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'in-progress': return 2;
      case 'completed': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

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
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <style>{`
        .track-modal-card {
          max-height: 90vh;
          max-height: 90dvh;
        }
        .track-modal-body {
          padding: 24px 28px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          touch-action: pan-y;
        }
        .track-modal-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 640px) {
          .track-modal-card {
            border-radius: 20px !important;
            max-height: 92dvh !important;
          }
          .track-modal-body {
            padding: 16px 14px !important;
          }
          .track-modal-grid-2col {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .track-modal-header {
            padding: 18px 16px !important;
          }
        }
      `}</style>

      <div
        data-lenis-prevent="true"
        data-lenis-prevent-touch="true"
        className="track-modal-card"
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '620px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div
          className="track-modal-header"
          style={{
            padding: '24px 28px',
            background: 'linear-gradient(135deg, #1C2677 0%, #0F172A 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #29C3BE, #1C2677)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(41, 195, 190, 0.3)',
                flexShrink: 0
              }}
            >
              <PackageCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Track Your Booking Status
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: '2px 0 0 0' }}>
                Instant real-time status, crew assignment & receipt
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              transition: 'background 0.2s',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div
          data-lenis-prevent="true"
          data-lenis-prevent-touch="true"
          className="track-modal-body"
          style={{ flex: 1 }}
        >
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Search by Mobile Number or Order Reference ID
            </label>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div
                style={{
                  flex: '1 1 200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Search size={18} style={{ color: '#64748B', flexShrink: 0 }} />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder="Enter exact 10-digit phone or Order ID (e.g. NEX-894210)"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setHasSearched(false);
                    setSelectedBooking(null);
                  }}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    fontWeight: 600,
                    background: 'transparent'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(41, 195, 190, 0.25)',
                  whiteSpace: 'nowrap'
                }}
              >
                Track Order
              </button>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>💡 Try phone e.g. <strong>9876543210</strong></span>
              <span>💡 Or order ID e.g. <strong>NEX-894210</strong></span>
            </div>
          </form>

          {/* Results Area */}
          {hasSearched && (
            <div>
              {/* Back to List Button if inside single booking view from multiple results */}
              {selectedBooking && matchedBookings.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#1C2677',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    padding: 0
                  }}
                >
                  <ArrowLeft size={16} /> Back to all results ({matchedBookings.length})
                </button>
              )}

              {/* VIEW 1: Multiple Results Card List */}
              {!selectedBooking && matchedBookings.length > 1 && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C2677', marginBottom: '12px' }}>
                    Found {matchedBookings.length} bookings for "{searchInput}":
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {matchedBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '16px',
                          border: '1px solid #E2E8F0',
                          background: '#F8FAFC',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
                              {b.referenceId || b.id}
                            </span>
                            {getStatusBadge(b.status)}
                          </div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1C2677' }}>
                            {b.serviceName} • {b.categoryOrPackage}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                            📅 {b.scheduledDate} ({b.scheduledTime}) • 📍 {b.area}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#1C2677' }}>
                            ₹{b.estimatedTotal}
                          </span>
                          <ChevronRight size={16} color="#94A3B8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 2: Single Booking Detailed View */}
              {selectedBooking && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Order Status Banner */}
                  <div
                    style={{
                      background: '#F8FAFC',
                      padding: '16px',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          ORDER REFERENCE ID
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1C2677', marginTop: '2px' }}>
                          {selectedBooking.referenceId || selectedBooking.id}
                        </div>
                      </div>
                      {getStatusBadge(selectedBooking.status)}
                    </div>

                    {/* Progress Timeline Tracker (4 Steps) */}
                    {selectedBooking.status !== 'cancelled' ? (
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                          Live Progress Tracker
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', position: 'relative' }}>
                          {[
                            { step: 0, label: 'Placed', icon: CheckCircle2 },
                            { step: 1, label: 'Confirmed', icon: Sparkles },
                            { step: 2, label: 'On Way', icon: UserCheck },
                            { step: 3, label: 'Completed', icon: PackageCheck }
                          ].map((s) => {
                            const curStep = getStepIndex(selectedBooking.status);
                            const isDone = curStep >= s.step;
                            const isCurrent = curStep === s.step;

                            return (
                              <div key={s.step} style={{ textAlign: 'center' }}>
                                <div
                                  style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    margin: '0 auto 4px auto',
                                    background: isDone ? '#29C3BE' : '#E2E8F0',
                                    color: isDone ? '#FFFFFF' : '#94A3B8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                    boxShadow: isCurrent ? '0 0 0 3px rgba(41, 195, 190, 0.25)' : 'none',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {isDone ? '✓' : s.step + 1}
                                </div>
                                <div style={{ fontSize: '0.68rem', fontWeight: isCurrent ? 800 : 600, color: isDone ? '#1C2677' : '#94A3B8' }}>
                                  {s.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '0.8rem', fontWeight: 600 }}>
                        <AlertCircle size={15} /> This booking was cancelled. Please contact customer care.
                      </div>
                    )}
                  </div>

                  {/* Assigned Staff Banner */}
                  {selectedBooking.assignedStaff && selectedBooking.assignedStaff !== 'Unassigned' && (
                    <div
                      style={{
                        padding: '14px',
                        borderRadius: '16px',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          background: '#1C2677',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <UserCheck size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>
                          ASSIGNED FIELD CREW
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E293B' }}>
                          {selectedBooking.assignedStaff}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Service & Schedule Details */}
                  <div className="track-modal-grid-2col">
                    <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1C2677', fontWeight: 700, fontSize: '0.78rem', marginBottom: '4px' }}>
                        <Sparkles size={13} style={{ color: '#29C3BE' }} /> Service & Plan
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                        {selectedBooking.serviceName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                        {selectedBooking.categoryOrPackage}
                      </div>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1C2677', fontWeight: 700, fontSize: '0.78rem', marginBottom: '4px' }}>
                        <Calendar size={13} style={{ color: '#29C3BE' }} /> Schedule Slot
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                        {selectedBooking.scheduledDate}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                        ⏱ {selectedBooking.scheduledTime}
                      </div>
                    </div>
                  </div>

                  {/* Address & Customer Details */}
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1C2677', fontWeight: 700, fontSize: '0.78rem', marginBottom: '4px' }}>
                      <MapPin size={13} style={{ color: '#29C3BE' }} /> Service Address ({selectedBooking.area})
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.3 }}>
                      {selectedBooking.customerName} • {selectedBooking.customerPhone}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      {selectedBooking.address}, {selectedBooking.area} ({selectedBooking.pincode})
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1C2677', fontWeight: 700, fontSize: '0.78rem', marginBottom: '8px' }}>
                      <CreditCard size={13} style={{ color: '#29C3BE' }} /> Payment Summary
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '4px' }}>
                      <span>Estimated Total:</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{selectedBooking.estimatedTotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '6px' }}>
                      <span>Advance Deposit Paid:</span>
                      <span style={{ fontWeight: 700, color: '#059669' }}>- ₹{selectedBooking.depositPaid}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800, color: '#1C2677', borderTop: '1px dashed #CBD5E1', paddingTop: '6px' }}>
                      <span>Balance Payable at Doorstep:</span>
                      <span>₹{Math.max(0, selectedBooking.estimatedTotal - selectedBooking.depositPaid)}</span>
                    </div>
                  </div>

                  {/* Help & Support Links */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      paddingTop: '4px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <a
                      href="https://wa.me/919895000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: '1 1 140px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: '#25D366',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <MessageSquare size={15} /> WhatsApp Support
                    </a>
                    <a
                      href="tel:+919895000000"
                      style={{
                        flex: '1 1 140px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: '#1C2677',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <PhoneCall size={15} /> Call Dispatch Team
                    </a>
                  </div>

                </div>
              )}

              {/* VIEW 3: Empty Not Found State */}
              {matchedBookings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 16px', background: '#FEF2F2', borderRadius: '16px', border: '1px solid #FECACA' }}>
                  <AlertCircle size={38} style={{ color: '#EF4444', marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#991B1B', margin: '0 0 6px 0' }}>
                    No Booking Found
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#7F1D1D', margin: 0, lineHeight: 1.5 }}>
                    No active booking matches <strong>"{searchInput}"</strong>.<br />
                    For privacy & security, please enter your complete 10-digit mobile number or exact Order Reference ID (e.g. <strong>NEX-894210</strong>).
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
};
