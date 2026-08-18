import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Save } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';

interface ServiceLocationModalProps {
  title: string;
  subtitle?: string;
  initialLocations?: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (locations: string[]) => void;
}

export const ServiceLocationModal: React.FC<ServiceLocationModalProps> = ({
  title,
  subtitle,
  initialLocations,
  isOpen,
  onClose,
  onSave
}) => {
  const { locations } = useAdminData();

  const allLocations = locations && locations.length > 0
    ? locations
    : [
        { id: '1', name: 'Kakkanad', zone: 'SmartCity & Infopark', pincode: '682030' },
        { id: '2', name: 'Edappally', zone: 'Lulu Mall & Bypass', pincode: '682024' },
        { id: '3', name: 'Kalamassery', zone: 'CUSAT & Apollo', pincode: '682022' },
        { id: '4', name: 'Ernakulam Central', zone: 'Marine Drive & MG Road', pincode: '682011' },
        { id: '5', name: 'Vytila', zone: 'Mobility Hub & Metro', pincode: '682019' },
        { id: '6', name: 'Aluva', zone: 'Cochin Airport Highway', pincode: '683101' }
      ];

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialLocations && initialLocations.length > 0) {
        setSelectedLocations(initialLocations);
      } else {
        setSelectedLocations(allLocations.map((l) => l.name));
      }
    }
  }, [isOpen, initialLocations]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedLocations);
    onClose();
  };

  const handleSelectAll = () => {
    setSelectedLocations(allLocations.map((l) => l.name));
  };

  const handleClearAll = () => {
    setSelectedLocations([]);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              background: 'linear-gradient(135deg, #03252A 0%, #004D56 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'linear-gradient(135deg, #007A87, #9BC83B)', padding: '8px', borderRadius: '10px', color: '#FFF', display: 'flex' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                  Location Coverage Settings
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: '2px 0 0 0' }}>
                  {subtitle || `Configure serviceable areas for ${title}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#007A87' }}>
                Select Active Areas ({selectedLocations.length} of {allLocations.length} active)
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  style={{ background: 'transparent', border: 'none', color: '#1D4ED8', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Select All
                </button>
                <span style={{ color: '#CBD5E1' }}>|</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  style={{ background: 'transparent', border: 'none', color: '#DC2626', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Location Checkboxes */}
            <div
              className="custom-scrollbar"
              onWheel={(e) => e.stopPropagation()}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '24px',
                maxHeight: '320px',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                paddingRight: '6px'
              }}
            >
              {allLocations.map((loc) => {
                const isChecked = selectedLocations.includes(loc.name);
                return (
                  <label
                    key={loc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: isChecked ? '#EEF2FF' : '#F8FAFC',
                      border: `1.5px solid ${isChecked ? '#818CF8' : '#CBD5E1'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLocations([...selectedLocations, loc.name]);
                        } else {
                          setSelectedLocations(selectedLocations.filter((l) => l !== loc.name));
                        }
                      }}
                      style={{ width: '18px', height: '18px', accentColor: '#007A87', cursor: 'pointer' }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: isChecked ? '#007A87' : '#334155', display: 'block' }}>
                        {loc.name}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {loc.zone || `Pincode: ${loc.pincode}`}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            {selectedLocations.length === 0 && (
              <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '12px', border: '1px solid #FCA5A5', color: '#B91C1C', fontSize: '0.82rem', marginBottom: '16px', fontWeight: 700 }}>
                ⚠️ Warning: Clearing all locations will make this service unavailable across all regions.
              </div>
            )}

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFF', color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #007A87, #0093A2)',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(28, 38, 119, 0.25)'
                }}
              >
                <Save size={16} /> Save Location Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
