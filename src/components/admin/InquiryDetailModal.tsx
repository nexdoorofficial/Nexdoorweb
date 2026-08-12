import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Save, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';
import type { InquiryRecord, InquiryStatus } from '../../types/admin';

interface InquiryDetailModalProps {
  inquiry: InquiryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: InquiryStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

export const InquiryDetailModal: React.FC<InquiryDetailModalProps> = ({
  inquiry,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
  onDelete
}) => {
  const [notes, setNotes] = useState('');
  const [isSavedNotes, setIsSavedNotes] = useState(false);

  useEffect(() => {
    if (inquiry) {
      setNotes(inquiry.notes || '');
      setIsSavedNotes(false);
    }
  }, [inquiry, isOpen]);

  if (!isOpen || !inquiry) return null;

  const handleSaveNotes = () => {
    onUpdateNotes(inquiry.id, notes);
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return { bg: '#EFF6FF', color: '#1E40AF', label: '🆕 NEW / UNREAD' };
      case 'in-progress':
        return { bg: '#FEF3C7', color: '#B45309', label: '⏳ IN PROGRESS' };
      case 'responded':
        return { bg: '#DCFCE7', color: '#15803D', label: '✓ RESPONDED' };
      case 'archived':
        return { bg: '#F1F5F9', color: '#64748B', label: '📁 ARCHIVED' };
    }
  };

  const statusInfo = getStatusBadge(inquiry.status);

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
          padding: '16px'
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
            maxWidth: '640px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Top Header */}
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
                  background: '#29C3BE',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  letterSpacing: '0.04em'
                }}
              >
                {inquiry.referenceId}
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  {inquiry.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: '2px 0 0 0' }}>
                  Submitted on {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
              <X size={18} />
            </button>
          </div>

          <div
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            
            {/* Quick Contact & Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#F8FAFC', padding: '14px 18px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={`tel:${inquiry.phone}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <Phone size={14} /> Call {inquiry.phone}
                </a>

                {inquiry.email && (
                  <a
                    href={`mailto:${inquiry.email}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: '#1C2677',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Mail size={14} /> Send Email
                  </a>
                )}
              </div>

              {/* Status Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Status:</span>
                <select
                  value={inquiry.status}
                  onChange={(e) => onUpdateStatus(inquiry.id, e.target.value as InquiryStatus)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    border: '1px solid #CBD5E1',
                    background: statusInfo.bg,
                    color: statusInfo.color,
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="new">🆕 New / Unread</option>
                  <option value="in-progress">⏳ In Progress</option>
                  <option value="responded">✓ Responded</option>
                  <option value="archived">📁 Archived</option>
                </select>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Service Category</span>
                <strong style={{ fontSize: '0.95rem', color: '#1C2677', fontWeight: 800 }}>{inquiry.serviceInterest}</strong>
              </div>

              <div style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Customer Contact</span>
                <strong style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 700 }}>
                  {inquiry.name} • {inquiry.phone}
                </strong>
              </div>
            </div>

            {/* Customer Message Box */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C2677', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <MessageSquare size={16} style={{ color: '#29C3BE' }} /> Customer Inquiry Message:
              </label>
              <div
                style={{
                  background: '#F8FAFC',
                  padding: '16px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.925rem',
                  color: '#334155',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line'
                }}
              >
                "{inquiry.message}"
              </div>
            </div>

            {/* Admin Response Notes */}
            <div style={{ background: '#EEF2FF', padding: '16px', borderRadius: '16px', border: '1px solid #C7D2FE' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E40AF', display: 'block' }}>
                  📝 Internal Admin Response & Action Remarks
                </label>
                {isSavedNotes && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Notes Saved!
                  </span>
                )}
              </div>

              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter internal follow-up remarks (e.g. Spoke on phone, quote sent via WhatsApp)..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #93C5FD',
                  fontSize: '0.88rem',
                  color: '#1E3A8A',
                  background: '#FFFFFF',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#1D4ED8',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Save size={14} /> Save Remarks
                </button>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (window.confirm(`Delete inquiry ${inquiry.referenceId}?`)) {
                  onDelete(inquiry.id);
                  onClose();
                }
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #FCA5A5',
                background: '#FEE2E2',
                color: '#DC2626',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Trash2 size={14} /> Delete Inquiry
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
