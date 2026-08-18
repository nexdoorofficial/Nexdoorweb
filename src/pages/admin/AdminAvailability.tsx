import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Lock,
  Unlock,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Car,
  Home as HomeIcon,
  Shirt,
  Sparkles,
  Trash2,
  Users
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { BlockSlotModal } from '../../components/admin/BlockSlotModal';
import type { BlockedSlot } from '../../types/admin';

export const AdminAvailability: React.FC = () => {
  const { blockedSlots, locations, addBlockedSlot, deleteBlockedSlot, slotCapacities, setSlotCapacity, deleteSlotCapacity } = useAdminData();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
  const [currentDateView, setCurrentDateView] = useState<Date>(new Date(2026, 7, 1)); // August 2026 default
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>('');

  const year = currentDateView.getFullYear();
  const month = currentDateView.getMonth();
  const monthName = currentDateView.toLocaleDateString('en-US', { month: 'long' });

  // Filtered blockages based on active service tab & selected location filter
  const filteredSlots = useMemo(() => {
    return blockedSlots.filter((slot) => {
      const catMatch = activeTab === 'all' || slot.serviceCategory === activeTab || slot.serviceCategory === 'all';
      const locMatch = selectedLocationFilter === 'all' || !slot.location || slot.location === 'all' || slot.location.toLowerCase().trim() === selectedLocationFilter.toLowerCase().trim();
      return catMatch && locMatch;
    });
  }, [blockedSlots, activeTab, selectedLocationFilter]);

  const handlePrevMonth = () => {
    setCurrentDateView(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDateView(new Date(year, month + 1, 1));
  };

  const handleOpenBlockModalForDay = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const cellDate = new Date(y, m - 1, d);
    cellDate.setHours(0, 0, 0, 0);

    const todayAtMidnight = new Date();
    todayAtMidnight.setHours(0, 0, 0, 0);

    if (cellDate < todayAtMidnight) {
      return; // Past dates cannot be blocked
    }

    setSelectedDateForModal(dateStr);
    setIsModalOpen(true);
  };

  const handleOpenBlockModalNew = () => {
    const today = new Date();
    const localDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDateForModal(localDateStr);
    setIsModalOpen(true);
  };

  const handleUnblock = (id: string) => {
    if (window.confirm('Are you sure you want to unblock this date/slot?')) {
      deleteBlockedSlot(id);
    }
  };

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = new Date(year, month, 1).getDay();

  const formatServiceBadge = (cat: BlockedSlot['serviceCategory']) => {
    const map = {
      all: { label: 'ALL SERVICES', bg: '#FEF2F2', color: '#DC2626', icon: Lock },
      'car-wash': { label: 'CAR WASH', bg: '#EFF6FF', color: '#1D4ED8', icon: Car },
      'house-cleaning': { label: 'HOUSE CLEANING', bg: '#ECFDF5', color: '#047857', icon: HomeIcon },
      laundry: { label: 'LAUNDRY', bg: '#FEF3C7', color: '#B45309', icon: Shirt },
      specialized: { label: 'SPECIALIZED', bg: '#F3E8FF', color: '#6B21A8', icon: Sparkles }
    };
    const item = map[cat] || map.all;
    const IconComp = item.icon;
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '16px',
          fontSize: '0.7rem',
          fontWeight: 800,
          background: item.bg,
          color: item.color,
          letterSpacing: '0.03em'
        }}
      >
        <IconComp size={12} />
        {item.label}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
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
            <Calendar size={28} style={{ color: '#007A87' }} />
            Availability & Slot Blocking Calendar
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Manage location-specific and service-specific date and time availability for doorstep dispatch
          </p>
        </div>

        <button
          onClick={handleOpenBlockModalNew}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={18} />
          Block Date / Time Slot
        </button>
      </div>

      {/* Service & Location Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: 'All Services', icon: Lock },
            { id: 'car-wash', label: 'Car Wash', icon: Car },
            { id: 'house-cleaning', label: 'House Cleaning', icon: HomeIcon },
            { id: 'laundry', label: 'Laundry', icon: Shirt },
            { id: 'specialized', label: 'Specialized', icon: Sparkles }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: isActive ? 'none' : '1px solid #E2E8F0',
                  background: isActive ? '#007A87' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 122, 135, 0.25)' : 'none'
                }}
              >
                <IconComp size={15} style={{ color: isActive ? '#9BC83B' : '#64748B' }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Location Filter Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '6px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#03252A' }}>📍 Location:</span>
          <select
            value={selectedLocationFilter}
            onChange={(e) => setSelectedLocationFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.825rem', fontWeight: 800, color: '#03252A', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">All Locations (System-wide)</option>
            {locations.map((loc) => (
              <option key={loc.id || loc.name} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Standing Location Team Defaults Panel */}
      <div style={{ marginBottom: '24px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} style={{ color: '#007A87' }} />
            Standing Location Team Defaults
          </h4>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
            These defaults apply to every future date unless overridden
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {locations.map((loc) => {
            const locDefault = slotCapacities.find((c) => !c.date && c.location && c.location.toLowerCase().trim() === loc.name.toLowerCase().trim());
            const currentTeams = locDefault ? locDefault.maxTeams : 1;
            return (
              <div
                key={loc.id || loc.name}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #F8FAFC, #EFF6FF)',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>📍 {loc.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>{loc.zone || ''}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setSlotCapacity({ location: loc.name, maxTeams: Math.max(0, currentTeams - 1) })}
                    style={{
                      width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #CBD5E1',
                      background: '#FFFFFF', cursor: 'pointer', fontWeight: 800, fontSize: '1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569'
                    }}
                  >
                    −
                  </button>
                  <span style={{
                    minWidth: '42px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 800,
                    color: currentTeams === 0 ? '#DC2626' : '#007A87',
                    background: currentTeams === 0 ? '#FEE2E2' : '#EEF2FF',
                    padding: '4px 8px', borderRadius: '8px'
                  }}>
                    {currentTeams === 0 ? '🔒 0' : `${currentTeams} 👥`}
                  </span>
                  <button
                    onClick={() => setSlotCapacity({ location: loc.name, maxTeams: currentTeams + 1 })}
                    style={{
                      width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #CBD5E1',
                      background: '#FFFFFF', cursor: 'pointer', fontWeight: 800, fontSize: '1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Layout: Calendar View (Left) & Active Blockages List (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', marginBottom: '32px' }} className="availability-grid">
        
        {/* Left Column: Calendar Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          
          {/* Month Nav Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {monthName} {year}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handlePrevMonth}
                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer' }}
              >
                <ChevronLeft size={18} color="#1E293B" />
              </button>
              <button
                onClick={handleNextMonth}
                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer' }}
              >
                <ChevronRight size={18} color="#1E293B" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', marginBottom: '12px' }}>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Cells Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ padding: '16px', background: 'transparent' }} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              
              const cellDate = new Date(year, month, dayNum);
              cellDate.setHours(0, 0, 0, 0);

              const todayAtMidnight = new Date();
              todayAtMidnight.setHours(0, 0, 0, 0);

              const isPastDate = cellDate < todayAtMidnight;
              
              // Find blockages on this date using filteredSlots (respects location filter, service tab & date aliases)
              const dayBlockages = filteredSlots.filter((slot) => {
                const targetDate = slot.date || (slot as any).date_str || '';
                return targetDate === dateStr;
              });

              // Also find any capacity overrides for this date (respects location filter)
              const dayCapacities = slotCapacities.filter((c) => {
                if (!c.date || c.date !== dateStr) return false;
                const cLoc = (c.location || 'all').toLowerCase().trim();
                const filterLoc = selectedLocationFilter.toLowerCase().trim();
                if (filterLoc !== 'all' && cLoc !== 'all' && cLoc !== filterLoc) return false;
                return true;
              });

              const hasCapacityOverride = dayCapacities.length > 0;
              const minTeams = hasCapacityOverride ? Math.min(...dayCapacities.map(c => c.maxTeams)) : null;

              const isFullDayBlocked = dayBlockages.some(
                (s) =>
                  !s.timeSlot ||
                  s.timeSlot === 'all' ||
                  s.timeSlot === '' ||
                  s.timeSlot.toLowerCase().includes('full day') ||
                  s.timeSlot.toLowerCase() === 'full-day'
              );
              const hasSlotBlock = dayBlockages.length > 0 || hasCapacityOverride;
              const slotBlockCount = dayBlockages.filter(s => s.timeSlot && !s.timeSlot.toLowerCase().includes('full day') && s.timeSlot.toLowerCase() !== 'full-day' && s.timeSlot !== '' && s.timeSlot !== 'all').length;

              return (
                <div
                  key={dayNum}
                  onClick={() => !isPastDate && handleOpenBlockModalForDay(dateStr)}
                  style={{
                    minHeight: '74px',
                    padding: '8px',
                    borderRadius: '12px',
                    border: isPastDate ? '1px solid #E2E8F0' : isFullDayBlocked ? '2px solid #EF4444' : hasSlotBlock ? '1.5px solid #F59E0B' : '1px solid #CBD5E1',
                    background: isPastDate ? '#F8FAFC' : isFullDayBlocked ? '#FEF2F2' : hasSlotBlock ? '#FFFBEB' : '#FFFFFF',
                    cursor: isPastDate ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    opacity: isPastDate ? 0.45 : 1
                  }}
                  title={isPastDate ? 'Past dates cannot be blocked' : `Click to manage blockages for ${dateStr}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isPastDate ? '#94A3B8' : isFullDayBlocked ? '#DC2626' : '#1E293B' }}>
                      {dayNum}
                    </span>
                    {hasSlotBlock && !isPastDate && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isFullDayBlocked ? '#EF4444' : '#F59E0B' }} />
                    )}
                  </div>

                  {isPastDate ? (
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#94A3B8', background: '#F1F5F9', padding: '2px 4px', borderRadius: '4px', display: 'block', textAlign: 'center' }}>
                        PASSED
                      </span>
                    </div>
                  ) : hasSlotBlock ? (
                    <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {isFullDayBlocked ? (
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '2px 4px', borderRadius: '4px', display: 'block', textAlign: 'center' }}>
                          🔒 FULL BLOCK
                        </span>
                      ) : slotBlockCount > 0 ? (
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '2px 4px', borderRadius: '4px', display: 'block', textAlign: 'center' }}>
                          {slotBlockCount} slot{slotBlockCount > 1 ? 's' : ''}
                        </span>
                      ) : null}
                      {hasCapacityOverride && minTeams !== null && !isFullDayBlocked && (
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '2px 4px', borderRadius: '4px', display: 'block', textAlign: 'center',
                          color: minTeams === 0 ? '#DC2626' : minTeams === 1 ? '#EA580C' : '#047857',
                          background: minTeams === 0 ? '#FEE2E2' : minTeams === 1 ? '#FFF7ED' : '#ECFDF5'
                        }}>
                          {minTeams === 0 ? '🔒 Full' : minTeams === 1 ? '🔥 1 Team' : `👥 ${minTeams} Teams`}
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Blocked Slots Summary & Quick List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} style={{ color: '#EF4444' }} />
                Active Blockages ({filteredSlots.length})
              </h4>
            </div>

            {filteredSlots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748B' }}>
                <Unlock size={32} style={{ color: '#CBD5E1', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>No active blockages for this view</p>
              </div>
            ) : (
              <div
                className="custom-scrollbar"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '520px',
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                  paddingRight: '6px'
                }}
              >
                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {formatServiceBadge(slot.serviceCategory)}
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#007A87', background: '#EEF2FF', border: '1px solid #C7D2FE', padding: '2px 8px', borderRadius: '12px' }}>
                          📍 {slot.location && slot.location !== 'all' ? slot.location : 'All Areas'}
                        </span>
                        {/* Show team capacity badge if a capacity override exists for this slot */}
                        {(() => {
                          const slotDate = slot.date || (slot as any).date_str;
                          const matchingCap = slotCapacities.find(c =>
                            c.date === slotDate &&
                            (c.location || 'all').toLowerCase() === (slot.location || 'all').toLowerCase() &&
                            (c.timeSlot ? c.timeSlot === slot.timeSlot : true)
                          );
                          if (!matchingCap) return null;
                          const t = matchingCap.maxTeams;
                          return (
                            <span style={{
                              fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px', borderRadius: '10px',
                              color: t === 0 ? '#DC2626' : t === 1 ? '#EA580C' : '#047857',
                              background: t === 0 ? '#FEE2E2' : t === 1 ? '#FFF7ED' : '#ECFDF5',
                              border: `1px solid ${t === 0 ? '#FECACA' : t === 1 ? '#FDBA74' : '#6EE7B7'}`
                            }}>
                              {t === 0 ? '🔒 Fully Blocked' : t === 1 ? '🔥 1 Team' : `👥 ${t} Teams`}
                            </span>
                          );
                        })()}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                        📅 {slot.date || (slot as any).date_str} {!slot.timeSlot || slot.timeSlot === 'all' || slot.timeSlot === '' || slot.timeSlot.toLowerCase().includes('full day') ? '• 🔴 Full Day' : `• ⏰ ${slot.timeSlot}`}
                      </div>
                      {slot.reason && (
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                          {slot.reason}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleUnblock(slot.id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #FECACA',
                        background: '#FEF2F2',
                        color: '#DC2626',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Unblock this slot"
                    >
                      <Trash2 size={13} />
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Capacity Overrides panel (date-specific, not standing defaults) */}
          {(() => {
            const dateCapacities = slotCapacities.filter((c) => {
              if (!c.date) return false; // skip standing defaults
              const cLoc = (c.location || 'all').toLowerCase().trim();
              const filterLoc = selectedLocationFilter.toLowerCase().trim();
              if (filterLoc !== 'all' && cLoc !== 'all' && cLoc !== filterLoc) return false;
              return true;
            });
            if (dateCapacities.length === 0) return null;
            return (
              <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} style={{ color: '#007A87' }} />
                  Team Capacity Overrides ({dateCapacities.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                  {dateCapacities.map((cap) => (
                    <div key={cap.id} style={{ padding: '10px 12px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#007A87', background: '#EEF2FF', border: '1px solid #C7D2FE', padding: '2px 8px', borderRadius: '12px' }}>
                            📍 {cap.location && cap.location !== 'all' ? cap.location : 'All Areas'}
                          </span>
                          <span style={{
                            fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px', borderRadius: '10px',
                            color: cap.maxTeams === 0 ? '#DC2626' : cap.maxTeams === 1 ? '#EA580C' : '#047857',
                            background: cap.maxTeams === 0 ? '#FEE2E2' : cap.maxTeams === 1 ? '#FFF7ED' : '#ECFDF5',
                            border: `1px solid ${cap.maxTeams === 0 ? '#FECACA' : cap.maxTeams === 1 ? '#FDBA74' : '#6EE7B7'}`
                          }}>
                            {cap.maxTeams === 0 ? '🔒 Full' : cap.maxTeams === 1 ? '🔥 1 Team' : `👥 ${cap.maxTeams} Teams`}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                          📅 {cap.date} {cap.timeSlot ? `• ⏰ ${cap.timeSlot}` : '• All Day'}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSlotCapacity(cap.id)}
                        style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Remove this capacity override"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Block Slot Modal */}
      <BlockSlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addBlockedSlot}
        initialDate={selectedDateForModal}
        initialServiceCategory={activeTab as any}
        initialLocation={selectedLocationFilter}
      />
    </div>
  );
};
