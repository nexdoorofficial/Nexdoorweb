import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home as HomeIcon,
  Car,
  Shirt,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  FileText,
  AlertCircle,
  Truck,
  Scale,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RefundableBanner } from '../common/RefundableBanner';
import { ViewOffersModal } from './ViewOffersModal';
import { HousePricingCalculator } from '../pricing/HousePricingCalculator';
import { CarWashCalculator } from '../pricing/CarWashCalculator';
import { LaundryCalculator } from '../pricing/LaundryCalculator';
import { HOUSE_CATEGORIES, VEHICLE_CATEGORIES } from '../../data/categories';
import { calculateLaundryPrice, DEMO_BOOKING_DEPOSIT } from '../../data/pricing';
import type { ServiceId, HouseCategoryKey, VehicleCategoryKey, LaundryPackageKey, LaundrySpeedKey, LaundryQualityKey } from '../../types';
import { useAdminData } from '../../context/AdminContext';

const SERVICEABLE_LOCATIONS = [
  { id: 'Kakkanad', name: 'Kakkanad', zone: 'SmartCity, Infopark & Seaport-Airport Rd', pincode: '682030' },
  { id: 'Edappally', name: 'Edappally', zone: 'Lulu Mall & Bypass Corridor', pincode: '682024' },
  { id: 'Kalamassery', name: 'Kalamassery', zone: 'CUSAT & Apollo Hospital Zone', pincode: '682022' },
  { id: 'Ernakulam Central', name: 'Marine Drive & MG Road', zone: 'Ernakulam Commercial Central', pincode: '682011' },
  { id: 'Vytila', name: 'Vytila & Thripunithura', zone: 'Mobility Hub & Metro Corridor', pincode: '682019' },
  { id: 'Aluva', name: 'Aluva & Angamaly', zone: 'Cochin Airport Highway Belt', pincode: '683101' }
];

