import React, { useState, useEffect } from 'react';
import { X, UserPlus, Users, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { Technician } from '../../types/admin';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Omit<Technician, 'id'>) => void;
  onUpdate?: (id: string, updates: Partial<Technician>) => void;
  editingStaff?: Technician | null;
  locations: { id: string; name: string }[];
}

const DEFAULT_SPECIALIZATION_SUGGESTIONS = [
  'House Cleaning',
  'Car Wash',
  'Laundry',
  'Deep Sanitization',
  'Detailing',
  'Floor Care',
  'Dry Cleaning'
];

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingStaff,
  locations
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [selectedZones, setSelectedZones] = useState<string[]>(['All Locations']);
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);
  const [rating, setRating] = useState<number>(4.9);
  const [status, setStatus] = useState<Technician['status']>('available');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState('');

  useEffect(() => {
    if (editingStaff) {
      setName(editingStaff.name || '');
      setPhone(editingStaff.phone || '');
      setEmail(editingStaff.email || '');
      setRole(editingStaff.role || '');
      
      const rawArea = editingStaff.serviceArea || '';
      if (!rawArea || rawArea === 'All Locations') {
        setSelectedZones(['All Locations']);
      } else {
        const parsed = rawArea.split(',').map((s) => s.trim()).filter(Boolean);
        setSelectedZones(parsed.length > 0 ? parsed : ['All Locations']);
      }

      setRating(editingStaff.rating ?? 4.9);
      setStatus(editingStaff.status || 'available');
      setSpecializations(editingStaff.specializations || []);
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setRole('');
      setSelectedZones(['All Locations']);
      setRating(4.9);
      setStatus('available');
      setSpecializations(['House Cleaning']);
    }
    setIsZoneDropdownOpen(false);
    setSpecInput('');
  }, [editingStaff, isOpen, locations]);

  if (!isOpen) return null;

  const handleZoneToggle = (zoneName: string) => {
    if (zoneName === 'All Locations') {
      setSelectedZones(['All Locations']);
    } else {
      let updated = selectedZones.filter((z) => z !== 'All Locations');
      if (updated.includes(zoneName)) {
        updated = updated.filter((z) => z !== zoneName);
      } else {
        updated.push(zoneName);
      }

      if (updated.length === 0 || updated.length === locations.length) {
        setSelectedZones(['All Locations']);
      } else {
        setSelectedZones(updated);
      }
    }
  };

  const handleAddSpec = (specToAdd?: string) => {
    const val = (specToAdd || specInput).trim();
    if (val && !specializations.includes(val)) {
      setSpecializations((prev) => [...prev, val]);
      if (!specToAdd) setSpecInput('');
    }
  };

  const handleRemoveSpec = (specToRemove: string) => {
    setSpecializations((prev) => prev.filter((s) => s !== specToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !role.trim()) return;

    const finalServiceArea = selectedZones.includes('All Locations')
      ? 'All Locations'
      : selectedZones.join(', ');

    if (editingStaff && onUpdate) {
      onUpdate(editingStaff.id, {
        name,
        phone,
        email,
        role,
        serviceArea: finalServiceArea,
        rating: Number(rating),
        status,
        specializations
      });
    } else {
      onSave({
        name,
        phone,
        email,
        role,
        serviceArea: finalServiceArea,
        rating: Number(rating),
        status,
        specializations,
        joinedDate: new Date().toISOString().split('T')[0],
        completedJobs: 0
      });
    }

    onClose();
  };

  const getZoneDisplayText = () => {
    if (selectedZones.includes('All Locations')) {
      return '📍 All Locations (Global)';
    }
    if (selectedZones.length === 1) {
      return `📍 ${selectedZones[0]}`;
    }
    return `📍 ${selectedZones.length} Zones (${selectedZones.join(', ')})`;
  };

  return (
    <div
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        maxHeight: '100vh',
        overflowY: 'auto'
      }}
    >
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        className="custom-scrollbar"
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          maxHeight: '86vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #F1F5F9'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {editingStaff ? <Users size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>
                {editingStaff ? 'Update technician profile & assignment' : 'Register a new field crew lead or specialist'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {/* Name & Role */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Anish V."
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Role / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sanitization Crew Lead"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="+91 98950 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="anish@nexdoor.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Service Area, Status & Rating */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {/* Multi-Select Assigned Zone */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Assigned Zone(s)
              </label>
              
              <div
                onClick={() => setIsZoneDropdownOpen(!isZoneDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FFF',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: isZoneDropdownOpen ? '0 0 0 2px rgba(41, 195, 190, 0.3)' : 'none'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getZoneDisplayText()}
                </span>
                {isZoneDropdownOpen ? <ChevronUp size={14} color="#64748B" /> : <ChevronDown size={14} color="#64748B" />}
              </div>

              {/* Checkbox Popover */}
              {isZoneDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: '#FFFFFF',
                    border: '1.5px solid #29C3BE',
                    borderRadius: '12px',
                    padding: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 20
                  }}
                >
                  <div
                    className="custom-scrollbar"
                    onWheel={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      maxHeight: '160px',
                      overflowY: 'auto',
                      overscrollBehavior: 'contain',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: selectedZones.includes('All Locations') ? '#EEF2FF' : '#F8FAFC',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: selectedZones.includes('All Locations') ? '#1C2677' : '#334155'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedZones.includes('All Locations')}
                        onChange={() => handleZoneToggle('All Locations')}
                        style={{ accentColor: '#1C2677', width: '14px', height: '14px', cursor: 'pointer' }}
                      />
                      <span>📍 All Locations (Global)</span>
                    </label>

                    {locations.map((loc) => {
                      const isChecked = selectedZones.includes('All Locations') || selectedZones.includes(loc.name);
                      return (
                        <label
                          key={loc.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            background: isChecked ? '#EEF2FF' : '#F8FAFC',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: isChecked ? '#1C2677' : '#334155'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleZoneToggle(loc.name)}
                            style={{ accentColor: '#1C2677', width: '14px', height: '14px', cursor: 'pointer' }}
                          />
                          <span>📍 {loc.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Technician['status'])}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.85rem' }}
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="off">Off Duty</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Rating (1-5★)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Specializations Tag Manager */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Service Specializations
            </label>

            {/* Suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {DEFAULT_SPECIALIZATION_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSpec(s)}
                  disabled={specializations.includes(s)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '16px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    border: '1px solid #E2E8F0',
                    background: specializations.includes(s) ? '#F1F5F9' : '#FFFFFF',
                    color: specializations.includes(s) ? '#94A3B8' : '#334155',
                    cursor: specializations.includes(s) ? 'default' : 'pointer'
                  }}
                >
                  + {s}
                </button>
              ))}
            </div>

            {/* Active Pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                minHeight: '44px',
                alignItems: 'center'
              }}
            >
              {specializations.map((spec) => (
                <span
                  key={spec}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: '#EFF6FF',
                    color: '#1E40AF',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid #BFDBFE'
                  }}
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(spec)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1E40AF', opacity: 0.8, padding: 0, display: 'flex' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '120px' }}>
                <input
                  type="text"
                  placeholder="Type custom skill..."
                  value={specInput}
                  onChange={(e) => setSpecInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSpec();
                    }
                  }}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', width: '100%' }}
                />
                {specInput && (
                  <button
                    type="button"
                    onClick={() => handleAddSpec()}
                    style={{ background: '#1C2677', color: '#FFF', border: 'none', borderRadius: '6px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    <Plus size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(41, 195, 190, 0.25)'
              }}
            >
              {editingStaff ? 'Save Changes' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
