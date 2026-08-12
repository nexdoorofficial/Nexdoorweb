import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  CalendarCheck,
  Clock,
  Sparkles,
  TrendingUp,
  UserCheck,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { BookingDetailModal } from '../../components/admin/BookingDetailModal';
import type { BookingRecord, BookingStatus } from '../../types/admin';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, services, technicians } = useAdminData();

  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Metrics calculations
  const totalRevenue = bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.estimatedTotal : sum), 0);
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const activeServicesCount = services.filter((s) => s.status === 'active').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

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

  return (
    <div>
      {/* Top Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Metric 1: Revenue */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>Total Revenue Value</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> <span>Across {totalBookings} scheduled jobs</span>
          </div>
        </div>

        {/* Metric 2: Total Bookings */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>Total Bookings</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #1C2677, #2563EB)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            {totalBookings}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
            {completedCount} completed successfully
          </div>
        </div>

        {/* Metric 3: Pending Action */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>Pending Approvals</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: pendingCount > 0 ? '#D97706' : '#10B981', fontWeight: 600 }}>
            {pendingCount > 0 ? 'Requires technician allocation' : 'All bookings confirmed!'}
          </div>
        </div>

        {/* Metric 4: Active Services Catalog */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>Active Service Catalog</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #29C3BE, #0D9488)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            {activeServicesCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
            House, Car Wash & Laundry
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Bookings + Technicians & Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '24px' }}>
        {/* Left Column: Recent Bookings Table */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Recent Bookings Pipeline</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Live incoming service requests & status management</p>
            </div>
            <button
              onClick={() => navigate('/admin/bookings')}
              style={{
                background: '#F1F5F9',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1C2677',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              View All ({bookings.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B' }}>
                  <th style={{ padding: '12px 10px', fontWeight: 700 }}>Ref ID</th>
                  <th style={{ padding: '12px 10px', fontWeight: 700 }}>Customer</th>
                  <th style={{ padding: '12px 10px', fontWeight: 700 }}>Service</th>
                  <th style={{ padding: '12px 10px', fontWeight: 700 }}>Schedule</th>
                  <th style={{ padding: '12px 10px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => {
                  const badge = getStatusBadge(b.status);
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                      <td style={{ padding: '14px 10px', fontWeight: 800, color: '#1C2677' }}>
                        {b.referenceId}
                      </td>
                      <td style={{ padding: '14px 10px' }}>
                        <strong style={{ display: 'block', color: '#1E293B' }}>{b.customerName}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{b.area}</span>
                      </td>
                      <td style={{ padding: '14px 10px', color: '#334155', fontWeight: 600 }}>
                        {b.serviceName}
                      </td>
                      <td style={{ padding: '14px 10px', color: '#64748B' }}>
                        {b.scheduledDate}<br />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{b.scheduledTime}</span>
                      </td>
                      <td style={{ padding: '14px 10px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 700, background: badge.bg, color: badge.color, display: 'inline-block' }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          style={{
                            background: '#F1F5F9',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#1E293B',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={14} /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Technicians Roster & Service Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Technicians Roster */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} color="#1C2677" /> Field Technicians ({technicians.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {technicians.map((t) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#1E293B', display: 'block' }}>{t.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.role}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>{t.rating}★</span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: t.status === 'available' ? '#10B981' : '#6366F1',
                        textTransform: 'capitalize'
                      }}
                    >
                      ● {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Catalog Quick Switch */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A, #1C2677)', color: '#FFFFFF', borderRadius: '20px', padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '6px' }}>Service Catalog Management</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '16px' }}>Add new pricing plans, customize specs, or toggle service status.</p>
            <button
              onClick={() => navigate('/admin/services')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: '#29C3BE',
                color: '#0F172A',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} /> Manage All Services
            </button>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
};