export const BookingWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let adminData: any = null;
  try {
    adminData = useAdminData();
  } catch (e) {
    // optional fallback
  }

  // Step state (1 to 6)
  const [step, setStep] = useState<number>(Number(searchParams.get('step')) || 1);

  // Form selections
  const [serviceId, setServiceId] = useState<ServiceId>((searchParams.get('service') as ServiceId) || 'house-cleaning');
  const [houseCategory, setHouseCategory] = useState<HouseCategoryKey>((searchParams.get('category') as HouseCategoryKey) || '2-bhk');
  const [housePlan, setHousePlan] = useState<'standard' | 'premium'>((searchParams.get('plan') as any) || 'premium');

  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategoryKey>((searchParams.get('vehicle') as VehicleCategoryKey) || 'sedan');
  const [carPackage, setCarPackage] = useState<'basic' | 'premium' | 'interior' | 'complete'>((searchParams.get('package') as any) || 'premium');

  const [laundryWeight, setLaundryWeight] = useState<number>(Number(searchParams.get('weight')) || 5);
  const [laundryPackage, setLaundryPackage] = useState<LaundryPackageKey>((searchParams.get('pkg') as LaundryPackageKey) || 'wash-iron');
  const [laundrySpeed] = useState<LaundrySpeedKey>((searchParams.get('speed') as LaundrySpeedKey) || 'normal');
  const [laundryQuality] = useState<LaundryQualityKey>((searchParams.get('quality') as LaundryQualityKey) || 'premium');

  // Date & Time Scheduling Helpers & State
  const getTodayNormalized = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const isDateInPast = (cellDate: Date): boolean => {
    const today = getTodayNormalized();
    const target = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
    return target < today;
  };

  const isTimeSlotInPast = (slotStr: string, selectedDate: Date): boolean => {
    const now = new Date();
    const target = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const today = getTodayNormalized();

    if (target < today) return true;
    if (target > today) return false;

    // Target is TODAY: check time
    const [time, modifier] = slotStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const slotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    return now.getTime() + (15 * 60 * 1000) > slotDate.getTime();
  };

  const [selectedDateObj, setSelectedDateObj] = useState<Date>(() => getTodayNormalized());
  const [currentCalendarView, setCurrentCalendarView] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:30 AM');

  // Location & Address State
  const [area, setArea] = useState<string>(searchParams.get('location') || 'Kakkanad');
  const [pincode, setPincode] = useState<string>('682030');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');

  // Coupon Code & Discount state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isViewOffersOpen, setIsViewOffersOpen] = useState(false);

  // Booking completion state
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const wizardLocationRef = React.useRef<HTMLDivElement>(null);
  const timeSlotsRef = React.useRef<HTMLDivElement>(null);
  const footerNavRef = React.useRef<HTMLDivElement>(null);

  const mobileAutoSlide = (targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (window.innerWidth <= 992 && targetRef.current) {
      setTimeout(() => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
    }
  };

  const handleServiceSelect = (sId: ServiceId) => {
    setServiceId(sId);
    mobileAutoSlide(wizardLocationRef);
  };

  const handleLocationSelect = (locName: string, locPincode: string) => {
    setArea(locName);
    setPincode(locPincode);
    mobileAutoSlide(footerNavRef);
  };

  const handleCategorySelect = (setter: (val: any) => void, val: any) => {
    setter(val);
    mobileAutoSlide(footerNavRef);
  };

  const handlePlanSelect = (setter: (val: any) => void, val: any) => {
    setter(val);
    mobileAutoSlide(footerNavRef);
  };

  const handleDateSelect = (cellDate: Date) => {
    if (isDateInPast(cellDate)) return;
    setSelectedDateObj(cellDate);

    // Auto-select first valid available time slot if currently selected slot is past
    const allSlots = ['08:30 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM', '10:30 PM'];
    if (isTimeSlotInPast(selectedTimeSlot, cellDate)) {
      const firstValidSlot = allSlots.find((slot) => !isTimeSlotInPast(slot, cellDate));
      if (firstValidSlot) {
        setSelectedTimeSlot(firstValidSlot);
      }
    }

    mobileAutoSlide(timeSlotsRef);
  };

  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
    mobileAutoSlide(footerNavRef);
  };

  // Scroll to top of wizard on step change
  React.useEffect(() => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [step]);

  const houseCategoriesList = (adminData && adminData.houseCategories && adminData.houseCategories.length > 0) ? adminData.houseCategories : HOUSE_CATEGORIES;
  const vehicleCategoriesList = (adminData && adminData.vehicleCategories && adminData.vehicleCategories.length > 0) ? adminData.vehicleCategories : VEHICLE_CATEGORIES;
  const laundryConfigData = (adminData && adminData.laundryConfig) ? adminData.laundryConfig : undefined;

  const activeHouseCat = houseCategoriesList.find((c: any) => c.id === houseCategory) || houseCategoriesList[0] || houseCategoriesList[1];
  const activeVehicle = vehicleCategoriesList.find((v: any) => v.id === vehicleCategory) || vehicleCategoriesList[0] || vehicleCategoriesList[1];

  // Formatted date string (e.g., "Monday, 3 August 2026")
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Price calculations
  const getEstimatedPrice = () => {
    if (serviceId === 'house-cleaning') {
      if (housePlan === 'standard' && activeHouseCat.standard) return activeHouseCat.standard.priceNumeric || 1999;
      if (housePlan === 'premium' && activeHouseCat.premium) return activeHouseCat.premium.priceNumeric || 3299;
      const customMatch = (activeHouseCat.customPlans || []).find(
        (cp: any) => cp.id === housePlan || cp.name === housePlan
      );
      if (customMatch) return customMatch.priceNumeric || 2499;
      return activeHouseCat.standard?.priceNumeric || 1999;
    } else if (serviceId === 'car-wash') {
      const pkg = (activeVehicle.packages as any)[carPackage];
      return pkg ? pkg.price : 849;
    } else {
      const lCalc = calculateLaundryPrice(laundryWeight, laundryPackage, laundrySpeed, laundryQuality, laundryConfigData);
      return lCalc.total;
    }
  };

  const estimatedTotal = getEstimatedPrice();
  const isCustomHouse = serviceId === 'house-cleaning' && (houseCategory === 'custom' || houseCategory === 'villa');
  const laundryCalcDetails = calculateLaundryPrice(laundryWeight, laundryPackage, laundrySpeed, laundryQuality, laundryConfigData);

  const handleApplyCouponCode = (codeToApply?: string) => {
    const targetCode = codeToApply !== undefined ? codeToApply : couponInput;
    if (!targetCode || !targetCode.trim()) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponMsg(null);
      return;
    }

    if (adminData && adminData.validateCoupon) {
      const res = adminData.validateCoupon(targetCode, serviceId, estimatedTotal, phone);
      if (res.valid) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.discountAmount);
        setCouponMsg({ type: 'success', text: res.message });
        setCouponInput(res.coupon.code);
      } else {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponMsg({ type: 'error', text: res.message });
      }
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponInput('');
    setCouponMsg(null);
  };

  const handlePayDemoDeposit = () => {
    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const randomRef = 'NEX-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(randomRef);
    setIsSuccess(true);

    if (adminData && adminData.addBooking) {
      try {
        const netInvoice = Math.max(0, estimatedTotal - couponDiscount);
        const finalNotes = `${customRequirements ? customRequirements + ' ' : ''}${appliedCoupon ? `[Coupon Code: ${appliedCoupon.code} (-₹${couponDiscount})]` : ''}`.trim();

        adminData.addBooking({
          referenceId: randomRef,
          customerName: fullName || 'Valued Customer',
          customerPhone: phone || '+91 98765 43210',
          address: addressLine || 'Doorstep Address',
          area: area || 'Kakkanad',
          pincode: pincode || '682030',
          serviceId,
          serviceName: serviceId === 'house-cleaning' ? `House Cleaning (${houseCategory})` : serviceId === 'car-wash' ? `Car Wash (${vehicleCategory})` : `Laundry (${laundryWeight}kg)`,
          categoryOrPackage: serviceId === 'house-cleaning' ? housePlan : serviceId === 'car-wash' ? carPackage : laundryPackage,
          scheduledDate: selectedDateObj ? selectedDateObj.toISOString().split('T')[0] : '2026-08-12',
          scheduledTime: selectedTimeSlot || '11:30 AM',
          estimatedTotal: Number(netInvoice) || 1499,
          depositPaid: DEMO_BOOKING_DEPOSIT || 199,
          status: 'pending',
          assignedStaff: 'Unassigned',
          notes: finalNotes || ''
        });

        // Increment coupon usage count if used
        if (appliedCoupon && adminData.updateCoupon) {
          adminData.updateCoupon(appliedCoupon.id, { usageCount: (appliedCoupon.usageCount || 0) + 1 });
        }
      } catch (err) {
        console.error('Failed to sync booking to admin context', err);
      }
    }
  };

  // 6 Unified Steps List
  const stepsList = [
    { num: 1, title: 'Service & Location' },
    { num: 2, title: 'Category' },
    { num: 3, title: 'Package Specifications' },
    { num: 4, title: 'Schedule (Date & Time)' },
    { num: 5, title: 'Address & Custom Needs' },
    { num: 6, title: 'Payment' }
  ];

  // Calendar rendering math
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calYear = currentCalendarView.getFullYear();
  const calMonth = currentCalendarView.getMonth();
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const startingDay = getFirstDayOfMonth(calYear, calMonth);
  const monthName = currentCalendarView.toLocaleString('default', { month: 'long' });

  const realNow = new Date();
  const currentMonthStart = new Date(realNow.getFullYear(), realNow.getMonth(), 1);
  const isPrevMonthDisabled = new Date(calYear, calMonth - 1, 1) < currentMonthStart;

  const handlePrevMonth = () => {
    const prevMonth = new Date(calYear, calMonth - 1, 1);
    if (prevMonth >= currentMonthStart) {
      setCurrentCalendarView(prevMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentCalendarView(new Date(calYear, calMonth + 1, 1));
  };

  if (isSuccess) {
    return (
      <div className="glass-card" style={{ padding: '48px', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#10B981',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
        }}>
          <CheckCircle2 size={40} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
          Booking Confirmed! 🎉
        </h2>
        <p style={{ fontSize: '1rem', color: '#64748B', marginBottom: '24px' }}>
          Your service has been scheduled successfully with NEXDOOR Cleaning Solutions.
        </p>

        <div style={{
          background: '#F8FAFC',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'left',
          marginBottom: '24px',
          border: '1px solid #E2E8F0',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#64748B' }}>Booking Reference:</span>
            <span style={{ fontWeight: 800, color: '#1C2677' }}>{bookingRef}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#64748B' }}>Service Scheduled:</span>
            <span style={{ fontWeight: 700, color: '#1B2236', textTransform: 'capitalize' }}>
              {serviceId.replace('-', ' ')} {serviceId === 'house-cleaning' ? `(${houseCategory})` : serviceId === 'car-wash' ? `(${vehicleCategory})` : `(${laundryWeight}kg - ${laundryPackage})`}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#64748B' }}>Scheduled Date & Time:</span>
            <span style={{ fontWeight: 700, color: '#1B2236' }}>{formattedSelectedDate} at {selectedTimeSlot}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#64748B' }}>Service Location:</span>
            <span style={{ fontWeight: 700, color: '#1B2236' }}>{area}, Kochi ({pincode})</span>
          </div>
          {customRequirements && (
            <div style={{ marginBottom: '12px', background: 'rgba(41, 195, 190, 0.1)', padding: '10px 14px', borderRadius: '10px' }}>
              <span style={{ fontWeight: 700, color: '#1C2677', display: 'block' }}>Custom Needs & Special Notes:</span>
              <span style={{ color: '#334155' }}>"{customRequirements}"</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#64748B' }}>Estimated Total:</span>
            <span style={{ fontWeight: 700, color: '#1B2236' }}>
              {isCustomHouse ? 'Quote / Inspection' : `₹${estimatedTotal}`}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #CBD5E1' }}>
            <span style={{ fontWeight: 700, color: '#10B981' }}>Refundable Deposit Paid (Demo):</span>
            <span style={{ fontWeight: 800, color: '#10B981' }}>₹{DEMO_BOOKING_DEPOSIT}</span>
          </div>
        </div>

        <RefundableBanner variant="full" />

        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/')} className="btn-primary">
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
      {/* Wizard Header Progress Bar (6 Steps) */}
      <div style={{ marginBottom: '24px' }}>
        <div
          className="category-scroll-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            paddingBottom: '4px',
            gap: '12px'
          }}
        >
          {stepsList.map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: s.num < step ? 'pointer' : 'default',
                opacity: s.num <= step ? 1 : 0.4,
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: s.num === step ? '#29C3BE' : s.num < step ? '#1C2677' : '#E2E8F0',
                color: s.num <= step ? '#FFFFFF' : '#64748B',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {s.num < step ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: s.num === step ? 700 : 500, color: '#1B2236', whiteSpace: 'nowrap' }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(step / 6) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #1C2677 0%, #29C3BE 100%)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Prominent Refundable Deposit Banner - SHOWN ONLY ON STEP 6 PAYMENT */}
      {step === 6 && (
        <div style={{ marginBottom: '24px' }}>
          <RefundableBanner variant="compact" />
        </div>
      )}

      {/* Main Wizard Card */}
      <div className="glass-card booking-main-card" style={{ padding: '36px', borderRadius: '24px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* STEP 1: Select Service & Service Location */}
            {step === 1 && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677', marginBottom: '4px' }}>
                    Step 1: Select Primary Service & Serviceable Location
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Choose your required service and confirm your service area in Kochi for dispatch availability.
                  </p>
                </div>

                {/* 1. Primary Service Selection */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1C2677', display: 'block', marginBottom: '12px' }}>
                    1. Choose Primary Service Category
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div
                      onClick={() => handleServiceSelect('house-cleaning')}
                      style={{
                        padding: '20px',
                        borderRadius: '20px',
                        border: serviceId === 'house-cleaning' ? '2.5px solid #29C3BE' : '1px solid #E2E8F0',
                        background: serviceId === 'house-cleaning' ? 'rgba(41, 195, 190, 0.08)' : '#F8FAFC',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: serviceId === 'house-cleaning' ? '0 8px 20px rgba(41, 195, 190, 0.15)' : 'none'
                      }}
                    >
                      <HomeIcon size={28} style={{ color: '#29C3BE', marginBottom: '10px' }} />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1B2236', marginBottom: '4px' }}>House Cleaning</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>1 BHK to Villas, Standard & Premium deep cleans</p>
                    </div>

                    <div
                      onClick={() => handleServiceSelect('car-wash')}
                      style={{
                        padding: '20px',
                        borderRadius: '20px',
                        border: serviceId === 'car-wash' ? '2.5px solid #29C3BE' : '1px solid #E2E8F0',
                        background: serviceId === 'car-wash' ? 'rgba(41, 195, 190, 0.08)' : '#F8FAFC',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: serviceId === 'car-wash' ? '0 8px 20px rgba(41, 195, 190, 0.15)' : 'none'
                      }}
                    >
                      <Car size={28} style={{ color: '#1C2677', marginBottom: '10px' }} />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1B2236', marginBottom: '4px' }}>Car Wash & Detailing</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Doorstep foam wash, interior spa & polish</p>
                    </div>

                    <div
                      onClick={() => handleServiceSelect('laundry')}
                      style={{
                        padding: '20px',
                        borderRadius: '20px',
                        border: serviceId === 'laundry' ? '2.5px solid #29C3BE' : '1px solid #E2E8F0',
                        background: serviceId === 'laundry' ? 'rgba(41, 195, 190, 0.08)' : '#F8FAFC',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: serviceId === 'laundry' ? '0 8px 20px rgba(41, 195, 190, 0.15)' : 'none'
                      }}
                    >
                      <Shirt size={28} style={{ color: '#F59E0B', marginBottom: '10px' }} />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1B2236', marginBottom: '4px' }}>Laundry Services</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Weight-based, free pickup for 2kg+</p>
                    </div>
                  </div>
                </div>

                {/* 2. Serviceable Location Picker */}
                <div ref={wizardLocationRef}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <MapPin size={20} style={{ color: '#29C3BE' }} />
                    <label style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1C2677' }}>
                      2. Select Your Service Location (Kochi Dispatch Hubs)
                    </label>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '16px' }}>
                    Select your area to verify active team dispatch & guaranteed arrival slots.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    {((adminData && adminData.locations && adminData.locations.length > 0)
                      ? adminData.locations.filter((l: any) => !l.status || l.status === 'active').map((l: any) => ({ id: l.name, name: l.name, zone: l.zone || 'Kochi Service Zone', pincode: l.pincode }))
                      : SERVICEABLE_LOCATIONS
                    ).map((loc: any) => {
                      const isSelected = area.toLowerCase().includes(loc.id.toLowerCase()) || loc.id.toLowerCase().includes(area.toLowerCase());
                      const isAvailable = adminData?.isServiceAvailableInLocation
                        ? adminData.isServiceAvailableInLocation(serviceId, loc.name)
                        : true;

                      return (
                        <div
                          key={loc.id}
                          onClick={() => handleLocationSelect(loc.name, loc.pincode)}
                          style={{
                            padding: '16px 20px',
                            borderRadius: '16px',
                            border: isSelected
                              ? isAvailable
                                ? '2.5px solid #29C3BE'
                                : '2.5px solid #EF4444'
                              : '1px solid #E2E8F0',
                            background: isSelected
                              ? isAvailable
                                ? '#1C2677'
                                : '#FEF2F2'
                              : isAvailable
                              ? '#F8FAFC'
                              : '#F1F5F9',
                            color: isSelected
                              ? isAvailable
                                ? '#FFFFFF'
                                : '#991B1B'
                              : '#1B2236',
                            opacity: isAvailable ? 1 : 0.75,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin size={16} style={{ color: isSelected ? (isAvailable ? '#29C3BE' : '#EF4444') : '#64748B' }} />
                              {loc.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8, color: isSelected ? (isAvailable ? '#CBD5E1' : '#B91C1C') : '#64748B' }}>
                              {loc.zone} ({loc.pincode})
                            </div>
                            {!isAvailable && (
                              <div style={{ marginTop: '4px', fontSize: '0.7rem', fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                                ✕ Service Unavailable Here
                              </div>
                            )}
                          </div>

                          {isSelected && (
                            <div
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: isAvailable ? '#29C3BE' : '#EF4444',
                                color: '#FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 800
                              }}
                            >
                              {isAvailable ? '✓' : '!'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Warning alert if selected location is unavailable for current primary service */}
                  {adminData?.isServiceAvailableInLocation && !adminData.isServiceAvailableInLocation(serviceId, area) && (
                    <div style={{ marginTop: '20px', background: '#FEF2F2', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid #FCA5A5', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <AlertCircle size={24} style={{ flexShrink: 0, color: '#DC2626' }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                          {serviceId.replace('-', ' ').toUpperCase()} is unavailable in {area}
                        </div>
                        <div style={{ fontSize: '0.825rem', color: '#991B1B', marginTop: '2px' }}>
                          Our team does not currently offer this service in {area}. Please select an active area or choose another service category above to proceed.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Choose Category */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                  Step 2: Choose Category
                </h3>

                {serviceId === 'house-cleaning' && (
                  <div>
                    <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>
                      Select your home layout or choose Custom Size for customized requests.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                      {HOUSE_CATEGORIES.map((cat) => {
                        const isAvailableInArea = adminData?.isServiceAvailableInLocation
                          ? adminData.isServiceAvailableInLocation('house-cleaning', area, cat.id)
                          : true;

                        return (
                          <div
                            key={cat.id}
                            onClick={() => handleCategorySelect(setHouseCategory, cat.id)}
                            style={{
                              padding: '20px',
                              borderRadius: '16px',
                              border: houseCategory === cat.id
                                ? isAvailableInArea
                                  ? '2px solid #29C3BE'
                                  : '2px solid #EF4444'
                                : '1px solid #E2E8F0',
                              background: houseCategory === cat.id
                                ? isAvailableInArea
                                  ? '#1C2677'
                                  : '#FEF2F2'
                                : isAvailableInArea
                                ? '#F8FAFC'
                                : '#F1F5F9',
                              color: houseCategory === cat.id
                                ? isAvailableInArea
                                  ? '#FFFFFF'
                                  : '#991B1B'
                                : '#1B2236',
                              opacity: isAvailableInArea ? 1 : 0.8,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>{cat.label}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{cat.sqftRange}</div>
                            {!isAvailableInArea ? (
                              <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.7rem', fontWeight: 800, background: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '10px' }}>
                                ✕ Unavailable in {area}
                              </span>
                            ) : (cat.id === 'custom' || cat.id === 'villa') ? (
                              <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.7rem', fontWeight: 700, background: '#F59E0B', color: '#FFF', padding: '2px 8px', borderRadius: '10px' }}>
                                Customised Scope
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {serviceId === 'car-wash' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    {VEHICLE_CATEGORIES.map((veh) => {
                      const isAvailableInArea = adminData?.isServiceAvailableInLocation
                        ? adminData.isServiceAvailableInLocation('car-wash', area, veh.id)
                        : true;

                      return (
                        <div
                          key={veh.id}
                          onClick={() => handleCategorySelect(setVehicleCategory, veh.id)}
                          style={{
                            padding: '18px',
                            borderRadius: '16px',
                            border: vehicleCategory === veh.id
                              ? isAvailableInArea
                                ? '2px solid #29C3BE'
                                : '2px solid #EF4444'
                              : '1px solid #E2E8F0',
                            background: vehicleCategory === veh.id
                              ? isAvailableInArea
                                ? '#1C2677'
                                : '#FEF2F2'
                              : isAvailableInArea
                              ? '#F8FAFC'
                              : '#F1F5F9',
                            color: vehicleCategory === veh.id
                              ? isAvailableInArea
                                ? '#FFFFFF'
                                : '#991B1B'
                              : '#1B2236',
                            opacity: isAvailableInArea ? 1 : 0.8,
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{veh.label}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{veh.examples}</div>
                          {!isAvailableInArea && (
                            <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.7rem', fontWeight: 800, background: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '10px' }}>
                              ✕ Unavailable in {area}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {serviceId === 'laundry' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ fontWeight: 700, fontSize: '1rem', color: '#1C2677', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Scale size={18} style={{ color: '#29C3BE' }} /> Select Total Weight (Kg)
                      </label>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#29C3BE' }}>
                        {laundryWeight} Kg
                      </span>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={1}
                      value={laundryWeight}
                      onChange={(e) => handleCategorySelect(setLaundryWeight, Number(e.target.value))}
                      style={{
                        width: '100%',
                        accentColor: '#29C3BE',
                        height: '8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '16px'
                      }}
                    />
                    {(() => {
                      const minWeight = laundryConfigData?.freePickupMinWeight ?? 2;
                      const pickupFeeAmt = laundryConfigData?.pickupFee ?? 80;

                      return (
                        <>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {[1, 2, 3, 5, 10, 15, 20].map((w) => (
                              <button
                                key={w}
                                onClick={() => handleCategorySelect(setLaundryWeight, w)}
                                style={{
                                  padding: '10px 18px',
                                  borderRadius: '14px',
                                  fontWeight: 700,
                                  background: laundryWeight === w ? '#1C2677' : '#F1F5F9',
                                  color: laundryWeight === w ? '#FFFFFF' : '#1B2236',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                {w} Kg {w === minWeight && '🌟 Free Delivery'}
                              </button>
                            ))}
                          </div>

                          <div style={{
                            padding: '14px',
                            borderRadius: '14px',
                            background: laundryCalcDetails.isPickupFree ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            border: `1px solid ${laundryCalcDetails.isPickupFree ? '#10B981' : '#F59E0B'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: laundryCalcDetails.isPickupFree ? '#065F46' : '#92400E'
                          }}>
                            <Truck size={20} />
                            {laundryCalcDetails.isPickupFree ? (
                              <span>🎉 <strong>FREE Pickup & Doorstep Delivery</strong> on above {minWeight}kg</span>
                            ) : (
                              <span>⚠️ Order under {minWeight}kg applies ₹{pickupFeeAmt} Pickup fee. Add {Math.max(1, minWeight - laundryWeight)}kg for FREE delivery!</span>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Detailed Package / Plan Specifications */}
            {step === 3 && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677', marginBottom: '4px' }}>
                    Step 3: Choose Package & Review Detailed Specifications
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Review exact included & excluded service items for your selected category ({serviceId === 'house-cleaning' ? activeHouseCat.label : serviceId === 'car-wash' ? activeVehicle.label : `${laundryWeight} Kg Load`}).
                  </p>
                </div>

                {serviceId === 'house-cleaning' && (
                  <HousePricingCalculator
                    initialCategory={houseCategory}
                    selectedPlan={housePlan}
                    onSelectPlan={(plan) => handlePlanSelect(setHousePlan, plan)}
                    hideHeader={true}
                  />
                )}

                {serviceId === 'car-wash' && (
                  <CarWashCalculator
                    initialVehicle={vehicleCategory}
                    selectedPackage={carPackage}
                    onSelectPackage={(pkg) => handlePlanSelect(setCarPackage, pkg)}
                    hideHeader={true}
                  />
                )}

                {serviceId === 'laundry' && (
                  <LaundryCalculator
                    initialWeight={laundryWeight}
                    selectedPackage={laundryPackage}
                    onSelectPackage={(pkg) => handlePlanSelect(setLaundryPackage, pkg)}
                    hideHeader={true}
                  />
                )}
              </div>
            )}

            {/* STEP 4: UNIFIED SCHEDULE (CALENDAR PICKER + TIME SLOTS + SERVICE DETAILS SIDEBAR) */}
            {step === 4 && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677', marginBottom: '4px' }}>
                    Schedule Your Service
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                    Check out our availability and book the date and time that works best for you.
                  </p>
                </div>

                {/* Main 3-Column Schedule Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 280px', gap: '24px' }} className="schedule-unified-grid">
                  
                  {/* Column 1: Interactive Mini Calendar */}
                  <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                    
                    {/* Calendar Month Selector Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <button
                        disabled={isPrevMonthDisabled}
                        onClick={handlePrevMonth}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: isPrevMonthDisabled ? 'not-allowed' : 'pointer',
                          padding: '6px',
                          borderRadius: '8px',
                          color: isPrevMonthDisabled ? '#CBD5E1' : '#1C2677',
                          opacity: isPrevMonthDisabled ? 0.4 : 1
                        }}
                        title={isPrevMonthDisabled ? 'Previous month unavailable' : undefined}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1C2677' }}>
                        {monthName} {calYear}
                      </span>
                      <button onClick={handleNextMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: '#1C2677' }}>
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {/* Day Headers (Sun Mon Tue Wed Thu Fri Sat) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '10px' }}>
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Days Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                      {/* Empty padding cells for month start */}
                      {Array.from({ length: startingDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}

                      {/* Day Cells */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const cellDate = new Date(calYear, calMonth, dayNum);
                        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const isSelected = selectedDateObj.getDate() === dayNum &&
                                          selectedDateObj.getMonth() === calMonth &&
                                          selectedDateObj.getFullYear() === calYear;

                        const isPast = isDateInPast(cellDate);
                        const isDayBlocked = adminData?.isSlotBlocked ? adminData.isSlotBlocked(serviceId, dateStr, undefined, area) : false;
                        const isDisabled = isPast || isDayBlocked;

                        return (
                          <button
                            key={dayNum}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && handleDateSelect(cellDate)}
                            style={{
                              aspectRatio: '1',
                              borderRadius: '50%',
                              border: 'none',
                              background: isSelected ? '#1C2677' : isDisabled ? '#F8FAFC' : 'transparent',
                              color: isSelected ? '#FFFFFF' : isDisabled ? '#CBD5E1' : '#1B2236',
                              fontWeight: isSelected ? 800 : 500,
                              fontSize: '0.85rem',
                              cursor: isDisabled ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '2px',
                              transition: 'all 0.15s',
                              position: 'relative',
                              opacity: isPast ? 0.45 : 1,
                              textDecoration: isDisabled ? 'line-through' : 'none'
                            }}
                            title={isPast ? 'Past date cannot be selected' : isDayBlocked ? 'Date Unavailable (Blocked by Admin)' : undefined}
                          >
                            <span>{dayNum}</span>
                            {isSelected && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#29C3BE' }} />}
                            {isDayBlocked && !isPast && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#EF4444' }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Available Time Slots */}
                  <div ref={timeSlotsRef} style={{ background: '#F8FAFC', padding: '20px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1C2677', margin: 0 }}>
                        Availability for {selectedDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>India Standard Time (IST)</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                      {[
                        '08:30 AM',
                        '10:00 AM',
                        '11:30 AM',
                        '01:00 PM',
                        '02:30 PM',
                        '04:00 PM',
                        '05:30 PM',
                        '07:00 PM',
                        '10:30 PM'
                      ].map((slot) => {
                        const isSlotSelected = selectedTimeSlot.startsWith(slot) || selectedTimeSlot === slot;
                        const selectedDateStr = `${selectedDateObj.getFullYear()}-${String(selectedDateObj.getMonth() + 1).padStart(2, '0')}-${String(selectedDateObj.getDate()).padStart(2, '0')}`;
                        const isBlocked = adminData?.isSlotBlocked ? adminData.isSlotBlocked(serviceId, selectedDateStr, slot, area) : false;
                        const isPastSlot = isTimeSlotInPast(slot, selectedDateObj);
                        const isDisabledSlot = isBlocked || isPastSlot;

                        return (
                          <button
                            key={slot}
                            disabled={isDisabledSlot}
                            onClick={() => !isDisabledSlot && handleTimeSlotSelect(slot)}
                            style={{
                              padding: '12px 10px',
                              borderRadius: '12px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              background: isDisabledSlot ? '#F1F5F9' : isSlotSelected ? '#1C2677' : '#FFFFFF',
                              color: isDisabledSlot ? '#94A3B8' : isSlotSelected ? '#FFFFFF' : '#1B2236',
                              border: `1.5px solid ${isDisabledSlot ? '#E2E8F0' : isSlotSelected ? '#1C2677' : '#E2E8F0'}`,
                              cursor: isDisabledSlot ? 'not-allowed' : 'pointer',
                              boxShadow: isSlotSelected && !isDisabledSlot ? '0 4px 12px rgba(28, 38, 119, 0.2)' : 'none',
                              transition: 'all 0.15s',
                              textAlign: 'center',
                              position: 'relative',
                              opacity: isPastSlot ? 0.45 : 1,
                              textDecoration: isPastSlot ? 'line-through' : 'none'
                            }}
                            title={isPastSlot ? 'Time slot has passed' : isBlocked ? `Slot unavailable for ${serviceId.replace('-', ' ')}` : undefined}
                          >
                            {slot}
                            {isPastSlot && (
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94A3B8', fontWeight: 800, marginTop: '2px' }}>
                                Passed
                              </span>
                            )}
                            {isBlocked && !isPastSlot && (
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#EF4444', fontWeight: 800, marginTop: '2px' }}>
                                Unavailable
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 3: Service Details Sidebar Summary */}
                  <div style={{
                    background: 'linear-gradient(180deg, #1C2677 0%, #151D5C 100%)',
                    borderRadius: '20px',
                    padding: '20px',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 12px 30px rgba(28, 38, 119, 0.2)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#29C3BE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                        Service Details
                      </div>

                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, marginBottom: '14px', color: '#FFFFFF', textTransform: 'capitalize' }}>
                        {serviceId.replace('-', ' ')}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '20px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Category & Package:</span>
                          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
                            {serviceId === 'house-cleaning' ? `${activeHouseCat.label} (${housePlan === 'premium' ? 'Premium Ultra' : 'Standard'})` : serviceId === 'car-wash' ? `${activeVehicle.label} (${carPackage})` : `${laundryWeight}kg (${laundryPackage})`}
                          </span>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Selected Schedule:</span>
                          <span style={{ fontWeight: 700, color: '#29C3BE' }}>
                            {selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {selectedTimeSlot}
                          </span>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Estimated Duration:</span>
                          <span style={{ fontWeight: 600, color: '#FFFFFF' }}>
                            {serviceId === 'house-cleaning' ? (housePlan === 'premium' ? activeHouseCat.premium.duration : activeHouseCat.standard.duration) : serviceId === 'car-wash' ? '1.5 - 2 Hours' : laundrySpeed === 'express' ? 'Same Day (Express)' : '2 Days (Standard)'}
                          </span>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Location:</span>
                          <span style={{ fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} style={{ color: '#29C3BE' }} /> {area}, Kochi
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Est. Total:</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#29C3BE' }}>
                          {isCustomHouse ? 'Quote' : `₹${estimatedTotal}`}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '4px' }}>
                        ✓ Includes 100% Refundable Deposit
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 5: Enter Address & Custom Requirements */}
            {step === 5 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                  Step 5: Address & Customised Service Needs
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Provide your specific street address and specify any customized requests or special instructions for our team.
                </p>

                {isCustomHouse && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1.5px solid #F59E0B', borderRadius: '16px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <AlertCircle size={24} style={{ color: '#B45309', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#92400E', fontSize: '0.95rem' }}>✨ Customised Service Selected ({activeHouseCat.label})</strong>
                      <p style={{ fontSize: '0.85rem', color: '#B45309', margin: 0, marginTop: '2px' }}>
                        Please enter your specific floor layout, approximate square footage, or key areas needing special deep cleaning attention in the custom needs box below.
                      </p>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Anand Ramachandran"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>House / Flat / Building Address *</label>
                    <input
                      type="text"
                      placeholder="Flat 4B, Prestige Cyber Towers, Seaport Airport Rd"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Selected Service Area (Chosen in Step 1)</label>
                    <select
                      value={area}
                      onChange={(e) => {
                        const newLoc = e.target.value;
                        setArea(newLoc);
                        const match = ((adminData && adminData.locations && adminData.locations.length > 0)
                          ? adminData.locations
                          : SERVICEABLE_LOCATIONS
                        ).find((l: any) => l.name === newLoc);
                        if (match && match.pincode) setPincode(match.pincode);
                      }}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #29C3BE', background: '#FAFCFF', fontWeight: 700, fontSize: '0.9rem', color: '#1C2677' }}
                    >
                      {(() => {
                        const activeSubKey = serviceId === 'house-cleaning' ? houseCategory : serviceId === 'car-wash' ? vehicleCategory : undefined;
                        const validLocations = ((adminData && adminData.locations && adminData.locations.length > 0)
                          ? adminData.locations.filter((l: any) => {
                              const isActiveSystem = !l.status || l.status === 'active';
                              const isServiceAvail = adminData.isServiceAvailableInLocation
                                ? adminData.isServiceAvailableInLocation(serviceId, l.name, activeSubKey)
                                : true;
                              return isActiveSystem && isServiceAvail;
                            })
                          : SERVICEABLE_LOCATIONS
                        );
                        
                        const listToRender = validLocations.length > 0 ? validLocations : SERVICEABLE_LOCATIONS;

                        return listToRender.map((loc: any) => (
                          <option key={loc.id || loc.name} value={loc.name}>
                            📍 {loc.name} ({loc.pincode})
                          </option>
                        ));
                      })()}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                    />
                  </div>

                  {/* CUSTOM REQUIREMENTS TEXT AREA */}
                  <div style={{ gridColumn: 'span 2', marginTop: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C2677', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <FileText size={18} style={{ color: '#29C3BE' }} />
                      Customised Requirements & Special Instructions
                    </label>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '8px' }}>
                      Describe any specific requests (e.g., custom balcony pressure washing, pet hair extraction, specific kitchen cabinet areas, fragile item handling).
                    </p>
                    <textarea
                      rows={4}
                      placeholder="e.g. Please bring extra floor scrubbing pads for the balcony, pay special attention to master bedroom glass windows..."
                      value={customRequirements}
                      onChange={(e) => setCustomRequirements(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '14px',
                        border: '1.5px solid #29C3BE',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        background: '#FAFCFF'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Review & Demo Deposit */}
            {step === 6 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2677', marginBottom: '8px' }}>
                  Step 6: Order Summary & Refundable Deposit
                </h3>

                <div style={{ background: '#F8FAFC', padding: '18px 16px', borderRadius: '18px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
                  
                  {/* Row 1: Service & Category */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, minWidth: '120px', flexShrink: 0 }}>
                      Service & Category:
                    </span>
                    <strong style={{ color: '#1B2236', fontSize: '0.875rem', fontWeight: 700, textAlign: 'right', textTransform: 'capitalize' }}>
                      {serviceId.replace('-', ' ')} {serviceId === 'house-cleaning' ? `(${houseCategory.toUpperCase()})` : serviceId === 'car-wash' ? `(${vehicleCategory.toUpperCase()})` : `(${laundryWeight}kg - ${laundryPackage})`}
                    </strong>
                  </div>

                  {serviceId === 'laundry' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid #E2E8F0' }}>
                        <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, minWidth: '120px', flexShrink: 0 }}>Delivery Speed:</span>
                        <strong style={{ color: '#1B2236', fontSize: '0.875rem', fontWeight: 700, textAlign: 'right', textTransform: 'capitalize' }}>{laundrySpeed === 'express' ? '⚡ Express Same Day (+₹199)' : 'Standard 2 Days (Free)'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid #E2E8F0' }}>
                        <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, minWidth: '120px', flexShrink: 0 }}>Detergent Quality:</span>
                        <strong style={{ color: '#1B2236', fontSize: '0.875rem', fontWeight: 700, textAlign: 'right', textTransform: 'capitalize' }}>{laundryQuality === 'premium' ? '✨ Premium Luxury (+₹35/kg)' : 'Standard Care'}</strong>
                      </div>
                    </>
                  )}

                  {/* Row 2: Schedule */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, minWidth: '90px', flexShrink: 0 }}>
                      Schedule:
                    </span>
                    <strong style={{ color: '#1B2236', fontSize: '0.875rem', fontWeight: 700, textAlign: 'right' }}>
                      {formattedSelectedDate} at {selectedTimeSlot}
                    </strong>
                  </div>

                  {/* Row 3: Service Location */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, minWidth: '120px', flexShrink: 0 }}>
                      Service Location:
                    </span>
                    <strong style={{ color: '#1B2236', fontSize: '0.875rem', fontWeight: 700, textAlign: 'right' }}>
                      {area}, Kochi ({pincode})
                    </strong>
                  </div>

                  {customRequirements && (
                    <div style={{ margin: '10px 0', background: 'rgba(41, 195, 190, 0.1)', padding: '12px', borderRadius: '12px' }}>
                      <span style={{ fontWeight: 700, color: '#1C2677', display: 'block', fontSize: '0.825rem' }}>Your Customised Instructions:</span>
                      <span style={{ fontSize: '0.85rem', color: '#334155', fontStyle: 'italic' }}>"{customRequirements}"</span>
                    </div>
                  )}

                  {/* Coupon Code Section */}
                  <div style={{ background: '#FFFFFF', padding: '14px 16px', borderRadius: '16px', border: '1px solid #CBD5E1', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1C2677', display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        <Tag size={16} style={{ color: '#29C3BE', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Apply Promo Code</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setIsViewOffersOpen(true)}
                        style={{
                          background: 'linear-gradient(135deg, rgba(41, 195, 190, 0.15) 0%, rgba(28, 38, 119, 0.1) 100%)',
                          border: '1px solid #29C3BE',
                          color: '#1C2677',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          padding: '6px 12px',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(41, 195, 190, 0.15)'
                        }}
                      >
                        <Tag size={12} style={{ color: '#29C3BE' }} /> View Offers 🏷️
                      </button>
                    </div>

                    {!appliedCoupon ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            if (couponMsg) setCouponMsg(null);
                          }}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            height: '42px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: '#1C2677',
                            letterSpacing: '0.04em',
                            outline: 'none',
                            background: '#F8FAFC'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyCouponCode()}
                          style={{
                            height: '42px',
                            padding: '0 18px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #1C2677, #29C3BE)',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 12px rgba(28, 38, 119, 0.2)'
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px 14px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#047857', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {appliedCoupon.code} Applied (-₹{couponDiscount})
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#065F46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {appliedCoupon.title}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, marginLeft: '8px' }}
                          title="Remove Coupon"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {couponMsg && !appliedCoupon && (
                      <div style={{ fontSize: '0.78rem', color: couponMsg.type === 'success' ? '#059669' : '#DC2626', marginTop: '6px', fontWeight: 600 }}>
                        {couponMsg.text}
                      </div>
                    )}
                  </div>

                  {/* Row 4: Total Invoice & Net Calculation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                    <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>Subtotal Invoice:</span>
                    <strong style={{ color: '#1B2236', fontSize: '1rem', fontWeight: 700 }}>
                      {isCustomHouse ? 'Quote / Inspection' : `₹${estimatedTotal}`}
                    </strong>
                  </div>

                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
                      <span style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 700 }}>Coupon Discount ({appliedCoupon.code}):</span>
                      <strong style={{ color: '#059669', fontSize: '1rem', fontWeight: 800 }}>
                        - ₹{couponDiscount}
                      </strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '10px 0', marginBottom: '14px', borderTop: '1px dashed #CBD5E1' }}>
                    <span style={{ color: '#1C2677', fontSize: '0.95rem', fontWeight: 800 }}>Net Total Invoice:</span>
                    <strong style={{ color: '#1C2677', fontSize: '1.4rem', fontWeight: 900 }}>
                      {isCustomHouse ? 'Quote / Inspection' : `₹${Math.max(0, estimatedTotal - couponDiscount)}`}
                    </strong>
                  </div>

                  {/* Highlighted Deposit Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(41, 195, 190, 0.12) 0%, rgba(28, 38, 119, 0.06) 100%)',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(41, 195, 190, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{ fontWeight: 800, color: '#1C2677', fontSize: '0.875rem', display: 'block' }}>
                        Refundable Booking Deposit:
                      </span>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '2px' }}>
                        Fully refundable upon service completion
                      </div>
                    </div>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#29C3BE', flexShrink: 0 }}>
                      ₹{DEMO_BOOKING_DEPOSIT}
                    </span>
                  </div>
                </div>

                <ViewOffersModal
                  isOpen={isViewOffersOpen}
                  onClose={() => setIsViewOffersOpen(false)}
                  onSelectCoupon={(code) => {
                    if (!code) {
                      handleRemoveCoupon();
                    } else {
                      setCouponInput(code);
                      handleApplyCouponCode(code);
                    }
                  }}
                  serviceId={serviceId}
                  orderTotal={estimatedTotal}
                  customerPhone={phone}
                  activeAppliedCode={appliedCoupon?.code}
                />

                <div style={{ marginBottom: '24px' }}>
                  <RefundableBanner variant="full" />
                </div>

                <button onClick={handlePayDemoDeposit} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }}>
                  Pay ₹{DEMO_BOOKING_DEPOSIT} Deposit & Confirm Booking (Demo) <CreditCard size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Wizard Controls Footer */}
        <div ref={footerNavRef} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="btn-outline">
              <ArrowLeft size={16} /> Previous
            </button>
          ) : <div />}

          {step < 6 && (
            <button
              onClick={() => {
                // Step 1: Check Primary Service Level
                if (step === 1 && adminData?.isServiceAvailableInLocation && !adminData.isServiceAvailableInLocation(serviceId, area)) {
                  alert(`⚠️ ${serviceId.replace('-', ' ').toUpperCase()} is currently not available in ${area}. Please choose an available location or different service to proceed.`);
                  return;
                }
                // Step 2: Check Sub-category Plan Tier Level
                if (step === 2 && adminData?.isServiceAvailableInLocation) {
                  const activeSubKey = serviceId === 'house-cleaning' ? houseCategory : serviceId === 'car-wash' ? vehicleCategory : undefined;
                  if (activeSubKey && !adminData.isServiceAvailableInLocation(serviceId, area, activeSubKey)) {
                    alert(`⚠️ ${activeSubKey.toUpperCase()} plan is currently not available in ${area}. Please choose an available plan tier or location to proceed.`);
                    return;
                  }
                }
                setStep(step + 1);
              }}
              className="btn-primary"
              style={{
                opacity: (() => {
                  if (step === 1 && adminData?.isServiceAvailableInLocation && !adminData.isServiceAvailableInLocation(serviceId, area)) return 0.5;
                  if (step === 2 && adminData?.isServiceAvailableInLocation) {
                    const activeSubKey = serviceId === 'house-cleaning' ? houseCategory : serviceId === 'car-wash' ? vehicleCategory : undefined;
                    if (activeSubKey && !adminData.isServiceAvailableInLocation(serviceId, area, activeSubKey)) return 0.5;
                  }
                  return 1;
                })(),
                cursor: (() => {
                  if (step === 1 && adminData?.isServiceAvailableInLocation && !adminData.isServiceAvailableInLocation(serviceId, area)) return 'not-allowed';
                  if (step === 2 && adminData?.isServiceAvailableInLocation) {
                    const activeSubKey = serviceId === 'house-cleaning' ? houseCategory : serviceId === 'car-wash' ? vehicleCategory : undefined;
                    if (activeSubKey && !adminData.isServiceAvailableInLocation(serviceId, area, activeSubKey)) return 'not-allowed';
                  }
                  return 'pointer';
                })()
              }}
            >
              Continue to Step {step + 1} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        .wizard-packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        @media (max-width: 992px) {
          .wizard-packages-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
            align-items: flex-start !important;
          }
          .pkg-card {
            padding: 12px 10px !important;
          }
          .pkg-badge-title {
            font-size: 0.675rem !important;
          }
          .pkg-price-text {
            font-size: 1.35rem !important;
          }
          .pkg-desc-text {
            font-size: 0.725rem !important;
            line-height: 1.35 !important;
            color: #64748B !important;
            margin-bottom: 8px !important;
          }
          .pkg-duration-text {
            font-size: 0.675rem !important;
            margin-bottom: 8px !important;
          }
          .desktop-features-list {
            display: none !important;
          }
          .mobile-features-accordion {
            display: block !important;
          }
        }

        @media (min-width: 993px) {
          .desktop-features-list {
            display: block !important;
          }
          .mobile-features-accordion {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .booking-main-card {
            padding: 14px 10px !important;
            border-radius: 18px !important;
          }
          .schedule-unified-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
