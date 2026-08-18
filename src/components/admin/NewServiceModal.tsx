import React, { useState } from 'react';
import { X, Sparkles, Layers, ShieldCheck, Star, MapPin } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { ServicePlanTier } from '../../types/admin';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NewServiceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addService, locations } = useAdminData();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'house-cleaning' | 'car-wash' | 'laundry' | 'specialized'>('house-cleaning');
  const [startingPrice, setStartingPrice] = useState('₹1,299');
  const [priceNumeric, setPriceNumeric] = useState<number>(1299);
  const [duration, setDuration] = useState('3 - 4 Hours');
  const [overview, setOverview] = useState('');
  const [recommendedFor, setRecommendedFor] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80');

  // Location Availability Selection
  const allLocationNames = locations && locations.length > 0 ? locations.map((l) => l.name) : ['Kakkanad', 'Edappally', 'Kalamassery', 'Ernakulam Central', 'Vyttila', 'Aluva'];
  const [selectedLocations, setSelectedLocations] = useState<string[]>(allLocationNames);

  // Key Highlights / Features
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'High-pressure sanitization',
    'Eco-certified non-toxic chemical wipe'
  ]);

  // Standard Plan Tier State
  const [enableStandardPlan, setEnableStandardPlan] = useState(true);
  const [stdName, setStdName] = useState('Standard Deep Clean');
  const [stdPriceNumeric, setStdPriceNumeric] = useState<number>(1499);
  const [stdPriceDisplay, setStdPriceDisplay] = useState('₹1,499');
  const [stdDuration, setStdDuration] = useState('3 - 4 Hours');
  const [stdProfessionals, setStdProfessionals] = useState<number>(2);
  const [stdIncInput, setStdIncInput] = useState('');
  const [stdIncluded, setStdIncluded] = useState<string[]>([
    'Complete surface deep scrub',
    'Kitchen countertop & sink sanitization',
    'Bathroom wall tile & fixture descaling'
  ]);
  const [stdExcInput, setStdExcInput] = useState('');
  const [stdExcluded, setStdExcluded] = useState<string[]>([
    'Inside wardrobe organizing',
    'External high-rise window rope access'
  ]);

  // Premium Plan Tier State
  const [enablePremiumPlan, setEnablePremiumPlan] = useState(true);
  const [premName, setPremName] = useState('Premium Ultra Clean');
  const [premPriceNumeric, setPremPriceNumeric] = useState<number>(2499);
  const [premPriceDisplay, setPremPriceDisplay] = useState('₹2,499');
  const [premDuration, setPremDuration] = useState('4.5 - 6 Hours');
  const [premProfessionals, setPremProfessionals] = useState<number>(4);
  const [premIncInput, setPremIncInput] = useState('');
  const [premIncluded, setPremIncluded] = useState<string[]>([
    'All Standard Plan features included',
    'Single-disc machine floor buffing & steam sanitization',
    'Interior appliance & chimney degreasing',
    'UV mattress vacuuming'
  ]);
  const [premExcInput, setPremExcInput] = useState('');
  const [premExcluded, setPremExcluded] = useState<string[]>([
    'Civil wall painting repairs'
  ]);

  // Custom Tier State
  const [customPlans, setCustomPlans] = useState<ServicePlanTier[]>([]);
  const [custName, setCustName] = useState('');
  const [custPriceNumeric, setCustPriceNumeric] = useState<number>(3999);
  const [custDuration, setCustDuration] = useState('Flexible');
  const [custDesc, setCustDesc] = useState('');
  const [custIncInput, setCustIncInput] = useState('');
  const [custIncluded, setCustIncluded] = useState<string[]>(['Custom scope of work', 'Dedicated technical supervisor']);
  const [custExcInput, setCustExcInput] = useState('');
  const [custExcluded, setCustExcluded] = useState<string[]>(['Architectural modifications']);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleAddCustomPlan = () => {
    if (custName.trim()) {
      const newPlan: ServicePlanTier = {
        id: 'cust-' + Date.now(),
        name: custName.trim(),
        priceDisplay: `₹${custPriceNumeric}`,
        priceNumeric: custPriceNumeric,
        duration: custDuration,
        description: custDesc || 'Customized executive package.',
        included: custIncluded.length > 0 ? custIncluded : ['Custom scope of work'],
        excluded: custExcluded
      };
      setCustomPlans([...customPlans, newPlan]);
      setCustName('');
      setCustDesc('');
      setCustIncluded(['Custom scope of work']);
      setCustExcluded([]);
    }
  };

  const handleRemoveCustomPlan = (id: string) => {
    setCustomPlans(customPlans.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !overview.trim()) {
      alert('Please fill in the required fields (Service Title and Overview).');
      return;
    }

    const standardPlan: ServicePlanTier | undefined = enableStandardPlan ? {
      id: 'std-' + Date.now(),
      name: stdName,
      priceDisplay: stdPriceDisplay || `₹${stdPriceNumeric}`,
      priceNumeric: Number(stdPriceNumeric) || 0,
      duration: stdDuration,
      professionals: Number(stdProfessionals) || 2,
      description: `Everyday general clean for ${title}.`,
      included: stdIncluded,
      excluded: stdExcluded
    } : undefined;

    const premiumPlan: ServicePlanTier | undefined = enablePremiumPlan ? {
      id: 'prem-' + Date.now(),
      name: premName,
      priceDisplay: premPriceDisplay || `₹${premPriceNumeric}`,
      priceNumeric: Number(premPriceNumeric) || 0,
      duration: premDuration,
      professionals: Number(premProfessionals) || 4,
      description: `All-inclusive deep restorative clean for ${title}.`,
      included: premIncluded,
      excluded: premExcluded
    } : undefined;

    addService({
      title,
      category,
      startingPrice,
      priceNumeric: Number(priceNumeric) || 0,
      duration,
      status: 'active',
      overview,
      features,
      included: stdIncluded,
      excluded: stdExcluded,
      recommendedFor,
      image,
      availableLocations: selectedLocations,
      standardPlan,
      premiumPlan,
      customPlans
    });

    onClose();
  };

  return (
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
        padding: '20px'
      }}
    >
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '86vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          padding: '32px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #007A87, #0093A2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#03252A', margin: 0 }}>Create New Service Offering</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>Configure service info, Standard/Premium plan pricing, and customized tiers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Service Information */}
          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '18px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#03252A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#007A87" /> 1. General Service Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Service Title *</label>
                <input type="text" required placeholder="e.g. Sofa & Upholstery Shampooing" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Service Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as any)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFF' }}>
                  <option value="house-cleaning">House Cleaning</option>
                  <option value="car-wash">Car Wash</option>
                  <option value="laundry">Laundry Care</option>
                  <option value="specialized">Specialized Services</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Starting Price Display</label>
                <input type="text" placeholder="e.g. ₹1,299" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Starting Price Numeric (₹)</label>
                <input type="number" value={priceNumeric} onChange={(e) => setPriceNumeric(Number(e.target.value))} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Estimated Duration</label>
                <input type="text" placeholder="e.g. 3 - 4 Hours" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Overview & Description *</label>
              <textarea required rows={2} placeholder="Detailed value proposition..." value={overview} onChange={(e) => setOverview(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Recommended For</label>
                <input type="text" placeholder="e.g. Pet owners, seasonal refresh" value={recommendedFor} onChange={(e) => setRecommendedFor(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Image Banner URL</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Key Highlights / Features</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="Add feature point..." value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())} style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }} />
                <button type="button" onClick={handleAddFeature} style={{ background: '#007A87', color: '#FFF', border: 'none', padding: '0 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>+ Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {features.map((f, i) => (
                  <span key={i} style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {f} <span style={{ cursor: 'pointer', color: '#DC2626' }} onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}>✕</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Service Location Availability Selector */}
            <div style={{ marginTop: '16px', background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #CBD5E1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#007A87', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} style={{ color: '#007A87' }} /> Service Location Availability (Areas where active) *
                </label>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedLocations(allLocationNames)}
                    style={{ background: 'transparent', border: 'none', color: '#1D4ED8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Select All
                  </button>
                  <span style={{ color: '#CBD5E1' }}>|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedLocations([])}
                    style={{ background: 'transparent', border: 'none', color: '#DC2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                {allLocationNames.map((locName) => {
                  const isChecked = selectedLocations.includes(locName);
                  return (
                    <label
                      key={locName}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: isChecked ? '#EEF2FF' : '#FFFFFF',
                        border: `1px solid ${isChecked ? '#818CF8' : '#CBD5E1'}`,
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: isChecked ? 800 : 500,
                        color: isChecked ? '#007A87' : '#475569'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLocations([...selectedLocations, locName]);
                          } else {
                            setSelectedLocations(selectedLocations.filter((l) => l !== locName));
                          }
                        }}
                        style={{ accentColor: '#007A87' }}
                      />
                      {locName}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Plan Pricing Tiers (Standard Plan & Premium Plan) */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', marginBottom: '24px', border: '2px solid #007A87' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#03252A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#007A87" /> 2. Standard & Premium Plan Pricing Configuration
            </h3>

            {/* Standard Plan Pricing Box */}
            <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '16px', border: '1px solid #CBD5E1', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E293B' }}>Standard Plan Tier</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#007A87' }}>
                  <input type="checkbox" checked={enableStandardPlan} onChange={(e) => setEnableStandardPlan(e.target.checked)} /> Enable Standard Plan
                </label>
              </div>

              {enableStandardPlan && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Standard Plan Name</label>
                      <input type="text" value={stdName} onChange={(e) => setStdName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Price Numeric (₹)</label>
                      <input type="number" value={stdPriceNumeric} onChange={(e) => { setStdPriceNumeric(Number(e.target.value)); setStdPriceDisplay(`₹${e.target.value}`); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#007A87' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Duration</label>
                      <input type="text" value={stdDuration} onChange={(e) => setStdDuration(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Staff Count</label>
                      <input type="number" value={stdProfessionals} onChange={(e) => setStdProfessionals(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>Standard Inclusions</label>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" placeholder="Add..." value={stdIncInput} onChange={(e) => setStdIncInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), stdIncInput && (setStdIncluded([...stdIncluded, stdIncInput]), setStdIncInput('')))} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
                        <button type="button" onClick={() => { if (stdIncInput) { setStdIncluded([...stdIncluded, stdIncInput]); setStdIncInput(''); } }} style={{ background: '#166534', color: '#FFF', border: 'none', padding: '0 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {stdIncluded.map((inc, i) => (
                          <span key={i} style={{ background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                            ✓ {inc} <span style={{ cursor: 'pointer', color: '#DC2626' }} onClick={() => setStdIncluded(stdIncluded.filter((_, idx) => idx !== i))}>✕</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>Standard Exclusions</label>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" placeholder="Add..." value={stdExcInput} onChange={(e) => setStdExcInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), stdExcInput && (setStdExcluded([...stdExcluded, stdExcInput]), setStdExcInput('')))} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
                        <button type="button" onClick={() => { if (stdExcInput) { setStdExcluded([...stdExcluded, stdExcInput]); setStdExcInput(''); } }} style={{ background: '#991B1B', color: '#FFF', border: 'none', padding: '0 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {stdExcluded.map((exc, i) => (
                          <span key={i} style={{ background: '#FEE2E2', color: '#991B1B', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                            ✕ {exc} <span style={{ cursor: 'pointer', color: '#DC2626' }} onClick={() => setStdExcluded(stdExcluded.filter((_, idx) => idx !== i))}>✕</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Premium Plan Pricing Box */}
            <div style={{ background: '#F0FDF4', padding: '18px', borderRadius: '16px', border: '2px solid #007A87' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0D9488', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={16} color="#0D9488" /> Premium Plan Tier (Recommended)
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#0D9488' }}>
                  <input type="checkbox" checked={enablePremiumPlan} onChange={(e) => setEnablePremiumPlan(e.target.checked)} /> Enable Premium Plan
                </label>
              </div>

              {enablePremiumPlan && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Premium Plan Name</label>
                      <input type="text" value={premName} onChange={(e) => setPremName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Price Numeric (₹)</label>
                      <input type="number" value={premPriceNumeric} onChange={(e) => { setPremPriceNumeric(Number(e.target.value)); setPremPriceDisplay(`₹${e.target.value}`); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#0D9488' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Duration</label>
                      <input type="text" value={premDuration} onChange={(e) => setPremDuration(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Staff Count</label>
                      <input type="number" value={premProfessionals} onChange={(e) => setPremProfessionals(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>Premium Inclusions</label>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" placeholder="Add..." value={premIncInput} onChange={(e) => setPremIncInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), premIncInput && (setPremIncluded([...premIncluded, premIncInput]), setPremIncInput('')))} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
                        <button type="button" onClick={() => { if (premIncInput) { setPremIncluded([...premIncluded, premIncInput]); setPremIncInput(''); } }} style={{ background: '#166534', color: '#FFF', border: 'none', padding: '0 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {premIncluded.map((inc, i) => (
                          <span key={i} style={{ background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                            ✓ {inc} <span style={{ cursor: 'pointer', color: '#DC2626' }} onClick={() => setPremIncluded(premIncluded.filter((_, idx) => idx !== i))}>✕</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>Premium Exclusions</label>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" placeholder="Add..." value={premExcInput} onChange={(e) => setPremExcInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), premExcInput && (setPremExcluded([...premExcluded, premExcInput]), setPremExcInput('')))} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
                        <button type="button" onClick={() => { if (premExcInput) { setPremExcluded([...premExcluded, premExcInput]); setPremExcInput(''); } }} style={{ background: '#991B1B', color: '#FFF', border: 'none', padding: '0 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {premExcluded.map((exc, i) => (
                          <span key={i} style={{ background: '#FEE2E2', color: '#991B1B', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                            ✕ {exc} <span style={{ cursor: 'pointer', color: '#DC2626' }} onClick={() => setPremExcluded(premExcluded.filter((_, idx) => idx !== i))}>✕</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Customized / Additional Plan Tiers */}
          <div style={{ background: '#FFFBEB', padding: '20px', borderRadius: '18px', marginBottom: '24px', border: '1px solid #FDE68A' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400E', marginBottom: '14px' }}>
              3. Customized / Additional Plan Tiers (Optional)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 2fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>Custom Plan Name *</label>
                <input type="text" placeholder="e.g. Executive SLA Plan" value={custName} onChange={(e) => setCustName(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FCD34D' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>Price (₹) *</label>
                <input type="number" value={custPriceNumeric} onChange={(e) => setCustPriceNumeric(Number(e.target.value))} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FCD34D' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>Duration</label>
                <input type="text" value={custDuration} onChange={(e) => setCustDuration(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FCD34D' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>Description</label>
                <input type="text" placeholder="Scope..." value={custDesc} onChange={(e) => setCustDesc(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FCD34D' }} />
              </div>
            </div>

            {/* Custom Tier Inclusions & Exclusions Input Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', marginBottom: '14px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>Tier Inclusions (✓)</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder="Add inclusion..." value={custIncInput} onChange={(e) => setCustIncInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), custIncInput && (setCustIncluded([...custIncluded, custIncInput.trim()]), setCustIncInput('')))} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #BBF7D0', fontSize: '0.8rem' }} />
                  <button type="button" onClick={() => { if (custIncInput.trim()) { setCustIncluded([...custIncluded, custIncInput.trim()]); setCustIncInput(''); } }} style={{ background: '#166534', color: '#FFF', border: 'none', padding: '0 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {custIncluded.map((inc, i) => (
                    <span key={i} style={{ background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                      ✓ {inc} <span style={{ cursor: 'pointer', color: '#DC2626' }} onClick={() => setCustIncluded(custIncluded.filter((_, idx) => idx !== i))}>✕</span>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#991B1B' }}>Tier Exclusions (✕)</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder="Add exclusion..." value={custExcInput} onChange={(e) => setCustExcInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), custExcInput && (setCustExcluded([...custExcluded, custExcInput.trim()]), setCustExcInput('')))} style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #FCA5A5', fontSize: '0.8rem' }} />
                  <button type="button" onClick={() => { if (custExcInput.trim()) { setCustExcluded([...custExcluded, custExcInput.trim()]); setCustExcInput(''); } }} style={{ background: '#991B1B', color: '#FFF', border: 'none', padding: '0 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {custExcluded.map((exc, i) => (
                    <span key={i} style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                      ✕ {exc} <span style={{ cursor: 'pointer', color: '#DC2626' }} onClick={() => setCustExcluded(custExcluded.filter((_, idx) => idx !== i))}>✕</span>
                    </span>
                  ))}
                </div>
              </div>

              <button type="button" onClick={handleAddCustomPlan} style={{ background: '#B45309', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', height: '36px' }}>
                + Add Plan Tier
              </button>
            </div>

            {customPlans.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {customPlans.map((p) => (
                  <div key={p.id} style={{ background: '#FFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #FCD34D', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ color: '#92400E', fontSize: '0.85rem' }}>{p.name}</strong> - <span style={{ color: '#1E293B', fontWeight: 800 }}>{p.priceDisplay}</span> ({p.duration})
                      <p style={{ margin: '2px 0 6px 0', fontSize: '0.75rem', color: '#64748B' }}>{p.description}</p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem' }}>
                        <span style={{ color: '#166534' }}>✓ Included: {p.included.join(', ') || 'None'}</span>
                        <span style={{ color: '#991B1B' }}>✕ Excluded: {p.excluded.join(', ') || 'None'}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemoveCustomPlan(p.id)} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
            <button type="button" onClick={onClose} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFF', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #007A87, #0093A2)', color: '#FFFFFF', fontWeight: 700, boxShadow: '0 8px 20px rgba(0, 122, 135, 0.3)', cursor: 'pointer' }}>
              Publish Service with Tiers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
