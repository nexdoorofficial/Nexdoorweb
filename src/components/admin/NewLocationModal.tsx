import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { ServiceAreaAdmin } from '../../types/admin';

interface Props {
  locationToEdit?: ServiceAreaAdmin | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NewLocationModal: React.FC<Props> = ({ locationToEdit, isOpen, onClose }) => {
  const { addServiceLocation, updateServiceLocation } = useAdminData();

  const [name, setName] = useState('');
  const [zone, setZone] = useState('');
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'active' | 'coming_soon'>('active');

  useEffect(() => {
    if (locationToEdit) {
      setName(locationToEdit.name);
      setZone(locationToEdit.zone);
      setPincode(locationToEdit.pincode);
      setStatus(locationToEdit.status);
    } else {
      setName('');
      setZone('');
      setPincode('682001');
      setStatus('active');
    }
  }, [locationToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (locationToEdit) {
      updateServiceLocation(locationToEdit.id, {
        name,
        zone,
        pincode,
        status
      });
    } else {
      addServiceLocation({
        name,
        zone,
        pincode,
        status
      });
    }

    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #E2E8F0',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #1C2677, #29C3BE)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                {locationToEdit ? 'Edit Service Location' : 'Add New Service Location'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                Expand coverage zone & operational pincode
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Location / Neighborhood Name *</label>
            <input type="text" required placeholder="e.g. Fort Kochi, Panampilly Nagar" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Zone Description</label>
            <input type="text" placeholder="e.g. Heritage Island & Coastal Belt" value={zone} onChange={(e) => setZone(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Pincode *</label>
              <input type="text" required value={pincode} onChange={(e) => setPincode(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Service Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF' }}>
                <option value="active">Active Operations</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #1C2677, #29C3BE)', color: '#FFF', fontWeight: 700 }}>
              {locationToEdit ? 'Save Changes' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
