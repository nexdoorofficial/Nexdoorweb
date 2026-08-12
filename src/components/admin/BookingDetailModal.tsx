import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Printer, Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { BookingRecord, BookingStatus } from '../../types/admin';

interface Props {
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const formatWhatsAppPhone = (phoneStr: string) => {
  let clean = (phoneStr || '').replace(/\D/g, '');
  if (clean.length === 10) {
    clean = '91' + clean;
  }
  return clean;
};

export const generateWhatsAppUrl = (bookingRecord: BookingRecord, targetStatus?: BookingStatus) => {
  const phone = formatWhatsAppPhone(bookingRecord.customerPhone);
  const statusLabel = (targetStatus || bookingRecord.status).toUpperCase();

  const text = `Hi ${bookingRecord.customerName || 'Valued Customer'},

Greetings from NEXDOOR Cleaning Solutions! 🧹✨

Your booking status has been updated:
📌 Ref ID: ${bookingRecord.referenceId}
📊 Current Status: ${statusLabel}
🛠️ Service: ${bookingRecord.serviceName}
📅 Schedule: ${bookingRecord.scheduledDate} at ${bookingRecord.scheduledTime}
📍 Location: ${bookingRecord.address || 'Doorstep Address'}, ${bookingRecord.area} (${bookingRecord.pincode})
💰 Total Amount: ₹${bookingRecord.estimatedTotal} (Deposit Paid: ₹${bookingRecord.depositPaid})

For any queries, reply to this message or call us at +91 98765 43210.
Thank you for choosing NEXDOOR!`.trim();

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

export const BookingDetailModal: React.FC<Props> = ({ booking, isOpen, onClose }) => {
  const { updateBookingStatus, assignTechnician, updateBookingNotes, deleteBooking, technicians } = useAdminData();

  const [currentStatus, setCurrentStatus] = useState<BookingStatus>('confirmed');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [notes, setNotes] = useState('');
  const [showWhatsAppPrompt, setShowWhatsAppPrompt] = useState<BookingStatus | null>(null);

  useEffect(() => {
    if (booking) {
      setCurrentStatus(booking.status);
      setSelectedStaff(booking.assignedStaff || 'Unassigned');
      setNotes(booking.notes || '');
      setShowWhatsAppPrompt(null);
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleStatusChange = (newStatus: BookingStatus) => {
    setCurrentStatus(newStatus);
    updateBookingStatus(booking.id, newStatus);
    setShowWhatsAppPrompt(newStatus);
  };

  const handleStaffAssign = (staff: string) => {
    setSelectedStaff(staff);
    assignTechnician(booking.id, staff);
  };

  const handleSaveNotes = () => {
    updateBookingNotes(booking.id, notes);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete booking ${booking.referenceId}?`)) {
      deleteBooking(booking.id);
      onClose();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return { bg: '#FEF3C7', color: '#D97706', label: 'Pending Confirmation' };
      case 'confirmed':
        return { bg: '#DBEAFE', color: '#2563EB', label: 'Confirmed' };
      case 'in-progress':
        return { bg: '#F3E8FF', color: '#9333EA', label: 'In Progress' };
      case 'completed':
        return { bg: '#D1FAE5', color: '#059669', label: 'Completed' };
      case 'cancelled':
        return { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelled' };
    }
  };

  const badge = getStatusBadge(currentStatus);

  return (
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
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '86vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          padding: '32px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677' }}>{booking.referenceId}</span>
              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
              Created on {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a
              href={generateWhatsAppUrl(booking, currentStatus)}
              target="_blank"
              rel="noopener noreferrer"
              title="Send WhatsApp Status to Customer"
              style={{
                background: '#25D366',
                color: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageSquare size={16} /> WhatsApp Status
            </a>
            <button onClick={handlePrint} title="Print Invoice" style={{ background: '#F1F5F9', border: 'none', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Printer size={18} color="#475569" />
            </button>
            <button onClick={handleDelete} title="Delete Booking" style={{ background: '#FEE2E2', border: 'none', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Trash2 size={18} color="#DC2626" />
            </button>
            <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={20} color="#64748B" />
            </button>
          </div>
        </div>

        {/* Skippable WhatsApp Notification Prompt Banner */}
        {showWhatsAppPrompt && (
          <div style={{
            background: 'linear-gradient(135deg, #064E3B, #047857)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(5, 150, 105, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={18} color="#25D366" /> Send WhatsApp Status Update to {booking.customerName}?
              </strong>
              <span style={{ fontSize: '0.82rem', opacity: 0.9, marginTop: '2px', display: 'block' }}>
                Status was updated to <strong style={{ textTransform: 'uppercase', color: '#34D399' }}>{showWhatsAppPrompt}</strong>. Click below to launch WhatsApp with pre-filled status receipt.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <a
                href={generateWhatsAppUrl(booking, showWhatsAppPrompt)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowWhatsAppPrompt(null)}
                style={{
                  background: '#25D366',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)'
                }}
              >
                Send WhatsApp <ExternalLink size={14} />
              </a>
              <button
                onClick={() => setShowWhatsAppPrompt(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Quick Status Control Bar */}
        <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Update Status:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'] as BookingStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: currentStatus === st ? '2px solid #1C2677' : '1px solid #CBD5E1',
                  background: currentStatus === st ? '#1C2677' : '#FFFFFF',
                  color: currentStatus === st ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {st.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* Customer Info */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#1C2677" /> Customer Information
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.8rem' }}>Name</span>
                <strong>{booking.customerName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.8rem' }}>Phone</span>
                <strong>{booking.customerPhone}</strong>
              </div>
              {booking.customerEmail && (
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.8rem' }}>Email</span>
                  <span>{booking.customerEmail}</span>
                </div>
              )}
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.8rem' }}>Address & Location</span>
                <span>{booking.address}, {booking.area} ({booking.pincode})</span>
              </div>
            </div>
          </div>

          {/* Service & Staff Info */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#29C3BE" /> Service & Staffing
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.8rem' }}>Service</span>
                <strong>{booking.serviceName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Order Specifications & Options</span>
                {(() => {
                  const spec = booking.categoryOrPackage || '';
                  const parts = spec.split('|').map((s) => s.trim());
                  if (parts.length > 1) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
                        {parts.map((p, i) => (
                          <div
                            key={i}
                            style={{
                              background: '#FAFCFF',
                              border: '1px solid #CBD5E1',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.825rem',
                              fontWeight: 700,
                              color: '#1C2677',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span style={{ color: '#29C3BE', fontWeight: 900 }}>✓</span> {p}
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <strong style={{ color: '#1E293B', fontSize: '0.9rem' }}>{spec}</strong>;
                })()}
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.8rem' }}>Scheduled Time</span>
                <strong>{booking.scheduledDate} at {booking.scheduledTime}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Assigned Technician</span>
                <select
                  value={selectedStaff}
                  onChange={(e) => handleStaffAssign(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.85rem' }}
                >
                  <option value="Unassigned">-- Unassigned --</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={`${t.name} (${t.role})`}>
                      {t.name} ({t.role}) - {t.rating}★
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '12px' }}>Payment Summary</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748B' }}>Estimated Total Amount:</span>
            <span style={{ fontWeight: 700, color: '#1E293B' }}>₹{booking.estimatedTotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748B' }}>Refundable Booking Deposit Paid:</span>
            <span style={{ fontWeight: 700, color: '#10B981' }}>₹{booking.depositPaid}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #CBD5E1', fontSize: '0.95rem' }}>
            <span style={{ fontWeight: 800, color: '#1C2677' }}>Balance Due on Completion:</span>
            <span style={{ fontWeight: 800, color: '#1C2677' }}>₹{Math.max(0, booking.estimatedTotal - booking.depositPaid)}</span>
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Admin Notes & Customer Special Instructions
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes for crew..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
            <button
              onClick={handleSaveNotes}
              style={{ background: '#1C2677', color: '#FFF', border: 'none', padding: '0 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
            >
              Save Notes
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: '12px', background: '#1E293B', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
