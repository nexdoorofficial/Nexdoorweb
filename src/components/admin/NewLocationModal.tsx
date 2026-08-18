import React, { useState, useEffect } from 'react';
import { X, MapPin, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { ServiceAreaAdmin } from '../../types/admin';

interface Props {
  locationToEdit?: ServiceAreaAdmin | null;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_PRIMARY_SERVICES = [
  { id: 'house-cleaning', label: 'House Cleaning', icon: '🏠' },
  { id: 'car-wash', label: 'Car Wash', icon: '🚗' },
  { id: 'laundry', label: 'Express Laundry', icon: '🧺' },
  { id: 'specialized', label: 'Specialized Hygiene', icon: '🧹' }
];

export const NewLocationModal: React.FC<Props> = ({ locationToEdit, isOpen, onClose }) => {
  const { addServiceLocation, updateServiceLocation, services } = useAdminData();

  const [name, setName] = useState('');
  const [zone, setZone] = useState('');
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'active' | 'coming_soon'>('active');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'house-cleaning',
    'car-wash',
    'laundry',
    'specialized'
  ]);

  // Combine default primary services with any custom services created by admin
  const allServiceOptions = React.useMemo(() => {
    const list = [...DEFAULT_PRIMARY_SERVICES];
    (services || []).forEach((s) => {
      if (!list.some((existing) => existing.id === s.id || existing.id === s.category)) {
        list.push({
          id: s.id,
          label: s.title,
          icon: '✨'
        });
      }
    });
    return list;
  }, [services]);

  useEffect(() => {
    if (locationToEdit) {
      setName(locationToEdit.name);
      setZone(locationToEdit.zone);
      setPincode(locationToEdit.pincode);
      setStatus(locationToEdit.status);
      setSelectedServices(
        locationToEdit.availableServices && locationToEdit.availableServices.length > 0
          ? locationToEdit.availableServices
          : ['house-cleaning', 'car-wash', 'laundry', 'specialized']
      );
    } else {
      setName('');
      setZone('');
      setPincode('682001');
      setStatus('active');
      setSelectedServices(allServiceOptions.map((s) => s.id));
    }
  }, [locationToEdit, isOpen, allServiceOptions]);

  if (!isOpen) return null;

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleAllServices = () => {
    if (selectedServices.length === allServiceOptions.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(allServiceOptions.map((s) => s.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (locationToEdit) {
      updateServiceLocation(locationToEdit.id, {
        name,
        zone,
        pincode,
        status,
        availableServices: selectedServices
      });
    } else {
      addServiceLocation({
        name,
        zone,
        pincode,
        status,
        availableServices: selectedServices
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
        maxWidth: '540px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #E2E8F0',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #007A87, #0093A2)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#03252A', margin: 0 }}>
                {locationToEdit ? 'Edit Service Location' : 'Add New Service Location'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                Expand coverage zone & available service dispatch
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
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

          {/* Available Services Selector */}
          <div style={{ marginBottom: '24px', background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚡ Available Services in Location
              </label>
              <button
                type="button"
                onClick={toggleAllServices}
                style={{ background: 'none', border: 'none', color: '#007A87', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                {selectedServices.length === allServiceOptions.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 12px 0', lineHeight: 1.35 }}>
              Choose which services are offered in this location. Unchecked services will show as unavailable on user side.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {allServiceOptions.map((srv) => {
                const isChecked = selectedServices.includes(srv.id);

                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      userSelect: 'none',
                      transition: 'all 0.15s ease',
                      background: isChecked
                        ? 'linear-gradient(135deg, #007A87, #0093A2)'
                        : '#FFFFFF',
                      color: isChecked ? '#FFFFFF' : '#475569',
                      border: isChecked ? '1px solid transparent' : '1px solid #CBD5E1',
                      boxShadow: isChecked ? '0 4px 12px rgba(0, 122, 135, 0.25)' : 'none'
                    }}
                  >
                    <span>{srv.icon}</span>
                    <span>{srv.label}</span>
                    {isChecked && <CheckCircle2 size={14} style={{ marginLeft: '2px' }} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #007A87, #0093A2)', color: '#FFF', fontWeight: 700 }}>
              {locationToEdit ? 'Save Changes' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
