import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Trash2,
  Eye
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { InquiryDetailModal } from '../../components/admin/InquiryDetailModal';
import type { InquiryRecord, InquiryStatus } from '../../types/admin';

export const AdminInquiries: React.FC = () => {
  const { inquiries, updateInquiryStatus, updateInquiryNotes, deleteInquiry } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const inProgressInquiries = inquiries.filter((i) => i.status === 'in-progress').length;
  const respondedInquiries = inquiries.filter((i) => i.status === 'responded').length;

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.includes(searchTerm) ||
      (inq.email && inq.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inq.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus !== 'all') {
      return inq.status === filterStatus;
    }

    return true;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE', label: '🆕 NEW' };
      case 'in-progress':
        return { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A', label: '⏳ IN PROGRESS' };
      case 'responded':
        return { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0', label: '✓ RESPONDED' };
      case 'archived':
        return { bg: '#F1F5F9', color: '#64748B', border: '#E2E8F0', label: '📁 ARCHIVED' };
    }
  };

  const handleOpenDetail = (inquiry: InquiryRecord) => {
    setSelectedInquiry(inquiry);
    setIsDetailOpen(true);
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Customer Inquiries Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            View and respond to website instant inquiry form submissions
          </p>
        </div>

        {/* Compact Stats Badges */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ background: '#FFFFFF', padding: '8px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#475569' }}>
            Total: <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>{totalInquiries}</strong>
          </div>
          <div style={{ background: '#EFF6FF', padding: '8px 14px', borderRadius: '12px', border: '1px solid #BFDBFE', fontSize: '0.8rem', color: '#1E40AF' }}>
            Unread: <strong style={{ color: '#1E40AF', fontSize: '0.95rem' }}>{newInquiries}</strong>
          </div>
          <div style={{ background: '#FEF3C7', padding: '8px 14px', borderRadius: '12px', border: '1px solid #FDE68A', fontSize: '0.8rem', color: '#B45309' }}>
            In Progress: <strong style={{ color: '#B45309', fontSize: '0.95rem' }}>{inProgressInquiries}</strong>
          </div>
          <div style={{ background: '#DCFCE7', padding: '8px 14px', borderRadius: '12px', border: '1px solid #BBF7D0', fontSize: '0.8rem', color: '#15803D' }}>
            Responded: <strong style={{ color: '#15803D', fontSize: '0.95rem' }}>{respondedInquiries}</strong>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filter Tabs */}
      <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 12px', minWidth: '260px', flex: 1 }}>
          <Search size={16} color="#64748B" />
          <input
            type="text"
            placeholder="Search by customer, phone, email, ref ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${totalInquiries})` },
            { id: 'new', label: `New (${newInquiries})` },
            { id: 'in-progress', label: `In Progress (${inProgressInquiries})` },
            { id: 'responded', label: `Responded (${respondedInquiries})` },
            { id: 'archived', label: 'Archived' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: filterStatus === f.id ? 'none' : '1px solid #E2E8F0',
                background: filterStatus === f.id ? '#007A87' : '#F8FAFC',
                color: filterStatus === f.id ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Classic Data Table View */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Ref ID</th>
                <th style={{ padding: '14px 18px' }}>Customer Name</th>
                <th style={{ padding: '14px 18px' }}>Contact Phone / Email</th>
                <th style={{ padding: '14px 18px' }}>Service Interest</th>
                <th style={{ padding: '14px 18px' }}>Date</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inq) => {
                const badge = getStatusBadge(inq.status);

                return (
                  <tr
                    key={inq.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                  >
                    {/* Status dropdown */}
                    <td style={{ padding: '14px 18px' }} onClick={(e) => e.stopPropagation()}>
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as InquiryStatus)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          border: `1px solid ${badge.border}`,
                          background: badge.bg,
                          color: badge.color,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="new">🆕 New</option>
                        <option value="in-progress">⏳ In Progress</option>
                        <option value="responded">✓ Responded</option>
                        <option value="archived">📁 Archived</option>
                      </select>
                    </td>

                    {/* Reference ID */}
                    <td style={{ padding: '14px 18px' }} onClick={() => handleOpenDetail(inq)}>
                      <span style={{ fontWeight: 800, color: '#007A87', background: '#EEF2FF', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                        {inq.referenceId}
                      </span>
                    </td>

                    {/* Customer Name */}
                    <td style={{ padding: '14px 18px' }} onClick={() => handleOpenDetail(inq)}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{inq.name}</div>
                    </td>

                    {/* Contact Phone & Email */}
                    <td style={{ padding: '14px 18px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <a
                          href={`tel:${inq.phone}`}
                          style={{ color: '#007A87', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Phone size={12} style={{ color: '#007A87' }} /> {inq.phone}
                        </a>
                        {inq.email && (
                          <a
                            href={`mailto:${inq.email}`}
                            style={{ color: '#64748B', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Mail size={12} /> {inq.email}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Service Interest */}
                    <td style={{ padding: '14px 18px' }} onClick={() => handleOpenDetail(inq)}>
                      <span style={{ background: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                        {inq.serviceInterest}
                      </span>
                    </td>

                    {/* Date Submitted */}
                    <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '0.8rem' }} onClick={() => handleOpenDetail(inq)}>
                      {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenDetail(inq)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #007A87, #0093A2)',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={14} /> View Details
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete inquiry ${inq.referenceId} from ${inq.name}?`)) {
                              deleteInquiry(inq.id);
                            }
                          }}
                          style={{ background: '#FEE2E2', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#DC2626' }}
                          title="Delete Inquiry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInquiries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
            <MessageSquare size={36} style={{ color: '#94A3B8', marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: 700 }}>No inquiries match your current search or filter.</p>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      <InquiryDetailModal
        inquiry={selectedInquiry}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdateStatus={updateInquiryStatus}
        onUpdateNotes={updateInquiryNotes}
        onDelete={deleteInquiry}
      />
    </div>
  );
};
