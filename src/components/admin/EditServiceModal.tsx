import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Star, MapPin } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { AdminService, ServicePlanTier } from '../../types/admin';

interface Props {
  service: AdminService | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditServiceModal: React.FC<Props> = ({ service, isOpen, onClose }) => {
  const { updateService, locations } = useAdminData();

  const allLocationNames = locations && locations.length > 0 ? locations.map((l) => l.name) : ['Kakkanad', 'Edappally', 'Kalamassery', 'Ernakulam Central', 'Vyttila', 'Aluva'];
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [priceNumeric, setPriceNumeric] = useState<number>(0);
  const [duration, setDuration] = useState('');
  const [overview, setOverview] = useState('');

  // Standard Plan Tier State
  const [enableStandardPlan, setEnableStandardPlan] = useState(false);
  const [stdName, setStdName] = useState('');
  const [stdPriceNumeric, setStdPriceNumeric] = useState<number>(1499);
  const [stdPriceDisplay, setStdPriceDisplay] = useState('');
  const [stdDuration, setStdDuration] = useState('');
  const [stdProfessionals, setStdProfessionals] = useState<number>(2);

  // Premium Plan Tier State
  const [enablePremiumPlan, setEnablePremiumPlan] = useState(false);
  const [premName, setPremName] = useState('');
  const [premPriceNumeric, setPremPriceNumeric] = useState<number>(2499);
  const [premPriceDisplay, setPremPriceDisplay] = useState('');
  const [premDuration, setPremDuration] = useState('');
  const [premProfessionals, setPremProfessionals] = useState<number>(4);

  // Custom Tier State
  const [customPlans, setCustomPlans] = useState<ServicePlanTier[]>([]);
  const [custName, setCustName] = useState('');
  const [custPriceNumeric, setCustPriceNumeric] = useState<number>(3999);
  const [custDuration, setCustDuration] = useState('Flexible');
  const [custDesc, setCustDesc] = useState('');
  const [custIncInput, setCustIncInput] = useState('');
  const [custIncluded, setCustIncluded] = useState<string[]>(['Custom scope of work']);
  const [custExcInput, setCustExcInput] = useState('');
  const [custExcluded, setCustExcluded] = useState<string[]>([]);

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setStartingPrice(service.startingPrice);
      setPriceNumeric(service.priceNumeric);
      setDuration(service.duration);
      setOverview(service.overview);

      if (service.standardPlan) {
        setEnableStandardPlan(true);
        setStdName(service.standardPlan.name);
        setStdPriceNumeric(service.standardPlan.priceNumeric);
        setStdPriceDisplay(service.standardPlan.priceDisplay);
        setStdDuration(service.standardPlan.duration);
        setStdProfessionals(service.standardPlan.professionals || 2);
      } else {
        setEnableStandardPlan(false);
        setStdName('Standard Deep Clean');
        setStdPriceNumeric(service.priceNumeric || 1499);
        setStdPriceDisplay(service.startingPrice || '₹1,499');
        setStdDuration(service.duration || '3 - 4 Hours');
        setStdProfessionals(2);
      }

      if (service.premiumPlan) {
        setEnablePremiumPlan(true);
        setPremName(service.premiumPlan.name);
        setPremPriceNumeric(service.premiumPlan.priceNumeric);
        setPremPriceDisplay(service.premiumPlan.priceDisplay);
        setPremDuration(service.premiumPlan.duration);
        setPremProfessionals(service.premiumPlan.professionals || 4);
      } else {
        setEnablePremiumPlan(false);
        setPremName('Premium Ultra Clean');
        setPremPriceNumeric(Math.round((service.priceNumeric || 1499) * 1.5));
        setPremPriceDisplay(`₹${Math.round((service.priceNumeric || 1499) * 1.5)}`);
        setPremDuration('5 - 6 Hours');
        setPremProfessionals(4);
      }

      setCustomPlans(service.customPlans || []);
      if (service.availableLocations && service.availableLocations.length > 0) {
        setSelectedLocations(service.availableLocations);
      } else {
        setSelectedLocations(allLocationNames);
      }
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleAddCustomPlan = () => {
    if (custName.trim()) {
      const newPlan: ServicePlanTier = {
        id: 'cust-' + Date.now(),
        name: custName.trim(),
        priceDisplay: `₹${custPriceNumeric}`,
        priceNumeric: custPriceNumeric,
        duration: custDuration,
        professionals: 2,
        description: custDesc || `Custom tier for ${title}`,
        included: custIncluded,
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
    if (!service) return;

    const standardPlan: ServicePlanTier | undefined = enableStandardPlan ? {
      id: service.standardPlan?.id || ('std-' + Date.now()),
      name: stdName,
      priceDisplay: stdPriceDisplay || `₹${stdPriceNumeric}`,
      priceNumeric: Number(stdPriceNumeric) || 0,
      duration: stdDuration,
      professionals: Number(stdProfessionals) || 2,
      description: service.standardPlan?.description || `Everyday general clean for ${title}.`,
      included: service.standardPlan?.included || service.included || [],
      excluded: service.standardPlan?.excluded || service.excluded || []
    } : undefined;

    const premiumPlan: ServicePlanTier | undefined = enablePremiumPlan ? {
      id: service.premiumPlan?.id || ('prem-' + Date.now()),
      name: premName,
      priceDisplay: premPriceDisplay || `₹${premPriceNumeric}`,
      priceNumeric: Number(premPriceNumeric) || 0,
      duration: premDuration,
      professionals: Number(premProfessionals) || 4,
      description: service.premiumPlan?.description || `All-inclusive deep restorative clean for ${title}.`,
      included: service.premiumPlan?.included || service.included || [],
      excluded: service.premiumPlan?.excluded || service.excluded || []
    } : undefined;

    updateService(service.id, {
      title,
      startingPrice,
      priceNumeric: Number(priceNumeric) || 0,
      duration,
      overview,
      availableLocations: selectedLocations,
      standardPlan,
      premiumPlan,
      customPlans
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
      <div
        className="custom-scrollbar"
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Edit Service & Plan Tier Pricing</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>ID: {service.id}</p>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General Service Details */}
          <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '12px' }}>General Service Info</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Service Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Starting Price Display</label>
                <input type="text" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Starting Price (₹)</label>
                <input type="number" value={priceNumeric} onChange={(e) => setPriceNumeric(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Duration</label>
                <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Overview</label>
              <textarea rows={2} value={overview} onChange={(e) => setOverview(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }} />
            </div>

            {/* Service Location Availability Checkboxes */}
            <div style={{ marginTop: '14px', background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C2677', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} style={{ color: '#29C3BE' }} /> Service Location Availability (Areas where active)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedLocations(allLocationNames)}
                    style={{ background: 'transparent', border: 'none', color: '#1D4ED8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Select All
                  </button>
                  <span style={{ color: '#CBD5E1' }}>|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedLocations([])}
                    style={{ background: 'transparent', border: 'none', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                {allLocationNames.map((locName) => {
                  const isChecked = selectedLocations.includes(locName);
                  return (
                    <label
                      key={locName}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: isChecked ? '#EEF2FF' : '#F8FAFC',
                        border: `1px solid ${isChecked ? '#818CF8' : '#E2E8F0'}`,
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: isChecked ? 700 : 500,
                        color: isChecked ? '#1C2677' : '#475569'
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
                        style={{ accentColor: '#1C2677' }}
                      />
                      {locName}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Standard & Premium Tier Editors */}
          <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '16px', marginBottom: '20px', border: '2px solid #1C2677' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C2677', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} /> Standard vs Premium Tier Configurator
            </h4>

            {/* Standard Plan Box */}
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.85rem' }}>Standard Plan Tier</span>
                <label style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#1C2677' }}>
                  <input type="checkbox" checked={enableStandardPlan} onChange={(e) => setEnableStandardPlan(e.target.checked)} /> Enable Standard Plan
                </label>
              </div>

              {enableStandardPlan && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Plan Name</label>
                    <input type="text" value={stdName} onChange={(e) => setStdName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Price Numeric (₹)</label>
                    <input type="number" value={stdPriceNumeric} onChange={(e) => { setStdPriceNumeric(Number(e.target.value)); setStdPriceDisplay(`₹${e.target.value}`); }} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 800 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Duration</label>
                    <input type="text" value={stdDuration} onChange={(e) => setStdDuration(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Staff Count</label>
                    <input type="number" value={stdProfessionals} onChange={(e) => setStdProfessionals(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Premium Plan Box */}
            <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '12px', border: '1px solid #86EFAC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, color: '#0D9488', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} color="#0D9488" /> Premium Plan Tier (Recommended)
                </span>
                <label style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#0D9488' }}>
                  <input type="checkbox" checked={enablePremiumPlan} onChange={(e) => setEnablePremiumPlan(e.target.checked)} /> Enable Premium Plan
                </label>
              </div>

              {enablePremiumPlan && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Plan Name</label>
                    <input type="text" value={premName} onChange={(e) => setPremName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Price Numeric (₹)</label>
                    <input type="number" value={premPriceNumeric} onChange={(e) => { setPremPriceNumeric(Number(e.target.value)); setPremPriceDisplay(`₹${e.target.value}`); }} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#0D9488' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Duration</label>
                    <input type="text" value={premDuration} onChange={(e) => setPremDuration(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Staff Count</label>
                    <input type="number" value={premProfessionals} onChange={(e) => setPremProfessionals(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Tier Configurator */}
          <div style={{ background: '#FFFBEB', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #FCD34D' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#92400E', marginBottom: '10px' }}>Customized Plan Tiers</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 2fr', gap: '8px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#92400E' }}>Custom Plan Name *</label>
                <input type="text" placeholder="e.g. Executive Custom" value={custName} onChange={(e) => setCustName(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #FCD34D', fontSize: '0.8rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#92400E' }}>Price (₹) *</label>
                <input type="number" value={custPriceNumeric} onChange={(e) => setCustPriceNumeric(Number(e.target.value))} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #FCD34D', fontSize: '0.8rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#92400E' }}>Duration</label>
                <input type="text" value={custDuration} onChange={(e) => setCustDuration(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #FCD34D', fontSize: '0.8rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#92400E' }}>Description</label>
                <input type="text" placeholder="Details..." value={custDesc} onChange={(e) => setCustDesc(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #FCD34D', fontSize: '0.8rem' }} />
              </div>
            </div>

            {/* Inclusions & Exclusions Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '12px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#166534' }}>Tier Inclusions (✓)</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <input type="text" placeholder="Add inclusion..." value={custIncInput} onChange={(e) => setCustIncInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), custIncInput && (setCustIncluded([...custIncluded, custIncInput.trim()]), setCustIncInput('')))} style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #BBF7D0', fontSize: '0.75rem' }} />
                  <button type="button" onClick={() => { if (custIncInput.trim()) { setCustIncluded([...custIncluded, custIncInput.trim()]); setCustIncInput(''); } }} style={{ background: '#166534', color: '#FFF', border: 'none', padding: '0 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
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
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#991B1B' }}>Tier Exclusions (✕)</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <input type="text" placeholder="Add exclusion..." value={custExcInput} onChange={(e) => setCustExcInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), custExcInput && (setCustExcluded([...custExcluded, custExcInput.trim()]), setCustExcInput('')))} style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #FCA5A5', fontSize: '0.75rem' }} />
                  <button type="button" onClick={() => { if (custExcInput.trim()) { setCustExcluded([...custExcluded, custExcInput.trim()]); setCustExcInput(''); } }} style={{ background: '#991B1B', color: '#FFF', border: 'none', padding: '0 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {custExcluded.map((exc, i) => (
                    <span key={i} style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                      ✕ {exc} <span style={{ cursor: 'pointer', color: '#DC2626' }} onClick={() => setCustExcluded(custExcluded.filter((_, idx) => idx !== i))}>✕</span>
                    </span>
                  ))}
                </div>
              </div>

              <button type="button" onClick={handleAddCustomPlan} style={{ background: '#B45309', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', height: '32px' }}>
                + Add Plan Tier
              </button>
            </div>

            {customPlans.map((p) => (
              <div key={p.id} style={{ background: '#FFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #FCD34D', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <strong style={{ color: '#92400E', fontSize: '0.8rem' }}>{p.name}</strong> - <span style={{ color: '#1E293B', fontWeight: 800 }}>{p.priceDisplay}</span> ({p.duration})
                  <p style={{ margin: '2px 0 4px 0', fontSize: '0.72rem', color: '#64748B' }}>{p.description}</p>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem' }}>
                    <span style={{ color: '#166534' }}>✓ Inclusions: {p.included.join(', ') || 'None'}</span>
                    <span style={{ color: '#991B1B' }}>✕ Exclusions: {p.excluded.join(', ') || 'None'}</span>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemoveCustomPlan(p.id)} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFF' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#1C2677', color: '#FFF', fontWeight: 700 }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
