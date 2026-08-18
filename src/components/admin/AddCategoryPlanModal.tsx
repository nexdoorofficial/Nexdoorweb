import React, { useState } from 'react';
import { X, Home, Car } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { HouseCategoryKey, VehicleCategoryKey } from '../../types';

interface Props {
  categoryType: 'house' | 'car';
  houseCategoryKey?: HouseCategoryKey | null;
  vehicleCategoryKey?: VehicleCategoryKey | null;
  categoryLabel: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddCategoryPlanModal: React.FC<Props> = ({
  categoryType,
  houseCategoryKey,
  vehicleCategoryKey,
  categoryLabel,
  isOpen,
  onClose
}) => {
  const { addHouseCategoryPlan, updateCarPackage } = useAdminData();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('Comprehensive deep sanitization');
  const [priceNumeric, setPriceNumeric] = useState<number>(2499);
  const [duration, setDuration] = useState('3 - 4 Hours');
  const [professionals, setProfessionals] = useState<number>(2);
  const [overview, setOverview] = useState('Deep sanitization plan customized for this category.');

  const [incInput, setIncInput] = useState('');
  const [included, setIncluded] = useState<string[]>([
    'Complete surface deep scrub',
    'Kitchen countertop & appliance scrub',
    'Bathroom wall tile & fixture descaling'
  ]);

  const [excInput, setExcInput] = useState('');
  const [excluded, setExcluded] = useState<string[]>([
    'Inside wardrobe organizing',
    'Structural painting repairs'
  ]);

  if (!isOpen) return null;

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

    if (!name.trim()) {
      alert('Please enter a Plan Name.');
      return;
    }

    if (categoryType === 'house' && houseCategoryKey) {
      addHouseCategoryPlan(houseCategoryKey, {
        id: 'plan-' + Date.now(),
        name,
        priceDisplay: `₹${priceNumeric.toLocaleString()}`,
        priceNumeric: Number(priceNumeric),
        description: overview,
        duration,
        professionals: Number(professionals),
        frequency: 'One-Time Deep Clean',
        prepInstructions: ['Keep loose valuables in closed drawers.'],
        afterCare: ['Ventilate rooms for 30 minutes after completion.'],
        included,
        excluded
      });
    } else if (categoryType === 'car' && vehicleCategoryKey) {
      const generatedId = name.toLowerCase().replace(/[^a-z0-9]/g, '-') || ('pkg-' + Date.now());
      updateCarPackage(vehicleCategoryKey, generatedId, {
        id: generatedId,
        name,
        tagline,
        price: Number(priceNumeric),
        duration,
        overview,
        frequency: 'Per Wash Service',
        included,
        excluded
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
        maxWidth: '640px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #E2E8F0',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #007A87, #0093A2)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {categoryType === 'house' ? <Home size={20} /> : <Car size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#03252A', margin: 0 }}>
                Add New Plan Tier to {categoryLabel}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                Configure pricing, features, duration, inclusions & exclusions
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Plan Tier Name *</label>
              <input type="text" required placeholder="e.g. Executive Protocol Clean" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Price (₹) *</label>
              <input type="number" required value={priceNumeric} onChange={(e) => setPriceNumeric(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#007A87' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: categoryType === 'house' ? '1fr 1fr' : '1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Estimated Duration</label>
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
            {categoryType === 'house' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Staff Count</label>
                <input type="number" value={professionals} onChange={(e) => setProfessionals(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
            )}
          </div>

          {categoryType === 'car' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Tagline</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Plan Description & Overview</label>
            <textarea rows={2} value={overview} onChange={(e) => setOverview(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
          </div>

          {/* Included & Excluded Items */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>What's Included</h4>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <input type="text" placeholder="Add..." value={incInput} onChange={(e) => setIncInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInc())} style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #BBF7D0', fontSize: '0.78rem' }} />
                <button type="button" onClick={handleAddInc} style={{ background: '#166534', color: '#FFF', border: 'none', padding: '0 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
              </div>
              <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.78rem', color: '#15803D' }}>
                {included.map((item, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    {item} <span style={{ cursor: 'pointer', color: '#DC2626', marginLeft: '4px' }} onClick={() => handleRemoveInc(i)}>✕</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#FEF2F2', padding: '14px', borderRadius: '12px', border: '1px solid #FEE2E2' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', marginBottom: '8px' }}>What's Excluded</h4>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <input type="text" placeholder="Add..." value={excInput} onChange={(e) => setExcInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExc())} style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #FCA5A5', fontSize: '0.78rem' }} />
                <button type="button" onClick={handleAddExc} style={{ background: '#991B1B', color: '#FFF', border: 'none', padding: '0 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
              </div>
              <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.78rem', color: '#B91C1C' }}>
                {excluded.map((item, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    {item} <span style={{ cursor: 'pointer', color: '#DC2626', marginLeft: '4px' }} onClick={() => handleRemoveExc(i)}>✕</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #007A87, #0093A2)', color: '#FFF', fontWeight: 700 }}>
              Add Plan Tier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
