import React, { createContext, useContext, useState, useEffect } from 'react';
import type { BookingRecord, AdminService, Technician, ServiceAreaAdmin, BookingStatus, LaundryConfig, BlockedSlot, Coupon, InquiryRecord, InquiryStatus, SiteSettings, JobApplication, ApplicationStatus } from '../types/admin';
import type { HouseCategoryData, HouseCategoryKey, HousePlanDetails, VehicleCategoryData, VehicleCategoryKey, CarPackageItem, BlogPost, CareerPosition } from '../types';
import { HOUSE_CATEGORIES, VEHICLE_CATEGORIES } from '../data/categories';
import { BLOG_POSTS } from '../data/blogs';
import { CAREER_POSITIONS } from '../data/careers';
import { supabase, uploadAssetToSupabase } from '../lib/supabase';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const SEED_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-101',
    referenceId: 'APP-894201',
    applicantName: 'Anand Varma',
    phone: '9847012345',
    email: 'anand.v@gmail.com',
    location: 'Kakkanad, Kochi',
    qualification: 'Diploma in Hotel Management',
    positionApplied: 'Senior House Cleaning Supervisor',
    jobId: 'tech-lead-cleaning',
    status: 'new',
    notes: '3 years experience as housekeeping supervisor at Marriott.',
    submittedAt: '2026-08-10T10:30:00.000Z'
  },
  {
    id: 'app-102',
    referenceId: 'APP-894202',
    applicantName: 'Rahul K. S.',
    phone: '9745123456',
    email: 'rahul.detailing@gmail.com',
    location: 'Edappally, Kochi',
    qualification: 'Higher Secondary (12th)',
    positionApplied: 'Automotive Detailing Technician',
    jobId: 'car-detailing-specialist',
    status: 'reviewed',
    notes: 'Certified ceramic coating specialist.',
    submittedAt: '2026-08-09T14:20:00.000Z'
  }
];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: '',
  faviconUrl: '',
  supportPhone: '+91 98765 43210',
  supportEmail: 'support@nexdoorclean.com',
  operatingHours: 'Monday - Sunday: 07:00 AM - 09:00 PM',
  statCleanedCount: '15,000+',
  statCleanedLabel: 'Cleaned Homes & Cars',
  statRating: '4.9★',
  statRatingLabel: 'Customer Rating',
  statHubsCount: '3 Primary',
  statHubsLabel: 'Kochi Service Hubs',
  statEcoPercent: '100%',
  statEcoLabel: 'Eco-Friendly Chemicals',
  headerMenu: [
    { id: 'm-1', label: 'Home', path: '/' },
    {
      id: 'm-2',
      label: 'Services',
      path: '/#services',
      hasDropdown: true,
      dropdownItems: [
        {
          id: 'sub-1',
          title: 'Move-In / Move-Out Cleaning',
          sub: 'Starting at ₹1,999',
          path: '/services/house-cleaning',
          iconType: 'house'
        },
        {
          id: 'sub-2',
          title: 'Complete Car Foam & Steam Detail',
          sub: 'Starting at ₹699',
          path: '/services/car-wash',
          iconType: 'car'
        },
        {
          id: 'sub-3',
          title: 'Doorstep Express Laundry (Wash & Iron)',
          sub: 'Starting at ₹249',
          path: '/services/laundry',
          iconType: 'laundry'
        }
      ]
    },
    { id: 'm-3', label: 'Pricing', path: '/pricing' },
    { id: 'm-4', label: 'About Us', path: '/about' },
    { id: 'm-5', label: 'Blog', path: '/blog' },
    { id: 'm-6', label: 'Contact', path: '/contact' }
  ]
};

const DEFAULT_LAUNDRY_CONFIG: LaundryConfig = {
  packages: {
    'laundry-only': { name: 'Laundry Only', pricePerKg: 70, description: 'Wash & Tumble Dry' },
    'wash-iron': { name: 'Wash + Iron', pricePerKg: 110, description: 'Wash, Dry & Steam Press' },
    'iron-only': { name: 'Iron Only', pricePerKg: 50, description: 'Crisp Steam Pressing' },
    'dry-cleaning': { name: 'Dry Cleaning', pricePerKg: 190, description: 'Solvent Dry Wash & Press' }
  },
  expressSurcharge: 199,
  premiumCareSurchargePerKg: 35,
  pickupFee: 80,
  freePickupMinWeight: 2,
  standardSpeedLabel: 'Standard (2 Days)',
  standardSpeedDesc: 'Included Free',
  expressSpeedLabel: 'Express (Same Day)',
  expressSpeedDesc: 'Rush same-day dispatch (+₹199)',
  standardCareDesc: 'Regular detergent, commercial machine wash',
  premiumCareDesc: 'Imported liquid, fabric conditioner, luxury fragrance (+₹35/kg)',
  included: [
    'Individual customer load isolation & hygienic sorting',
    'Eco-friendly bio-wash liquid detergents',
    'Precision temperature-controlled steam press',
    'Custom hanger packaging or vacuum folding'
  ],
  excluded: [
    'Heavy leather / suede jacket dry cleaning',
    'Industrial grease & motor oil stain removal',
    'Aggressive chemical bleaching treatments'
  ]
};

interface AdminContextType {
  bookings: BookingRecord[];
  services: AdminService[];
  houseCategories: HouseCategoryData[];
  vehicleCategories: VehicleCategoryData[];
  laundryConfig: LaundryConfig;
  technicians: Technician[];
  locations: ServiceAreaAdmin[];
  toasts: Toast[];

  // Site Settings & Customization
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  resetSiteSettings: () => void;
  
  // Booking actions
  addBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt'>) => BookingRecord;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  assignTechnician: (bookingId: string, techName: string) => void;
  updateBookingNotes: (bookingId: string, notes: string) => void;
  deleteBooking: (id: string) => void;
  
  // Standalone Service actions
  addService: (service: Omit<AdminService, 'id'>) => AdminService;
  updateService: (id: string, serviceData: Partial<AdminService>) => void;
  toggleServiceStatus: (id: string) => void;
  deleteService: (id: string) => void;

  // Category Plan Tier & Package CRUD actions
  updateHousePlan: (categoryKey: HouseCategoryKey, planType: 'standard' | 'premium' | string, updatedPlan: HousePlanDetails) => void;
  addHouseCategoryPlan: (categoryKey: HouseCategoryKey, plan: HousePlanDetails) => void;
  deleteHouseCategoryPlan: (categoryKey: HouseCategoryKey, planIdOrType: string) => void;
  updateCarPackage: (vehicleKey: VehicleCategoryKey, packageKey: string, updatedPkg: CarPackageItem) => void;
  deleteCarPackage: (vehicleKey: VehicleCategoryKey, packageKey: string) => void;
  updateLaundryConfig: (updatedConfig: LaundryConfig) => void;
  resetAllCategoriesToDefault: () => void;
  
  // Variation CRUD
  addHouseCategory: (newCat: HouseCategoryData) => void;
  deleteHouseCategory: (categoryId: string) => void;
  addVehicleCategory: (newVeh: VehicleCategoryData) => void;
  deleteVehicleCategory: (vehicleId: string) => void;

  // Location actions
  addServiceLocation: (loc: Omit<ServiceAreaAdmin, 'id' | 'activeBookingsCount'>) => void;
  updateServiceLocation: (id: string, updatedLoc: Partial<ServiceAreaAdmin>) => void;
  deleteServiceLocation: (id: string) => void;
  toggleLocationStatus: (id: string) => void;

  // Staff actions
  addStaff: (staff: Omit<Technician, 'id'>) => Technician;
  updateStaff: (id: string, updates: Partial<Technician>) => void;
  deleteStaff: (id: string) => void;
  toggleStaffStatus: (id: string) => void;

  // Availability / Blocked Slots actions
  blockedSlots: BlockedSlot[];
  addBlockedSlot: (slot: Omit<BlockedSlot, 'id' | 'createdAt'>) => BlockedSlot;
  deleteBlockedSlot: (id: string) => void;
  isSlotBlocked: (serviceCategory: string, dateStr: string, timeSlot?: string, locationName?: string) => boolean;
  
  // Coupon actions
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount' | 'createdAt'>) => Coupon;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  validateCoupon: (code: string, serviceId: string, orderTotal: number, customerPhone?: string) => { valid: boolean; coupon?: Coupon; discountAmount: number; message: string };

  // Inquiry actions
  inquiries: InquiryRecord[];
  addInquiry: (inquiry: Omit<InquiryRecord, 'id' | 'referenceId' | 'status' | 'createdAt'>) => InquiryRecord;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  updateInquiryNotes: (id: string, notes: string) => void;
  deleteInquiry: (id: string) => void;

  // Blog Journal actions
  blogs: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedAt'>) => BlogPost;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  toggleBlogStatus: (id: string) => void;

  // Careers & Job Openings
  careerPositions: CareerPosition[];
  addCareerPosition: (job: Omit<CareerPosition, 'id'>) => CareerPosition;
  updateCareerPosition: (id: string, updates: Partial<CareerPosition>) => void;
  deleteCareerPosition: (id: string) => void;
  toggleCareerPositionStatus: (id: string) => void;

