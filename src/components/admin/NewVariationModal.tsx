import React, { useState } from 'react';
import { X, Home, Car } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';

interface Props {
  type: 'house' | 'car';
  isOpen: boolean;
  onClose: () => void;
}

export const NewVariationModal: React.FC<Props> = ({ type, isOpen, onClose }) => {
  const { addHouseCategory, addVehicleCategory } = useAdminData();

  // House fields
  const [houseLabel, setHouseLabel] = useState('');
  const [sqftRange, setSqftRange] = useState('');
  const [stdPrice, setStdPrice] = useState(1999);
  const [premPrice, setPremPrice] = useState(2999);

  // Car fields
  const [vehLabel, setVehLabel] = useState('');
  const [vehExamples, setVehExamples] = useState('');
  const [basicPrice, setBasicPrice] = useState(499);
  const [premiumPrice, setPremiumPrice] = useState(849);
  const [interiorPrice, setInteriorPrice] = useState(1399);
  const [completePrice, setCompletePrice] = useState(2399);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'house') {
      const generatedId = houseLabel.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'custom-house';
      addHouseCategory({
        id: generatedId as any,
        label: houseLabel || 'New House Variation',
        sqftRange: sqftRange || '1,000 - 2,000 sq.ft',
        description: `Custom ${houseLabel} residential cleaning configuration.`,
        standard: {
          name: `${houseLabel} Standard Clean`,
          priceDisplay: `₹${stdPrice.toLocaleString()}`,
          priceNumeric: Number(stdPrice),
          duration: '3 - 4 Hours',
          professionals: 2,
          description: 'Essential deep cleaning for all primary living spaces.',
          frequency: 'One-Time Deep Clean',
          prepInstructions: ['Keep loose valuables in closed drawers.'],
          afterCare: ['Ventilate rooms for 30 minutes after completion.'],
          included: ['Floor sweeping & mopping', 'Dusting open surfaces', 'Bathroom sanitization'],
          excluded: ['Wall painting', 'Exterior rope access']
        },
        premium: {
          name: `${houseLabel} Premium Ultra`,
          priceDisplay: `₹${premPrice.toLocaleString()}`,
          priceNumeric: Number(premPrice),
          duration: '4 - 5 Hours',
          professionals: 3,
          description: 'All-inclusive deep sanitization with single-disc floor scrubbing.',
          frequency: 'One-Time Deep Clean',
          prepInstructions: ['Clear kitchen countertops of small utensils.'],
          afterCare: ['Allow sanitized floors 20 minutes to air-dry completely.'],
          included: ['Standard plan included', 'Single-disc floor scrubbing', 'Steam sanitization'],
          excluded: ['Structural alterations']
        }
      });
    } else {
      const generatedId = vehLabel.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'custom-car';
      addVehicleCategory({
        id: generatedId as any,
        label: vehLabel || 'New Vehicle Variation',
        examples: vehExamples || 'Custom vehicle models',
        description: `Custom vehicle wash packages for ${vehLabel}.`,
        packages: {
          basic: {
            id: 'basic',
            name: 'Basic Eco Wash',
            tagline: 'Exterior foam wash & tire shine',
            price: Number(basicPrice),
            duration: '35 - 45 Mins',
            overview: 'Quick eco foam wash and tire dressing.',
            frequency: 'Per Service Session',
            included: ['High-pressure water rinse', 'Snow foam exterior wash'],
            excluded: ['Interior vacuuming']
          },
          premium: {
            id: 'premium',
            name: 'Premium Hydro Wash',
            tagline: 'Exterior wash & interior vacuuming',
            price: Number(premiumPrice),
            duration: '60 - 75 Mins',
            overview: 'Complete exterior and interior care.',
            frequency: 'Per Service Session',
            included: ['Basic wash included', 'Interior cabin vacuuming'],
            excluded: ['Engine bay cleaning']
          },
          interior: {
            id: 'interior',
            name: 'Interior Deep Detailing',
            tagline: 'Seat shampooing & dashboard polish',
            price: Number(interiorPrice),
            duration: '2 - 3 Hours',
            overview: 'Restorative cabin deep detailing.',
            frequency: 'Per Service Session',
            included: ['Upholstery shampooing', 'AC vent steam cleaning'],
            excluded: ['Exterior paint restoration']
          },
          complete: {
            id: 'complete',
            name: 'Full Vehicle Detailing',
            tagline: 'Full interior + exterior ceramic wax',
            price: Number(completePrice),
            duration: '3 - 4 Hours',
            overview: 'Showroom finish detailing.',
            frequency: 'Per Service Session',
            included: ['Interior deep detailing', 'Hard wax polish treatment'],
            excluded: ['Engine overhaul']
          }
        }
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
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #E2E8F0',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: type === 'house' ? '#1C2677' : '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {type === 'house' ? <Home size={20} /> : <Car size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Add New {type === 'house' ? 'House Category' : 'Vehicle Category'} Variation
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                {type === 'house' ? 'e.g. 5 BHK, Studio, Commercial Studio' : 'e.g. Pickup Truck, Electric Car, Mini Van'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {type === 'house' ? (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Variation Label *</label>
                <input type="text" required placeholder="e.g. 5 BHK / Penthouse" value={houseLabel} onChange={(e) => setHouseLabel(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Sq.Ft. Coverage Range</label>
                <input type="text" placeholder="e.g. 2,500 - 3,500 sq.ft" value={sqftRange} onChange={(e) => setSqftRange(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Standard Plan Base Price (₹)</label>
                  <input type="number" value={stdPrice} onChange={(e) => setStdPrice(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Premium Plan Base Price (₹)</label>
                  <input type="number" value={premPrice} onChange={(e) => setPremPrice(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Vehicle Class Label *</label>
                <input type="text" required placeholder="e.g. Pickup Truck / Mini Van" value={vehLabel} onChange={(e) => setVehLabel(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Example Models</label>
                <input type="text" placeholder="e.g. Isuzu D-Max, Hilux, Carnival" value={vehExamples} onChange={(e) => setVehExamples(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Basic Wash Price (₹)</label>
                  <input type="number" value={basicPrice} onChange={(e) => setBasicPrice(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Premium Wash Price (₹)</label>
                  <input type="number" value={premiumPrice} onChange={(e) => setPremiumPrice(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Interior Detailing (₹)</label>
                  <input type="number" value={interiorPrice} onChange={(e) => setInteriorPrice(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Complete Detailing (₹)</label>
                  <input type="number" value={completePrice} onChange={(e) => setCompletePrice(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: type === 'house' ? '#1C2677' : '#2563EB', color: '#FFF', fontWeight: 700 }}>
              Create Variation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
