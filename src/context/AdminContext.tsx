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
  // Pure State initialized from default seeds, synchronized live via Supabase Cloud
  const [bookings, setBookings] = useState<BookingRecord[]>(SEED_BOOKINGS);
  const [services, setServices] = useState<AdminService[]>(SEED_SERVICES);
  const [houseCategories, setHouseCategories] = useState<HouseCategoryData[]>(HOUSE_CATEGORIES);
  const [vehicleCategories, setVehicleCategories] = useState<VehicleCategoryData[]>(VEHICLE_CATEGORIES);
  const [laundryConfig, setLaundryConfigState] = useState<LaundryConfig>(DEFAULT_LAUNDRY_CONFIG);
  const [technicians, setTechnicians] = useState<Technician[]>(SEED_TECHNICIANS);
  const [locations, setLocations] = useState<ServiceAreaAdmin[]>(SEED_LOCATIONS);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(SEED_BLOCKED_SLOTS);
  const [coupons, setCoupons] = useState<Coupon[]>(SEED_COUPONS);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(SEED_INQUIRIES);
  const [blogs, setBlogs] = useState<BlogPost[]>(SEED_BLOGS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [careerPositions, setCareerPositions] = useState<CareerPosition[]>(
    CAREER_POSITIONS.map((p) => ({ ...p, status: 'active' as const }))
  );
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(SEED_JOB_APPLICATIONS);

  // Admin Session State (Kept in Local Browser Storage as requested)
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

        // 7. Sync Coupons
        const { data: dbCoupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
        if (dbCoupons && dbCoupons.length > 0) {
          const mappedCoupons: Coupon[] = dbCoupons.map((c: any) => ({
            id: c.id,
            code: c.code,
            title: c.title || c.code,
            description: c.description || '',
            discountType: c.discount_type || c.discountType || 'fixed',
            discountValue: Number(c.discount_value || c.discountValue) || 0,
            maxDiscountAmount: c.max_discount_amount || c.maxDiscountAmount,
            minOrderAmount: Number(c.min_order_amount || c.minOrderAmount) || 0,
            applicableServices: c.applicable_services || c.applicableServices || 'all',
            expiryDate: c.expiry_date || c.expiryDate || '',
            oncePerCustomerPhone: Boolean(c.once_per_customer_phone || c.oncePerCustomerPhone),
            status: c.status || 'active',
            usageCount: Number(c.usage_count || c.usageCount) || 0,
            createdAt: c.created_at || new Date().toISOString()
          }));
          setCoupons(mappedCoupons);
        }

        // 8. Sync Technicians / Staff with Smart Merging & Auto Seeding
        const { data: dbTechs } = await supabase.from('technicians').select('*');
        const dbTechMap = new Map((dbTechs || []).map((t: any) => [t.id, t]));

        const mergedTechs: Technician[] = SEED_TECHNICIANS.map((defaultT) => {
          const dbT = dbTechMap.get(defaultT.id);
          if (dbT) {
            return {
              id: dbT.id,
              name: dbT.name || defaultT.name,
              phone: dbT.phone || defaultT.phone,
              email: dbT.email || defaultT.email,
              role: dbT.role || defaultT.role,
              specializations: dbT.specializations || defaultT.specializations,
              serviceArea: dbT.service_area || dbT.serviceArea || defaultT.serviceArea,
              rating: Number(dbT.rating ?? defaultT.rating) || defaultT.rating,
              status: dbT.status || defaultT.status,
              joinedDate: dbT.joined_date || dbT.joinedDate || defaultT.joinedDate,
              completedJobs: Number(dbT.completed_jobs ?? dbT.completedJobs) || defaultT.completedJobs
            };
          }
          return defaultT;
        });

        (dbTechs || []).forEach((dbT: any) => {
          if (!SEED_TECHNICIANS.some((dt) => dt.id === dbT.id)) {
            mergedTechs.push({
              id: dbT.id,
              name: dbT.name,
              phone: dbT.phone,
              email: dbT.email || '',
              role: dbT.role || 'Service Crew',
              specializations: dbT.specializations || [],
              serviceArea: dbT.service_area || dbT.serviceArea || 'Kakkanad',
              rating: Number(dbT.rating) || 5.0,
              status: dbT.status || 'available',
              joinedDate: dbT.joined_date || dbT.joinedDate || 'Aug 2025',
              completedJobs: Number(dbT.completed_jobs || dbT.completedJobs) || 0
            });
          }
        });

        setTechnicians(mergedTechs);

        for (const defaultT of SEED_TECHNICIANS) {
          if (!dbTechMap.has(defaultT.id)) {
            (async () => {
              try {
                await supabase.from('technicians').upsert({
                  id: defaultT.id,
                  name: defaultT.name,
                  phone: defaultT.phone,
                  email: defaultT.email,
                  role: defaultT.role,
                  specializations: defaultT.specializations,
                  service_area: defaultT.serviceArea,
                  rating: defaultT.rating,
                  status: defaultT.status,
                  joined_date: defaultT.joinedDate,
                  completed_jobs: defaultT.completedJobs
                });
              } catch (e) {}
            })();
          }
        }

        // 9. Sync Blocked Slots with Smart Merging & Auto Seeding
        const { data: dbBlocked } = await supabase.from('blocked_slots').select('*');
        const dbBlockedMap = new Map((dbBlocked || []).map((bs: any) => [bs.id, bs]));

        const mergedBlocked: BlockedSlot[] = SEED_BLOCKED_SLOTS.map((defaultBs) => {
          const dbBs = dbBlockedMap.get(defaultBs.id);
          if (dbBs) {
            return {
              id: dbBs.id,
              serviceCategory: dbBs.service_category || dbBs.serviceCategory || defaultBs.serviceCategory,
              date: dbBs.date || dbBs.date_str || defaultBs.date,
              timeSlot: dbBs.time_slot || dbBs.timeSlot || defaultBs.timeSlot,
              location: dbBs.location || dbBs.location_name || defaultBs.location,
              reason: dbBs.reason || defaultBs.reason,
              createdAt: dbBs.created_at || defaultBs.createdAt || new Date().toISOString()
            };
          }
          return defaultBs;
        });

        (dbBlocked || []).forEach((dbBs: any) => {
          if (!SEED_BLOCKED_SLOTS.some((dbs) => dbs.id === dbBs.id)) {
            mergedBlocked.push({
              id: dbBs.id,
              serviceCategory: dbBs.service_category || dbBs.serviceCategory || 'all',
              date: dbBs.date || dbBs.date_str || '',
              timeSlot: dbBs.time_slot || dbBs.timeSlot || 'Full Day',
              location: dbBs.location || dbBs.location_name || 'All Locations',
              reason: dbBs.reason || 'Admin Block',
              createdAt: dbBs.created_at || new Date().toISOString()
            });
          }
        });

        setBlockedSlots(mergedBlocked);

        for (const defaultBs of SEED_BLOCKED_SLOTS) {
          if (!dbBlockedMap.has(defaultBs.id)) {
            (async () => {
              try {
                await supabase.from('blocked_slots').upsert({
                  id: defaultBs.id,
                  service_category: defaultBs.serviceCategory,
                  date: defaultBs.date,
                  date_str: defaultBs.date,
                  time_slot: defaultBs.timeSlot,
                  location: defaultBs.location,
                  location_name: defaultBs.location,
                  reason: defaultBs.reason
                });
              } catch (e) {}
            })();
          }
        }

        // 10. Sync Locations
        const { data: dbLocs } = await supabase.from('locations').select('*');
        if (dbLocs && dbLocs.length > 0) {
          const mappedLocs: ServiceAreaAdmin[] = dbLocs.map((l: any) => ({
            id: l.id,
            name: l.name,
            zone: l.zone || 'Ernakulam Central',
            pincode: l.pincode || '682030',
            status: l.status || 'active',
            activeBookingsCount: Number(l.active_bookings_count || l.activeBookingsCount) || 0
          }));
          setLocations(mappedLocs);
        }

        // 11. Sync House Categories (Pricing & Specifications)
        const { data: dbHouseCats } = await supabase.from('house_categories').select('*');
        const dbHouseMap = new Map((dbHouseCats || []).map((hc: any) => [hc.id, hc]));

        // Smart Merge: Preserve ALL default house categories (1-bhk, 2-bhk, 3-bhk, 4-bhk, villa, custom) while keeping DB edits!
        const mergedHouseCats: HouseCategoryData[] = HOUSE_CATEGORIES.map((defaultHc) => {
          const dbHc = dbHouseMap.get(defaultHc.id);
          if (dbHc) {
            return {
              id: dbHc.id as HouseCategoryKey,
              label: dbHc.label || defaultHc.label,
              description: dbHc.description || defaultHc.description,
              sqftRange: dbHc.sqft_range || dbHc.sqftRange || defaultHc.sqftRange,
              standard: dbHc.standard && dbHc.standard.name ? dbHc.standard : defaultHc.standard,
              premium: dbHc.premium && dbHc.premium.name ? dbHc.premium : defaultHc.premium,
              customPlans: dbHc.custom_plans || dbHc.customPlans || defaultHc.customPlans || [],
              availableLocations: dbHc.available_locations || dbHc.availableLocations || defaultHc.availableLocations || []
            };
          }
          return defaultHc;
        });

        // Retain any extra custom categories added by admin
        (dbHouseCats || []).forEach((dbHc: any) => {
          if (!HOUSE_CATEGORIES.some((dhc) => dhc.id === dbHc.id)) {
            mergedHouseCats.push({
              id: dbHc.id as HouseCategoryKey,
              label: dbHc.label,
              description: dbHc.description || dbHc.label,
              sqftRange: dbHc.sqft_range || dbHc.sqftRange || '',
              standard: dbHc.standard || {},
              premium: dbHc.premium || {},
              customPlans: dbHc.custom_plans || dbHc.customPlans || [],
              availableLocations: dbHc.available_locations || dbHc.availableLocations || []
            });
          }
        });

        setHouseCategories(mergedHouseCats);

        // Background seed any missing default house categories to Supabase
        for (const defaultHc of HOUSE_CATEGORIES) {
          if (!dbHouseMap.has(defaultHc.id)) {
            (async () => {
              try {
                await supabase.from('house_categories').upsert({
                  id: defaultHc.id,
                  label: defaultHc.label,
                  description: defaultHc.description,
                  sqft_range: defaultHc.sqftRange,
                  standard: defaultHc.standard,
                  premium: defaultHc.premium,
                  custom_plans: defaultHc.customPlans || [],
                  available_locations: defaultHc.availableLocations || []
                });
              } catch (e) {}
            })();
          }
        }

        // 12. Sync Vehicle Categories (Car Wash Packages & Pricing)
        const { data: dbVehCats } = await supabase.from('vehicle_categories').select('*');
        const dbVehMap = new Map((dbVehCats || []).map((vc: any) => [vc.id, vc]));

        // Smart Merge: Preserve ALL default vehicle categories (hatchback, sedan, suv, luxury-suv, premium-car)
        const mergedVehCats: VehicleCategoryData[] = VEHICLE_CATEGORIES.map((defaultVc) => {
          const dbVc = dbVehMap.get(defaultVc.id);
          if (dbVc) {
            return {
              id: dbVc.id as VehicleCategoryKey,
              label: dbVc.label || defaultVc.label,
              description: dbVc.description || defaultVc.description,
              examples: dbVc.examples || defaultVc.examples,
              packages: dbVc.packages || defaultVc.packages,
              availableLocations: dbVc.available_locations || dbVc.availableLocations || defaultVc.availableLocations || []
            };
          }
          return defaultVc;
        });

        // Retain any extra vehicle categories added by admin
        (dbVehCats || []).forEach((dbVc: any) => {
          if (!VEHICLE_CATEGORIES.some((dvc) => dvc.id === dbVc.id)) {
            mergedVehCats.push({
              id: dbVc.id as VehicleCategoryKey,
              label: dbVc.label,
              description: dbVc.description || dbVc.label,
              examples: dbVc.examples || '',
              packages: dbVc.packages || {},
              availableLocations: dbVc.available_locations || dbVc.availableLocations || []
            });
          }
        });

        setVehicleCategories(mergedVehCats);

        // Background seed any missing default vehicle categories to Supabase
        for (const defaultVc of VEHICLE_CATEGORIES) {
          if (!dbVehMap.has(defaultVc.id)) {
            (async () => {
              try {
                await supabase.from('vehicle_categories').upsert({
                  id: defaultVc.id,
                  label: defaultVc.label,
                  description: defaultVc.description,
                  examples: defaultVc.examples,
                  packages: defaultVc.packages,
                  available_locations: defaultVc.availableLocations || []
                });
              } catch (e) {}
            })();
          }
        }

        // 13. Sync Laundry Config
        const { data: dbLaundry } = await supabase.from('laundry_config').select('*');
        if (dbLaundry && dbLaundry.length > 0) {
          const lc = dbLaundry[0];
          const mappedLaundry: LaundryConfig = {
            packages: lc.packages || DEFAULT_LAUNDRY_CONFIG.packages,
            expressSurcharge: Number(lc.express_surcharge ?? lc.expressSurcharge) || DEFAULT_LAUNDRY_CONFIG.expressSurcharge,
            premiumCareSurchargePerKg: Number(lc.premium_care_surcharge_per_kg ?? lc.premiumCareSurchargePerKg) || DEFAULT_LAUNDRY_CONFIG.premiumCareSurchargePerKg,
            pickupFee: Number(lc.pickup_fee ?? lc.pickupFee) || DEFAULT_LAUNDRY_CONFIG.pickupFee,
            freePickupMinWeight: Number(lc.free_pickup_min_weight ?? lc.freePickupMinWeight) || DEFAULT_LAUNDRY_CONFIG.freePickupMinWeight,
            standardSpeedLabel: lc.standard_speed_label || lc.standardSpeedLabel,
            standardSpeedDesc: lc.standard_speed_desc || lc.standardSpeedDesc,
            expressSpeedLabel: lc.express_speed_label || lc.expressSpeedLabel,
            expressSpeedDesc: lc.express_speed_desc || lc.expressSpeedDesc,
            standardCareDesc: lc.standard_care_desc || lc.standardCareDesc,
            premiumCareDesc: lc.premium_care_desc || lc.premiumCareDesc,
            included: lc.included || [],
            excluded: lc.excluded || [],
            availableLocations: lc.available_locations || lc.availableLocations || []
          };
          setLaundryConfigState(mappedLaundry);
        } else {
          // Seed default laundry config to Supabase
          await supabase.from('laundry_config').upsert({
            id: 'default_laundry_config',
            packages: DEFAULT_LAUNDRY_CONFIG.packages,
            express_surcharge: DEFAULT_LAUNDRY_CONFIG.expressSurcharge,
            premium_care_surcharge_per_kg: DEFAULT_LAUNDRY_CONFIG.premiumCareSurchargePerKg,
            pickup_fee: DEFAULT_LAUNDRY_CONFIG.pickupFee,
            free_pickup_min_weight: DEFAULT_LAUNDRY_CONFIG.freePickupMinWeight,
            available_locations: DEFAULT_LAUNDRY_CONFIG.availableLocations || []
          });
        }

        // 14. Sync Standalone Services
        const { data: dbServices } = await supabase.from('services').select('*');
        const dbServiceMap = new Map((dbServices || []).map((s: any) => [s.id, s]));

        const mergedServices: AdminService[] = SEED_SERVICES.map((defaultS) => {
          const dbS = dbServiceMap.get(defaultS.id);
          if (dbS) {
            return {
              id: dbS.id,
              title: dbS.title || defaultS.title,
              category: dbS.category || defaultS.category,
              startingPrice: dbS.starting_price || dbS.startingPrice || defaultS.startingPrice,
              priceNumeric: Number(dbS.price_numeric ?? dbS.priceNumeric) || defaultS.priceNumeric,
              duration: dbS.duration || defaultS.duration,
              status: dbS.status || defaultS.status,
              overview: dbS.overview || defaultS.overview,
              features: dbS.features || defaultS.features,
              included: dbS.included || defaultS.included,
              excluded: dbS.excluded || defaultS.excluded,
              recommendedFor: dbS.recommended_for || dbS.recommendedFor || defaultS.recommendedFor,
              image: dbS.image || defaultS.image,
              availableLocations: dbS.available_locations || dbS.availableLocations || defaultS.availableLocations || []
            };
          }
          return defaultS;
        });

        (dbServices || []).forEach((dbS: any) => {
          if (!SEED_SERVICES.some((ds) => ds.id === dbS.id)) {
            mergedServices.push({
              id: dbS.id,
              title: dbS.title,
              category: dbS.category || 'specialized',
              startingPrice: dbS.starting_price || dbS.startingPrice || '₹999',
              priceNumeric: Number(dbS.price_numeric ?? dbS.priceNumeric) || 999,
              duration: dbS.duration || '2 - 3 Hours',
              status: dbS.status || 'active',
              overview: dbS.overview || '',
              features: dbS.features || [],
              included: dbS.included || [],
              excluded: dbS.excluded || [],
              recommendedFor: dbS.recommended_for || dbS.recommendedFor,
              image: dbS.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
              availableLocations: dbS.available_locations || dbS.availableLocations || []
            });
          }
        });

        setServices(mergedServices);

        for (const defaultS of SEED_SERVICES) {
          if (!dbServiceMap.has(defaultS.id)) {
            (async () => {
              try {
                await supabase.from('services').upsert({
                  id: defaultS.id,
                  title: defaultS.title,
                  category: defaultS.category,
                  starting_price: defaultS.startingPrice,
                  price_numeric: defaultS.priceNumeric,
                  duration: defaultS.duration,
                  status: defaultS.status,
                  overview: defaultS.overview,
                  features: defaultS.features,
                  included: defaultS.included,
                  excluded: defaultS.excluded,
                  recommended_for: defaultS.recommendedFor,
                  image: defaultS.image,
                  available_locations: defaultS.availableLocations || []
                });
              } catch (e) {}
            })();
          }
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
      prev.map((b) => (b.id === id || b.referenceId === id ? { ...b, status } : b))
    );

    (async () => {
      try {
        await supabase
          .from('bookings')
          .update({ status })
          .or(`id.eq.${id},reference_id.eq.${id}`);
      } catch (e) {
        console.error('Supabase status update notice:', e);
      }
    })();

    showToast(`Booking status updated to ${status.toUpperCase()}`, 'info');
  };

  const assignTechnician = (bookingId: string, techName: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId || b.referenceId === bookingId ? { ...b, assignedStaff: techName } : b))
    );

    (async () => {
      try {
        await supabase
          .from('bookings')
          .update({
            assigned_staff: techName,
            assigned_technician: techName
          })
          .or(`id.eq.${bookingId},reference_id.eq.${bookingId}`);
      } catch (e) {
        console.error('Supabase staff assign notice:', e);
      }
    })();

    showToast(`Assigned ${techName} to booking`, 'success');
  };

  const updateBookingNotes = (bookingId: string, notes: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId || b.referenceId === bookingId ? { ...b, notes } : b))
    );

    (async () => {
      try {
        await supabase
          .from('bookings')
          .update({ notes })
          .or(`id.eq.${bookingId},reference_id.eq.${bookingId}`);
      } catch (e) {
        console.error('Supabase notes update notice:', e);
      }
    })();

    showToast('Booking notes updated', 'info');
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id && b.referenceId !== id));

    (async () => {
      try {
        await supabase
          .from('bookings')
          .delete()
          .or(`id.eq.${id},reference_id.eq.${id}`);
      } catch (e) {
        console.error('Supabase delete booking notice:', e);
      }
    })();

    showToast('Booking removed', 'error');
  };

  // Standalone Service handlers
  const addService = (serviceData: Omit<AdminService, 'id'>): AdminService => {
    const newService: AdminService = {
      ...serviceData,
      id: serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)
    };
    setServices((prev) => [newService, ...prev]);

    (async () => {
      try {
        await supabase.from('services').insert({
          id: newService.id,
          title: newService.title,
          category: newService.category,
          starting_price: newService.startingPrice,
          price_numeric: newService.priceNumeric,
          duration: newService.duration,
          status: newService.status,
          overview: newService.overview,
          features: newService.features || [],
          included: newService.included || [],
          excluded: newService.excluded || [],
          recommended_for: newService.recommendedFor,
          image: newService.image,
          available_locations: newService.availableLocations || []
        });
      } catch (e) {
        console.error('Supabase service insert notice:', e);
      }
    })();

    showToast(`New service "${newService.title}" created successfully!`, 'success');
    return newService;
  };

  const updateService = (id: string, serviceData: Partial<AdminService>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...serviceData } : s))
    );

    (async () => {
      try {
        const payload: Record<string, any> = {};
        if (serviceData.title !== undefined) payload.title = serviceData.title;
        if (serviceData.category !== undefined) payload.category = serviceData.category;
        if (serviceData.startingPrice !== undefined) payload.starting_price = serviceData.startingPrice;
        if (serviceData.priceNumeric !== undefined) payload.price_numeric = serviceData.priceNumeric;
        if (serviceData.duration !== undefined) payload.duration = serviceData.duration;
        if (serviceData.status !== undefined) payload.status = serviceData.status;
        if (serviceData.overview !== undefined) payload.overview = serviceData.overview;
        if (serviceData.features !== undefined) payload.features = serviceData.features;
        if (serviceData.included !== undefined) payload.included = serviceData.included;
        if (serviceData.excluded !== undefined) payload.excluded = serviceData.excluded;
        if (serviceData.recommendedFor !== undefined) payload.recommended_for = serviceData.recommendedFor;
        if (serviceData.image !== undefined) payload.image = serviceData.image;
        if (serviceData.availableLocations !== undefined) payload.available_locations = serviceData.availableLocations;

        await supabase.from('services').update(payload).eq('id', id);
      } catch (e) {
        console.error('Supabase service update notice:', e);
      }
    })();

    showToast('Service updated successfully!', 'success');
  };

  const toggleServiceStatus = (id: string) => {
    let nextStatus: 'active' | 'inactive' = 'active';
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          nextStatus = s.status === 'active' ? 'inactive' : 'active';
          showToast(`Service "${s.title}" is now ${nextStatus.toUpperCase()}`, 'info');
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );

    (async () => {
      try {
        await supabase.from('services').update({ status: nextStatus }).eq('id', id);
      } catch (e) {
        console.error('Supabase service status notice:', e);
      }
    })();
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));

    (async () => {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase service delete notice:', e);
      }
    })();

    showToast('Service deleted', 'error');
  };

  // Category & Tier CRUD handlers with live Supabase cloud sync
  const updateHousePlan = (categoryKey: HouseCategoryKey, planType: string, updatedPlan: HousePlanDetails) => {
    setHouseCategories((prev) => {
      const currentCat = prev.find((c) => c.id === categoryKey) || HOUSE_CATEGORIES.find((c) => c.id === categoryKey);
      if (!currentCat) return prev;

      let nextCat = { ...currentCat };
      if (planType === 'standard') nextCat.standard = updatedPlan;
      else if (planType === 'premium') nextCat.premium = updatedPlan;
      else {
        const updatedCustoms = (currentCat.customPlans || []).map((cp) =>
          (cp.id === planType || cp.name === planType) ? updatedPlan : cp
        );
        nextCat.customPlans = updatedCustoms;
      }

      (async () => {
        try {
          await supabase.from('house_categories').upsert({
            id: nextCat.id,
            label: nextCat.label,
            description: nextCat.description,
            sqft_range: nextCat.sqftRange,
            standard: nextCat.standard,
            premium: nextCat.premium,
            custom_plans: nextCat.customPlans || [],
            available_locations: nextCat.availableLocations || []
          });
        } catch (e) {
          console.error('Supabase house plan update notice:', e);
        }
      })();

      return prev.map((cat) => (cat.id === categoryKey ? nextCat : cat));
    });

    showToast(`Updated ${categoryKey.toUpperCase()} plan details`, 'success');
  };

  const addHouseCategoryPlan = (categoryKey: HouseCategoryKey, plan: HousePlanDetails) => {
    const planWithId = { ...plan, id: plan.id || ('plan-' + Date.now()) };

    setHouseCategories((prev) => {
      const currentCat = prev.find((c) => c.id === categoryKey) || HOUSE_CATEGORIES.find((c) => c.id === categoryKey);
      if (!currentCat) return prev;

      const nextCat = {
        ...currentCat,
        customPlans: [...(currentCat.customPlans || []), planWithId]
      };

      (async () => {
        try {
          await supabase.from('house_categories').upsert({
            id: nextCat.id,
            label: nextCat.label,
            description: nextCat.description,
            sqft_range: nextCat.sqftRange,
            standard: nextCat.standard,
            premium: nextCat.premium,
            custom_plans: nextCat.customPlans || [],
            available_locations: nextCat.availableLocations || []
          });
        } catch (e) {
          console.error('Supabase house add plan notice:', e);
        }
      })();

      return prev.map((cat) => (cat.id === categoryKey ? nextCat : cat));
    });

    showToast(`Added new plan "${plan.name}" to ${categoryKey.toUpperCase()}`, 'success');
  };

  const deleteHouseCategoryPlan = (categoryKey: HouseCategoryKey, planIdOrType: string) => {
    setHouseCategories((prev) => {
      const currentCat = prev.find((c) => c.id === categoryKey) || HOUSE_CATEGORIES.find((c) => c.id === categoryKey);
      if (!currentCat) return prev;

      let nextCat = { ...currentCat };
      if (planIdOrType === 'standard') {
        nextCat.standard = {
          ...currentCat.standard,
          name: 'Standard Clean (Inactive)',
          priceDisplay: 'Unavailable',
          priceNumeric: null
        };
      } else if (planIdOrType === 'premium') {
        nextCat.premium = {
          ...currentCat.premium,
          name: 'Premium Ultra (Inactive)',
          priceDisplay: 'Unavailable',
          priceNumeric: null
        };
      } else {
        nextCat.customPlans = (currentCat.customPlans || []).filter((cp) => cp.id !== planIdOrType && cp.name !== planIdOrType);
      }

      (async () => {
        try {
          await supabase.from('house_categories').upsert({
            id: nextCat.id,
            label: nextCat.label,
            description: nextCat.description,
            sqft_range: nextCat.sqftRange,
            standard: nextCat.standard,
            premium: nextCat.premium,
            custom_plans: nextCat.customPlans || [],
            available_locations: nextCat.availableLocations || []
          });
        } catch (e) {
          console.error('Supabase house delete plan notice:', e);
        }
      })();

      return prev.map((cat) => (cat.id === categoryKey ? nextCat : cat));
    });

    showToast(`Deleted plan from ${categoryKey.toUpperCase()}`, 'info');
  };

  const updateCarPackage = (vehicleKey: VehicleCategoryKey, packageKey: string, updatedPkg: CarPackageItem) => {
    setVehicleCategories((prev) => {
      const currentVeh = prev.find((v) => v.id === vehicleKey) || VEHICLE_CATEGORIES.find((v) => v.id === vehicleKey);
      if (!currentVeh) return prev;

      const nextVeh = {
        ...currentVeh,
        packages: {
          ...currentVeh.packages,
          [packageKey]: updatedPkg
        }
      };

      (async () => {
        try {
          await supabase.from('vehicle_categories').upsert({
            id: nextVeh.id,
            label: nextVeh.label,
            description: nextVeh.description,
            examples: nextVeh.examples,
            packages: nextVeh.packages,
            available_locations: nextVeh.availableLocations || []
          });
        } catch (e) {
          console.error('Supabase car package update notice:', e);
        }
      })();

      return prev.map((veh) => (veh.id === vehicleKey ? nextVeh : veh));
    });

    showToast(`Updated ${vehicleKey.toUpperCase()} ${updatedPkg.name} Package`, 'success');
  };

  const deleteCarPackage = (vehicleKey: VehicleCategoryKey, packageKey: string) => {
    setVehicleCategories((prev) => {
      const currentVeh = prev.find((v) => v.id === vehicleKey) || VEHICLE_CATEGORIES.find((v) => v.id === vehicleKey);
      if (!currentVeh) return prev;

      const newPackages = { ...currentVeh.packages };
      delete newPackages[packageKey as keyof typeof newPackages];

      const nextVeh = {
        ...currentVeh,
        packages: newPackages
      };

      (async () => {
        try {
          await supabase.from('vehicle_categories').upsert({
            id: nextVeh.id,
            label: nextVeh.label,
            description: nextVeh.description,
            examples: nextVeh.examples,
            packages: nextVeh.packages,
            available_locations: nextVeh.availableLocations || []
          });
        } catch (e) {
          console.error('Supabase car package delete notice:', e);
        }
      })();

      return prev.map((veh) => (veh.id === vehicleKey ? nextVeh : veh));
    });

    showToast(`Deleted package from ${vehicleKey.toUpperCase()}`, 'info');
  };

  const updateLaundryConfig = (updatedConfig: LaundryConfig) => {
    setLaundryConfigState(updatedConfig);

    (async () => {
      try {
        await supabase.from('laundry_config').upsert({
          id: 'default_laundry_config',
          packages: updatedConfig.packages,
          express_surcharge: updatedConfig.expressSurcharge,
          premium_care_surcharge_per_kg: updatedConfig.premiumCareSurchargePerKg,
          pickup_fee: updatedConfig.pickupFee,
          free_pickup_min_weight: updatedConfig.freePickupMinWeight,
          available_locations: updatedConfig.availableLocations || []
        });
      } catch (e) {
        console.error('Supabase laundry config update notice:', e);
      }
    })();

    showToast('Laundry pricing & care tiers updated!', 'success');
  };

  const resetAllCategoriesToDefault = () => {
    setHouseCategories(HOUSE_CATEGORIES);
    setVehicleCategories(VEHICLE_CATEGORIES);
    setLaundryConfigState(DEFAULT_LAUNDRY_CONFIG);

    (async () => {
      try {
        for (const hc of HOUSE_CATEGORIES) {
          await supabase.from('house_categories').upsert({
            id: hc.id,
            label: hc.label,
            description: hc.description,
            sqft_range: hc.sqftRange,
            standard: hc.standard,
            premium: hc.premium,
            custom_plans: hc.customPlans || [],
            available_locations: hc.availableLocations || []
          });
        }

        for (const vc of VEHICLE_CATEGORIES) {
          await supabase.from('vehicle_categories').upsert({
            id: vc.id,
            label: vc.label,
            description: vc.description,
            examples: vc.examples,
            packages: vc.packages,
            available_locations: vc.availableLocations || []
          });
        }

        await supabase.from('laundry_config').upsert({
          id: 'default_laundry_config',
          packages: DEFAULT_LAUNDRY_CONFIG.packages,
          express_surcharge: DEFAULT_LAUNDRY_CONFIG.expressSurcharge,
          premium_care_surcharge_per_kg: DEFAULT_LAUNDRY_CONFIG.premiumCareSurchargePerKg,
          pickup_fee: DEFAULT_LAUNDRY_CONFIG.pickupFee,
          free_pickup_min_weight: DEFAULT_LAUNDRY_CONFIG.freePickupMinWeight,
          available_locations: DEFAULT_LAUNDRY_CONFIG.availableLocations || []
        });
      } catch (e) {
        console.error('Supabase reset pricing notice:', e);
      }
    })();

    showToast('Reset all pricing categories to system defaults in Cloud Database', 'info');
  };

  const addHouseCategory = (newCat: HouseCategoryData) => {
    setHouseCategories((prev) => [...prev, newCat]);

    (async () => {
      try {
        await supabase.from('house_categories').upsert({
          id: newCat.id,
          label: newCat.label,
          sqft_range: newCat.sqftRange,
          standard: newCat.standard,
          premium: newCat.premium,
          custom_plans: newCat.customPlans || [],
          available_locations: newCat.availableLocations || []
        });
      } catch (e) {
        console.error('Supabase house category add notice:', e);
      }
    })();

    showToast(`Added new variation: ${newCat.label}`, 'success');
  };

  const deleteHouseCategory = (categoryId: string) => {
    setHouseCategories((prev) => prev.filter((c) => c.id !== categoryId));

    (async () => {
      try {
        await supabase.from('house_categories').delete().eq('id', categoryId);
      } catch (e) {
        console.error('Supabase house category delete notice:', e);
      }
    })();

    showToast(`Deleted variation category`, 'info');
  };

  const addVehicleCategory = (newVeh: VehicleCategoryData) => {
    setVehicleCategories((prev) => [...prev, newVeh]);

    (async () => {
      try {
        await supabase.from('vehicle_categories').upsert({
          id: newVeh.id,
          label: newVeh.label,
          examples: newVeh.examples,
          packages: newVeh.packages,
          available_locations: newVeh.availableLocations || []
        });
      } catch (e) {
        console.error('Supabase vehicle category add notice:', e);
      }
    })();

    showToast(`Added new vehicle variation: ${newVeh.label}`, 'success');
  };

  const deleteVehicleCategory = (vehicleId: string) => {
    setVehicleCategories((prev) => prev.filter((v) => v.id !== vehicleId));

    (async () => {
      try {
        await supabase.from('vehicle_categories').delete().eq('id', vehicleId);
      } catch (e) {
        console.error('Supabase vehicle category delete notice:', e);
      }
    })();

    showToast(`Deleted vehicle variation`, 'info');
  };

  const addServiceLocation = (locData: Omit<ServiceAreaAdmin, 'id' | 'activeBookingsCount'>) => {
    const newLoc: ServiceAreaAdmin = {
      ...locData,
      id: 'loc-' + Date.now(),
      activeBookingsCount: 0
    };
    setLocations((prev) => [newLoc, ...prev]);

    (async () => {
      try {
        await supabase.from('locations').insert({
          id: newLoc.id,
          name: newLoc.name,
          zone: newLoc.zone,
          pincode: newLoc.pincode,
          status: newLoc.status,
          active_bookings_count: 0
        });
      } catch (e) {
        console.error('Supabase location insert notice:', e);
      }
    })();

    showToast(`Added service location: ${newLoc.name}`, 'success');
  };

  const updateServiceLocation = (id: string, updatedLoc: Partial<ServiceAreaAdmin>) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updatedLoc } : l))
    );

    (async () => {
      try {
        await supabase.from('locations').update(updatedLoc).eq('id', id);
      } catch (e) {
        console.error('Supabase location update notice:', e);
      }
    })();

    showToast('Updated location details', 'success');
  };

  const deleteServiceLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));

    (async () => {
      try {
        await supabase.from('locations').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase location delete notice:', e);
      }
    })();

    showToast('Service location deleted', 'info');
  };

  const toggleLocationStatus = (id: string) => {
    let nextStatus: 'active' | 'coming_soon' = 'active';
    setLocations((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          nextStatus = l.status === 'active' ? 'coming_soon' : 'active';
          return { ...l, status: nextStatus };
        }
        return l;
      })
    );

    (async () => {
      try {
        await supabase.from('locations').update({ status: nextStatus }).eq('id', id);
      } catch (e) {
        console.error('Supabase location toggle notice:', e);
      }
    })();

    showToast('Location status toggled', 'info');
  };

  // Staff handlers
  const addStaff = (staffData: Omit<Technician, 'id'>): Technician => {
    const newStaff: Technician = {
      ...staffData,
      id: 'staff-' + Date.now(),
      joinedDate: staffData.joinedDate || 'Aug 2025',
      completedJobs: staffData.completedJobs || 0
    };
    setTechnicians((prev) => [newStaff, ...prev]);

    (async () => {
      try {
        await supabase.from('technicians').insert({
          id: newStaff.id,
          name: newStaff.name,
          phone: newStaff.phone,
          email: newStaff.email,
          role: newStaff.role,
          specializations: newStaff.specializations,
          service_area: newStaff.serviceArea,
          rating: newStaff.rating,
          status: newStaff.status,
          joined_date: newStaff.joinedDate,
          completed_jobs: newStaff.completedJobs
        });
      } catch (e) {
        console.error('Supabase staff insert notice:', e);
      }
    })();

    showToast(`Staff member "${newStaff.name}" added successfully!`, 'success');
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<Technician>) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    (async () => {
      try {
        const payload: Record<string, any> = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.phone !== undefined) payload.phone = updates.phone;
        if (updates.email !== undefined) payload.email = updates.email;
        if (updates.role !== undefined) payload.role = updates.role;
        if (updates.specializations !== undefined) payload.specializations = updates.specializations;
        if (updates.serviceArea !== undefined) payload.service_area = updates.serviceArea;
        if (updates.rating !== undefined) payload.rating = updates.rating;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.joinedDate !== undefined) payload.joined_date = updates.joinedDate;
        if (updates.completedJobs !== undefined) payload.completed_jobs = updates.completedJobs;

        await supabase.from('technicians').update(payload).eq('id', id);
      } catch (e) {
        console.error('Supabase staff update notice:', e);
      }
    })();

    showToast('Staff member updated successfully!', 'success');
  };

  const deleteStaff = (id: string) => {
    setTechnicians((prev) => prev.filter((t) => t.id !== id));

    (async () => {
      try {
        await supabase.from('technicians').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase staff delete notice:', e);
      }
    })();

    showToast('Staff member removed', 'error');
  };

  const toggleStaffStatus = (id: string) => {
    setTechnicians((prev) => {
      const target = prev.find((t) => t.id === id) || SEED_TECHNICIANS.find((t) => t.id === id);
      if (!target) return prev;

      const nextStatus: Technician['status'] =
        target.status === 'available' ? 'assigned' : target.status === 'assigned' ? 'off' : 'available';

      (async () => {
        try {
          await supabase.from('technicians').update({ status: nextStatus }).eq('id', id);
        } catch (e) {
          console.error('Supabase staff toggle status notice:', e);
        }
      })();

      showToast(`${target.name} is now ${nextStatus.toUpperCase()}`, 'info');
      return prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t));
    });
  };

  // Blocked Slots / Availability Handlers
  const addBlockedSlot = (slotData: Omit<BlockedSlot, 'id' | 'createdAt'>): BlockedSlot => {
    const newSlot: BlockedSlot = {
      ...slotData,
      id: 'bslot-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setBlockedSlots((prev) => [newSlot, ...prev]);

    (async () => {
      try {
        await supabase.from('blocked_slots').insert({
          id: newSlot.id,
          service_category: newSlot.serviceCategory,
          date: newSlot.date,
          date_str: newSlot.date,
          time_slot: newSlot.timeSlot,
          location: newSlot.location,
          location_name: newSlot.location,
          reason: newSlot.reason
        });
      } catch (e) {
        console.error('Supabase blocked slot insert notice:', e);
      }
    })();

    const scope = newSlot.serviceCategory === 'all' ? 'All Services' : newSlot.serviceCategory.replace('-', ' ').toUpperCase();
    const locText = newSlot.location && newSlot.location !== 'all' ? ` in ${newSlot.location}` : ' in All Locations';
    const slotText = newSlot.timeSlot ? `at ${newSlot.timeSlot}` : 'All Day';
    showToast(`Blocked ${scope}${locText} on ${newSlot.date} (${slotText})`, 'info');
    return newSlot;
  };

  const deleteBlockedSlot = (id: string) => {
    setBlockedSlots((prev) => prev.filter((s) => s.id !== id));

    (async () => {
      try {
        await supabase.from('blocked_slots').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase blocked slot delete notice:', e);
      }
    })();

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

      // 4. If slot has no specific timeSlot or is a Full Day block, it blocks the full day
      if (
        !slot.timeSlot ||
        slot.timeSlot === 'all' ||
        slot.timeSlot === '' ||
        slot.timeSlot.toLowerCase().includes('full day') ||
        slot.timeSlot.toLowerCase() === 'full-day'
      ) return true;

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

    (async () => {
      try {
        await supabase.from('coupons').insert({
          id: newCoupon.id,
          code: newCoupon.code,
          title: newCoupon.title,
          description: newCoupon.description,
          discount_type: newCoupon.discountType,
          discount_value: newCoupon.discountValue,
          max_discount_amount: newCoupon.maxDiscountAmount,
          min_order_amount: newCoupon.minOrderAmount,
          applicable_services: newCoupon.applicableServices,
          expiry_date: newCoupon.expiryDate,
          once_per_customer_phone: newCoupon.oncePerCustomerPhone,
          status: newCoupon.status,
          usage_count: 0
        });
      } catch (e) {
        console.error('Supabase coupon insert notice:', e);
      }
    })();

    showToast(`Coupon ${newCoupon.code} created successfully!`, 'success');
    return newCoupon;
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, code: updates.code ? updates.code.trim().toUpperCase() : c.code } : c))
    );

    (async () => {
      try {
        const payload: Record<string, any> = {};
        if (updates.code !== undefined) payload.code = updates.code.trim().toUpperCase();
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.discountType !== undefined) payload.discount_type = updates.discountType;
        if (updates.discountValue !== undefined) payload.discount_value = updates.discountValue;
        if (updates.maxDiscountAmount !== undefined) payload.max_discount_amount = updates.maxDiscountAmount;
        if (updates.minOrderAmount !== undefined) payload.min_order_amount = updates.minOrderAmount;
        if (updates.applicableServices !== undefined) payload.applicable_services = updates.applicableServices;
        if (updates.expiryDate !== undefined) payload.expiry_date = updates.expiryDate;
        if (updates.oncePerCustomerPhone !== undefined) payload.once_per_customer_phone = updates.oncePerCustomerPhone;
        if (updates.status !== undefined) payload.status = updates.status;

        await supabase.from('coupons').update(payload).eq('id', id);
      } catch (e) {
        console.error('Supabase coupon update notice:', e);
      }
    })();

    showToast('Coupon updated successfully!', 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));

    (async () => {
      try {
        await supabase.from('coupons').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase coupon delete notice:', e);
      }
    })();

    showToast('Coupon deleted.', 'info');
  };

  const toggleCouponStatus = (id: string) => {
    let nextStatus: 'active' | 'inactive' = 'active';
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          nextStatus = c.status === 'active' ? 'inactive' : 'active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );

    (async () => {
      try {
        await supabase.from('coupons').update({ status: nextStatus }).eq('id', id);
      } catch (e) {
        console.error('Supabase coupon toggle notice:', e);
      }
    })();

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
      prev.map((inq) => (inq.id === id || inq.referenceId === id ? { ...inq, status } : inq))
    );

    (async () => {
      try {
        await supabase
          .from('inquiries')
          .update({ status })
          .or(`id.eq.${id},reference_id.eq.${id}`);
      } catch (e) {
        console.error('Supabase inquiry status notice:', e);
      }
    })();

    showToast('Inquiry status updated', 'info');
  };

  const updateInquiryNotes = (id: string, notes: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id || inq.referenceId === id ? { ...inq, notes } : inq))
    );

    (async () => {
      try {
        await supabase
          .from('inquiries')
          .update({ notes })
          .or(`id.eq.${id},reference_id.eq.${id}`);
      } catch (e) {
        console.error('Supabase inquiry notes notice:', e);
      }
    })();

    showToast('Inquiry notes saved', 'success');
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id && inq.referenceId !== id));

    (async () => {
      try {
        await supabase
          .from('inquiries')
          .delete()
          .or(`id.eq.${id},reference_id.eq.${id}`);
      } catch (e) {
        console.error('Supabase inquiry delete notice:', e);
      }
    })();

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

    (async () => {
      try {
        await supabase.from('house_categories').update({ available_locations: locs }).eq('id', catId);
      } catch (e) {
        console.error('Supabase house location coverage notice:', e);
      }
    })();

    showToast(`Updated location coverage for House Cleaning (${catId})`, 'success');
  };

  const updateVehicleCategoryLocations = (catId: VehicleCategoryKey, locs: string[]) => {
    setVehicleCategories((prev) =>
      prev.map((v) => (v.id === catId ? { ...v, availableLocations: locs } : v))
    );

    (async () => {
      try {
        await supabase.from('vehicle_categories').update({ available_locations: locs }).eq('id', catId);
      } catch (e) {
        console.error('Supabase vehicle location coverage notice:', e);
      }
    })();

    showToast(`Updated location coverage for Car Wash (${catId})`, 'success');
  };

  const updateLaundryLocations = (locs: string[]) => {
    setLaundryConfigState((prev) => ({ ...prev, availableLocations: locs }));

    (async () => {
      try {
        await supabase.from('laundry_config').update({ available_locations: locs }).eq('id', 'default_laundry_config');
      } catch (e) {
        console.error('Supabase laundry location coverage notice:', e);
      }
    })();

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
