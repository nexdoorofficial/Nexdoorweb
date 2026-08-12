import React, { useState, useEffect } from 'react';
import { X, Car } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { VehicleCategoryKey, CarPackageItem } from '../../types';

interface Props {
  vehicleKey: VehicleCategoryKey | null;
  vehicleLabel: string;
  packageKey: string | null;
  packageData: CarPackageItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCarPackageModal: React.FC<Props> = ({
  vehicleKey,
  vehicleLabel,
  packageKey,
  packageData,
  isOpen,
  onClose
}) => {
  const { updateCarPackage } = useAdminData();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState('');
  const [overview, setOverview] = useState('');

  const [incInput, setIncInput] = useState('');
  const [included, setIncluded] = useState<string[]>([]);

  const [excInput, setExcInput] = useState('');
  const [excluded, setExcluded] = useState<string[]>([]);

  useEffect(() => {
    if (packageData) {
      setName(packageData.name);
      setTagline(packageData.tagline);
      setPrice(packageData.price);
      setDuration(packageData.duration);
      setOverview(packageData.overview);
      setIncluded(packageData.included || []);
      setExcluded(packageData.excluded || []);
    }
  }, [packageData]);

  if (!isOpen || !vehicleKey || !packageKey || !packageData) return null;

  const handleAddInc = () => {
    if (incInput.trim()) {
      setIncluded([...included, incInput.trim()]);
      setIncInput('');
    }
  };

  const handleRemoveInc = (idx: number) => {
    setIncluded(included.filter((_, i) => i !== idx));
  };

  const handleAddExc = () => {
    if (excInput.trim()) {
      setExcluded([...excluded, excInput.trim()]);
      setExcInput('');
    }
  };

  const handleRemoveExc = (idx: number) => {
    setExcluded(excluded.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateCarPackage(vehicleKey, packageKey, {
      ...packageData,
      name,
      tagline,
      price: Number(price) || 0,
      duration,
      overview,
      included,
      excluded
    });

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
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #E2E8F0',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Edit {vehicleLabel} - {name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                Update pricing, duration, and inclusions for this vehicle tier
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Package Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Tagline</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Package Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Estimated Duration</label>
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Overview</label>
            <textarea rows={2} value={overview} onChange={(e) => setOverview(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
          </div>

          {/* Included / Excluded Lists */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '14px', border: '1px solid #DCFCE7' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>What's Included</h4>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <input type="text" placeholder="Add inclusion..." value={incInput} onChange={(e) => setIncInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInc())} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #BBF7D0', fontSize: '0.8rem' }} />
                <button type="button" onClick={handleAddInc} style={{ background: '#166534', color: '#FFF', border: 'none', padding: '0 10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem' }}>Add</button>
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: '#15803D' }}>
                {included.map((item, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    {item} <span style={{ cursor: 'pointer', color: '#DC2626', marginLeft: '6px' }} onClick={() => handleRemoveInc(i)}>✕</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#FEF2F2', padding: '16px', borderRadius: '14px', border: '1px solid #FEE2E2' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#991B1B', marginBottom: '8px' }}>What's Excluded</h4>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <input type="text" placeholder="Add exclusion..." value={excInput} onChange={(e) => setExcInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExc())} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #FCA5A5', fontSize: '0.8rem' }} />
                <button type="button" onClick={handleAddExc} style={{ background: '#991B1B', color: '#FFF', border: 'none', padding: '0 10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem' }}>Add</button>
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: '#B91C1C' }}>
                {excluded.map((item, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    {item} <span style={{ cursor: 'pointer', color: '#DC2626', marginLeft: '6px' }} onClick={() => handleRemoveExc(i)}>✕</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 700 }}>Save Package</button>
          </div>
        </form>
      </div>
    </div>
  );
};