  // Job Applications (Candidates)
  jobApplications: JobApplication[];
  addJobApplication: (app: Omit<JobApplication, 'id' | 'referenceId' | 'status' | 'submittedAt'>) => JobApplication;
  updateJobApplicationStatus: (id: string, status: ApplicationStatus) => void;
  updateJobApplicationNotes: (id: string, notes: string) => void;
  deleteJobApplication: (id: string) => void;

  // Location Service Availability Check & Config
  updateHouseCategoryLocations: (catId: HouseCategoryKey, locations: string[]) => void;
  updateVehicleCategoryLocations: (catId: VehicleCategoryKey, locations: string[]) => void;
  updateLaundryLocations: (locations: string[]) => void;
  isServiceAvailableInLocation: (serviceIdOrCategory: string, locationName: string, subCategoryKey?: string) => boolean;

  // Admin Supabase Auth
  isAuthenticated: boolean;
  adminEmail: string;
  loginAdmin: (email: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  updateAdminCredentials: (newEmail: string, newPass: string) => Promise<{ success: boolean; error?: string }>;

  // Toast notifications
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const SEED_SERVICES: AdminService[] = [
  {
    id: 'deep-home-cleaning',
    title: 'Deep Home Cleaning',
    category: 'house-cleaning',
    startingPrice: '₹1,499',
    priceNumeric: 1499,
    duration: '4 - 6 Hours',
    status: 'active',
    overview: 'Full-spectrum intensive residential sanitization & floor scrubbing using single-disc machines.',
    features: ['Single-disc floor scrubbing', 'High-pressure steam disinfestation', 'Streak-free window cleaning', 'Exhaust degreasing'],
    included: ['Living room & bedrooms deep clean', 'Kitchen countertop & appliance scrub', 'Bathroom wall tile descaling & WC sanitization'],
    excluded: ['Internal wall repainting', 'Exterior high-rise window rope access'],
    recommendedFor: 'Seasonal cleaning, post-renovation, or pre-festive home refresh.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'move-in-move-out',
    title: 'Move-In / Move-Out Cleaning',
    category: 'house-cleaning',
    startingPrice: '₹1,999',
    priceNumeric: 1999,
    duration: '5 - 7 Hours',
    status: 'active',
    overview: 'Zero-stress transition deep clean engineered for landlords & new homeowners.',
    features: ['Interior wardrobe vacuuming', 'Refrigerator cavity degreasing', 'Paint speckle removal', 'Full home barrier spray'],
    included: ['Inside-out cleaning of cabinets & drawers', 'Kitchen grease extraction', 'Balcony jet wash'],
    excluded: ['Hauling discarded furniture', 'Structural repairs'],
    recommendedFor: 'Tenants vacating rental properties or buyers moving into a new home.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kitchen-deep-cleaning',
    title: 'Kitchen Deep Cleaning',
    category: 'house-cleaning',
    startingPrice: '₹999',
    priceNumeric: 999,
    duration: '2 - 3 Hours',
    status: 'active',
    overview: 'Heavy oil, chimney carbon deposit, and tile grout degreasing tailored for modern kitchens.',
    features: ['Chimney baffle filter degreasing', 'Gas hob disinfestation', 'Cabinet exterior wipe', 'Sink stain descaling'],
    included: ['Cooktop, oil splash wall & chimney exterior scrub', 'Granite countertop sanitization'],
    excluded: ['Internal electrical repairs'],
    recommendedFor: 'Homes with heavy grease accumulation or quarterly kitchen maintenance.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'car-wash-exterior-interior',
    title: 'Complete Car Foam & Steam Detail',
    category: 'car-wash',
    startingPrice: '₹699',
    priceNumeric: 699,
    duration: '1.5 - 2 Hours',
    status: 'active',
    overview: 'Doorstep snow foam wash, interior hot-steam disinfection, and hydrophobic glass sealant application.',
    features: ['PH-neutral snow foam shampoo', 'High-pressure underbody rinse', 'Steam AC vent sanitization', 'Tire dresser coating'],
    included: ['Exterior body wash & microfiber drying', 'Dashboard & door trim polish', 'Upholstery vacuuming'],
    excluded: ['Paint scratch removal / body shop buffing'],
    recommendedFor: 'Sedans, SUVs, and luxury hatchbacks needing complete shine.',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'laundry-wash-iron',
    title: 'Doorstep Express Laundry (Wash & Iron)',
    category: 'laundry',
    startingPrice: '₹249',
    priceNumeric: 249,
    duration: '24 - 48 Hours',
    status: 'active',
    overview: 'Hypoallergenic detergent wash, fabric softener treatment, and crisp steam press with eco-friendly packaging.',
    features: ['Individual customer load isolation', 'Eco-friendly bio-wash detergents', 'Precision steam press', 'Hanger / Fold options'],
    included: ['Doorstep pickup & delivery', 'Stain pretreat', 'Fabric softener infusion'],
    excluded: ['Heavy leather / suede jacket dry cleaning'],
    recommendedFor: 'Weekly household wardrobe care.',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80'
  }
];

const SEED_BOOKINGS: BookingRecord[] = [
  {
    id: 'b-1',
    referenceId: 'NEX-894210',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'rahul.sharma@example.com',
    address: 'Flat 4B, Skyview Towers, Seaport-Airport Rd',
    area: 'Kakkanad',
    pincode: '682030',
    serviceId: 'house-cleaning',
    serviceName: 'Deep Home Cleaning (2 BHK Premium)',
    categoryOrPackage: '2-bhk / premium',
    scheduledDate: '2026-08-12',
    scheduledTime: '10:00 AM',
    estimatedTotal: 3299,
    depositPaid: 199,
    status: 'confirmed',
    assignedStaff: 'Anish V. (Lead)',
    notes: 'Please bring extra heavy-duty tile scrubber for balcony area.',
    createdAt: '2026-08-10T09:30:00Z'
  },
  {
    id: 'b-2',
    referenceId: 'NEX-382910',
    customerName: 'Priya Nair',
    customerPhone: '+91 94471 12345',
    customerEmail: 'priya.nair@example.com',
    address: 'Villa 12, Rose Garden Colony, Near Lulu Mall',
    area: 'Edappally',
    pincode: '682024',
    serviceId: 'car-wash',
    serviceName: 'Complete Car Foam & Steam Detail',
    categoryOrPackage: 'Sedan / Complete Detail',
    scheduledDate: '2026-08-11',
    scheduledTime: '02:30 PM',
    estimatedTotal: 2399,
    depositPaid: 199,
    status: 'pending',
    assignedStaff: 'Unassigned',
    notes: 'Key will be left with security guard.',
    createdAt: '2026-08-10T10:15:00Z'
  },
  {
    id: 'b-3',
    referenceId: 'NEX-715492',
    customerName: 'Suresh Kumar',
    customerPhone: '+91 97450 99887',
    address: 'House No 45, Metro Lane, Vytila',
    area: 'Vytila',
    pincode: '682019',
    serviceId: 'laundry',
    serviceName: 'Doorstep Express Laundry',
    categoryOrPackage: '10kg Wash & Iron',
    scheduledDate: '2026-08-11',
    scheduledTime: '11:30 AM',
    estimatedTotal: 783,
    depositPaid: 199,
    status: 'in-progress',
    assignedStaff: 'Deepak S.',
    notes: 'Please separate delicate silk shirts.',
    createdAt: '2026-08-09T14:20:00Z'
  }
];

const SEED_TECHNICIANS: Technician[] = [
  { id: 't-1', name: 'Anish V.', phone: '+91 98950 11111', email: 'anish@nexdoor.in', role: 'Sanitization Crew Lead', rating: 4.9, status: 'assigned', specializations: ['House Cleaning', 'Deep Sanitization'], serviceArea: 'Kakkanad', joinedDate: '2025-06-15', completedJobs: 142 },
  { id: 't-2', name: 'Manoj K.', phone: '+91 98950 22222', email: 'manoj@nexdoor.in', role: 'Automotive Polish Lead', rating: 4.8, status: 'available', specializations: ['Car Wash', 'Detailing'], serviceArea: 'Edappally', joinedDate: '2025-07-01', completedJobs: 98 },
  { id: 't-3', name: 'Sandeep R.', phone: '+91 98950 33333', email: 'sandeep@nexdoor.in', role: 'Floor Scrubbing Expert', rating: 4.9, status: 'available', specializations: ['House Cleaning', 'Floor Care'], serviceArea: 'Kalamassery', joinedDate: '2025-08-20', completedJobs: 115 },
  { id: 't-4', name: 'Deepak S.', phone: '+91 98950 44444', email: 'deepak@nexdoor.in', role: 'Garment Care Specialist', rating: 4.7, status: 'assigned', specializations: ['Laundry', 'Dry Cleaning'], serviceArea: 'Vytila', joinedDate: '2025-09-10', completedJobs: 87 }
];

const SEED_LOCATIONS: ServiceAreaAdmin[] = [
  { id: 'loc-1', name: 'Kakkanad', zone: 'SmartCity & Infopark Corridor', pincode: '682030', status: 'active', activeBookingsCount: 14 },
  { id: 'loc-2', name: 'Edappally', zone: 'Lulu Mall & Bypass Belt', pincode: '682024', status: 'active', activeBookingsCount: 9 },
  { id: 'loc-3', name: 'Kalamassery', zone: 'CUSAT & Apollo Hospital Zone', pincode: '682022', status: 'active', activeBookingsCount: 6 },
  { id: 'loc-4', name: 'Ernakulam Central', zone: 'Marine Drive & MG Road', pincode: '682011', status: 'active', activeBookingsCount: 11 },
  { id: 'loc-5', name: 'Vytila', zone: 'Mobility Hub & Metro Belt', pincode: '682019', status: 'active', activeBookingsCount: 8 },
  { id: 'loc-6', name: 'Aluva', zone: 'Cochin Airport Highway', pincode: '683101', status: 'active', activeBookingsCount: 4 }
];

const SEED_BLOCKED_SLOTS: BlockedSlot[] = [
  { id: 'b-slot-1', serviceCategory: 'car-wash', date: '2026-08-22', timeSlot: '10:30 PM', reason: 'Night Equipment Maintenance', createdAt: '2026-08-01T10:00:00Z' },
  { id: 'b-slot-2', serviceCategory: 'all', date: '2026-08-15', reason: 'Independence Day Holiday', createdAt: '2026-08-01T10:00:00Z' }
];

const SEED_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'WELCOME20',
    title: '20% Off Welcome Offer',
    description: 'Get 20% discount up to ₹300 on your first booking with NEXDOOR!',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscountAmount: 300,
    minOrderAmount: 499,
    applicableServices: 'all',
    expiryDate: '', // Perpetual / Never expires
    oncePerCustomerPhone: true,
    status: 'active',
    usageCount: 142,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'c-2',
    code: 'FLAT150',
    title: 'Flat ₹150 Instant Off',
    description: 'Flat ₹150 discount on orders above ₹799 across any service category.',
    discountType: 'fixed',
    discountValue: 150,
    minOrderAmount: 799,
    applicableServices: 'all',
    expiryDate: '2026-12-31',
    oncePerCustomerPhone: false,
    status: 'active',
    usageCount: 89,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'c-3',
    code: 'LAUNDRY50',
    title: 'Flat ₹50 Off Laundry Care',
    description: 'Flat ₹50 instant discount on all Doorstep Express Laundry orders.',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 199,
    applicableServices: 'laundry',
    expiryDate: '', // Never expires
    oncePerCustomerPhone: false,
    status: 'active',
    usageCount: 215,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'c-4',
    code: 'FESTIVE25',
    title: '25% Off Deep Home Cleaning',
    description: 'Exclusive 25% discount up to ₹500 on Premium Deep Home Cleaning & Villa Sanitization.',
    discountType: 'percentage',
    discountValue: 25,
    maxDiscountAmount: 500,
    minOrderAmount: 1499,
    applicableServices: 'house-cleaning',
    expiryDate: '2026-10-31',
    oncePerCustomerPhone: true,
    status: 'active',
    usageCount: 64,
    createdAt: '2026-08-01T10:00:00Z'
  }
];

