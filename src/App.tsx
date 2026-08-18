import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';

import { AdminProvider } from './context/AdminContext';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminLocations } from './pages/admin/AdminLocations';
import { AdminStaff } from './pages/admin/AdminStaff';
import { AdminAvailability } from './pages/admin/AdminAvailability';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminBlogs } from './pages/admin/AdminBlogs';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminCareers } from './pages/admin/AdminCareers';
import { AdminGallery } from './pages/admin/AdminGallery';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';

import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { HouseCleaningPage } from './pages/HouseCleaningPage';
import { CarWashPage } from './pages/CarWashPage';
import { LaundryPage } from './pages/LaundryPage';
import { PricingPage } from './pages/PricingPage';
import { BookServicePage } from './pages/BookServicePage';
import { FAQPage } from './pages/FAQPage';
import { CareersPage } from './pages/CareersPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import {
  PrivacyPolicyPage,
  TermsConditionsPage,
  RefundPolicyPage,
  CancellationPolicyPage
} from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to Top helper on route or search query changes
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // 1. Reset Lenis smooth scroll immediately
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }

    // 2. Native window scroll reset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [pathname, search]);

  return null;
};

const MainAppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/careers" element={<AdminCareers />} />
          <Route path="/admin/availability" element={<AdminAvailability />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/locations" element={<AdminLocations />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services/house-cleaning" element={<HouseCleaningPage />} />
          <Route path="/services/car-wash" element={<CarWashPage />} />
          <Route path="/services/laundry" element={<LaundryPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/book" element={<BookServicePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    // Disable automatic browser scroll restoration on navigation
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2
    });

    // Expose lenis globally for route/step scroll resetting
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      delete (window as any).lenis;
      lenis.destroy();
    };
  }, []);

  return (
    <AdminProvider>
      <Router>
        <ScrollToTop />
        <MainAppLayout />
      </Router>
    </AdminProvider>
  );
};

export default App;
