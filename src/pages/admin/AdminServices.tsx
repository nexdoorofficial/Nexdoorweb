import React, { useState } from 'react';
import {
  Home as HomeIcon,
  Car,
  Shirt,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Search,
  RotateCcw,
  Save,
  MapPin
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { NewServiceModal } from '../../components/admin/NewServiceModal';
import { EditServiceModal } from '../../components/admin/EditServiceModal';
import { EditHousePlanModal } from '../../components/admin/EditHousePlanModal';
import { EditCarPackageModal } from '../../components/admin/EditCarPackageModal';
import { NewVariationModal } from '../../components/admin/NewVariationModal';
import { AddCategoryPlanModal } from '../../components/admin/AddCategoryPlanModal';
import { ServiceLocationModal } from '../../components/admin/ServiceLocationModal';
import type { AdminService } from '../../types/admin';
import type { HouseCategoryKey, HousePlanDetails, VehicleCategoryKey, CarPackageItem } from '../../types';

export const AdminServices: React.FC = () => {
  const {
    services,
    updateService,
    toggleServiceStatus,
    deleteService,
    houseCategories,
    vehicleCategories,
    laundryConfig,
    updateLaundryConfig,
    updateHouseCategoryLocations,
    updateVehicleCategoryLocations,
    updateLaundryLocations,
    resetAllCategoriesToDefault,
    deleteHouseCategory,
    deleteVehicleCategory,
    deleteHouseCategoryPlan,
    deleteCarPackage
  } = useAdminData();

  const [variationModalType, setVariationModalType] = useState<'house' | 'car' | null>(null);

  const [addPlanModal, setAddPlanModal] = useState<{
    type: 'house' | 'car';
    houseCategoryKey?: HouseCategoryKey;
    vehicleCategoryKey?: VehicleCategoryKey;
    label: string;
  } | null>(null);

  // Tab State: 'house' | 'car' | 'laundry' | 'standalone'
  const [activeTab, setActiveTab] = useState<'house' | 'car' | 'laundry' | 'standalone'>('house');

  // Generic Location Config Modal State
  const [locModalData, setLocModalData] = useState<{
    title: string;
    subtitle?: string;
    initialLocations?: string[];
    onSave: (locs: string[]) => void;
  } | null>(null);

  // House Cleaning state
  const [selectedHouseCategory, setSelectedHouseCategory] = useState<HouseCategoryKey>('2-bhk');
  const [editingHousePlan, setEditingHousePlan] = useState<{
    categoryKey: HouseCategoryKey;
    categoryLabel: string;
    planType: string;
    planData: HousePlanDetails;
  } | null>(null);

  // Car Wash state
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<VehicleCategoryKey>('sedan');
  const [editingCarPkg, setEditingCarPkg] = useState<{
    vehicleKey: VehicleCategoryKey;
    vehicleLabel: string;
    packageKey: string;
    packageData: CarPackageItem;
  } | null>(null);

  // Laundry state local edit
  const [editingLaundry, setEditingLaundry] = useState(laundryConfig);
  const [newLaundryInc, setNewLaundryInc] = useState('');
  const [newLaundryExc, setNewLaundryExc] = useState('');

  React.useEffect(() => {
    setEditingLaundry(laundryConfig);
  }, [laundryConfig]);

  // Standalone Services state
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(null);

  const currentHouseCategoryData = houseCategories.find((c) => c.id === selectedHouseCategory) || houseCategories[0] || houseCategories[1];
  const currentVehicleCategoryData = vehicleCategories.find((v) => v.id === selectedVehicleCategory) || vehicleCategories[0] || vehicleCategories[1];

  const handleSaveLaundryRates = () => {
    updateLaundryConfig(editingLaundry);
    alert('Laundry rates, delivery rules & service coverage updated successfully!');
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Services & Pricing Catalog Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
            Manage house cleaning plans, car wash tiers, laundry rates, and standalone services
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              if (window.confirm('Reset all categories and rates to factory defaults?')) {
                resetAllCategoriesToDefault();
              }
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#64748B',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={16} /> Reset Defaults
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
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
            <Plus size={16} /> Add Standalone Service
          </button>
        </div>
      </div>

      {/* Main 4-Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #E2E8F0', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveTab('house')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'house' ? '3px solid #1C2677' : '3px solid transparent',
            background: activeTab === 'house' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'house' ? '#1C2677' : '#64748B',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <HomeIcon size={18} /> House Cleaning Plans ({houseCategories.length})
        </button>

        <button
          onClick={() => setActiveTab('car')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'car' ? '3px solid #2563EB' : '3px solid transparent',
            background: activeTab === 'car' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'car' ? '#2563EB' : '#64748B',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <Car size={18} /> Car Wash Packages ({vehicleCategories.length})
        </button>

        <button
          onClick={() => setActiveTab('laundry')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'laundry' ? '3px solid #059669' : '3px solid transparent',
            background: activeTab === 'laundry' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'laundry' ? '#059669' : '#64748B',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <Shirt size={18} /> Laundry Rates & Care Tiers
        </button>

        <button
          onClick={() => setActiveTab('standalone')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom: activeTab === 'standalone' ? '3px solid #9333EA' : '3px solid transparent',
            background: activeTab === 'standalone' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'standalone' ? '#9333EA' : '#64748B',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <Sparkles size={18} /> Standalone Services ({services.length})
        </button>
      </div>

      {/* TAB 1: HOUSE CLEANING PLANS CRUD */}
      {activeTab === 'house' && currentHouseCategoryData && (
        <div>
          {/* Sub-selector for BHK/Villa */}
          <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '18px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', flex: 1, paddingBottom: '4px' }}>
              {houseCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedHouseCategory(c.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    border: 'none',
                    background: selectedHouseCategory === c.id ? '#1C2677' : '#F1F5F9',
                    color: selectedHouseCategory === c.id ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {c.label} ({c.sqftRange})
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() =>
                  setLocModalData({
                    title: `House Cleaning (${currentHouseCategoryData.label})`,
                    subtitle: `Configure active serviceable locations for ${currentHouseCategoryData.label} (${currentHouseCategoryData.sqftRange})`,
                    initialLocations: currentHouseCategoryData.availableLocations,
                    onSave: (locs) => updateHouseCategoryLocations(currentHouseCategoryData.id, locs)
                  })
                }
                style={{ background: '#EEF2FF', color: '#1C2677', border: '1px solid #818CF8', padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <MapPin size={16} style={{ color: '#29C3BE' }} />
                {currentHouseCategoryData.availableLocations && currentHouseCategoryData.availableLocations.length > 0
                  ? `${currentHouseCategoryData.availableLocations.length} Areas Active`
                  : 'All Areas Active'}
              </button>

              <button
                onClick={() =>
                  setAddPlanModal({
                    type: 'house',
                    houseCategoryKey: currentHouseCategoryData.id,
                    label: currentHouseCategoryData.label
                  })
                }
                style={{ background: 'linear-gradient(135deg, #1C2677, #29C3BE)', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(41,195,190,0.25)' }}
              >
                <Plus size={16} /> Add New Plan Tier
              </button>

              <button
                onClick={() => setVariationModalType('house')}
                style={{ background: '#1C2677', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Add Variation
              </button>
              
              {houseCategories.length > 1 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${currentHouseCategoryData.label} variation category?`)) {
                      deleteHouseCategory(currentHouseCategoryData.id);
                      setSelectedHouseCategory(houseCategories[0].id);
                    }
                  }}
                  style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Delete Category
                </button>
              )}
            </div>
          </div>

          {/* Standard, Premium & Custom Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {/* Standard Plan Card */}
            {currentHouseCategoryData.standard && (
              <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, background: '#E2E8F0', color: '#334155' }}>
                      STANDARD PLAN
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginTop: '6px', marginBottom: '4px' }}>
                      {currentHouseCategoryData.standard.name}
                    </h3>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1C2677' }}>
                      {currentHouseCategoryData.standard.priceDisplay}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() =>
                        setEditingHousePlan({
                          categoryKey: currentHouseCategoryData.id,
                          categoryLabel: currentHouseCategoryData.label,
                          planType: 'standard',
                          planData: currentHouseCategoryData.standard
                        })
                      }
                      style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', color: '#1C2677', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit2 size={14} /> Edit Plan
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${currentHouseCategoryData.standard.name}?`)) {
                          deleteHouseCategoryPlan(currentHouseCategoryData.id, 'standard');
                        }
                      }}
                      style={{ background: '#FEE2E2', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#64748B', marginBottom: '16px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px' }}>
                  <span>⏱ {currentHouseCategoryData.standard.duration}</span>
                  <span>👥 {currentHouseCategoryData.standard.professionals} Professionals</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                  {currentHouseCategoryData.standard.description}
                </p>

                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>Included Features:</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#334155', marginBottom: '16px' }}>
                  {currentHouseCategoryData.standard.included.map((item, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Premium Plan Card */}
            {currentHouseCategoryData.premium && (
              <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '2px solid #29C3BE', padding: '24px', boxShadow: '0 8px 24px rgba(41, 195, 190, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, background: '#29C3BE', color: '#0F172A' }}>
                      PREMIUM ULTRA PLAN ★ RECOMMENDED
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginTop: '6px', marginBottom: '4px' }}>
                      {currentHouseCategoryData.premium.name}
                    </h3>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0D9488' }}>
                      {currentHouseCategoryData.premium.priceDisplay}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() =>
                        setEditingHousePlan({
                          categoryKey: currentHouseCategoryData.id,
                          categoryLabel: currentHouseCategoryData.label,
                          planType: 'premium',
                          planData: currentHouseCategoryData.premium
                        })
                      }
                      style={{ background: '#29C3BE', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit2 size={14} /> Edit Plan
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${currentHouseCategoryData.premium.name}?`)) {
                          deleteHouseCategoryPlan(currentHouseCategoryData.id, 'premium');
                        }
                      }}
                      style={{ background: '#FEE2E2', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#64748B', marginBottom: '16px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px' }}>
                  <span>⏱ {currentHouseCategoryData.premium.duration}</span>
                  <span>👥 {currentHouseCategoryData.premium.professionals} Professionals</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                  {currentHouseCategoryData.premium.description}
                </p>

                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>Included Features:</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#334155', marginBottom: '16px' }}>
                  {currentHouseCategoryData.premium.included.map((item, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Custom Plan Cards */}
            {(currentHouseCategoryData.customPlans || []).map((cp) => (
              <div key={cp.id || cp.name} style={{ background: '#FFFFFF', borderRadius: '20px', border: '2px solid #FCD34D', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, background: '#FEF3C7', color: '#92400E' }}>
                      CUSTOM PLAN TIER
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginTop: '6px', marginBottom: '4px' }}>
                      {cp.name}
                    </h3>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#B45309' }}>
                      {cp.priceDisplay}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() =>
                        setEditingHousePlan({
                          categoryKey: currentHouseCategoryData.id,
                          categoryLabel: currentHouseCategoryData.label,
                          planType: cp.id || cp.name,
                          planData: cp
                        })
                      }
                      style={{ background: '#FEF3C7', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', color: '#92400E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit2 size={14} /> Edit Plan
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete plan ${cp.name}?`)) {
                          deleteHouseCategoryPlan(currentHouseCategoryData.id, cp.id || cp.name);
                        }
                      }}
                      style={{ background: '#FEE2E2', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#64748B', marginBottom: '16px', background: '#FFFBEB', padding: '10px 14px', borderRadius: '10px' }}>
                  <span>⏱ {cp.duration}</span>
                  <span>👥 {cp.professionals} Staff</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                  {cp.description}
                </p>

                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>Included Features:</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#334155', marginBottom: '16px' }}>
                  {cp.included.map((item, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CAR WASH PACKAGES CRUD */}
      {activeTab === 'car' && currentVehicleCategoryData && (
        <div>
          {/* Vehicle Type Sub-selector */}
          <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '18px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', flex: 1, paddingBottom: '4px' }}>
              {vehicleCategories.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleCategory(v.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    border: 'none',
                    background: selectedVehicleCategory === v.id ? '#2563EB' : '#F1F5F9',
                    color: selectedVehicleCategory === v.id ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🚗 {v.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() =>
                  setLocModalData({
                    title: `Car Wash (${currentVehicleCategoryData.label})`,
                    subtitle: `Configure active serviceable locations for ${currentVehicleCategoryData.label} (${currentVehicleCategoryData.examples})`,
                    initialLocations: currentVehicleCategoryData.availableLocations,
                    onSave: (locs) => updateVehicleCategoryLocations(currentVehicleCategoryData.id, locs)
                  })
                }
                style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD', padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <MapPin size={16} style={{ color: '#2563EB' }} />
                {currentVehicleCategoryData.availableLocations && currentVehicleCategoryData.availableLocations.length > 0
                  ? `${currentVehicleCategoryData.availableLocations.length} Areas Active`
                  : 'All Areas Active'}
              </button>

              <button
                onClick={() =>
                  setAddPlanModal({
                    type: 'car',
                    vehicleCategoryKey: currentVehicleCategoryData.id,
                    label: currentVehicleCategoryData.label
                  })
                }
                style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}
              >
                <Plus size={16} /> Add Wash Package
              </button>

              <button
                onClick={() => setVariationModalType('car')}
                style={{ background: '#2563EB', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Add Variation
              </button>

              {vehicleCategories.length > 1 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${currentVehicleCategoryData.label} vehicle category?`)) {
                      deleteVehicleCategory(currentVehicleCategoryData.id);
                      setSelectedVehicleCategory(vehicleCategories[0].id);
                    }
                  }}
                  style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Delete Category
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: '#64748B' }}>
            Showing package options for <strong>{currentVehicleCategoryData.label}</strong> ({currentVehicleCategoryData.examples})
          </div>

          {/* Packages Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {Object.keys(currentVehicleCategoryData.packages).map((pkgKey) => {
              const pkg = (currentVehicleCategoryData.packages as any)[pkgKey];
              if (!pkg) return null;

              return (
                <div key={pkgKey} style={{ background: '#FFFFFF', borderRadius: '18px', border: pkgKey === 'premium' ? '2px solid #2563EB' : '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, background: pkgKey === 'premium' ? '#DBEAFE' : '#F1F5F9', color: pkgKey === 'premium' ? '#1D4ED8' : '#334155', textTransform: 'uppercase' }}>
                        {pkgKey}
                      </span>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() =>
                            setEditingCarPkg({
                              vehicleKey: currentVehicleCategoryData.id,
                              vehicleLabel: currentVehicleCategoryData.label,
                              packageKey: pkgKey,
                              packageData: pkg
                            })
                          }
                          style={{ background: 'transparent', border: '1px solid #CBD5E1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Edit2 size={12} /> Edit
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${pkg.name}?`)) {
                              deleteCarPackage(currentVehicleCategoryData.id, pkgKey);
                            }
                          }}
                          style={{ background: '#FEE2E2', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{pkg.name}</h4>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563EB', margin: '4px 0 8px 0' }}>₹{pkg.price}</div>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>{pkg.tagline}</p>
                    <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '12px', background: '#F8FAFC', padding: '6px 8px', borderRadius: '6px' }}>⏱ {pkg.duration}</div>

                    <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.78rem', color: '#334155' }}>
                      {pkg.included.slice(0, 4).map((inc: string, i: number) => (
                        <li key={i} style={{ marginBottom: '3px' }}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LAUNDRY RATES & CARE TIERS */}
      {activeTab === 'laundry' && (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', maxWidth: '900px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Laundry Package Rates, Surcharges & Service Scope
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748B', margin: '4px 0 0 0' }}>
                Configure base per-kg rates, doorstep delivery rules, quality care tiers, and service coverage items
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() =>
                  setLocModalData({
                    title: 'Laundry Services Coverage',
                    subtitle: 'Configure active doorstep pickup & delivery locations for Laundry Services',
                    initialLocations: laundryConfig.availableLocations,
                    onSave: (locs) => updateLaundryLocations(locs)
                  })
                }
                style={{ background: '#EEF2FF', color: '#1C2677', border: '1px solid #818CF8', padding: '10px 16px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <MapPin size={16} style={{ color: '#29C3BE' }} />
                {laundryConfig.availableLocations && laundryConfig.availableLocations.length > 0
                  ? `${laundryConfig.availableLocations.length} Areas Active`
                  : 'All Areas Active'}
              </button>

              <button
                onClick={handleSaveLaundryRates}
                style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #059669, #10B981)', color: '#FFF', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)' }}
              >
                <Save size={18} /> Save Laundry Settings
              </button>
            </div>
          </div>

          {/* 1. Package Per Kg Base Rates & Descriptions */}
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C2677', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shirt size={18} style={{ color: '#29C3BE' }} /> Package Rates (₹ / Kg) & Subtext Descriptions
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            {(Object.keys(editingLaundry.packages || {}) as (keyof typeof editingLaundry.packages)[]).map((pkgKey) => {
              const item = editingLaundry.packages[pkgKey] || { name: pkgKey, pricePerKg: 70, description: '' };
              return (
                <div key={pkgKey} style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E293B', marginBottom: '10px' }}>
                    {item.name}
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Price (₹ / Kg)
                    </label>
                    <input
                      type="number"
                      value={item.pricePerKg}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEditingLaundry({
                          ...editingLaundry,
                          packages: {
                            ...editingLaundry.packages,
                            [pkgKey]: { ...item, pricePerKg: val }
                          }
                        });
                      }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Subtext / Package Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        setEditingLaundry({
                          ...editingLaundry,
                          packages: {
                            ...editingLaundry.packages,
                            [pkgKey]: { ...item, description: e.target.value }
                          }
                        });
                      }}
                      placeholder="e.g. Wash, Dry & Steam Press"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Doorstep Pickup & Delivery Rules */}
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C2677', marginBottom: '14px' }}>
            Doorstep Pickup & Delivery Rules
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#EFF6FF', padding: '16px', borderRadius: '14px', border: '1px solid #BFDBFE' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1E40AF', marginBottom: '4px' }}>
                Pickup & Delivery Fee (Flat ₹)
              </label>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#3B82F6', marginBottom: '8px' }}>
                Applied on orders below minimum load weight
              </span>
              <input
                type="number"
                value={editingLaundry.pickupFee ?? 80}
                onChange={(e) => setEditingLaundry({ ...editingLaundry, pickupFee: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #93C5FD', fontSize: '0.95rem', fontWeight: 700 }}
              />
            </div>

            <div style={{ background: '#EFF6FF', padding: '16px', borderRadius: '14px', border: '1px solid #BFDBFE' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1E40AF', marginBottom: '4px' }}>
                Free Delivery Minimum Weight (Kg)
              </label>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#3B82F6', marginBottom: '8px' }}>
                Order weight needed to unlock FREE doorstep pickup
              </span>
              <input
                type="number"
                value={editingLaundry.freePickupMinWeight ?? 2}
                onChange={(e) => setEditingLaundry({ ...editingLaundry, freePickupMinWeight: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #93C5FD', fontSize: '0.95rem', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* 3. Delivery Speed & Care Surcharges & Subtexts */}
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C2677', marginBottom: '14px' }}>
            Delivery Speed & Care Quality Surcharges
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#FFFBEB', padding: '16px', borderRadius: '14px', border: '1px solid #FDE68A' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#92400E', marginBottom: '4px' }}>
                Express Delivery Surcharge (Flat ₹)
              </label>
              <input
                type="number"
                value={editingLaundry.expressSurcharge ?? 199}
                onChange={(e) => setEditingLaundry({ ...editingLaundry, expressSurcharge: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #FCD34D', fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}
              />
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#78350F', marginBottom: '4px' }}>
                Express Speed Subtext
              </label>
              <input
                type="text"
                value={editingLaundry.expressSpeedDesc || 'Rush same-day dispatch (+₹199)'}
                onChange={(e) => setEditingLaundry({ ...editingLaundry, expressSpeedDesc: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #FCD34D', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '14px', border: '1px solid #DCFCE7' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#166534', marginBottom: '4px' }}>
                Premium Luxury Care Surcharge (+₹ / Kg)
              </label>
              <input
                type="number"
                value={editingLaundry.premiumCareSurchargePerKg ?? 35}
                onChange={(e) => setEditingLaundry({ ...editingLaundry, premiumCareSurchargePerKg: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #86EFAC', fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}
              />
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#14532D', marginBottom: '4px' }}>
                Premium Luxury Care Subtext
              </label>
              <input
                type="text"
                value={editingLaundry.premiumCareDesc || 'Imported liquid, fabric conditioner, luxury fragrance'}
                onChange={(e) => setEditingLaundry({ ...editingLaundry, premiumCareDesc: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #86EFAC', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* 4. Service Inclusions List Manager */}
          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#166534', margin: '0 0 10px 0' }}>
              Included Features in Laundry Service ({ (editingLaundry.included || []).length })
            </h4>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Add included feature (e.g. Individual load wash, steam press...)"
                value={newLaundryInc}
                onChange={(e) => setNewLaundryInc(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={() => {
                  if (newLaundryInc.trim()) {
                    setEditingLaundry({
                      ...editingLaundry,
                      included: [...(editingLaundry.included || []), newLaundryInc.trim()]
                    });
                    setNewLaundryInc('');
                  }
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', background: '#059669', color: '#FFF', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(editingLaundry.included || []).map((incItem, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#334155' }}>
                  <span>✓ {incItem}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editingLaundry.included || []).filter((_, i) => i !== idx);
                      setEditingLaundry({ ...editingLaundry, included: updated });
                    }}
                    style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'center' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Service Exclusions List Manager */}
          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#991B1B', margin: '0 0 10px 0' }}>
              Excluded Items in Laundry Service ({ (editingLaundry.excluded || []).length })
            </h4>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Add excluded item (e.g. Heavy genuine leather jackets, rugs...)"
                value={newLaundryExc}
                onChange={(e) => setNewLaundryExc(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={() => {
                  if (newLaundryExc.trim()) {
                    setEditingLaundry({
                      ...editingLaundry,
                      excluded: [...(editingLaundry.excluded || []), newLaundryExc.trim()]
                    });
                    setNewLaundryExc('');
                  }
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', background: '#DC2626', color: '#FFF', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(editingLaundry.excluded || []).map((excItem, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#64748B' }}>
                  <span>✗ {excItem}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editingLaundry.excluded || []).filter((_, i) => i !== idx);
                      setEditingLaundry({ ...editingLaundry, excluded: updated });
                    }}
                    style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'center' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: STANDALONE & FEATURED SERVICES CRUD */}
      {activeTab === 'standalone' && (
        <div>
          <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '18px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search service title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {services
              .filter((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((s) => (
                <div key={s.id} style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', overflow: 'hidden', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, background: '#F1F5F9', color: '#334155', textTransform: 'capitalize' }}>
                        {s.category.replace('-', ' ')}
                      </span>
                      <button
                        onClick={() => toggleServiceStatus(s.id)}
                        style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, border: 'none', background: s.status === 'active' ? '#D1FAE5' : '#FEE2E2', color: s.status === 'active' ? '#059669' : '#DC2626', cursor: 'pointer' }}
                      >
                        ● {s.status.toUpperCase()}
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{s.title}</h4>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1C2677', margin: '4px 0 8px 0' }}>{s.startingPrice}</div>
                    
                    {/* Plan Tiers Preview */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                      {s.standardPlan && (
                        <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, background: '#E2E8F0', color: '#1E293B' }}>
                          Standard: {s.standardPlan.priceDisplay}
                        </span>
                      )}
                      {s.premiumPlan && (
                        <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, background: '#DCFCE7', color: '#166534' }}>
                          Premium: {s.premiumPlan.priceDisplay}
                        </span>
                      )}
                      {s.customPlans && s.customPlans.length > 0 && (
                        <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, background: '#FEF3C7', color: '#92400E' }}>
                          + {s.customPlans.length} Custom Tier(s)
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '12px' }}>{s.overview}</p>

                    {/* Location Availability Badge & Configurator Trigger */}
                    <div style={{ margin: '8px 0 12px 0', fontSize: '0.78rem', color: '#1C2677', background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} style={{ color: '#29C3BE' }} />
                        {s.availableLocations && s.availableLocations.length > 0
                          ? `${s.availableLocations.length} Area(s) Active`
                          : 'Active in All Areas'}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setLocModalData({
                            title: s.title,
                            subtitle: `Configure active locations for ${s.title}`,
                            initialLocations: s.availableLocations,
                            onSave: (locs) => updateService(s.id, { availableLocations: locs })
                          })
                        }
                        style={{ background: '#1C2677', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Manage Areas
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                    <button onClick={() => setEditingService(s)} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => { if (window.confirm(`Delete ${s.title}?`)) deleteService(s.id); }} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <NewServiceModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
      <EditServiceModal service={editingService} isOpen={!!editingService} onClose={() => setEditingService(null)} />
      <ServiceLocationModal
        title={locModalData?.title || ''}
        subtitle={locModalData?.subtitle}
        initialLocations={locModalData?.initialLocations}
        isOpen={!!locModalData}
        onClose={() => setLocModalData(null)}
        onSave={(locs) => locModalData?.onSave(locs)}
      />
      <EditHousePlanModal
        categoryKey={editingHousePlan?.categoryKey || null}
        categoryLabel={editingHousePlan?.categoryLabel || ''}
        planType={editingHousePlan?.planType || null}
        planData={editingHousePlan?.planData || null}
        isOpen={!!editingHousePlan}
        onClose={() => setEditingHousePlan(null)}
      />
      <EditCarPackageModal
        vehicleKey={editingCarPkg?.vehicleKey || null}
        vehicleLabel={editingCarPkg?.vehicleLabel || ''}
        packageKey={editingCarPkg?.packageKey || null}
        packageData={editingCarPkg?.packageData || null}
        isOpen={!!editingCarPkg}
        onClose={() => setEditingCarPkg(null)}
      />
      <NewVariationModal
        type={variationModalType || 'house'}
        isOpen={!!variationModalType}
        onClose={() => setVariationModalType(null)}
      />
      <AddCategoryPlanModal
        categoryType={addPlanModal?.type || 'house'}
        houseCategoryKey={addPlanModal?.houseCategoryKey}
        vehicleCategoryKey={addPlanModal?.vehicleCategoryKey}
        categoryLabel={addPlanModal?.label || ''}
        isOpen={!!addPlanModal}
        onClose={() => setAddPlanModal(null)}
      />
    </div>
  );
};
