import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Home as HomeIcon,
  Car,
  Shirt,
  ChevronDown,
  Menu,
  X,
  CalendarCheck,
  PackageCheck
} from 'lucide-react';
import { TrackBookingModal } from '../common/TrackBookingModal';
import { useAdminData } from '../../context/AdminContext';
import type { HeaderMenuItem } from '../../types/admin';

export const Navbar: React.FC = () => {
  const adminData = useAdminData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
  }, [location.pathname]);

  const navItems: HeaderMenuItem[] = [
    { id: 'm-1', label: 'Home', path: '/' },
    { id: 'm-3', label: 'Pricing', path: '/pricing' },
    { id: 'm-4', label: 'FAQ', path: '/faq' },
    { id: 'm-5', label: 'Blog', path: '/blog' },
    { id: 'm-6', label: 'Careers', path: '/careers' },
    { id: 'm-7', label: 'About', path: '/about' },
    { id: 'm-8', label: 'Contact', path: '/contact' }
  ];

  return (
    <header
      className="glass-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: scrolled ? '0 8px 24px rgba(27, 34, 54, 0.08)' : 'none'
      }}
    >
      <div className="container navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          {adminData?.siteSettings?.logoUrl ? (
            <img
              src={adminData.siteSettings.logoUrl}
              alt="NEXDOOR Logo"
              style={{ maxHeight: '42px', maxWidth: '160px', objectFit: 'contain' }}
            />
          ) : (
            <>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1C2677 0%, #29C3BE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(41, 195, 190, 0.3)',
                flexShrink: 0
              }}>
                <Sparkles size={20} style={{ color: '#FFFFFF' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#1C2677',
                  lineHeight: 1
                }}>
                  NEXDOOR
                </span>
                <span className="logo-subtext" style={{ fontSize: '0.6rem', fontWeight: 700, color: '#29C3BE', letterSpacing: '0.15em', marginTop: '2px' }}>
                  CLEANING SOLUTIONS
                </span>
              </div>
            </>
          )}
        </Link>

        {/* Desktop Navigation Links (Dynamic from siteSettings.headerMenu) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          {(adminData?.siteSettings?.headerMenu && adminData.siteSettings.headerMenu.length > 0
            ? adminData.siteSettings.headerMenu
            : navItems
          ).map((item) => {
            if (item.hasDropdown) {
              const dropdownSubItems = item.dropdownItems || [];
              return (
                <div
                  key={item.id}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setServicesDropdown(true)}
                  onMouseLeave={() => setServicesDropdown(false)}
                >
                  <button
                    style={{
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: location.pathname.startsWith('/services') ? 700 : 500,
                      color: location.pathname.startsWith('/services') ? '#29C3BE' : '#1B2236',
                      fontSize: '0.95rem',
                      padding: '8px 0',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}{' '}
                    <ChevronDown
                      size={16}
                      style={{
                        transform: servicesDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {servicesDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '-20px',
                          width: '340px',
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          boxShadow: '0 16px 40px rgba(27, 34, 54, 0.12)',
                          border: '1px solid #E2E8F0',
                          padding: '12px',
                          zIndex: 110
                        }}
                      >
                        {dropdownSubItems.length > 0 ? (
                          dropdownSubItems.map((sub: any) => {
                            const isHouse = sub.iconType === 'house' || sub.path?.includes('house-cleaning');
                            const isCar = sub.iconType === 'car' || sub.path?.includes('car-wash');
                            const isLaundry = sub.iconType === 'laundry' || sub.path?.includes('laundry');

                            return (
                              <Link
                                key={sub.id}
                                to={sub.path || '/services/house-cleaning'}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '14px',
                                  padding: '12px',
                                  borderRadius: '12px',
                                  transition: 'background 0.2s',
                                  textDecoration: 'none'
                                }}
                                className="dropdown-item"
                              >
                                <div
                                  style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '10px',
                                    background: isHouse
                                      ? 'rgba(41, 195, 190, 0.15)'
                                      : isCar
                                      ? 'rgba(28, 38, 119, 0.1)'
                                      : isLaundry
                                      ? 'rgba(245, 158, 11, 0.15)'
                                      : 'rgba(16, 185, 129, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  {isHouse ? (
                                    <HomeIcon size={20} style={{ color: '#29C3BE' }} />
                                  ) : isCar ? (
                                    <Car size={20} style={{ color: '#1C2677' }} />
                                  ) : isLaundry ? (
                                    <Shirt size={20} style={{ color: '#F59E0B' }} />
                                  ) : (
                                    <Sparkles size={20} style={{ color: '#10B981' }} />
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1B2236' }}>
                                    {sub.title}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                    {sub.sub || 'Professional Service'}
                                  </div>
                                </div>
                              </Link>
                            );
                          })
                        ) : (
                          <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.85rem', color: '#64748B' }}>
                            No sub-menu items configured
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                style={{
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  color: location.pathname === item.path ? '#29C3BE' : '#1B2236',
                  fontSize: '0.95rem',
                  textDecoration: 'none'
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Desktop Track Order Button */}
          <button
            type="button"
            onClick={() => setIsTrackModalOpen(true)}
            className="btn-outline desktop-book-btn"
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <PackageCheck size={17} style={{ color: '#29C3BE' }} />
            Track Order
          </button>

          {/* Desktop Full Book Button */}
          <Link
            to="/book"
            className="btn-primary desktop-book-btn"
            style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            <CalendarCheck size={18} />
            Book Service
          </Link>

          {/* Mobile Sleek Compact Button */}
          <Link
            to="/book"
            className="mobile-book-btn"
            style={{
              textDecoration: 'none',
              background: '#29C3BE',
              color: '#1C2677',
              fontWeight: 800,
              fontSize: '0.8rem',
              padding: '7px 14px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              display: 'none',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 10px rgba(41, 195, 190, 0.3)'
            }}
          >
            <CalendarCheck size={14} /> Book
          </Link>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: mobileMenuOpen ? 'rgba(28, 38, 119, 0.08)' : 'transparent',
              border: 'none',
              padding: '6px',
              color: '#1C2677',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              overflow: 'hidden',
              padding: '20px 24px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(adminData?.siteSettings?.headerMenu && adminData.siteSettings.headerMenu.length > 0
                ? adminData.siteSettings.headerMenu
                : navItems
              ).map((item) => {
                if (item.hasDropdown) {
                  const dropdownSubItems = item.dropdownItems || [];
                  return (
                    <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {item.label}
                      </div>
                      {dropdownSubItems.map((sub: any) => {
                        const isHouse = sub.iconType === 'house' || sub.path?.includes('house-cleaning');
                        const isCar = sub.iconType === 'car' || sub.path?.includes('car-wash');
                        const isLaundry = sub.iconType === 'laundry' || sub.path?.includes('laundry');

                        return (
                          <Link
                            key={sub.id}
                            to={sub.path || '/services/house-cleaning'}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, color: '#1B2236', textDecoration: 'none' }}
                          >
                            {isHouse ? (
                              <HomeIcon size={18} style={{ color: '#29C3BE' }} />
                            ) : isCar ? (
                              <Car size={18} style={{ color: '#1C2677' }} />
                            ) : isLaundry ? (
                              <Shirt size={18} style={{ color: '#F59E0B' }} />
                            ) : (
                              <Sparkles size={18} style={{ color: '#10B981' }} />
                            )}
                            <span>{sub.title}</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: 'auto' }}>
                              {sub.sub}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      color: location.pathname === item.path ? '#29C3BE' : '#1B2236',
                      fontSize: '0.95rem',
                      textDecoration: 'none'
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsTrackModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    border: '1.5px solid #29C3BE',
                    background: '#F0FDF4',
                    color: '#1C2677',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <PackageCheck size={18} style={{ color: '#29C3BE' }} /> Track Order Status
                </button>

                <Link to="/book" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <CalendarCheck size={18} /> Book Online Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TrackBookingModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      <style>{`
        .desktop-nav {
          display: flex;
        }
        .desktop-book-btn {
          display: inline-flex !important;
        }
        .mobile-book-btn {
          display: none !important;
        }
        .mobile-toggle {
          display: none !important;
        }
        .dropdown-item:hover {
          background: #F8FAFC;
        }

        @media (max-width: 992px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-book-btn {
            display: none !important;
          }
          .mobile-book-btn {
            display: inline-flex !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
          .logo-subtext {
            display: none !important;
          }
          .navbar-container {
            height: 62px !important;
          }
        }
      `}</style>
    </header>
  );
};
