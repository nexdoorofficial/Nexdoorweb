import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { NewLocationModal } from '../../components/admin/NewLocationModal';
import type { ServiceAreaAdmin } from '../../types/admin';

export const AdminLocations: React.FC = () => {
  const { locations, toggleLocationStatus, deleteServiceLocation, bookings } = useAdminData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<ServiceAreaAdmin | null>(null);

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Service Areas & District Coverage
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            Manage serviceable zones, postal codes, and operational expansion across Ernakulam / Kochi
          </p>
        </div>

        <button
          onClick={() => {
            setEditingLocation(null);
            setIsModalOpen(true);
          }}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 8px 20px rgba(41, 195, 190, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} /> Add New Location
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {locations.map((loc) => {
          const activeBookings = bookings.filter((b) => b.area.toLowerCase() === loc.name.toLowerCase() && b.status !== 'cancelled').length;

          return (
            <div
              key={loc.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(41, 195, 190, 0.15)', color: '#1C2677', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{loc.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Pincode: {loc.pincode}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLocationStatus(loc.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: 'none',
                      background: loc.status === 'active' ? '#D1FAE5' : '#FEF3C7',
                      color: loc.status === 'active' ? '#059669' : '#D97706',
                      cursor: 'pointer'
                    }}
                  >
                    {loc.status === 'active' ? '● ACTIVE' : '○ COMING SOON'}
                  </button>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px' }}>
                  {loc.zone}
                </p>

                {/* Available Service Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {(loc.availableServices && loc.availableServices.length > 0
                    ? loc.availableServices
                    : ['house-cleaning', 'car-wash', 'laundry', 'specialized']
                  ).map((srv) => (
                    <span
                      key={srv}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '20px',
                        background: '#EFF6FF',
                        color: '#1E40AF'
                      }}
                    >
                      {srv === 'house-cleaning'
                        ? '🏠 House'
                        : srv === 'car-wash'
                        ? '🚗 Car Wash'
                        : srv === 'laundry'
                        ? '🧺 Laundry'
                        : srv === 'specialized'
                        ? '🧹 Specialized'
                        : srv}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Active Jobs in Zone:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C2677' }}>{activeBookings} Bookings</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                  <button
                    onClick={() => {
                      setEditingLocation(loc);
                      setIsModalOpen(true);
                    }}
                    style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete service area ${loc.name}?`)) {
                        deleteServiceLocation(loc.id);
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <NewLocationModal
        locationToEdit={editingLocation}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLocation(null);
        }}
      />
    </div>
  );
};
