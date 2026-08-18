import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  MapPin,
  Users,
  Calendar,
  Tag,
  MessageSquare,
  BookOpen,
  ExternalLink,
  Bell,
  Plus,
  ChevronRight,
  Settings,
  Briefcase,
  Images,
  LogOut
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { AdminLogin } from '../../pages/admin/AdminLogin';
import { NewBookingModal } from './NewBookingModal';
import { NewServiceModal } from './NewServiceModal';

interface Props {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    adminEmail,
    logoutAdmin,
    bookings,
    services,
    technicians,
    blockedSlots,
    coupons,
    inquiries,
    blogs,
    siteSettings,
    jobApplications,
    recentWorks
  } = useAdminData();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);

  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const newInquiriesCount = inquiries ? inquiries.filter((i) => i.status === 'new').length : 0;
  const newApplicationsCount = jobApplications ? jobApplications.filter((a) => a.status === 'new').length : 0;

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck, badge: bookings.length },
    { label: 'Recent Works', path: '/admin/gallery', icon: Images, badge: recentWorks ? recentWorks.length : 0 },
    { label: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare, badge: newInquiriesCount },
    { label: 'Careers & HR', path: '/admin/careers', icon: Briefcase, badge: newApplicationsCount },
    { label: 'Blog Journal', path: '/admin/blogs', icon: BookOpen, badge: blogs ? blogs.length : 0 },
    { label: 'Services', path: '/admin/services', icon: Sparkles, badge: services.length },
    { label: 'Staff', path: '/admin/staff', icon: Users, badge: technicians.length },
    { label: 'Availability', path: '/admin/availability', icon: Calendar, badge: blockedSlots ? blockedSlots.length : 0 },
    { label: 'Coupons & Offers', path: '/admin/coupons', icon: Tag, badge: coupons ? coupons.filter(c => c.status === 'active').length : 0 },
    { label: 'Service Areas', path: '/admin/locations', icon: MapPin },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          background: '#03252A',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          flexShrink: 0,
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div>
          {/* Logo Brand */}
          <div style={{ padding: '0 12px 28px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '24px' }}>
            <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {siteSettings?.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt="NEXDOOR Control Center"
                  style={{ maxHeight: '38px', maxWidth: '140px', objectFit: 'contain' }}
                />
              ) : (
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #007A87, #9BC83B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(0, 122, 135, 0.4)'
                  }}
                >
                  NX
                </div>
              )}
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                  NEXDOOR
                </span>
                <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#9BC83B', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Control Center
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', padding: '0 12px 6px 12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isActive ? '#FFFFFF' : '#CBD5E1',
                    background: isActive ? 'linear-gradient(135deg, #007A87, #0093A2)' : 'transparent',
                    boxShadow: isActive ? '0 8px 20px rgba(0, 122, 135, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} color={isActive ? '#9BC83B' : '#94A3B8'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0, 0, 0, 0.3)',
                        color: '#FFF'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Actions Card inside Sidebar */}
          <div
            style={{
              marginTop: '28px',
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(0, 77, 86, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '10px' }}>
              Quick Creation
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setIsNewBookingOpen(true)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#007A87',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} /> New Booking
              </button>
              <button
                onClick={() => setIsNewServiceOpen(true)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'transparent',
                  color: '#F8FAFC',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={16} /> Create Service
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link back to website */}
        <div>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#38BDF8',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              marginBottom: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ExternalLink size={16} />
              <span>Customer Portal</span>
            </div>
            <ChevronRight size={14} />
          </Link>

          <button
            onClick={logoutAdmin}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#F87171',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LogOut size={16} />
              <span>Sign Out ({adminEmail.split('@')[0]})</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Admin Header */}
        <header
          style={{
            height: '72px',
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          {/* Breadcrumb / Title */}
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
              Admin Operations Dashboard
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
              Manage NEXDOOR services, booking pipeline, and field personnel
            </p>
          </div>

          {/* Header Right Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Pending Alert Badge */}
            {pendingBookingsCount > 0 && (
              <div
                onClick={() => navigate('/admin/bookings?status=pending')}
                style={{
                  background: '#FEF3C7',
                  border: '1px solid #F59E0B',
                  color: '#92400E',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
                }}
              >
                <Bell size={16} color="#D97706" />
                <span>{pendingBookingsCount} Pending Bookings Need Confirmation</span>
              </div>
            )}

            {/* Admin Profile Chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#007A87', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                AD
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', display: 'block' }}>Administrator</span>
                <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>● Active Session</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Modals */}
      <NewBookingModal isOpen={isNewBookingOpen} onClose={() => setIsNewBookingOpen(false)} />
      <NewServiceModal isOpen={isNewServiceOpen} onClose={() => setIsNewServiceOpen(false)} />
    </div>
  );
};
