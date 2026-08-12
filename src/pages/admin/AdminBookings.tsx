import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Eye,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { BookingDetailModal, generateWhatsAppUrl } from '../../components/admin/BookingDetailModal';
import { NewBookingModal } from '../../components/admin/NewBookingModal';
import type { BookingRecord, BookingStatus } from '../../types/admin';

export const AdminBookings: React.FC = () => {
  const { bookings, updateBookingStatus, assignTechnician, technicians } = useAdminData();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>(initialStatus);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [tableWhatsAppPrompt, setTableWhatsAppPrompt] = useState<{ booking: BookingRecord; newStatus: BookingStatus } | null>(null);

  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl) {
      setSelectedStatusFilter(statusFromUrl);
    }
  }, [searchParams]);

  const handleTableStatusChange = (booking: BookingRecord, newStatus: BookingStatus) => {
    updateBookingStatus(booking.id, newStatus);
    setTableWhatsAppPrompt({ booking, newStatus });
  };

  // Filtering logic
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      selectedStatusFilter === 'all' || b.status === selectedStatusFilter;

    const matchesSearch =
      b.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm) ||
      b.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return { bg: '#FEF3C7', color: '#D97706', label: 'Pending' };
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

  const statusTabs = [
    { key: 'all', label: 'All Bookings', count: bookings.length },
    { key: 'pending', label: 'Pending', count: bookings.filter((b) => b.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmed', count: bookings.filter((b) => b.status === 'confirmed').length },
    { key: 'in-progress', label: 'In Progress', count: bookings.filter((b) => b.status === 'in-progress').length },
    { key: 'completed', label: 'Completed', count: bookings.filter((b) => b.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: bookings.filter((b) => b.status === 'cancelled').length }
  ];

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Booking Management & Dispatch
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            Track, assign staff, update statuses, and create customer service appointments
          </p>
        </div>
        <button
          onClick={() => setIsNewBookingOpen(true)}
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px rgba(41, 195, 190, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} /> Create New Booking
        </button>
      </div>

      {/* Skippable WhatsApp Notification Banner */}
      {tableWhatsAppPrompt && (
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
              <MessageSquare size={18} color="#25D366" /> Send WhatsApp Status Update to {tableWhatsAppPrompt.booking.customerName}?
            </strong>
            <span style={{ fontSize: '0.82rem', opacity: 0.9, marginTop: '2px', display: 'block' }}>
              Status was changed to <strong style={{ textTransform: 'uppercase', color: '#34D399' }}>{tableWhatsAppPrompt.newStatus}</strong> for Ref [{tableWhatsAppPrompt.booking.referenceId}].
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a
              href={generateWhatsAppUrl(tableWhatsAppPrompt.booking, tableWhatsAppPrompt.newStatus)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTableWhatsAppPrompt(null)}
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
              onClick={() => setTableWhatsAppPrompt(null)}
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

      {/* Filter Tabs & Search Bar */}
      <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #E2E8F0', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {statusTabs.map((tab) => {
              const isActive = selectedStatusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatusFilter(tab.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    background: isActive ? '#1C2677' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{ padding: '2px 6px', borderRadius: '8px', fontSize: '0.75rem', background: isActive ? 'rgba(255,255,255,0.2)' : '#E2E8F0', color: isActive ? '#FFF' : '#334155' }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search reference, customer, area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Booking Ref</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Customer Info</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Service & Specs</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Scheduled Slot</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Total / Deposit</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Assigned Staff</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                  No bookings found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => {
                const badge = getStatusBadge(b.status);
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px', fontWeight: 800, color: '#1C2677' }}>
                      {b.referenceId}
                    </td>

                    <td style={{ padding: '16px' }}>
                      <strong style={{ display: 'block', color: '#1E293B', fontSize: '0.9rem' }}>{b.customerName}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>{b.customerPhone}</span>
                      <span style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 600 }}>📍 {b.area}</span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{ fontWeight: 700, color: '#1E293B', display: 'block' }}>{b.serviceName}</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{b.categoryOrPackage}</span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{ color: '#1E293B', fontWeight: 600, display: 'block' }}>{b.scheduledDate}</span>
                      <span style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700 }}>{b.scheduledTime}</span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <strong style={{ color: '#1E293B', display: 'block' }}>₹{b.estimatedTotal}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>₹{b.depositPaid} Paid</span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <select
                        value={b.status}
                        onChange={(e) => handleTableStatusChange(b, e.target.value as BookingStatus)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: badge.bg,
                          color: badge.color,
                          border: 'none',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <select
                        value={b.assignedStaff || 'Unassigned'}
                        onChange={(e) => assignTechnician(b.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          border: '1px solid #CBD5E1',
                          background: '#FFF',
                          color: '#334155'
                        }}
                      >
                        <option value="Unassigned">Unassigned</option>
                        {technicians.map((t) => (
                          <option key={t.id} value={`${t.name} (${t.role})`}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <a
                          href={generateWhatsAppUrl(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Send WhatsApp Status to Customer"
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: '#25D366',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                          }}
                        >
                          <MessageSquare size={14} /> WhatsApp
                        </a>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#1C2677',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={14} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
      />
    </div>
  );
};
