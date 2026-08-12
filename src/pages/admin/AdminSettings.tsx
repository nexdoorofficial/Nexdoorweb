import React, { useState } from 'react';
import {
  Settings,
  Image as ImageIcon,
  Menu,
  PhoneCall,
  BarChart3,
  Upload,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import type { HeaderMenuItem } from '../../types/admin';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings, resetSiteSettings, adminEmail, updateAdminCredentials } = useAdminData();
  const [activeTab, setActiveTab] = useState<'branding' | 'menu' | 'helpline' | 'stats' | 'security'>('branding');

  // Security Form State
  const [newAdminEmail, setNewAdminEmail] = useState(adminEmail || 'nexdoorofficial@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isUpdatingAuth, setIsUpdatingAuth] = useState(false);

  // Form states initialized from siteSettings
  const [logoUrl, setLogoUrl] = useState(siteSettings?.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(siteSettings?.faviconUrl || '');

  // Helpline state
  const [supportPhone, setSupportPhone] = useState(siteSettings?.supportPhone || '+91 98765 43210');
  const [supportEmail, setSupportEmail] = useState(siteSettings?.supportEmail || 'support@nexdoorclean.com');
  const [operatingHours, setOperatingHours] = useState(siteSettings?.operatingHours || 'Monday - Sunday: 07:00 AM - 09:00 PM');

  // Stats state
  const [statCleanedCount, setStatCleanedCount] = useState(siteSettings?.statCleanedCount || '15,000+');
  const [statCleanedLabel, setStatCleanedLabel] = useState(siteSettings?.statCleanedLabel || 'Cleaned Homes & Cars');
  const [statRating, setStatRating] = useState(siteSettings?.statRating || '4.9★');
  const [statRatingLabel, setStatRatingLabel] = useState(siteSettings?.statRatingLabel || 'Customer Rating');
  const [statHubsCount, setStatHubsCount] = useState(siteSettings?.statHubsCount || '3 Primary');
  const [statHubsLabel, setStatHubsLabel] = useState(siteSettings?.statHubsLabel || 'Kochi Service Hubs');
  const [statEcoPercent, setStatEcoPercent] = useState(siteSettings?.statEcoPercent || '100%');
  const [statEcoLabel, setStatEcoLabel] = useState(siteSettings?.statEcoLabel || 'Eco-Friendly Chemicals');

  // Menu state
  const [headerMenu, setHeaderMenu] = useState<HeaderMenuItem[]>(siteSettings?.headerMenu || []);

  // Sync state if siteSettings changes externally
  React.useEffect(() => {
    if (siteSettings) {
      setLogoUrl(siteSettings.logoUrl || '');
      setFaviconUrl(siteSettings.faviconUrl || '');
      setSupportPhone(siteSettings.supportPhone || '+91 98765 43210');
      setSupportEmail(siteSettings.supportEmail || 'support@nexdoorclean.com');
      setOperatingHours(siteSettings.operatingHours || 'Monday - Sunday: 07:00 AM - 09:00 PM');
      setStatCleanedCount(siteSettings.statCleanedCount || '15,000+');
      setStatCleanedLabel(siteSettings.statCleanedLabel || 'Cleaned Homes & Cars');
      setStatRating(siteSettings.statRating || '4.9★');
      setStatRatingLabel(siteSettings.statRatingLabel || 'Customer Rating');
      setStatHubsCount(siteSettings.statHubsCount || '3 Primary');
      setStatHubsLabel(siteSettings.statHubsLabel || 'Kochi Service Hubs');
      setStatEcoPercent(siteSettings.statEcoPercent || '100%');
      setStatEcoLabel(siteSettings.statEcoLabel || 'Eco-Friendly Chemicals');
      setHeaderMenu(siteSettings.headerMenu || []);
    }
  }, [siteSettings]);

  // Image Upload Handlers (converts PNG/JPEG to base64 DataURL)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogoUrl(result);
      updateSiteSettings({ logoUrl: result });
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFaviconUrl(result);
      updateSiteSettings({ faviconUrl: result });
    };
    reader.readAsDataURL(file);
  };

  // Save Helpline Settings
  const handleSaveHelpline = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      supportPhone,
      supportEmail,
      operatingHours
    });
  };

  // Save Stats Settings
  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      statCleanedCount,
      statCleanedLabel,
      statRating,
      statRatingLabel,
      statHubsCount,
      statHubsLabel,
      statEcoPercent,
      statEcoLabel
    });
  };

  // Header Menu CRUD
  const handleAddMenuItem = () => {
    const newItem: HeaderMenuItem = {
      id: 'm-' + Date.now(),
      label: 'New Link',
      path: '/new-link',
      hasDropdown: false
    };
    const updated = [...headerMenu, newItem];
    setHeaderMenu(updated);
    updateSiteSettings({ headerMenu: updated });
  };

  const handleUpdateMenuItem = (id: string, updates: Partial<HeaderMenuItem>) => {
    const updated = headerMenu.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setHeaderMenu(updated);
    updateSiteSettings({ headerMenu: updated });
  };

  const handleDeleteMenuItem = (id: string) => {
    const updated = headerMenu.filter((item) => item.id !== id);
    setHeaderMenu(updated);
    updateSiteSettings({ headerMenu: updated });
  };

  const handleAddSubItem = (parentId: string) => {
    const updated = headerMenu.map((item) => {
      if (item.id === parentId) {
        const existingSubs = item.dropdownItems || [];
        const newSub = {
          id: 'sub-' + Date.now(),
          title: 'New Service Item',
          sub: 'Starting at ₹499',
          path: '/services/house-cleaning',
          iconType: 'house' as const
        };
        return {
          ...item,
          hasDropdown: true,
          dropdownItems: [...existingSubs, newSub]
        };
      }
      return item;
    });
    setHeaderMenu(updated);
    updateSiteSettings({ headerMenu: updated });
  };

  const handleUpdateSubItem = (parentId: string, subId: string, updates: any) => {
    const updated = headerMenu.map((item) => {
      if (item.id === parentId && item.dropdownItems) {
        const updatedSubs = item.dropdownItems.map((sub) =>
          sub.id === subId ? { ...sub, ...updates } : sub
        );
        return { ...item, dropdownItems: updatedSubs };
      }
      return item;
    });
    setHeaderMenu(updated);
    updateSiteSettings({ headerMenu: updated });
  };

  const handleDeleteSubItem = (parentId: string, subId: string) => {
    const updated = headerMenu.map((item) => {
      if (item.id === parentId && item.dropdownItems) {
        const updatedSubs = item.dropdownItems.filter((sub) => sub.id !== subId);
        return { ...item, dropdownItems: updatedSubs };
      }
      return item;
    });
    setHeaderMenu(updated);
    updateSiteSettings({ headerMenu: updated });
  };

  // Save Security Settings
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      alert('New password and confirmation password do not match!');
      return;
    }

    setIsUpdatingAuth(true);
    try {
      const res = await updateAdminCredentials(newAdminEmail, newPassword);
      if (res.success) {
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(res.error || 'Failed to update credentials');
      }
    } finally {
      setIsUpdatingAuth(false);
    }
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
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
            <Settings size={28} style={{ color: '#29C3BE' }} />
            Site Settings & Header Customization
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Manage logo, favicon, header navigation menus, helpline contact info, and website statistics
          </p>
        </div>

        <button
          onClick={resetSiteSettings}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            color: '#475569',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease'
          }}
        >
          <RotateCcw size={16} /> Reset All Settings
        </button>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #E2E8F0',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}
      >
        {[
          { id: 'branding', label: 'Logo & Favicon', icon: ImageIcon },
          { id: 'menu', label: 'Header Navigation Menu', icon: Menu },
          { id: 'helpline', label: 'Instant Support & Helpline', icon: PhoneCall },
          { id: 'stats', label: 'Numbers & Statistics', icon: BarChart3 },
          { id: 'security', label: 'Admin Credentials & Security', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '12px 12px 0 0',
                border: 'none',
                borderBottom: isActive ? '3px solid #29C3BE' : '3px solid transparent',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#1C2677' : '#64748B',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} color={isActive ? '#29C3BE' : '#94A3B8'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT RENDER */}
      {activeTab === 'branding' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Logo Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '6px' }}>
              Header & Footer Brand Logo
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
              Upload your official PNG or JPEG logo file to customize the brand mark across your entire website header, footer, and admin panel.
            </p>

            {/* Current Logo Preview */}
            <div
              style={{
                background: '#F8FAFC',
                border: '2px dashed #CBD5E1',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '20px'
              }}
            >
              {logoUrl ? (
                <div>
                  <img
                    src={logoUrl}
                    alt="Brand Logo"
                    style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain', marginBottom: '12px' }}
                  />
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                    ✓ Custom Logo Active
                  </span>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                      color: '#FFF',
                      fontWeight: 900,
                      fontSize: '1.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px auto'
                    }}
                  >
                    NX
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>NEXDOOR</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                    Default Vector Brand Logo
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(41, 195, 190, 0.3)'
                }}
              >
                <Upload size={16} /> Upload New Logo (PNG / JPG)
                <input type="file" accept="image/png, image/jpeg, image/jpg, image/svg+xml" onChange={handleLogoUpload} style={{ display: 'none' }} />
              </label>

              {logoUrl && (
                <button
                  onClick={() => {
                    setLogoUrl('');
                    updateSiteSettings({ logoUrl: '' });
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    cursor: 'pointer'
                  }}
                  title="Remove Logo"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Favicon Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '6px' }}>
              Browser Tab Favicon Icon
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
              Upload your PNG icon to automatically replace the browser address bar and bookmark tab icon.
            </p>

            {/* Current Favicon Preview */}
            <div
              style={{
                background: '#F8FAFC',
                border: '2px dashed #CBD5E1',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '20px'
              }}
            >
              {faviconUrl ? (
                <div>
                  <img
                    src={faviconUrl}
                    alt="Favicon"
                    style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '12px', borderRadius: '8px' }}
                  />
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                    ✓ Custom Tab Favicon Active
                  </span>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#1C2677',
                      color: '#29C3BE',
                      fontWeight: 800,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px auto'
                    }}
                  >
                    N
                  </div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>
                    Default System Favicon
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(41, 195, 190, 0.3)'
                }}
              >
                <Upload size={16} /> Upload Favicon (PNG / ICO)
                <input type="file" accept="image/png, image/x-icon, image/jpeg" onChange={handleFaviconUpload} style={{ display: 'none' }} />
              </label>

              {faviconUrl && (
                <button
                  onClick={() => {
                    setFaviconUrl('');
                    updateSiteSettings({ faviconUrl: '' });
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    cursor: 'pointer'
                  }}
                  title="Remove Favicon"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HEADER NAVIGATION MENU (FULL CONTROL - Screenshot 1) */}
      {activeTab === 'menu' && (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Manage Navigation Header & Sub-Menus
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
                Full control over top navigation links and dropdown sub-menu items (Mobile & Desktop).
              </p>
            </div>
            <button
              onClick={handleAddMenuItem}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} /> Add Top Menu Item
            </button>
          </div>

          {/* Menu Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {headerMenu.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '18px',
                  background: '#F8FAFC'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: item.hasDropdown ? '14px' : 0 }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1C2677', width: '24px' }}>
                    #{idx + 1}
                  </span>

                  <div style={{ flex: '1 1 180px' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '2px' }}>
                      Menu Label
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateMenuItem(item.id, { label: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}
                    />
                  </div>

                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '2px' }}>
                      Target Route / Link
                    </label>
                    <input
                      type="text"
                      value={item.path}
                      onChange={(e) => handleUpdateMenuItem(item.id, { path: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!item.hasDropdown}
                        onChange={(e) => handleUpdateMenuItem(item.id, { hasDropdown: e.target.checked })}
                        style={{ accentColor: '#1C2677', width: '15px', height: '15px' }}
                      />
                      <span>Dropdown Menu</span>
                    </label>

                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                      title="Delete Menu Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Sub-menu items editor if dropdown enabled */}
                {item.hasDropdown && (
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C2677' }}>
                        Dropdown Sub-Items ({item.dropdownItems?.length || 0})
                      </span>
                      <button
                        onClick={() => handleAddSubItem(item.id)}
                        style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        + Add Sub-Item
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.dropdownItems?.map((sub) => (
                        <div
                          key={sub.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 2fr 2fr 1fr auto',
                            gap: '8px',
                            alignItems: 'center',
                            background: '#F8FAFC',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0'
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Title (e.g. Move-In Cleaning)"
                            value={sub.title}
                            onChange={(e) => handleUpdateSubItem(item.id, sub.id, { title: e.target.value })}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 700 }}
                          />
                          <input
                            type="text"
                            placeholder="Subtitle (e.g. Starting at ₹1,999)"
                            value={sub.sub}
                            onChange={(e) => handleUpdateSubItem(item.id, sub.id, { sub: e.target.value })}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                          />
                          <input
                            type="text"
                            placeholder="Target Path"
                            value={sub.path}
                            onChange={(e) => handleUpdateSubItem(item.id, sub.id, { path: e.target.value })}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                          />
                          <select
                            value={sub.iconType || 'house'}
                            onChange={(e) => handleUpdateSubItem(item.id, sub.id, { iconType: e.target.value })}
                            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem' }}
                          >
                            <option value="house">House Icon</option>
                            <option value="car">Car Icon</option>
                            <option value="laundry">Laundry Icon</option>
                          </select>
                          <button
                            onClick={() => handleDeleteSubItem(item.id, sub.id)}
                            style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INSTANT SUPPORT & HELPLINE (Screenshot 2) */}
      {activeTab === 'helpline' && (
        <form onSubmit={handleSaveHelpline} style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', maxWidth: '680px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '6px' }}>
            Update Instant Support & Helpline
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
            Customize customer care contact details shown on the website contact page, header, and footer.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Customer Care Phone Number
              </label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Email Inquiry Address
              </label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@nexdoorclean.com"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Operations Hours
              </label>
              <input
                type="text"
                required
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="Monday - Sunday: 07:00 AM - 09:00 PM"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(41, 195, 190, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Save size={18} /> Save Helpline Details
          </button>
        </form>
      )}

      {/* TAB 4: NUMBERS & STATISTICS MANAGER (Screenshot 3) */}
      {activeTab === 'stats' && (
        <form onSubmit={handleSaveStats} style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', maxWidth: '720px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '6px' }}>
            Update Website Numbers & Statistics
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
            Manage figures and milestone metrics displayed in the homepage hero banner (Screenshot 3).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {/* Stat 1 */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1C2677', marginBottom: '4px' }}>
                Metric 1 (Value)
              </label>
              <input
                type="text"
                value={statCleanedCount}
                onChange={(e) => setStatCleanedCount(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px' }}
              />
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '2px' }}>
                Subtitle / Description
              </label>
              <input
                type="text"
                value={statCleanedLabel}
                onChange={(e) => setStatCleanedLabel(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
              />
            </div>

            {/* Stat 2 */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1C2677', marginBottom: '4px' }}>
                Metric 2 (Value)
              </label>
              <input
                type="text"
                value={statRating}
                onChange={(e) => setStatRating(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px' }}
              />
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '2px' }}>
                Subtitle / Description
              </label>
              <input
                type="text"
                value={statRatingLabel}
                onChange={(e) => setStatRatingLabel(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
              />
            </div>

            {/* Stat 3 */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1C2677', marginBottom: '4px' }}>
                Metric 3 (Value)
              </label>
              <input
                type="text"
                value={statHubsCount}
                onChange={(e) => setStatHubsCount(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px' }}
              />
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '2px' }}>
                Subtitle / Description
              </label>
              <input
                type="text"
                value={statHubsLabel}
                onChange={(e) => setStatHubsLabel(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
              />
            </div>

            {/* Stat 4 */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1C2677', marginBottom: '4px' }}>
                Metric 4 (Value)
              </label>
              <input
                type="text"
                value={statEcoPercent}
                onChange={(e) => setStatEcoPercent(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px' }}
              />
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '2px' }}>
                Subtitle / Description
              </label>
              <input
                type="text"
                value={statEcoLabel}
                onChange={(e) => setStatEcoLabel(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(41, 195, 190, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Save size={18} /> Save Statistics Numbers
          </button>
        </form>
      )}

      {/* TAB 5: ADMIN SECURITY & CREDENTIALS */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleSaveSecurity}
          style={{
            background: '#FFFFFF',
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            maxWidth: '640px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', borderRadius: '14px', background: '#EFF6FF', color: '#1E40AF' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Admin Credentials & Security Settings
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '2px 0 0 0' }}>
                Update your Supabase Admin Username / Email and Password
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Admin Username / Email Address
              </label>
              <input
                type="email"
                required
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                New Password (leave blank to keep current password)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748B'
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {newPassword && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdatingAuth}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: isUpdatingAuth ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(41, 195, 190, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isUpdatingAuth ? 0.7 : 1
            }}
          >
            <Save size={18} /> Update Supabase Credentials
          </button>
        </form>
      )}
    </div>
  );
};
