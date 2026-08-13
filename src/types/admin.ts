export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface BookingRecord {
  id: string;
  referenceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  area: string;
  pincode: string;
  serviceId: string;
  serviceName: string;
  categoryOrPackage: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedTotal: number;
  depositPaid: number;
  status: BookingStatus;
  assignedStaff?: string;
  notes?: string;
  createdAt: string;
}

export interface ServicePlanTier {
  id: string;
  name: string;
  priceDisplay: string;
  priceNumeric: number;
  duration: string;
  professionals?: number;
  description: string;
  included: string[];
  excluded: string[];
}

export interface AdminService {
  id: string;
  title: string;
  category: 'house-cleaning' | 'car-wash' | 'laundry' | 'specialized';
  startingPrice: string;
  priceNumeric: number;
  duration: string;
  status: 'active' | 'inactive';
  overview: string;
  features: string[];
  included: string[];
  excluded: string[];
  recommendedFor?: string;
  image: string;
  availableLocations?: string[]; // Array of location names e.g. ['Kakkanad', 'Edappally', 'Aluva'] where active
  standardPlan?: ServicePlanTier;
  premiumPlan?: ServicePlanTier;
  customPlans?: ServicePlanTier[];
}

export interface LaundryConfig {
  packages: {
    'laundry-only': { name: string; pricePerKg: number; description: string };
    'wash-iron': { name: string; pricePerKg: number; description: string };
    'iron-only': { name: string; pricePerKg: number; description: string };
    'dry-cleaning': { name: string; pricePerKg: number; description: string };
  };
  expressSurcharge: number;
  premiumCareSurchargePerKg: number;
  pickupFee: number;
  freePickupMinWeight: number;
  standardSpeedLabel?: string;
  standardSpeedDesc?: string;
  expressSpeedLabel?: string;
  expressSpeedDesc?: string;
  standardCareDesc?: string;
  premiumCareDesc?: string;
  included?: string[];
  excluded?: string[];
  availableLocations?: string[];
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  rating: number;
  status: 'available' | 'assigned' | 'off';
  avatar?: string;
  specializations?: string[];
  serviceArea?: string;
  joinedDate?: string;
  completedJobs?: number;
}

export interface ServiceAreaAdmin {
  id: string;
  name: string;
  zone: string;
  pincode: string;
  status: 'active' | 'coming_soon';
  activeBookingsCount: number;
  description?: string;
  availableServices?: string[];
}

export interface BlockedSlot {
  id: string;
  serviceCategory: 'all' | 'house-cleaning' | 'car-wash' | 'laundry' | 'specialized';
  location?: string; // e.g. 'all' or 'Kakkanad'
  date: string; // YYYY-MM-DD e.g., '2026-08-22'
  timeSlot?: string; // e.g. '10:30 PM', '11:30 AM', or undefined for full-day block
  reason?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  applicableServices: 'all' | 'house-cleaning' | 'car-wash' | 'laundry';
  expiryDate?: string; // Optional: empty string or undefined means never expires
  oncePerCustomerPhone?: boolean; // Optional: 1 redemption per phone number
  status: 'active' | 'inactive';
  usageCount: number;
  usageLimit?: number;
  createdAt: string;
}

export type InquiryStatus = 'new' | 'in-progress' | 'responded' | 'archived';

export interface InquiryRecord {
  id: string;
  referenceId: string;
  name: string;
  phone: string;
  email?: string;
  serviceInterest: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  notes?: string;
}

export interface HeaderMenuItem {
  id: string;
  label: string;
  path: string;
  hasDropdown?: boolean;
  dropdownItems?: {
    id: string;
    title: string;
    sub: string;
    path: string;
    iconType?: 'house' | 'car' | 'laundry';
  }[];
}

export interface SiteSettings {
  logoUrl?: string;
  faviconUrl?: string;
  
  // Instant Support & Helpline
  supportPhone: string;
  supportEmail: string;
  operatingHours: string;
  
  // Numbers & Statistics
  statCleanedCount: string;
  statCleanedLabel: string;
  statRating: string;
  statRatingLabel: string;
  statHubsCount: string;
  statHubsLabel: string;
  statEcoPercent: string;
  statEcoLabel: string;
  
  // Header Menu
  headerMenu: HeaderMenuItem[];
}

export type ApplicationStatus = 'new' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';

export interface JobApplication {
  id: string;
  referenceId: string;
  applicantName: string;
  phone: string;
  email: string;
  location: string;
  qualification: string;
  positionApplied: string;
  jobId?: string;
  status: ApplicationStatus;
  notes?: string;
  submittedAt: string;
}
