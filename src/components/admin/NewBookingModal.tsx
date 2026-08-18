import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { BookingStatus } from '../../types/admin';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBookingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addBooking, services, locations } = useAdminData();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Kakkanad');
  const [pincode] = useState('682030');
  const [serviceId, setServiceId] = useState('house-cleaning');
  const [serviceName, setServiceName] = useState('Deep Home Cleaning');
  const [categoryOrPackage, setCategoryOrPackage] = useState('2 BHK Premium');
  const [scheduledDate, setScheduledDate] = useState('2026-08-15');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [estimatedTotal, setEstimatedTotal] = useState<number>(1999);
  const [depositPaid, setDepositPaid] = useState<number>(199);
  const [status, setStatus] = useState<BookingStatus>('confirmed');
  const [assignedStaff, setAssignedStaff] = useState('Anish V. (Lead)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) {
      alert('Please fill in Customer Name, Phone, and Address.');
      return;
    }

    const refId = 'NEX-' + Math.floor(100000 + Math.random() * 900000);

    addBooking({
      referenceId: refId,
      customerName,
      customerPhone,
      customerEmail,
      address,
      area,
      pincode,
      serviceId,
      serviceName,
      categoryOrPackage,
      scheduledDate,
      scheduledTime,
      estimatedTotal: Number(estimatedTotal) || 0,
      depositPaid: Number(depositPaid) || 0,
      status,
      assignedStaff,
      notes
    });

    onClose();
  };

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
        padding: '20px'
      }}
    >
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '86vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Create Manual Booking</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>Add a phone or walk-in customer booking</p>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Customer Details */}
          <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '14px' }}>Customer Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Full Name *</label>
                <input type="text" required placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Phone Number *</label>
                <input type="text" required placeholder="+91 98765 43210" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Full Address *</label>
                <input type="text" required placeholder="Flat / House / Street Address" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Area / Location</label>
                <select value={area} onChange={(e) => setArea(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF' }}>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Service & Schedule */}
          <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '14px' }}>Service & Schedule</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Service Offering</label>
                <select
                  value={serviceName}
                  onChange={(e) => {
                    setServiceName(e.target.value);
                    const found = services.find((s) => s.title === e.target.value);
                    if (found) {
                      setServiceId(found.id);
                      setEstimatedTotal(found.priceNumeric);
                    }
                  }}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF' }}
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>{s.title} ({s.startingPrice})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Category / Plan Spec</label>
                <input type="text" value={categoryOrPackage} onChange={(e) => setCategoryOrPackage(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Scheduled Date</label>
                <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Time Slot</label>
                <input type="text" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Assign Staff</label>
                <input type="text" value={assignedStaff} onChange={(e) => setAssignedStaff(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>
          </div>

          {/* Pricing & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Estimated Total (₹)</label>
              <input type="number" value={estimatedTotal} onChange={(e) => setEstimatedTotal(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Deposit Paid (₹)</label>
              <input type="number" value={depositPaid} onChange={(e) => setDepositPaid(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Initial Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF' }}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Admin Notes & Special Requests</label>
            <textarea rows={2} placeholder="Any specific instructions or client requests..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFF' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #007A87, #0093A2)', color: '#FFF', fontWeight: 700 }}>
              Save Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