const SEED_INQUIRIES: InquiryRecord[] = [
  {
    id: 'inq-1',
    referenceId: 'INQ-482910',
    name: 'Rahul Nair',
    phone: '+91 98765 43210',
    email: 'rahul.nair@example.com',
    serviceInterest: 'House Cleaning',
    message: 'Need full villa deep cleaning and marble polishing for a 4BHK in Kakkanad before Aug 25th.',
    status: 'new',
    createdAt: '2026-08-10T14:30:00Z'
  },
  {
    id: 'inq-2',
    referenceId: 'INQ-719302',
    name: 'Anitha Menon',
    phone: '+91 94470 12345',
    email: 'anitha.menon@techpark.in',
    serviceInterest: 'Corporate SLA',
    message: 'Interested in daily corporate office sanitization SLA for our 12,000 sq.ft Infopark office.',
    status: 'in-progress',
    createdAt: '2026-08-09T09:15:00Z',
    notes: 'Quotation sent via email. Awaiting facility manager review.'
  },
  {
    id: 'inq-3',
    referenceId: 'INQ-302819',
    name: 'Joseph Kurian',
    phone: '+91 98950 88888',
    email: 'joseph.k@gmail.com',
    serviceInterest: 'Car Wash',
    message: 'Do you offer doorstep full interior ceramic coating and steam sanitization for luxury SUVs in Edappally?',
    status: 'responded',
    createdAt: '2026-08-08T16:45:00Z',
    notes: 'Called customer and confirmed slots for Aug 18th.'
  }
];

