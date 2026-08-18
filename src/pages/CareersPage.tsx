import React, { useState } from 'react';
import { Briefcase, MapPin, CheckCircle2, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAdminData } from '../context/AdminContext';
import type { CareerPosition } from '../types';

export const CareersPage: React.FC = () => {
  const { careerPositions, addJobApplication } = useAdminData();

  // Active positions published by admin
  const activeJobs = (careerPositions || []).filter((j) => j.status !== 'closed');

  const [selectedJob, setSelectedJob] = useState<CareerPosition | null>(null);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantLocation, setApplicantLocation] = useState('');
  const [applicantQualification, setApplicantQualification] = useState('Graduate');
  const [positionApplied, setPositionApplied] = useState('');

  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  const handleOpenModal = (job: CareerPosition) => {
    setSelectedJob(job);
    setPositionApplied(job.title);
    setApplicantName('');
    setApplicantPhone('');
    setApplicantEmail('');
    setApplicantLocation('');
    setApplicantQualification('Graduate');
    setSubmittedRefId(null);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone || !applicantEmail || !applicantLocation) return;

    const newApp = addJobApplication({
      applicantName,
      phone: applicantPhone,
      email: applicantEmail,
      location: applicantLocation,
      qualification: applicantQualification,
      positionApplied: positionApplied || (selectedJob ? selectedJob.title : 'General Application'),
      jobId: selectedJob?.id
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setSubmittedRefId(newApp.referenceId);
  };

  return (
    <div className="section-padding" style={{ background: '#F8FAFC', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
          <span className="badge-tag"><Briefcase size={14} /> JOIN OUR TEAM</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#03252A', marginTop: '8px' }}>
            Build the Future of Home & Auto Care
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '8px', lineHeight: 1.6 }}>
            We offer industry-leading salaries, performance incentives, health insurance, and structured career growth paths in Kochi.
          </p>
        </div>

        {/* Job Listings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {activeJobs.length > 0 ? (
            activeJobs.map((job) => (
              <div key={job.id} className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge-secondary">{job.type}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} style={{ color: '#007A87' }} /> {job.location}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#03252A', marginBottom: '8px' }}>
                    {job.title}
                  </h3>

                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#007A87', marginBottom: '12px' }}>
                    {job.salary}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                    {job.description}
                  </p>

                  {job.requirements && job.requirements.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#03252A', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                        Requirements:
                      </h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.825rem', color: '#334155', padding: 0 }}>
                        {job.requirements.map((req, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={15} style={{ color: '#9BC83B', flexShrink: 0 }} />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenModal(job)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', borderRadius: '12px' }}
                >
                  Apply for Position <ArrowRight size={16} />
                </button>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', background: '#FFFFFF', padding: '48px', borderRadius: '24px', textAlign: 'center', color: '#64748B' }}>
              <Briefcase size={40} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>No Openings Right Now</h3>
              <p style={{ fontSize: '0.9rem' }}>Check back soon or submit a general inquiry.</p>
            </div>
          )}
        </div>

        {/* APPLICATION MODAL */}
        {selectedJob && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(3, 37, 42, 0.65)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '540px',
                width: '100%',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
              }}
            >
              <button
                onClick={() => setSelectedJob(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={22} style={{ color: '#64748B' }} />
              </button>

              {submittedRefId ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <CheckCircle2 size={54} style={{ color: '#9BC83B', margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#03252A' }}>
                    Application Received!
                  </h3>
                  <div style={{ display: 'inline-block', background: 'rgba(0, 122, 135, 0.1)', padding: '6px 16px', borderRadius: '12px', fontWeight: 800, color: '#007A87', margin: '12px 0', fontSize: '0.95rem' }}>
                    Reference ID: {submittedRefId}
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '8px' }}>
                    Thank you for applying! Our HR Recruitment team will review your qualifications and contact you at <strong>{applicantPhone}</strong>.
                  </p>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="btn-primary"
                    style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#03252A', marginBottom: '4px' }}>
                    Apply for {selectedJob.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>
                    {selectedJob.department} • {selectedJob.location}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                    {/* Position Applied For (Read-only / Editable) */}
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Position Applied For *
                      </label>
                      <input
                        required
                        type="text"
                        value={positionApplied}
                        onChange={(e) => setPositionApplied(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#03252A',
                          background: '#F8FAFC'
                        }}
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Anand Varma"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    {/* Phone Number & Email */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Phone Number *
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="e.g. 9847012345"
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '12px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="e.g. anand@gmail.com"
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '12px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Location & Qualification */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Location / Area *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Kakkanad, Kochi"
                          value={applicantLocation}
                          onChange={(e) => setApplicantLocation(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '12px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Qualification *
                        </label>
                        <select
                          value={applicantQualification}
                          onChange={(e) => setApplicantQualification(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '12px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.9rem',
                            fontWeight: 600
                          }}
                        >
                          <option value="SSLC (10th)">SSLC (10th)</option>
                          <option value="Higher Secondary (12th)">Higher Secondary (12th)</option>
                          <option value="Diploma / ITI">Diploma / ITI</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Post Graduate">Post Graduate</option>
                          <option value="Other Certification">Other Certification</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', fontWeight: 800 }}
                  >
                    Submit Job Application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

