import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Star,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  CalendarDays
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { StaffModal } from '../../components/admin/StaffModal';
import type { Technician } from '../../types/admin';

export const AdminStaff: React.FC = () => {
  const { technicians, locations, addStaff, updateStaff, deleteStaff, toggleStaffStatus } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Technician | null>(null);

  const filteredStaff = useMemo(() => {
    return technicians.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.phone && t.phone.includes(searchQuery)) ||
        (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [technicians, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: technicians.length,
    available: technicians.filter((t) => t.status === 'available').length,
    assigned: technicians.filter((t) => t.status === 'assigned').length,
    off: technicians.filter((t) => t.status === 'off').length,
    avgRating: technicians.length > 0 ? (technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length).toFixed(1) : '0.0'
  }), [technicians]);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (staff: Technician) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = (staff: Technician) => {
    if (window.confirm(`Are you sure you want to remove "${staff.name}"?`)) {
      deleteStaff(staff.id);
    }
  };

  const handleSave = (staffData: Omit<Technician, 'id'>) => {
    addStaff(staffData);
    setIsModalOpen(false);
  };

  const handleUpdate = (id: string, updates: Partial<Technician>) => {
    updateStaff(id, updates);
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const locationsList = locations.map((l) => ({ id: l.name, name: l.name }));

  const statusBadge = (status: Technician['status']) => {
    const map = {
      available: { bg: '#DCFCE7', color: '#166534', label: 'Available' },
      assigned: { bg: '#FEF3C7', color: '#92400E', label: 'Assigned' },
      off: { bg: '#F1F5F9', color: '#64748B', label: 'Off Duty' }
    };
    const s = map[status];
    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.72rem',
          fontWeight: 700,
          background: s.bg,
          color: s.color,
          whiteSpace: 'nowrap'
        }}
      >
        {s.label}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  };

  const avatarColors = ['#007A87', '#0D9488', '#7C3AED', '#DC2626', '#EA580C', '#0284C7', '#4F46E5', '#059669'];
  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Users size={28} style={{ color: '#007A87' }} />
            Assigned Staff
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Manage your field technicians and service crew
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #007A87, #0093A2)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 122, 135, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <UserPlus size={18} />
          Add Staff Member
        </button>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {[
          { label: 'Total Staff', value: stats.total, icon: Users, color: '#007A87', bg: '#EFF6FF' },
          { label: 'Available', value: stats.available, icon: ToggleRight, color: '#059669', bg: '#DCFCE7' },
          { label: 'Assigned', value: stats.assigned, icon: Briefcase, color: '#D97706', bg: '#FEF3C7' },
          { label: 'Off Duty', value: stats.off, icon: ToggleLeft, color: '#64748B', bg: '#F1F5F9' },
          { label: 'Avg Rating', value: `${stats.avgRating} ★`, icon: Star, color: '#EA580C', bg: '#FFF7ED' }
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '10px 16px',
            flex: '1 1 280px',
            maxWidth: '420px'
          }}
        >
          <Search size={16} style={{ color: '#94A3B8', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by name, role, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.88rem',
              color: '#0F172A',
              background: 'transparent'
            }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              appearance: 'none',
              padding: '10px 38px 10px 16px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="off">Off Duty</option>
          </select>
          <ChevronDown
            size={14}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8',
              pointerEvents: 'none'
            }}
          />
        </div>

        <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, marginLeft: 'auto' }}>
          Showing {filteredStaff.length} of {technicians.length}
        </div>
      </div>

      {/* Staff Cards Grid */}
      {filteredStaff.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0'
          }}
        >
          <Users size={48} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#64748B', margin: '0 0 4px 0' }}>
            No staff members found
          </p>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Add your first staff member to get started'}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '16px'
          }}
        >
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease'
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 20px 14px 20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${getAvatarColor(staff.name)}, ${getAvatarColor(staff.name)}CC)`,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: `0 4px 12px ${getAvatarColor(staff.name)}40`
                    }}
                  >
                    {getInitials(staff.name)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {staff.name}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, margin: '2px 0 0 0' }}>
                      {staff.role}
                    </p>
                  </div>
                </div>
                {statusBadge(staff.status)}
              </div>

              {/* Card Body — Contact & Details */}
              <div style={{ padding: '0 20px 14px 20px' }}>
                {/* Contact Row */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '12px',
                    fontSize: '0.78rem',
                    color: '#475569'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={13} style={{ color: '#007A87', flexShrink: 0 }} />
                    <span>{staff.phone}</span>
                  </div>
                  {staff.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={13} style={{ color: '#007A87', flexShrink: 0 }} />
                      <span>{staff.email}</span>
                    </div>
                  )}
                </div>

                {/* Info pills row */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '12px'
                  }}
                >
                  {staff.serviceArea && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {staff.serviceArea.split(',').map((areaName, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: '#F0FDF4',
                            color: '#166534',
                            fontSize: '0.72rem',
                            fontWeight: 600
                          }}
                        >
                          <MapPin size={11} />
                          {areaName.trim()}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: '#FFF7ED',
                      color: '#C2410C',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    <Star size={11} />
                    {staff.rating.toFixed(1)}
                  </div>
                  {staff.completedJobs !== undefined && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: '#EFF6FF',
                        color: '#1E40AF',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      <Briefcase size={11} />
                      {staff.completedJobs} jobs
                    </div>
                  )}
                  {staff.joinedDate && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: '#F8FAFC',
                        color: '#64748B',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      <CalendarDays size={11} />
                      {new Date(staff.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>

                {/* Specializations */}
                {staff.specializations && staff.specializations.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {staff.specializations.map((spec, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: '#F0F9FF',
                          color: '#0369A1',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          border: '1px solid #BAE6FD'
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer — Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  padding: '12px 20px',
                  borderTop: '1px solid #F1F5F9',
                  background: '#FAFBFC'
                }}
              >
                <button
                  onClick={() => toggleStaffStatus(staff.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Toggle Status"
                >
                  {staff.status === 'available' ? (
                    <ToggleRight size={14} style={{ color: '#059669' }} />
                  ) : (
                    <ToggleLeft size={14} style={{ color: '#94A3B8' }} />
                  )}
                  Toggle
                </button>
                <button
                  onClick={() => handleOpenEdit(staff)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 14px',
                    borderRadius: '10px',
                    border: '1px solid #DBEAFE',
                    background: '#EFF6FF',
                    color: '#1D4ED8',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Edit3 size={13} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(staff)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 14px',
                    borderRadius: '10px',
                    border: '1px solid #FECACA',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingStaff(null); }}
        onSave={handleSave}
        onUpdate={handleUpdate}
        editingStaff={editingStaff}
        locations={locationsList}
      />
    </div>
  );
};
