import React, { useState, useEffect } from 'react';
import { X, Lock, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { BlockedSlot } from '../../types/admin';

interface BlockSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: Omit<BlockedSlot, 'id' | 'createdAt'>) => void;
  initialDate?: string;
  initialServiceCategory?: BlockedSlot['serviceCategory'];
  initialLocation?: string;
}

const COMMON_TIME_SLOTS = [
  'Full Day Block',
  '08:30 AM',
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:00 PM',
  '10:30 PM'
];

export const BlockSlotModal: React.FC<BlockSlotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  initialServiceCategory = 'all',
  initialLocation = 'all'
}) => {
  const { blockedSlots, locations, setSlotCapacity } = useAdminData();
  const [maxTeams, setMaxTeams] = useState<number>(1);
  const allLocations = locations && locations.length > 0
    ? locations
    : [
        { id: '1', name: 'Kakkanad', zone: 'SmartCity Corridor' },
        { id: '2', name: 'Edappally', zone: 'Lulu Mall Corridor' },
        { id: '3', name: 'Kalamassery', zone: 'CUSAT Zone' },
        { id: '4', name: 'Ernakulam Central', zone: 'Marine Drive' },
        { id: '5', name: 'Vytila', zone: 'Mobility Hub' },
        { id: '6', name: 'Aluva', zone: 'Airport Highway' }
      ];

  const [serviceCategory, setServiceCategory] = useState<BlockedSlot['serviceCategory']>(initialServiceCategory);
  
  // Multi-select locations state
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['all']);
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState<boolean>(false);

  const [date, setDate] = useState<string>('');
  
  // Multi-select time slots state
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(['Full Day Block']);
  const [customTime, setCustomTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setMaxTeams(1);
      const today = new Date();
      const localTodayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const targetDate = initialDate || localTodayStr;
      setDate(targetDate);

      // Hydrate state from existing blockages for targetDate if available
      const existingForDate = blockedSlots.filter((s) => (s.date || (s as any).date_str) === targetDate);

      if (existingForDate.length > 0) {
        // 1. Service Category
        const cats = Array.from(new Set(existingForDate.map((s) => s.serviceCategory).filter(Boolean)));
        if (cats.length === 1 && cats[0]) {
          setServiceCategory(cats[0] as any);
        } else {
          setServiceCategory(initialServiceCategory || 'all');
        }

        // 2. Locations
        const locs = Array.from(new Set(existingForDate.map((s) => s.location || (s as any).location_name).filter(Boolean)));
        const isGlobalLoc = locs.some((l) => !l || l === 'all' || l.toLowerCase().includes('all location'));
        if (isGlobalLoc || locs.length === 0) {
          setSelectedLocations(['all']);
        } else {
          setSelectedLocations(locs as string[]);
        }

        // 3. Time Slots
        const hasFullDay = existingForDate.some(
          (s) =>
            !s.timeSlot ||
            s.timeSlot === 'all' ||
            s.timeSlot === '' ||
            s.timeSlot === 'Full Day' ||
            s.timeSlot.toLowerCase().includes('full day')
        );

        if (hasFullDay) {
          setSelectedTimeSlots(['Full Day Block']);
        } else {
          const activeSlots = Array.from(
            new Set(existingForDate.map((s) => normalizeSlotString(s.timeSlot!)).filter(Boolean))
          );
          setSelectedTimeSlots(activeSlots.length > 0 ? activeSlots : ['Full Day Block']);
        }

        // 4. Reason
        const firstReason = existingForDate.find((s) => s.reason)?.reason;
        setReason(firstReason || '');
      } else {
        // Fresh date with zero blockages -> use default active filter values
        setServiceCategory(initialServiceCategory || 'all');
        if (initialLocation && initialLocation !== 'all') {
          setSelectedLocations([initialLocation]);
        } else {
          setSelectedLocations(['all']);
        }
        setSelectedTimeSlots(['Full Day Block']);
        setReason('');
      }

      setIsLocDropdownOpen(false);
      setCustomTime('');
    }
  }, [isOpen, initialDate, initialServiceCategory, initialLocation, blockedSlots]);

  if (!isOpen) return null;

  // Toggle Location Checkbox
  const handleLocationToggle = (locName: string) => {
    if (locName === 'all') {
      setSelectedLocations(['all']);
    } else {
      let updated = selectedLocations.filter((l) => l !== 'all');
      if (updated.includes(locName)) {
        updated = updated.filter((l) => l !== locName);
      } else {
        updated.push(locName);
      }

      if (updated.length === 0 || updated.length === allLocations.length) {
        setSelectedLocations(['all']);
      } else {
        setSelectedLocations(updated);
      }
    }
  };

  const handleSelectAllLocs = () => {
    setSelectedLocations(['all']);
  };

  const handleClearAllLocs = () => {
    setSelectedLocations([allLocations[0]?.name || 'Kakkanad']);
  };

  // Helper to normalize time slot string format (e.g., '8:30 AM' -> '08:30 AM')
  const normalizeSlotString = (str: string): string => {
    const trimmed = str.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      const hh = match[1].padStart(2, '0');
      const mm = match[2];
      const ampm = match[3].toUpperCase();
      return `${hh}:${mm} ${ampm}`;
    }
    return trimmed;
  };

  // Helper to check if a time slot has already passed today
  const isSlotInPastForDate = (slotName: string, targetDateStr: string): boolean => {
    if (!targetDateStr) return false;
    if (slotName === 'Full Day Block' || slotName === 'Custom') return false;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (targetDateStr !== todayStr) return false; // Only applies to today's date

    const match = slotName.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return false;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const slotTimeObj = new Date();
    slotTimeObj.setHours(hours, minutes, 0, 0);

    return slotTimeObj < today;
  };

  // Toggle Time Slot Pill
  const handleTimeSlotToggle = (slot: string) => {
    const normSlot = normalizeSlotString(slot);
    if (isSlotInPastForDate(normSlot, date)) return; // Past time slots cannot be toggled

    if (normSlot === 'Full Day Block') {
      setSelectedTimeSlots(['Full Day Block']);
    } else if (normSlot === 'Custom') {
      if (selectedTimeSlots.includes('Custom')) {
        const next = selectedTimeSlots.filter((s) => s !== 'Custom');
        setSelectedTimeSlots(next.length === 0 ? ['Full Day Block'] : Array.from(new Set(next)));
      } else {
        const next = selectedTimeSlots.filter((s) => s !== 'Full Day Block');
        setSelectedTimeSlots(Array.from(new Set([...next, 'Custom'])));
      }
    } else {
      let next = selectedTimeSlots.filter((s) => s !== 'Full Day Block');
      if (next.includes(normSlot)) {
        next = next.filter((s) => s !== normSlot);
      } else {
        next.push(normSlot);
      }
      setSelectedTimeSlots(next.length === 0 ? ['Full Day Block'] : Array.from(new Set(next)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    // 1. Resolve Target Locations list
    let targetLocs: string[] = [];
    if (selectedLocations.includes('all') || selectedLocations.length === 0) {
      targetLocs = ['All Locations']; // Explicit 'All Locations' global block string
    } else {
      targetLocs = selectedLocations;
    }

    // 2. Resolve Time Slots list
    let targetSlots: string[] = [];
    if (selectedTimeSlots.includes('Full Day Block')) {
      targetSlots = ['Full Day']; // Explicit 'Full Day' block string
    } else {
      const activeSlots: string[] = [];
      selectedTimeSlots.forEach((slot) => {
        if (slot === 'Custom') {
          if (customTime.trim()) activeSlots.push(normalizeSlotString(customTime.trim()));
        } else {
          activeSlots.push(normalizeSlotString(slot));
        }
      });
      targetSlots = activeSlots.length > 0 ? Array.from(new Set(activeSlots)) : ['Full Day'];
    }

    // 3. Save blockage or team capacity for each combination
    targetLocs.forEach((locName) => {
      targetSlots.forEach((slotTime) => {
        if (maxTeams === 0) {
          onSave({
            serviceCategory,
            location: locName,
            date,
            timeSlot: slotTime,
            reason: reason.trim() || 'Fully Blocked'
          });
        } else {
          setSlotCapacity({
            location: locName,
            serviceCategory,
            date,
            timeSlot: slotTime === 'Full Day' ? undefined : slotTime,
            maxTeams
          });
        }
      });
    });

    onClose();
  };

  // Location display label text
  const getLocationDisplayText = () => {
    if (selectedLocations.includes('all')) {
      return '📍 All Locations (Global System Block)';
    }
    if (selectedLocations.length === 1) {
      return `📍 ${selectedLocations[0]}`;
    }
    return `📍 ${selectedLocations.length} Areas Selected (${selectedLocations.join(', ')})`;
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
          maxWidth: '560px',
          maxHeight: '86vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          padding: '28px'
        }}
      >
        {/* Header */}
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
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Lock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Block Service Date & Time
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>
                Make specific dates, locations, or slots unavailable on frontend
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Target Service Category */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Target Service Category *
            </label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value as BlockedSlot['serviceCategory'])}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.88rem', fontWeight: 600 }}
            >
              <option value="all">🔒 All Services (Global Block)</option>
              <option value="car-wash">🚗 Car Wash & Detailing</option>
              <option value="house-cleaning">🏠 House Cleaning</option>
              <option value="laundry">🧺 Laundry Services</option>
              <option value="specialized">✨ Specialized Cleaning</option>
            </select>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', margin: '4px 0 0 0' }}>
              Selecting e.g. "Car Wash" blocks ONLY Car Wash on this date/time while House Cleaning remains available.
            </p>
          </div>

          {/* Multi-Select Target Location / Area Selector */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Target Service Area / Location * (Multiple Selection)
            </label>
            
            {/* Custom Dropdown Trigger Button */}
            <div
              onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                background: '#FFF',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: isLocDropdownOpen ? '0 0 0 2px rgba(41, 195, 190, 0.3)' : 'none'
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getLocationDisplayText()}
              </span>
              {isLocDropdownOpen ? <ChevronUp size={18} color="#64748B" /> : <ChevronDown size={18} color="#64748B" />}
            </div>

            {/* Checkbox Popover Drawer */}
            {isLocDropdownOpen && (
              <div
                style={{
                  marginTop: '6px',
                  background: '#FFFFFF',
                  border: '1.5px solid #29C3BE',
                  borderRadius: '14px',
                  padding: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1C2677' }}>
                    Select Locations to Block ({selectedLocations.includes('all') ? 'All Active' : `${selectedLocations.length} Active`})
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={handleSelectAllLocs} style={{ background: 'none', border: 'none', color: '#1D4ED8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      Select All
                    </button>
                    <span style={{ color: '#CBD5E1' }}>|</span>
                    <button type="button" onClick={handleClearAllLocs} style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      Clear
                    </button>
                  </div>
                </div>

                <div
                  className="custom-scrollbar"
                  onWheel={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                    paddingRight: '6px'
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: selectedLocations.includes('all') ? '#EEF2FF' : '#F8FAFC',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: selectedLocations.includes('all') ? '#1C2677' : '#334155'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes('all')}
                      onChange={() => handleLocationToggle('all')}
                      style={{ accentColor: '#1C2677', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span>📍 All Locations (Global System Block)</span>
                  </label>

                  {allLocations.map((loc) => {
                    const isChecked = selectedLocations.includes('all') || selectedLocations.includes(loc.name);
                    return (
                      <label
                        key={loc.id || loc.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: isChecked ? '#EEF2FF' : '#F8FAFC',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: isChecked ? '#1C2677' : '#334155'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleLocationToggle(loc.name)}
                          style={{ accentColor: '#1C2677', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <div>
                          <span>📍 {loc.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '6px' }}>
                            {loc.zone ? `(${loc.zone})` : ''}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Check multiple locations e.g. "Kakkanad" & "Edappally" to block them simultaneously.
            </p>
          </div>

          {/* Target Date */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Target Date *
            </label>
            <input
              type="date"
              required
              min={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          {/* Time Slot Selection (Multi-Select Pills) */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Time Slot Blockage * (Select Multiple)
              </label>
              <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700 }}>
                {selectedTimeSlots.includes('Full Day Block')
                  ? 'Full Day Selected'
                  : `${COMMON_TIME_SLOTS.filter((s) => selectedTimeSlots.includes(s)).length + (selectedTimeSlots.includes('Custom') ? 1 : 0)} Slot(s) Selected`}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {COMMON_TIME_SLOTS.map((slot) => {
                const isSelected = selectedTimeSlots.includes(slot);
                const isPastSlot = isSlotInPastForDate(slot, date);

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isPastSlot}
                    onClick={() => !isPastSlot && handleTimeSlotToggle(slot)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: isPastSlot ? 'not-allowed' : 'pointer',
                      border: isPastSlot ? '1px solid #E2E8F0' : isSelected ? '2px solid #EF4444' : '1px solid #E2E8F0',
                      background: isPastSlot ? '#F1F5F9' : isSelected ? '#FEF2F2' : '#F8FAFC',
                      color: isPastSlot ? '#94A3B8' : isSelected ? '#DC2626' : '#334155',
                      opacity: isPastSlot ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                      textDecoration: isPastSlot ? 'line-through' : 'none'
                    }}
                    title={isPastSlot ? 'This time slot has already passed today' : undefined}
                  >
                    {isSelected && <Check size={12} />}
                    {slot}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handleTimeSlotToggle('Custom')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: selectedTimeSlots.includes('Custom') ? '2px solid #EF4444' : '1px solid #E2E8F0',
                  background: selectedTimeSlots.includes('Custom') ? '#FEF2F2' : '#F8FAFC',
                  color: selectedTimeSlots.includes('Custom') ? '#DC2626' : '#334155'
                }}
              >
                Custom Time
              </button>
            </div>

            {selectedTimeSlots.includes('Custom') && (
              <input
                type="text"
                placeholder="e.g. 10:30 PM, 09:15 AM..."
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            )}
          </div>

          {/* Operational Team Capacity Selector */}
          <div style={{ marginBottom: '20px', background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
              👥 Operational Team Capacity
            </label>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 10px 0', lineHeight: 1.35 }}>
              Set how many dispatch teams operate in this slot. 0 = Fully Blocked, 1 = Only 1 team (triggers "🔥 Only 1 Team Left!" urgency on user side), 2+ = Multiple teams.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxTeams(num)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    border: maxTeams === num ? '1px solid transparent' : '1px solid #CBD5E1',
                    background: maxTeams === num
                      ? (num === 0 ? '#DC2626' : 'linear-gradient(135deg, #1C2677, #29C3BE)')
                      : '#FFFFFF',
                    color: maxTeams === num ? '#FFFFFF' : '#334155',
                    boxShadow: maxTeams === num ? '0 4px 12px rgba(41, 195, 190, 0.25)' : 'none'
                  }}
                >
                  {num === 0 ? '🔒 Block (0 Teams)' : `${num} ${num === 1 ? 'Team' : 'Teams'}`}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Reason / Internal Note
            </label>
            <input
              type="text"
              placeholder="e.g. Night Equipment Maintenance, Fully Booked, Public Holiday..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 600, color: '#475569' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                color: '#FFF',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                cursor: 'pointer'
              }}
            >
              Confirm Blockage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
