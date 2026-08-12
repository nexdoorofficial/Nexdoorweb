export type ServiceId = 'house-cleaning' | 'car-wash' | 'laundry';

export type HouseCategoryKey = '1-bhk' | '2-bhk' | '3-bhk' | '4-bhk' | 'villa' | 'custom';

export interface HousePlanDetails {
  id?: string;
  name: string;
  priceDisplay: string;
  priceNumeric: number | null;
  description: string;
  included: string[];
  excluded: string[];
  duration: string;
  professionals: number;
  frequency: string;
  prepInstructions: string[];
  afterCare: string[];
}

export interface HouseCategoryData {
  id: HouseCategoryKey;
  label: string;
  description: string;
  sqftRange: string;
  standard: HousePlanDetails;
  premium: HousePlanDetails;
  customPlans?: HousePlanDetails[];
  availableLocations?: string[];
}

export interface FeaturedService {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  features: string[];
  benefits: string[];
  included: string[];
  excluded: string[];
  estimatedTime: string;
  recommendedFor: string;
  gallery: string[];
  faq: { question: string; answer: string }[];
  ctaText: string;
  startingPrice: string;
}

export type VehicleCategoryKey = 'hatchback' | 'sedan' | 'suv' | 'luxury-suv' | 'premium-car';

export interface CarPackageItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  overview: string;
  included: string[];
  excluded: string[];
  duration: string;
  frequency: string;
}

export interface VehicleCategoryData {
  id: VehicleCategoryKey;
  label: string;
  description: string;
  examples: string;
  packages: Record<'basic' | 'premium' | 'interior' | 'complete', CarPackageItem>;
  availableLocations?: string[];
}

export type LaundryWeightKey = '1kg' | '2kg' | '3kg' | '5kg' | '10kg' | '15kg' | '20kg';
export type LaundryPackageKey = 'laundry-only' | 'wash-iron' | 'iron-only' | 'dry-cleaning';
export type LaundrySpeedKey = 'normal' | 'express';
export type LaundryQualityKey = 'standard' | 'premium';

export interface ServiceArea {
  id: string;
  name: string;
  district: string;
  pincode: string;
  status: 'active' | 'coming_soon';
  description: string;
  landmarks: string[];
  estimatedArrival: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  serviceUsed: string;
  rating: number;
  comment: string;
  avatar: string;
  verified: boolean;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  image: string;
  coverImage?: string;
  tags: string[];
  // SEO & Admin Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  status?: 'published' | 'draft' | 'archived';
  featured?: boolean;
  viewsCount?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'house-cleaning' | 'car-wash' | 'laundry' | 'booking-payment';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  experience: string;
  image: string;
}

export interface CareerPosition {
  id: string;
  title: string;
  department: string;
  type: 'Full-Time' | 'Part-Time' | 'Shift' | string;
  location: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status?: 'active' | 'closed';
  createdAt?: string;
}

export interface BookingState {
  serviceId: ServiceId;
  categoryKey: string;
  packageKey: string;
  planType: 'standard' | 'premium';
  laundryWeight: number;
  laundryPackage: LaundryPackageKey;
  laundrySpeed: LaundrySpeedKey;
  laundryQuality: LaundryQualityKey;
  selectedDate: string;
  selectedTimeSlot: string;
  address: {
    fullName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    area: string;
    pincode: string;
    notes: string;
  };
  estimatedTotal: number;
  pickupFee: number;
  depositAmount: number;
}