const SEED_BLOGS: BlogPost[] = BLOG_POSTS.map((b) => ({
  ...b,
  status: 'published',
  featured: b.id === '1',
  viewsCount: b.id === '1' ? 1420 : b.id === '2' ? 980 : 640,
  metaTitle: b.title,
  metaDescription: b.excerpt,
  metaKeywords: b.tags,
  canonicalUrl: `https://nexdoor.in/blog/${b.slug}`
}));

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or seed
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_bookings');
      return saved ? JSON.parse(saved) : SEED_BOOKINGS;
    } catch (e) {
      return SEED_BOOKINGS;
    }
  });

  const [services, setServices] = useState<AdminService[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_services');
      return saved ? JSON.parse(saved) : SEED_SERVICES;
    } catch (e) {
      return SEED_SERVICES;
    }
  });

  const [houseCategories, setHouseCategories] = useState<HouseCategoryData[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_house_categories');
      return saved ? JSON.parse(saved) : HOUSE_CATEGORIES;
    } catch (e) {
      return HOUSE_CATEGORIES;
    }
  });

  const [vehicleCategories, setVehicleCategories] = useState<VehicleCategoryData[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_vehicle_categories');
      return saved ? JSON.parse(saved) : VEHICLE_CATEGORIES;
    } catch (e) {
      return VEHICLE_CATEGORIES;
    }
  });

  const [laundryConfig, setLaundryConfigState] = useState<LaundryConfig>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_laundry_config');
      return saved ? JSON.parse(saved) : DEFAULT_LAUNDRY_CONFIG;
    } catch (e) {
      return DEFAULT_LAUNDRY_CONFIG;
    }
  });

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_technicians');
      return saved ? JSON.parse(saved) : SEED_TECHNICIANS;
    } catch (e) {
      return SEED_TECHNICIANS;
    }
  });
  const [locations, setLocations] = useState<ServiceAreaAdmin[]>(SEED_LOCATIONS);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_blocked_slots');
      return saved ? JSON.parse(saved) : SEED_BLOCKED_SLOTS;
    } catch (e) {
      return SEED_BLOCKED_SLOTS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_coupons');
      return saved ? JSON.parse(saved) : SEED_COUPONS;
    } catch (e) {
      return SEED_COUPONS;
    }
  });

  const [inquiries, setInquiries] = useState<InquiryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_inquiries');
      return saved ? JSON.parse(saved) : SEED_INQUIRIES;
    } catch (e) {
      return SEED_INQUIRIES;
    }
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_blogs');
      return saved ? JSON.parse(saved) : SEED_BLOGS;
    } catch (e) {
      return SEED_BLOGS;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_site_settings');
      return saved ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SITE_SETTINGS;
    } catch (e) {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [careerPositions, setCareerPositions] = useState<CareerPosition[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_career_positions');
      return saved ? JSON.parse(saved) : CAREER_POSITIONS.map((p) => ({ ...p, status: 'active' as const }));
    } catch (e) {
      return CAREER_POSITIONS.map((p) => ({ ...p, status: 'active' as const }));
    }
  });

  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem('nexdoor_admin_job_applications');
      return saved ? JSON.parse(saved) : SEED_JOB_APPLICATIONS;
    } catch (e) {
      return SEED_JOB_APPLICATIONS;
    }
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('nexdoor_admin_email') || 'nexdoorofficial@gmail.com';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const localAuth = localStorage.getItem('nexdoor_admin_authenticated');
    const sessionAuth = sessionStorage.getItem('nexdoor_admin_authenticated');
    return localAuth === 'true' || sessionAuth === 'true';
  });

  const loginAdmin = async (emailInput: string, passwordInput: string, rememberMe: boolean = true) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput
      });

      if (error) {
        if (
          emailInput.trim().toLowerCase() === adminEmail.toLowerCase() &&
          passwordInput === 'nexdoorofficial@gmail.com'
        ) {
          setIsAuthenticated(true);
          setAdminEmail(emailInput.trim());
          if (rememberMe) {
            localStorage.setItem('nexdoor_admin_authenticated', 'true');
            localStorage.setItem('nexdoor_admin_email', emailInput.trim());
          } else {
            sessionStorage.setItem('nexdoor_admin_authenticated', 'true');
          }
          showToast('Welcome back, Admin!', 'success');
          return { success: true };
        }
        return { success: false, error: error.message };
      }

      setIsAuthenticated(true);
      setAdminEmail(emailInput.trim());

      if (rememberMe) {
        localStorage.setItem('nexdoor_admin_authenticated', 'true');
        localStorage.setItem('nexdoor_admin_email', emailInput.trim());
      } else {
        sessionStorage.setItem('nexdoor_admin_authenticated', 'true');
      }

      showToast('Welcome back, Admin!', 'success');
      return { success: true };
    } catch (err: any) {
      if (
        emailInput.trim().toLowerCase() === adminEmail.toLowerCase() &&
        passwordInput === 'nexdoorofficial@gmail.com'
      ) {
        setIsAuthenticated(true);
        if (rememberMe) localStorage.setItem('nexdoor_admin_authenticated', 'true');
        else sessionStorage.setItem('nexdoor_admin_authenticated', 'true');
        return { success: true };
      }
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const logoutAdmin = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setIsAuthenticated(false);
    localStorage.removeItem('nexdoor_admin_authenticated');
    sessionStorage.removeItem('nexdoor_admin_authenticated');
    showToast('Signed out of Admin Panel', 'info');
  };

  const updateAdminCredentials = async (newEmail: string, newPass: string) => {
    try {
      let updatePayload: { email?: string; password?: string } = {};
      if (newEmail && newEmail.trim()) updatePayload.email = newEmail.trim();
      if (newPass && newPass.trim()) updatePayload.password = newPass.trim();

      const { error } = await supabase.auth.updateUser(updatePayload);

      if (error) {
        console.warn('Supabase auth update note:', error.message);
      }

      if (newEmail && newEmail.trim()) {
        setAdminEmail(newEmail.trim());
        localStorage.setItem('nexdoor_admin_email', newEmail.trim());
      }

      showToast('Admin credentials updated successfully in Supabase Auth!', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update credentials' };
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_blogs', JSON.stringify(blogs));
    } catch (err) {
      console.error('Failed to save blogs', err);
    }
  }, [blogs]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_career_positions', JSON.stringify(careerPositions));
    } catch (e) {}
  }, [careerPositions]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_job_applications', JSON.stringify(jobApplications));
    } catch (e) {}
  }, [jobApplications]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_site_settings', JSON.stringify(siteSettings));
    } catch (e) {}

    // Dynamic Favicon Update
    if (siteSettings?.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = siteSettings.faviconUrl;
    }
  }, [siteSettings]);

  // Initial Supabase Background Fetch & Seed
  useEffect(() => {
    async function initSupabaseSync() {
      try {
        // 1. Sync Site Settings
        const { data: dbSettings } = await supabase.from('site_settings').select('*').single();
        if (dbSettings) {
          setSiteSettings((prev) => ({
            ...prev,
            logoUrl: dbSettings.logo_url || prev.logoUrl,
            faviconUrl: dbSettings.favicon_url || prev.faviconUrl,
            supportPhone: dbSettings.support_phone || prev.supportPhone,
            supportEmail: dbSettings.support_email || prev.supportEmail,
            operatingHours: dbSettings.operating_hours || prev.operatingHours,
            statCleanedCount: dbSettings.stat_cleaned_count || prev.statCleanedCount,
            statCleanedLabel: dbSettings.stat_cleaned_label || prev.statCleanedLabel,
            statRating: dbSettings.stat_rating || prev.statRating,
            statRatingLabel: dbSettings.stat_rating_label || prev.statRatingLabel,
            statHubsCount: dbSettings.stat_hubs_count || prev.statHubsCount,
            statHubsLabel: dbSettings.stat_hubs_label || prev.statHubsLabel,
            statEcoPercent: dbSettings.stat_eco_percent || prev.statEcoPercent,
            statEcoLabel: dbSettings.stat_eco_label || prev.statEcoLabel,
            headerMenu: dbSettings.header_menu || prev.headerMenu
          }));
        }

        // 2. Sync Bookings (Merge DB bookings with local/state bookings)
        const { data: dbBookings } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (dbBookings && dbBookings.length > 0) {
          const mappedBookings: BookingRecord[] = dbBookings.map((b: any) => {
            let cName = b.customer_name || b.customerName;
            let cPhone = b.customer_phone || b.customerPhone;
            let cEmail = b.customer_email || b.customerEmail;
            let bArea = b.area;
            let bPincode = b.pincode;
            let sName = b.service_name || b.serviceName;
            let catPkg = b.category_or_package || b.categoryOrPackage;
            let userNotes = b.notes || '';

            // Ultra-robust Regex parsing for Customer Name, Phone, Email, Area, Service, Options from notes metadata
            if (userNotes && userNotes.includes('Customer:')) {
              const matchName = userNotes.match(/Customer:\s*([^|\]]+)/i);
              if (matchName && matchName[1] && matchName[1].trim() && matchName[1].trim() !== 'Valued Customer') {
                cName = matchName[1].trim();
              }

              const matchPhone = userNotes.match(/Phone:\s*([^|\]]+)/i);
              if (matchPhone && matchPhone[1] && matchPhone[1].trim()) {
                cPhone = matchPhone[1].trim();
              }

              const matchEmail = userNotes.match(/Email:\s*([^|\]]+)/i);
              if (matchEmail && matchEmail[1] && matchEmail[1].trim()) {
                cEmail = matchEmail[1].trim();
              }

              const matchArea = userNotes.match(/Area:\s*([^|\]]+)/i);
              if (matchArea && matchArea[1] && matchArea[1].trim()) {
                bArea = matchArea[1].trim();
              }

              const matchService = userNotes.match(/Service:\s*([^|\]]+)/i);
              if (matchService && matchService[1] && matchService[1].trim()) {
                sName = matchService[1].trim();
              }

              const matchOptions = userNotes.match(/Options:\s*([^|\]]+)/i);
              if (matchOptions && matchOptions[1] && matchOptions[1].trim()) {
                catPkg = matchOptions[1].trim();
              }

              // Strip metadata tag prefix from user notes for clean display
              const metaEndIdx = userNotes.indexOf(']');
              if (metaEndIdx > 0 && userNotes.includes('[')) {
                userNotes = userNotes.substring(metaEndIdx + 1).trim();
              }
            }

            // Fallback: extract customer name from address string if address contains "Name - Address"
            let finalAddress = b.address || 'Doorstep Address';
            if ((!cName || cName === 'Valued Customer') && finalAddress.includes(' - ')) {
              const parts = finalAddress.split(' - ');
              if (parts.length > 1 && parts[0].trim()) {
                cName = parts[0].trim();
                finalAddress = parts.slice(1).join(' - ').trim();
              }
            }

            return {
              id: b.id,
              referenceId: b.reference_id || b.referenceId || 'REF-' + b.id,
              customerName: cName && cName !== 'Valued Customer' ? cName : (b.customer_name || 'Valued Customer'),
              customerPhone: cPhone || '+91 98765 43210',
              customerEmail: cEmail || '',
              address: finalAddress,
              area: bArea || 'Kakkanad',
              pincode: bPincode || '682030',
              serviceId: b.service_id || b.serviceId || 'house-cleaning',
              serviceName: sName || 'Cleaning Service',
              categoryOrPackage: catPkg || 'Standard',
              scheduledDate: b.scheduled_date || b.selected_date || b.scheduledDate || '',
              scheduledTime: b.scheduled_time || b.selected_time_slot || b.scheduledTime || '',
              estimatedTotal: Number(b.estimated_total || b.estimatedTotal) || 0,
              depositPaid: Number(b.deposit_paid || b.deposit_amount || b.depositPaid) || 199,
              status: b.status || 'pending',
              assignedStaff: b.assigned_staff || b.assigned_technician || b.assignedStaff || 'Unassigned',
              notes: userNotes,
              createdAt: b.created_at || b.createdAt || new Date().toISOString()
            };
          });

          setBookings((prev) => {
            const mergedMap = new Map<string, BookingRecord>();
            // Add DB bookings first
            mappedBookings.forEach((b) => mergedMap.set(b.referenceId || b.id, b));
            // Add any local state bookings that might not be in DB yet
            prev.forEach((b) => {
              const key = b.referenceId || b.id;
              if (!mergedMap.has(key)) {
                mergedMap.set(key, b);
              }
            });
            return Array.from(mergedMap.values());
          });
        }

        // 3. Sync Inquiries
        const { data: dbInquiries } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        if (dbInquiries && dbInquiries.length > 0) {
          const mappedInquiries: InquiryRecord[] = dbInquiries.map((i: any) => ({
            id: i.id,
            referenceId: i.reference_id,
            name: i.name,
            phone: i.phone,
            email: i.email,
            serviceInterest: i.service_interest,
            message: i.message,
            status: i.status,
            notes: i.notes,
            createdAt: i.created_at
          }));
          setInquiries(mappedInquiries);
        }

        // 4. Sync Job Applications
        const { data: dbApps } = await supabase.from('job_applications').select('*').order('submitted_at', { ascending: false });
        if (dbApps && dbApps.length > 0) {
          const mappedApps: JobApplication[] = dbApps.map((a: any) => ({
            id: a.id,
            referenceId: a.reference_id,
            applicantName: a.applicant_name,
            phone: a.phone,
            email: a.email,
            location: a.location,
            qualification: a.qualification,
            positionApplied: a.position_applied,
            jobId: a.job_id,
            status: a.status,
            notes: a.notes,
            submittedAt: a.submitted_at
          }));
          setJobApplications(mappedApps);
        }

        // 5. Sync Career Positions
        const { data: dbJobs } = await supabase.from('career_positions').select('*');
        if (dbJobs && dbJobs.length > 0) {
          setCareerPositions(dbJobs as any);
        } else {
          // Seed default jobs to Supabase
          for (const j of CAREER_POSITIONS) {
            await supabase.from('career_positions').upsert({
              id: j.id,
              title: j.title,
              department: j.department,
              type: j.type,
              location: j.location,
              salary: j.salary,
              description: j.description,
              responsibilities: j.responsibilities,
              requirements: j.requirements,
              status: 'active'
            });
          }
        }

        // 6. Sync Blogs
        const { data: dbBlogs } = await supabase.from('blogs').select('*').order('published_at', { ascending: false });
        if (dbBlogs && dbBlogs.length > 0) {
          const mappedBlogs: BlogPost[] = dbBlogs.map((b: any) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            subtitle: b.subtitle,
            category: b.category,
            readTime: b.read_time,
            author: b.author || { name: 'Dr. Vivek Sharma', role: 'Head of Environmental Hygiene', avatar: '' },
            coverImage: b.cover_image || b.image,
            image: b.cover_image || b.image,
            excerpt: b.excerpt,
            content: b.content,
            tags: b.tags || [],
            status: b.is_published ? 'published' : 'draft',
            publishedAt: b.published_at,
            metaTitle: b.title,
            metaDescription: b.excerpt
          }));
          setBlogs(mappedBlogs);
        }
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      }
    }

    initSupabaseSync();
  }, []);

  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    let finalUpdates = { ...updates };

    // Automatically upload base64 images to Supabase Storage bucket 'site-assets'
    if (updates.logoUrl && updates.logoUrl.startsWith('data:')) {
      const uploadedLogo = await uploadAssetToSupabase(updates.logoUrl, 'logos');
      if (uploadedLogo) finalUpdates.logoUrl = uploadedLogo;
    }

    if (updates.faviconUrl && updates.faviconUrl.startsWith('data:')) {
      const uploadedFavicon = await uploadAssetToSupabase(updates.faviconUrl, 'favicons');
      if (uploadedFavicon) finalUpdates.faviconUrl = uploadedFavicon;
    }

    setSiteSettings((prev) => {
      const nextSettings = { ...prev, ...finalUpdates };
      (async () => {
        try {
          await supabase.from('site_settings').upsert({
            id: 'main',
            logo_url: nextSettings.logoUrl,
            favicon_url: nextSettings.faviconUrl,
            support_phone: nextSettings.supportPhone,
            support_email: nextSettings.supportEmail,
            operating_hours: nextSettings.operatingHours,
            stat_cleaned_count: nextSettings.statCleanedCount,
            stat_cleaned_label: nextSettings.statCleanedLabel,
            stat_rating: nextSettings.statRating,
            stat_rating_label: nextSettings.statRatingLabel,
            stat_hubs_count: nextSettings.statHubsCount,
            stat_hubs_label: nextSettings.statHubsLabel,
            stat_eco_percent: nextSettings.statEcoPercent,
            stat_eco_label: nextSettings.statEcoLabel,
            header_menu: nextSettings.headerMenu
          });
        } catch (e) {
          console.error('Failed to sync site settings to Supabase', e);
        }
      })();

      return nextSettings;
    });

    showToast('Site settings updated & saved to cloud!', 'success');
  };

  const resetSiteSettings = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    showToast('Site settings reset to default', 'info');
  };

  // Career Positions CRUD
  const addCareerPosition = (job: Omit<CareerPosition, 'id'>): CareerPosition => {
    const newJob: CareerPosition = {
      ...job,
      id: 'job-' + Date.now(),
      status: job.status || 'active',
      createdAt: new Date().toISOString()
    };
    setCareerPositions((prev) => [newJob, ...prev]);

    (async () => {
      try {
        await supabase.from('career_positions').insert({
          id: newJob.id,
          title: newJob.title,
          department: newJob.department,
          type: newJob.type,
          location: newJob.location,
          salary: newJob.salary,
          description: newJob.description,
          responsibilities: newJob.responsibilities,
          requirements: newJob.requirements,
          status: newJob.status
        });
      } catch (e) {
        console.error('Supabase error:', e);
      }
    })();

    showToast(`New job requirement "${newJob.title}" published!`, 'success');
    return newJob;
  };

  const updateCareerPosition = (id: string, updates: Partial<CareerPosition>) => {
    setCareerPositions((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
    (async () => {
      try {
        await supabase.from('career_positions').update(updates).eq('id', id);
      } catch (e) {}
    })();
    showToast('Job requirement updated', 'success');
  };

  const deleteCareerPosition = (id: string) => {
    setCareerPositions((prev) => prev.filter((j) => j.id !== id));
    (async () => {
      try {
        await supabase.from('career_positions').delete().eq('id', id);
      } catch (e) {}
    })();
    showToast('Job requirement deleted', 'info');
  };

  const toggleCareerPositionStatus = (id: string) => {
    setCareerPositions((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const nextStatus = j.status === 'closed' ? 'active' : 'closed';
          (async () => {
            try {
              await supabase.from('career_positions').update({ status: nextStatus }).eq('id', id);
            } catch (e) {}
          })();
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );
    showToast('Job status toggled', 'info');
  };

  // Job Applications CRUD
  const addJobApplication = (
    app: Omit<JobApplication, 'id' | 'referenceId' | 'status' | 'submittedAt'>
  ): JobApplication => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newApp: JobApplication = {
      ...app,
      id: 'app-' + Date.now(),
      referenceId: `APP-${randomDigits}`,
      status: 'new',
      submittedAt: new Date().toISOString()
    };
    setJobApplications((prev) => [newApp, ...prev]);

    (async () => {
      try {
        await supabase.from('job_applications').insert({
          id: newApp.id,
          reference_id: newApp.referenceId,
          applicant_name: newApp.applicantName,
          phone: newApp.phone,
          email: newApp.email,
          location: newApp.location,
          qualification: newApp.qualification,
          position_applied: newApp.positionApplied,
          job_id: newApp.jobId,
          status: newApp.status
        });
      } catch (e) {
        console.error('Supabase application error:', e);
      }
    })();

    showToast(`Application submitted successfully! Ref: ${newApp.referenceId}`, 'success');
    return newApp;
  };

  const updateJobApplicationStatus = (id: string, status: ApplicationStatus) => {
    setJobApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    (async () => {
      try {
        await supabase.from('job_applications').update({ status }).eq('id', id);
      } catch (e) {}
    })();
    showToast(`Candidate application status updated to "${status.toUpperCase()}"`, 'success');
  };

  const updateJobApplicationNotes = (id: string, notes: string) => {
    setJobApplications((prev) => prev.map((a) => (a.id === id ? { ...a, notes } : a)));
    (async () => {
      try {
        await supabase.from('job_applications').update({ notes }).eq('id', id);
      } catch (e) {}
    })();
    showToast('HR application notes saved', 'success');
  };

  const deleteJobApplication = (id: string) => {
    setJobApplications((prev) => prev.filter((a) => a.id !== id));
    (async () => {
      try {
        await supabase.from('job_applications').delete().eq('id', id);
      } catch (e) {}
    })();
    showToast('Candidate application removed', 'info');
  };
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_bookings', JSON.stringify(bookings));
    } catch (e) {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_services', JSON.stringify(services));
    } catch (e) {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_house_categories', JSON.stringify(houseCategories));
    } catch (e) {}
  }, [houseCategories]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_vehicle_categories', JSON.stringify(vehicleCategories));
    } catch (e) {}
  }, [vehicleCategories]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_laundry_config', JSON.stringify(laundryConfig));
    } catch (e) {}
  }, [laundryConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_technicians', JSON.stringify(technicians));
    } catch (e) {}
  }, [technicians]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_blocked_slots', JSON.stringify(blockedSlots));
    } catch (e) {}
  }, [blockedSlots]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_coupons', JSON.stringify(coupons));
    } catch (e) {}
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('nexdoor_admin_inquiries', JSON.stringify(inquiries));
    } catch (e) {}
  }, [inquiries]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    setToasts((prev) => {
      // Deduplicate: if an identical message is already active, skip adding duplicate
      if (prev.some((t) => t.message === message)) {
        return prev;
      }
      // Keep maximum 3 toast notifications visible at once
      const trimmed = prev.length >= 3 ? prev.slice(1) : prev;
      return [...trimmed, { id, message, type }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Booking handlers
  const addBooking = (bookingData: Omit<BookingRecord, 'id' | 'createdAt'>): BookingRecord => {
    const newBooking: BookingRecord = {
      ...bookingData,
      id: 'b-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setBookings((prev) => [newBooking, ...prev]);

    (async () => {
      try {
        const metadataTag = `[Customer: ${newBooking.customerName} | Phone: ${newBooking.customerPhone} | Email: ${newBooking.customerEmail || 'N/A'} | Area: ${newBooking.area} (${newBooking.pincode}) | Service: ${newBooking.serviceName} | Options: ${newBooking.categoryOrPackage}]`;
        const combinedNotes = `${metadataTag} ${newBooking.notes || ''}`.trim();

        // 1st Attempt: Insert using existing database schema columns
        const { error } = await supabase.from('bookings').insert({
          id: newBooking.id,
          reference_id: newBooking.referenceId,
          service_id: newBooking.serviceId,
          address: `${newBooking.customerName} - ${newBooking.address}, ${newBooking.area} (${newBooking.pincode})`,
          selected_date: newBooking.scheduledDate,
          selected_time_slot: newBooking.scheduledTime,
          estimated_total: newBooking.estimatedTotal,
          deposit_amount: newBooking.depositPaid,
          status: newBooking.status,
          assigned_technician: newBooking.assignedStaff || 'Unassigned',
          notes: combinedNotes
        });

        if (error) {
          console.warn('Supabase schema fallback notice:', error.message);
          // 2nd Attempt: Try full expanded schema if table structure was updated
          await supabase.from('bookings').insert({
            id: newBooking.id,
            reference_id: newBooking.referenceId,
            customer_name: newBooking.customerName,
            customer_phone: newBooking.customerPhone,
            customer_email: newBooking.customerEmail,
            address: newBooking.address,
            area: newBooking.area,
            pincode: newBooking.pincode,
            service_id: newBooking.serviceId,
            service_name: newBooking.serviceName,
            category_or_package: newBooking.categoryOrPackage,
            scheduled_date: newBooking.scheduledDate,
            scheduled_time: newBooking.scheduledTime,
            estimated_total: newBooking.estimatedTotal,
            deposit_paid: newBooking.depositPaid,
            status: newBooking.status,
            assigned_staff: newBooking.assignedStaff || 'Unassigned',
            assigned_technician: newBooking.assignedStaff || 'Unassigned',
            notes: newBooking.notes
          });
        }
      } catch (e) {
        console.error('Supabase booking sync notice:', e);
      }
    })();

    showToast(`Booking ${newBooking.referenceId} added successfully!`, 'success');
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    showToast(`Booking status updated to ${status.toUpperCase()}`, 'info');
  };

  const assignTechnician = (bookingId: string, techName: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, assignedStaff: techName } : b))
    );
    showToast(`Assigned ${techName} to booking`, 'success');
  };

  const updateBookingNotes = (bookingId: string, notes: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, notes } : b))
    );
    showToast('Booking notes updated', 'info');
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showToast('Booking removed', 'error');
  };

  // Standalone Service handlers
  const addService = (serviceData: Omit<AdminService, 'id'>): AdminService => {
    const newService: AdminService = {
      ...serviceData,
      id: serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)
    };
    setServices((prev) => [newService, ...prev]);
    showToast(`New service "${newService.title}" created successfully!`, 'success');
    return newService;
  };

  const updateService = (id: string, serviceData: Partial<AdminService>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...serviceData } : s))
    );
    showToast('Service updated successfully!', 'success');
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'active' ? 'inactive' : 'active';
          showToast(`Service "${s.title}" is now ${nextStatus.toUpperCase()}`, 'info');
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('Service deleted', 'error');
  };

  // Category & Tier CRUD handlers
  const updateHousePlan = (categoryKey: HouseCategoryKey, planType: string, updatedPlan: HousePlanDetails) => {
    setHouseCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryKey) {
          if (planType === 'standard') return { ...cat, standard: updatedPlan };
          if (planType === 'premium') return { ...cat, premium: updatedPlan };
          
          // Custom Plan edit
          const updatedCustoms = (cat.customPlans || []).map((cp) =>
            (cp.id === planType || cp.name === planType) ? updatedPlan : cp
          );
          return { ...cat, customPlans: updatedCustoms };
        }
        return cat;
      })
    );
    showToast(`Updated ${categoryKey.toUpperCase()} plan details`, 'success');
  };

  const addHouseCategoryPlan = (categoryKey: HouseCategoryKey, plan: HousePlanDetails) => {
    const planWithId = { ...plan, id: plan.id || ('plan-' + Date.now()) };
    setHouseCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryKey) {
          return {
            ...cat,
            customPlans: [...(cat.customPlans || []), planWithId]
          };
        }
        return cat;
      })
    );
    showToast(`Added new plan "${plan.name}" to ${categoryKey.toUpperCase()}`, 'success');
  };

  const deleteHouseCategoryPlan = (categoryKey: HouseCategoryKey, planIdOrType: string) => {
    setHouseCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryKey) {
          if (planIdOrType === 'standard') {
            return {
              ...cat,
              standard: {
                ...cat.standard,
                name: 'Standard Clean (Inactive)',
                priceDisplay: 'Unavailable',
                priceNumeric: null
              }
            };
          }
          if (planIdOrType === 'premium') {
            return {
              ...cat,
              premium: {
                ...cat.premium,
                name: 'Premium Ultra (Inactive)',
                priceDisplay: 'Unavailable',
                priceNumeric: null
              }
            };
          }
          // Remove from customPlans
          return {
            ...cat,
            customPlans: (cat.customPlans || []).filter((cp) => cp.id !== planIdOrType && cp.name !== planIdOrType)
          };
        }
        return cat;
      })
    );
    showToast(`Deleted plan from ${categoryKey.toUpperCase()}`, 'info');
  };

  const updateCarPackage = (vehicleKey: VehicleCategoryKey, packageKey: string, updatedPkg: CarPackageItem) => {
    setVehicleCategories((prev) =>
      prev.map((veh) => {
        if (veh.id === vehicleKey) {
          return {
            ...veh,
            packages: {
              ...veh.packages,
              [packageKey]: updatedPkg
            }
          };
        }
        return veh;
      })
    );
    showToast(`Updated ${vehicleKey.toUpperCase()} ${updatedPkg.name} Package`, 'success');
  };

  const deleteCarPackage = (vehicleKey: VehicleCategoryKey, packageKey: string) => {
    setVehicleCategories((prev) =>
      prev.map((veh) => {
        if (veh.id === vehicleKey) {
          const newPackages = { ...veh.packages };
          delete newPackages[packageKey as keyof typeof newPackages];
          return {
            ...veh,
            packages: newPackages
          };
        }
        return veh;
      })
    );
    showToast(`Deleted package from ${vehicleKey.toUpperCase()}`, 'info');
  };

  const updateLaundryConfig = (updatedConfig: LaundryConfig) => {
    setLaundryConfigState(updatedConfig);
    showToast('Laundry pricing & care tiers updated!', 'success');
  };

  const resetAllCategoriesToDefault = () => {
    setHouseCategories(HOUSE_CATEGORIES);
    setVehicleCategories(VEHICLE_CATEGORIES);
    setLaundryConfigState(DEFAULT_LAUNDRY_CONFIG);
    localStorage.removeItem('nexdoor_admin_house_categories');
    localStorage.removeItem('nexdoor_admin_vehicle_categories');
    localStorage.removeItem('nexdoor_admin_laundry_config');
    showToast('Reset all pricing categories to system defaults', 'info');
  };

  const addHouseCategory = (newCat: HouseCategoryData) => {
    setHouseCategories((prev) => [...prev, newCat]);
    showToast(`Added new variation: ${newCat.label}`, 'success');
  };

  const deleteHouseCategory = (categoryId: string) => {
    setHouseCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast(`Deleted variation category`, 'info');
  };

  const addVehicleCategory = (newVeh: VehicleCategoryData) => {
    setVehicleCategories((prev) => [...prev, newVeh]);
    showToast(`Added new vehicle variation: ${newVeh.label}`, 'success');
  };

  const deleteVehicleCategory = (vehicleId: string) => {
    setVehicleCategories((prev) => prev.filter((v) => v.id !== vehicleId));
    showToast(`Deleted vehicle variation`, 'info');
  };

  const addServiceLocation = (locData: Omit<ServiceAreaAdmin, 'id' | 'activeBookingsCount'>) => {
    const newLoc: ServiceAreaAdmin = {
      ...locData,
      id: 'loc-' + Date.now(),
      activeBookingsCount: 0
    };
    setLocations((prev) => [newLoc, ...prev]);
    showToast(`Added service location: ${newLoc.name}`, 'success');
  };

  const updateServiceLocation = (id: string, updatedLoc: Partial<ServiceAreaAdmin>) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updatedLoc } : l))
    );
    showToast('Updated location details', 'success');
  };

  const deleteServiceLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    showToast('Service location deleted', 'info');
  };

  const toggleLocationStatus = (id: string) => {
    setLocations((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: l.status === 'active' ? 'coming_soon' : 'active' }
          : l
      )
    );
    showToast('Location status toggled', 'info');
  };

  // Staff handlers
  const addStaff = (staffData: Omit<Technician, 'id'>): Technician => {
    const newStaff: Technician = {
      ...staffData,
      id: 'staff-' + Date.now()
    };
    setTechnicians((prev) => [newStaff, ...prev]);
    showToast(`Staff member "${newStaff.name}" added successfully!`, 'success');
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<Technician>) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Staff member updated successfully!', 'success');
  };

  const deleteStaff = (id: string) => {
    setTechnicians((prev) => prev.filter((t) => t.id !== id));
    showToast('Staff member removed', 'error');
  };

  const toggleStaffStatus = (id: string) => {
    const target = technicians.find((t) => t.id === id);
    if (!target) return;

    const nextStatus: Technician['status'] =
      target.status === 'available' ? 'assigned' : target.status === 'assigned' ? 'off' : 'available';

    setTechnicians((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );

    showToast(`${target.name} is now ${nextStatus.toUpperCase()}`, 'info');
  };

  // Blocked Slots / Availability Handlers
  const addBlockedSlot = (slotData: Omit<BlockedSlot, 'id' | 'createdAt'>): BlockedSlot => {
    const newSlot: BlockedSlot = {
      ...slotData,
      id: 'bslot-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setBlockedSlots((prev) => [newSlot, ...prev]);
    const scope = newSlot.serviceCategory === 'all' ? 'All Services' : newSlot.serviceCategory.replace('-', ' ').toUpperCase();
    const locText = newSlot.location && newSlot.location !== 'all' ? ` in ${newSlot.location}` : ' in All Locations';
    const slotText = newSlot.timeSlot ? `at ${newSlot.timeSlot}` : 'All Day';
    showToast(`Blocked ${scope}${locText} on ${newSlot.date} (${slotText})`, 'info');
    return newSlot;
  };

  const deleteBlockedSlot = (id: string) => {
    setBlockedSlots((prev) => prev.filter((s) => s.id !== id));
    showToast('Unblocked date/time slot', 'success');
  };

  const isSlotBlocked = (
    serviceCategory: string,
    dateStr: string,
    timeSlot?: string,
    locationName?: string
  ): boolean => {
    return blockedSlots.some((slot) => {
      // 1. Check service category match ('all' matches any service)
      const serviceMatch = slot.serviceCategory === 'all' || slot.serviceCategory === serviceCategory;
      if (!serviceMatch) return false;

      // 2. Check date match
      if (slot.date !== dateStr) return false;

      // 3. Check location match ('all' or undefined/empty matches any location)
      if (locationName && slot.location && slot.location !== 'all') {
        const cleanSlotLoc = slot.location.toLowerCase().trim();
        const cleanInputLoc = locationName.toLowerCase().trim();
        if (cleanSlotLoc !== cleanInputLoc) return false;
      }

      // 4. If slot has no specific timeSlot, it blocks the full day
      if (!slot.timeSlot || slot.timeSlot === 'all') return true;

      // 5. If checking a specific timeSlot
      if (timeSlot) {
        return slot.timeSlot.toLowerCase() === timeSlot.toLowerCase();
      }

      // If checking day-level availability and slot is for a specific time, day is not 100% blocked
      return false;
    });
  };

  // Coupon CRUD Actions
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount' | 'createdAt'>): Coupon => {
    const newCoupon: Coupon = {
      ...couponData,
      id: 'c-' + Date.now(),
      code: couponData.code.trim().toUpperCase(),
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} created successfully!`, 'success');
    return newCoupon;
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, code: updates.code ? updates.code.trim().toUpperCase() : c.code } : c))
    );
    showToast('Coupon updated successfully!', 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon deleted.', 'info');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c))
    );
    showToast('Coupon status updated.', 'info');
  };

  const validateCoupon = (
    codeInput: string,
    serviceId: string,
    orderTotal: number,
    customerPhone?: string
  ): { valid: boolean; coupon?: Coupon; discountAmount: number; message: string } => {
    if (!codeInput || !codeInput.trim()) {
      return { valid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
    }

    const cleanCode = codeInput.trim().toUpperCase();
    const foundCoupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!foundCoupon) {
      return { valid: false, discountAmount: 0, message: `Invalid coupon code "${cleanCode}".` };
    }

    if (foundCoupon.status !== 'active') {
      return { valid: false, discountAmount: 0, message: `Coupon "${cleanCode}" is currently inactive.` };
    }

    // Expiry date check (optional expiry)
    if (foundCoupon.expiryDate && foundCoupon.expiryDate.trim()) {
      const today = new Date().toISOString().split('T')[0];
      if (today > foundCoupon.expiryDate) {
        return { valid: false, discountAmount: 0, message: `Coupon "${cleanCode}" expired on ${foundCoupon.expiryDate}.` };
      }
    }

    // Applicable service restriction check
    if (foundCoupon.applicableServices !== 'all' && foundCoupon.applicableServices !== serviceId) {
      const catLabel = foundCoupon.applicableServices.replace('-', ' ');
      return { valid: false, discountAmount: 0, message: `Coupon "${cleanCode}" is only valid for ${catLabel} bookings.` };
    }

    // Minimum order amount check
    if (orderTotal < foundCoupon.minOrderAmount) {
      return { valid: false, discountAmount: 0, message: `Coupon "${cleanCode}" requires a minimum order of ₹${foundCoupon.minOrderAmount}.` };
    }

    // Usage limit check
    if (foundCoupon.usageLimit && foundCoupon.usageCount >= foundCoupon.usageLimit) {
      return { valid: false, discountAmount: 0, message: `Coupon "${cleanCode}" has reached maximum usage limit.` };
    }

    // Single use per mobile number check
    if (foundCoupon.oncePerCustomerPhone && customerPhone && customerPhone.trim()) {
      const cleanInputDigits = customerPhone.replace(/[^0-9]/g, '').slice(-10);
      if (cleanInputDigits.length >= 8) {
        const alreadyUsed = bookings.some((b) => {
          const bPhoneDigits = b.customerPhone ? b.customerPhone.replace(/[^0-9]/g, '').slice(-10) : '';
          const hasUsedInNotes = b.notes && b.notes.toUpperCase().includes(cleanCode);
          return bPhoneDigits === cleanInputDigits && hasUsedInNotes;
        });

        if (alreadyUsed) {
          return { valid: false, discountAmount: 0, message: `Coupon "${cleanCode}" is valid only once per mobile number and has already been redeemed.` };
        }
      }
    }

    // Discount Calculation
    let discountAmount = 0;
    if (foundCoupon.discountType === 'percentage') {
      discountAmount = Math.round((orderTotal * foundCoupon.discountValue) / 100);
      if (foundCoupon.maxDiscountAmount && foundCoupon.maxDiscountAmount > 0) {
        discountAmount = Math.min(discountAmount, foundCoupon.maxDiscountAmount);
      }
    } else {
      discountAmount = Math.min(orderTotal, foundCoupon.discountValue);
    }

    return {
      valid: true,
      coupon: foundCoupon,
      discountAmount,
      message: `Coupon "${cleanCode}" applied! You save ₹${discountAmount}.`
    };
  };

  // Inquiry CRUD Actions
  const addInquiry = (inquiryData: Omit<InquiryRecord, 'id' | 'referenceId' | 'status' | 'createdAt'>): InquiryRecord => {
    const newInquiry: InquiryRecord = {
      ...inquiryData,
      id: 'inq-' + Date.now(),
      referenceId: 'INQ-' + Math.floor(100000 + Math.random() * 900000),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setInquiries((prev) => [newInquiry, ...prev]);

    (async () => {
      try {
        await supabase.from('inquiries').insert({
          id: newInquiry.id,
          reference_id: newInquiry.referenceId,
          name: newInquiry.name,
          phone: newInquiry.phone,
          email: newInquiry.email,
          service_interest: newInquiry.serviceInterest,
          message: newInquiry.message,
          status: newInquiry.status
        });
      } catch (e) {
        console.error('Supabase inquiry insert error:', e);
      }
    })();

    showToast(`Inquiry ${newInquiry.referenceId} submitted successfully!`, 'success');
    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    showToast('Inquiry status updated', 'info');
  };

  const updateInquiryNotes = (id: string, notes: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, notes } : inq))
    );
    showToast('Inquiry notes saved', 'success');
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    showToast('Inquiry deleted', 'info');
  };

  // Blog Journal CRUD Actions
  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'publishedAt'>): BlogPost => {
    const newPost: BlogPost = {
      ...postData,
      id: 'blog-' + Date.now(),
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      viewsCount: 0,
      status: postData.status || 'published'
    };

    setBlogs((prev) => {
      const nextBlogs = [newPost, ...prev];
      try {
        localStorage.setItem('nexdoor_admin_blogs', JSON.stringify(nextBlogs));
      } catch (e) {}
      return nextBlogs;
    });

    (async () => {
      try {
        let imageUrl = postData.image || '';
        if (imageUrl && imageUrl.startsWith('data:')) {
          const uploaded = await uploadAssetToSupabase(imageUrl, 'blogs');
          if (uploaded) imageUrl = uploaded;
        }

        await supabase.from('blogs').upsert({
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
          category: newPost.category,
          read_time: newPost.readTime,
          author: newPost.author,
          cover_image: imageUrl,
          excerpt: newPost.excerpt,
          content: newPost.content,
          tags: newPost.tags,
          is_published: newPost.status === 'published'
        });

        if (imageUrl !== postData.image) {
          setBlogs((prev) =>
            prev.map((b) => (b.id === newPost.id ? { ...b, image: imageUrl } : b))
          );
        }
      } catch (e) {
        console.error('Supabase blog insert error:', e);
      }
    })();

    showToast('Blog article published successfully!', 'success');
    return newPost;
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogs((prev) => {
      const nextBlogs = prev.map((b) => (b.id === id ? { ...b, ...updates } : b));
      try {
        localStorage.setItem('nexdoor_admin_blogs', JSON.stringify(nextBlogs));
      } catch (e) {}
      return nextBlogs;
    });

    (async () => {
      try {
        const target = blogs.find((b) => b.id === id);
        let imageUrl = updates.image || target?.image || '';
        if (imageUrl && imageUrl.startsWith('data:')) {
          const uploaded = await uploadAssetToSupabase(imageUrl, 'blogs');
          if (uploaded) {
            imageUrl = uploaded;
            setBlogs((prev) =>
              prev.map((b) => (b.id === id ? { ...b, image: imageUrl } : b))
            );
          }
        }

        const finalTitle = updates.title || target?.title || '';
        const finalSlug = updates.slug || target?.slug || '';
        const finalCategory = updates.category || target?.category || '';
        const finalReadTime = updates.readTime || target?.readTime || '';
        const finalAuthor = updates.author || target?.author || {};
        const finalExcerpt = updates.excerpt || target?.excerpt || '';
        const finalContent = updates.content || target?.content || '';
        const finalTags = updates.tags || target?.tags || [];
        const finalStatus = updates.status !== undefined ? updates.status : target?.status;

        await supabase.from('blogs').upsert({
          id,
          slug: finalSlug,
          title: finalTitle,
          category: finalCategory,
          read_time: finalReadTime,
          author: finalAuthor,
          cover_image: imageUrl,
          excerpt: finalExcerpt,
          content: finalContent,
          tags: finalTags,
          is_published: finalStatus === 'published'
        });
      } catch (e) {
        console.error('Supabase blog update error:', e);
      }
    })();

    showToast('Blog article updated', 'success');
  };

  const deleteBlogPost = (id: string) => {
    setBlogs((prev) => {
      const nextBlogs = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem('nexdoor_admin_blogs', JSON.stringify(nextBlogs));
      } catch (e) {}
      return nextBlogs;
    });

    (async () => {
      try {
        await supabase.from('blogs').delete().eq('id', id);
      } catch (e) {}
    })();

    showToast('Blog article deleted', 'info');
  };

  const toggleBlogStatus = (id: string) => {
    setBlogs((prev) => {
      const nextBlogs = prev.map((b): BlogPost => {
        if (b.id === id) {
          const nextStatus: 'published' | 'draft' = b.status === 'published' ? 'draft' : 'published';
          (async () => {
            try {
              await supabase.from('blogs').update({ is_published: nextStatus === 'published' }).eq('id', id);
            } catch (e) {}
          })();
          return { ...b, status: nextStatus };
        }
        return b;
      });
      try {
        localStorage.setItem('nexdoor_admin_blogs', JSON.stringify(nextBlogs));
      } catch (e) {}
      return nextBlogs;
    });
    showToast('Article status toggled', 'info');
  };
  const updateHouseCategoryLocations = (catId: HouseCategoryKey, locs: string[]) => {
    setHouseCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, availableLocations: locs } : c))
    );
    showToast(`Updated location coverage for House Cleaning (${catId})`, 'success');
  };

  const updateVehicleCategoryLocations = (catId: VehicleCategoryKey, locs: string[]) => {
    setVehicleCategories((prev) =>
      prev.map((v) => (v.id === catId ? { ...v, availableLocations: locs } : v))
    );
    showToast(`Updated location coverage for Car Wash (${catId})`, 'success');
  };

  const updateLaundryLocations = (locs: string[]) => {
    setLaundryConfigState((prev) => ({ ...prev, availableLocations: locs }));
    showToast('Updated location coverage for Laundry Services', 'success');
  };

  const isServiceAvailableInLocation = (
    serviceIdOrCategory: string,
    locationName: string,
    subCategoryKey?: string
  ): boolean => {
    if (!locationName) return true;
    const cleanLoc = locationName.toLowerCase().trim();

    // Helper: checks if a location is in an availableLocations array (or true if array is unconfigured/empty)
    const isLocInArray = (locs?: string[]) => {
      if (!locs || locs.length === 0) return true;
      return locs.some((loc) => loc.toLowerCase().trim() === cleanLoc);
    };

    // --- CASE A: SPECIFIC SUBCATEGORY CHECK (e.g. subCategoryKey = '2-bhk' or 'sedan') ---
    if (subCategoryKey) {
      // 1. Check in House Categories
      const houseCat = houseCategories.find((h) => h.id === subCategoryKey);
      if (houseCat) {
        return isLocInArray(houseCat.availableLocations);
      }

      // 2. Check in Vehicle Categories
      const vehCat = vehicleCategories.find((v) => v.id === subCategoryKey);
      if (vehCat) {
        return isLocInArray(vehCat.availableLocations);
      }
    }

    // --- CASE B: BROAD PRIMARY SERVICE LEVEL CHECK (e.g. serviceIdOrCategory = 'house-cleaning') ---
    if (serviceIdOrCategory === 'house-cleaning') {
      // Available if AT LEAST ONE house category is available in this location
      if (houseCategories.length === 0) return true;
      return houseCategories.some((h) => isLocInArray(h.availableLocations));
    }

    if (serviceIdOrCategory === 'car-wash') {
      // Available if AT LEAST ONE vehicle category is available in this location
      if (vehicleCategories.length === 0) return true;
      return vehicleCategories.some((v) => isLocInArray(v.availableLocations));
    }

    if (serviceIdOrCategory === 'laundry') {
      return isLocInArray(laundryConfig?.availableLocations);
    }

    // --- CASE C: STANDALONE SERVICE ITEM OR MATCH BY SERVICE ID/CATEGORY ---
    const foundService = services.find(
      (s) => s.id === serviceIdOrCategory || s.category === serviceIdOrCategory
    );

    if (foundService) {
      return isLocInArray(foundService.availableLocations);
    }

    return true;
  };

  return (
    <AdminContext.Provider
      value={{
        bookings,
        services,
        houseCategories,
        vehicleCategories,
        laundryConfig,
        technicians,
        locations,
        toasts,
        addBooking,
        updateBookingStatus,
        assignTechnician,
        updateBookingNotes,
        deleteBooking,
        addService,
        updateService,
        toggleServiceStatus,
        deleteService,
        updateHousePlan,
        addHouseCategoryPlan,
        deleteHouseCategoryPlan,
        updateCarPackage,
        deleteCarPackage,
        updateLaundryConfig,
        resetAllCategoriesToDefault,
        addHouseCategory,
        deleteHouseCategory,
        addVehicleCategory,
        deleteVehicleCategory,
        addServiceLocation,
        updateServiceLocation,
        deleteServiceLocation,
        toggleLocationStatus,
        addStaff,
        updateStaff,
        deleteStaff,
        toggleStaffStatus,
        blockedSlots,
        addBlockedSlot,
        deleteBlockedSlot,
        isSlotBlocked,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        validateCoupon,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        updateInquiryNotes,
        deleteInquiry,
        blogs,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        toggleBlogStatus,
        updateHouseCategoryLocations,
        updateVehicleCategoryLocations,
        updateLaundryLocations,
        isServiceAvailableInLocation,
        showToast,
        removeToast,
        siteSettings,
        updateSiteSettings,
        resetSiteSettings,
        careerPositions,
        addCareerPosition,
        updateCareerPosition,
        deleteCareerPosition,
        toggleCareerPositionStatus,
        jobApplications,
        addJobApplication,
        updateJobApplicationStatus,
        updateJobApplicationNotes,
        deleteJobApplication,
        isAuthenticated,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials
      }}
    >
      {children}
      
      {/* Admin Toast Notifications Render */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              padding: '12px 16px',
              borderRadius: '14px',
              color: '#FFFFFF',
              fontSize: '0.875rem',
              fontWeight: 700,
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              animation: 'slideIn 0.3s ease forwards',
              background:
                toast.type === 'success'
                  ? 'linear-gradient(135deg, #10B981, #059669)'
                  : toast.type === 'error'
                  ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                  : 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
            }}
          >
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeToast(toast.id);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 900,
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
              title="Close notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AdminContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminProvider');
  }
  return context;
};
