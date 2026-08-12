import type { ServiceArea } from '../types';

export const PRIMARY_SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'kakkanad',
    name: 'Kakkanad',
    district: 'Kochi / Ernakulam',
    pincode: '682030 / 682037',
    status: 'active',
    description: 'Serving all major residential complexes, SmartCity, Infopark Phase I & II, and independent villas across Kakkanad.',
    landmarks: ['SmartCity Kochi', 'Infopark Expressway', 'Collectorate', 'Rajagiri Valley'],
    estimatedArrival: 'Dispatch within 30-45 mins'
  },
  {
    id: 'edappally',
    name: 'Edappally',
    district: 'Kochi / Ernakulam',
    pincode: '682024 / 682041',
    status: 'active',
    description: 'Complete coverage for Lulu Mall vicinity, NH bypass residential belts, Edappally Toll, and Ponekkara.',
    landmarks: ['Lulu International Mall', 'Amrita Institute', 'Oberon Mall', 'Edappally Church'],
    estimatedArrival: 'Dispatch within 30-45 mins'
  },
  {
    id: 'kalamassery',
    name: 'Kalamassery',
    district: 'Kochi / Ernakulam',
    pincode: '683104 / 683109',
    status: 'active',
    description: 'Doorstep service across CUSAT campus area, KINFRA Hi-Tech Park, Container Road, and South Kalamassery.',
    landmarks: ['CUSAT University', 'KINFRA Park', 'Apollo Hospital Area', 'Seaport-Airport Road'],
    estimatedArrival: 'Dispatch within 30-45 mins'
  }
];

export const COMING_SOON_AREAS: ServiceArea[] = [
  {
    id: 'vyttila',
    name: 'Vyttila & Mobility Hub',
    district: 'Kochi',
    pincode: '682019',
    status: 'coming_soon',
    description: 'Expansion under setup! Onboarding specialized mobile detailing fleets for Vyttila Mobility Hub & SA Road.',
    landmarks: ['Vyttila Junction', 'Mobility Hub', 'Ponnurunni'],
    estimatedArrival: 'Launching Q4 2026'
  },
  {
    id: 'tripunithura',
    name: 'Tripunithura',
    district: 'Kochi',
    pincode: '682301',
    status: 'coming_soon',
    description: 'Preparing dedicated villa cleaning teams for Royal Town & Hill Palace residential suburbs.',
    landmarks: ['Hill Palace', 'Statue Junction', 'Kottai Kovilakom'],
    estimatedArrival: 'Launching Q4 2026'
  },
  {
    id: 'aluva',
    name: 'Aluva',
    district: 'Ernakulam North',
    pincode: '683101',
    status: 'coming_soon',
    description: 'Expanding industrial scale laundry & car wash hubs near Periyar riverbank townships.',
    landmarks: ['Aluva Metro Station', 'Bank Junction', 'UC College Area'],
    estimatedArrival: 'Launching Q4 2026'
  },
  {
    id: 'fort-kochi',
    name: 'Fort Kochi & Mattancherry',
    district: 'Heritage Kochi',
    pincode: '682001',
    status: 'coming_soon',
    description: 'Tailored boutique homestay and heritage property cleaning services launching soon.',
    landmarks: ['Chinese Fishing Nets', 'Jew Town', 'Princess Street'],
    estimatedArrival: 'Launching Q1 2027'
  }
];
