import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Save, CheckCircle2, Trash2, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import type { JobApplication, ApplicationStatus } from '../../types/admin';

interface CandidateDetailModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
  onDelete
}) => {
  const [notes, setNotes] = useState('');
  const [isSavedNotes, setIsSavedNotes] = useState(false);

  useEffect(() => {
    if (application) {
      setNotes(application.notes || '');
      setIsSavedNotes(false);
    }
  }, [application, isOpen]);

  if (!isOpen || !application) return null;

  const handleSaveNotes = () => {
    onUpdateNotes(application.id, notes);
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
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
              background: 'linear-gradient(135deg, #03252A 0%, #004D56 100%)',
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
                  background: 'linear-gradient(135deg, #007A87, #9BC83B)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  letterSpacing: '0.04em'
                }}
              >
                {application.referenceId}
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  {application.applicantName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: '2px 0 0 0' }}>
                  Submitted on {new Date(application.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Status Switcher & Date */}
            <div
              style={{
                background: '#F8FAFC',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Application Status
                </div>
                <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(['new', 'reviewed', 'interviewed', 'hired', 'rejected'] as ApplicationStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateStatus(application.id, st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        border: application.status === st ? 'none' : '1px solid #CBD5E1',
                        background: application.status === st ? '#007A87' : '#FFFFFF',
                        color: application.status === st ? '#FFFFFF' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      {st.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748B', textAlign: 'right' }}>
                Submitted on
                <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {new Date(application.submittedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Candidate Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>POSITION APPLIED FOR</div>
                <div style={{ fontWeight: 800, color: '#007A87', fontSize: '0.95rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={16} style={{ color: '#007A87' }} /> {application.positionApplied}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>HIGHEST QUALIFICATION</div>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={16} style={{ color: '#D97706' }} /> {application.qualification}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>CANDIDATE LOCATION</div>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} style={{ color: '#E11D48' }} /> {application.location}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>CONTACT DETAILS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                  <a href={`tel:${application.phone}`} style={{ color: '#007A87', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} style={{ color: '#007A87' }} /> {application.phone}
                  </a>
                  <a href={`mailto:${application.email}`} style={{ color: '#64748B', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} /> {application.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action Contact Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={`tel:${application.phone}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #007A87, #0093A2)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 122, 135, 0.3)'
                }}
              >
                <Phone size={16} /> Call Candidate ({application.phone})
              </a>

              <a
                href={`mailto:${application.email}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#007A87',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none'
                }}
              >
                <Mail size={16} /> Send Email Inquiry
              </a>
            </div>

            {/* HR Notes Textarea */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                HR Recruiter Notes & Evaluation
              </div>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter interview feedback, salary expectation, experience verification notes..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <button
                  onClick={handleSaveNotes}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: isSavedNotes ? '#10B981' : '#007A87',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {isSavedNotes ? <CheckCircle2 size={16} /> : <Save size={16} />}
                  {isSavedNotes ? 'Notes Saved!' : 'Save HR Notes'}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete application ${application.referenceId} from ${application.applicantName}?`)) {
                      onDelete(application.id);
                      onClose();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: '#FEE2E2',
                    border: 'none',
                    color: '#DC2626',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={15} /> Delete Candidate
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
