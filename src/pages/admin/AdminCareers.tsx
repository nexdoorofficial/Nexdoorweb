import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Search,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  CheckCircle2,
  Edit3,
  X,
  Eye
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { CandidateDetailModal } from '../../components/admin/CandidateDetailModal';
import type { JobApplication, ApplicationStatus } from '../../types/admin';
import type { CareerPosition } from '../../types';

export const AdminCareers: React.FC = () => {
  const {
    careerPositions,
    addCareerPosition,
    updateCareerPosition,
    deleteCareerPosition,
    toggleCareerPositionStatus,
    jobApplications,
    updateJobApplicationStatus,
    updateJobApplicationNotes,
    deleteJobApplication
  } = useAdminData();

  const [activeTab, setActiveTab] = useState<'applications' | 'requirements'>('applications');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<JobApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Job Opening Modal state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<CareerPosition | null>(null);

  // Form states for New/Edit Job
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('');
  const [jobType, setJobType] = useState<'Full-Time' | 'Part-Time' | 'Shift'>('Full-Time');
  const [jobLocation, setJobLocation] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState('');

  const totalApplications = (jobApplications || []).length;
  const newApplications = (jobApplications || []).filter((a) => a.status === 'new').length;
  const reviewedApplications = (jobApplications || []).filter((a) => a.status === 'reviewed').length;
  const interviewedApplications = (jobApplications || []).filter((a) => a.status === 'interviewed').length;
  const hiredApplications = (jobApplications || []).filter((a) => a.status === 'hired').length;
  const rejectedApplications = (jobApplications || []).filter((a) => a.status === 'rejected').length;

  const filteredApplications = (jobApplications || []).filter((app) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.applicantName.toLowerCase().includes(q) ||
      app.phone.includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.positionApplied.toLowerCase().includes(q) ||
      app.referenceId.toLowerCase().includes(q) ||
      app.qualification.toLowerCase().includes(q) ||
      app.location.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterStatus !== 'all') {
      return app.status === filterStatus;
    }

    return true;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'new':
        return { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE', label: '🆕 NEW' };
      case 'reviewed':
        return { bg: '#F0FDFA', color: '#0F766E', border: '#CCFBF1', label: '👁️ REVIEWED' };
      case 'interviewed':
        return { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A', label: '⏳ INTERVIEWED' };
      case 'hired':
        return { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0', label: '✓ HIRED 🎉' };
      case 'rejected':
        return { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA', label: '❌ REJECTED' };
    }
  };

  const handleOpenDetail = (app: JobApplication) => {
    setSelectedCandidate(app);
    setIsDetailModalOpen(true);
  };

  const handleOpenAddJob = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobDept('Operations');
    setJobType('Full-Time');
    setJobLocation('Kakkanad HQ');
    setJobSalary('₹25,000 - ₹32,000 / month');
    setJobDesc('');
    setJobReqs([
      'Prior experience in cleaning / detailing operations',
      'Valid driving license preferred'
    ]);
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job: CareerPosition) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobDept(job.department);
    setJobType((job.type as any) || 'Full-Time');
    setJobLocation(job.location);
    setJobSalary(job.salary);
    setJobDesc(job.description);
    setJobReqs(job.requirements || []);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobLocation || !jobSalary) return;

    if (editingJob) {
      updateCareerPosition(editingJob.id, {
        title: jobTitle,
        department: jobDept,
        type: jobType,
        location: jobLocation,
        salary: jobSalary,
        description: jobDesc,
        requirements: jobReqs
      });
    } else {
      addCareerPosition({
        title: jobTitle,
        department: jobDept,
        type: jobType,
        location: jobLocation,
        salary: jobSalary,
        description: jobDesc,
        responsibilities: [],
        requirements: jobReqs,
        status: 'active'
      });
    }

    setIsJobModalOpen(false);
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={24} style={{ color: '#007A87' }} />
            Careers & HR Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Review candidate applications, manage recruitment stages, and publish career requirements
          </p>
        </div>

        {/* Compact Stats Badges */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ background: '#FFFFFF', padding: '8px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#475569' }}>
            Total: <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>{totalApplications}</strong>
          </div>
          <div style={{ background: '#EFF6FF', padding: '8px 14px', borderRadius: '12px', border: '1px solid #BFDBFE', fontSize: '0.8rem', color: '#1E40AF' }}>
            New: <strong style={{ color: '#1E40AF', fontSize: '0.95rem' }}>{newApplications}</strong>
          </div>
          <div style={{ background: '#FEF3C7', padding: '8px 14px', borderRadius: '12px', border: '1px solid #FDE68A', fontSize: '0.8rem', color: '#B45309' }}>
            Interviewed: <strong style={{ color: '#B45309', fontSize: '0.95rem' }}>{interviewedApplications}</strong>
          </div>
          <div style={{ background: '#DCFCE7', padding: '8px 14px', borderRadius: '12px', border: '1px solid #BBF7D0', fontSize: '0.8rem', color: '#15803D' }}>
            Hired: <strong style={{ color: '#15803D', fontSize: '0.95rem' }}>{hiredApplications}</strong>
          </div>
        </div>
      </div>

      {/* Main Section Navigation Bar */}
      <div
        style={{
          background: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('applications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: activeTab === 'applications' ? 'none' : '1px solid #E2E8F0',
              background: activeTab === 'applications' ? '#007A87' : '#F8FAFC',
              color: activeTab === 'applications' ? '#FFFFFF' : '#475569',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Users size={16} /> Candidate Applications ({totalApplications})
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: activeTab === 'requirements' ? 'none' : '1px solid #E2E8F0',
              background: activeTab === 'requirements' ? '#007A87' : '#F8FAFC',
              color: activeTab === 'requirements' ? '#FFFFFF' : '#475569',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Briefcase size={16} /> Manage Job Openings ({careerPositions ? careerPositions.length : 0})
          </button>
        </div>

        {activeTab === 'requirements' && (
          <button
            onClick={handleOpenAddJob}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #007A87, #0093A2)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.82rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 122, 135, 0.3)'
            }}
          >
            <Plus size={16} /> Add Job Requirement
          </button>
        )}
      </div>

      {/* TAB 1: CANDIDATE APPLICATIONS TABLE */}
      {activeTab === 'applications' && (
        <div>
          {/* Toolbar: Search & Filter Tabs */}
          <div
            style={{
              background: '#FFFFFF',
              padding: '14px 18px',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '8px 12px',
                minWidth: '280px',
                flex: 1
              }}
            >
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search candidate name, phone, email, ref ID, qualification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `All (${totalApplications})` },
                { id: 'new', label: `New (${newApplications})` },
                { id: 'reviewed', label: `Reviewed (${reviewedApplications})` },
                { id: 'interviewed', label: `Interviewed (${interviewedApplications})` },
                { id: 'hired', label: `Hired 🎉 (${hiredApplications})` },
                { id: 'rejected', label: `Rejected (${rejectedApplications})` }
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
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr
                    style={{
                      background: '#F8FAFC',
                      borderBottom: '1px solid #E2E8F0',
                      color: '#64748B',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    <th style={{ padding: '14px 18px' }}>Status</th>
                    <th style={{ padding: '14px 18px' }}>Ref ID</th>
                    <th style={{ padding: '14px 18px' }}>Candidate Name</th>
                    <th style={{ padding: '14px 18px' }}>Contact Phone / Email</th>
                    <th style={{ padding: '14px 18px' }}>Position Applied</th>
                    <th style={{ padding: '14px 18px' }}>Location & Qualification</th>
                    <th style={{ padding: '14px 18px' }}>Date Submitted</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => {
                    const badge = getStatusBadge(app.status);

                    return (
                      <tr
                        key={app.id}
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
                            value={app.status}
                            onChange={(e) => updateJobApplicationStatus(app.id, e.target.value as ApplicationStatus)}
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
                            <option value="reviewed">👁️ Reviewed</option>
                            <option value="interviewed">⏳ Interviewed</option>
                            <option value="hired">✓ Hired 🎉</option>
                            <option value="rejected">❌ Rejected</option>
                          </select>
                        </td>

                        {/* Reference ID */}
                        <td style={{ padding: '14px 18px' }} onClick={() => handleOpenDetail(app)}>
                          <span style={{ fontWeight: 800, color: '#007A87', background: '#EEF2FF', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                            {app.referenceId}
                          </span>
                        </td>

                        {/* Candidate Name */}
                        <td style={{ padding: '14px 18px' }} onClick={() => handleOpenDetail(app)}>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>{app.applicantName}</div>
                        </td>

                        {/* Contact Phone & Email */}
                        <td style={{ padding: '14px 18px' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <a
                              href={`tel:${app.phone}`}
                              style={{ color: '#007A87', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Phone size={12} style={{ color: '#007A87' }} /> {app.phone}
                            </a>
                            {app.email && (
                              <a
                                href={`mailto:${app.email}`}
                                style={{ color: '#64748B', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Mail size={12} /> {app.email}
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Position Applied */}
                        <td style={{ padding: '14px 18px' }} onClick={() => handleOpenDetail(app)}>
                          <span style={{ background: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {app.positionApplied}
                          </span>
                        </td>

                        {/* Location & Qualification */}
                        <td style={{ padding: '14px 18px' }} onClick={() => handleOpenDetail(app)}>
                          <div style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                            <MapPin size={12} style={{ color: '#E11D48', display: 'inline', marginRight: '4px' }} />
                            {app.location}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            <GraduationCap size={12} style={{ color: '#D97706', display: 'inline', marginRight: '4px' }} />
                            {app.qualification}
                          </div>
                        </td>

                        {/* Date Submitted */}
                        <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '0.8rem' }} onClick={() => handleOpenDetail(app)}>
                          {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 18px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenDetail(app)}
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
                                if (window.confirm(`Delete candidate application ${app.referenceId} from ${app.applicantName}?`)) {
                                  deleteJobApplication(app.id);
                                }
                              }}
                              style={{ background: '#FEE2E2', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#DC2626' }}
                              title="Delete Candidate Application"
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

            {filteredApplications.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                <Users size={36} style={{ color: '#94A3B8', marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 700 }}>No candidate applications match your current search or status filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: JOB REQUIREMENTS & POSTINGS */}
      {activeTab === 'requirements' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {careerPositions.map((job) => {
            const isClosed = job.status === 'closed';
            return (
              <div
                key={job.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: isClosed ? '1px solid #E2E8F0' : '2px solid #007A87',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: isClosed ? 0.75 : 1
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: job.type === 'Full-Time' ? '#EFF6FF' : '#FEF3C7',
                        color: job.type === 'Full-Time' ? '#1D4ED8' : '#B45309',
                        padding: '4px 10px',
                        borderRadius: '12px'
                      }}
                    >
                      {job.type}
                    </span>

                    <button
                      onClick={() => toggleCareerPositionStatus(job.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        background: isClosed ? '#F1F5F9' : '#D1FAE5',
                        color: isClosed ? '#64748B' : '#065F46'
                      }}
                    >
                      {isClosed ? 'CLOSED ●' : 'ACTIVE OPENING ●'}
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#03252A', marginBottom: '6px' }}>
                    {job.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, marginBottom: '10px' }}>
                    {job.department} • {job.location}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#007A87', marginBottom: '14px' }}>
                    {job.salary}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                    {job.description}
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#03252A', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Key Requirements:
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#334155', padding: 0 }}>
                      {job.requirements?.map((req, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} style={{ color: '#9BC83B', flexShrink: 0 }} />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <button
                    onClick={() => handleOpenEditJob(job)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      color: '#334155',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={15} /> Edit Requirement
                  </button>

                  <button
                    onClick={() => deleteCareerPosition(job.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      color: '#DC2626',
                      cursor: 'pointer'
                    }}
                    title="Delete Job Requirement"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CANDIDATE DETAIL MODAL */}
      <CandidateDetailModal
        application={selectedCandidate}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateStatus={updateJobApplicationStatus}
        onUpdateNotes={updateJobApplicationNotes}
        onDelete={deleteJobApplication}
      />

      {/* NEW/EDIT JOB OPENING MODAL */}
      {isJobModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {editingJob ? 'Edit Job Requirement' : 'Publish New Job Requirement'}
              </h3>
              <button onClick={() => setIsJobModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Job Position Title *</label>
                <input required type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior House Cleaning Supervisor" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Department</label>
                  <input type="text" value={jobDept} onChange={(e) => setJobDept(e.target.value)} placeholder="Operations / Detailing" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Work Type</label>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value as any)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Shift">Shift</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Hub / Location *</label>
                  <input required type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} placeholder="Kakkanad / Edappally Hub" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Salary Range *</label>
                  <input required type="text" value={jobSalary} onChange={(e) => setJobSalary(e.target.value)} placeholder="₹25,000 - ₹32,000 / month" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Job Overview & Role Description</label>
                <textarea rows={3} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Lead residential cleaning specialists operating floor scrubbers and steam machines..." style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }} />
              </div>

              {/* Requirements List Manager */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Key Candidate Requirements</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    placeholder="Add requirement e.g. Valid 2-wheeler driver license"
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (reqInput.trim()) {
                        setJobReqs([...jobReqs, reqInput.trim()]);
                        setReqInput('');
                      }
                    }}
                    style={{ padding: '8px 14px', borderRadius: '8px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    + Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {jobReqs.map((req, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                      <span>• {req}</span>
                      <button type="button" onClick={() => setJobReqs(jobReqs.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsJobModalOpen(false)} style={{ padding: '12px 20px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #007A87, #0093A2)', color: '#FFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                  {editingJob ? 'Save Changes' : 'Publish Job Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
