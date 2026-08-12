import type {
  LaundryPackageKey,
  LaundrySpeedKey,
  LaundryQualityKey,
  HouseCategoryKey,
  VehicleCategoryKey
} from '../types';
import { HOUSE_CATEGORIES, VEHICLE_CATEGORIES } from './categories';

export const REFUNDABLE_DEPOSIT_NOTICE =
  "The booking amount is fully refundable or adjustable against your final invoice after successful service completion.";

export const DEMO_BOOKING_DEPOSIT = 299; // Demo token deposit amount

export function calculateLaundryPrice(
  weightKg: number,
  pkg: LaundryPackageKey,
  speed: LaundrySpeedKey,
  quality: LaundryQualityKey,
  customConfig?: any
): {
  subtotal: number;
  pickupFee: number;
  speedExtra: number;
  qualityExtra: number;
  total: number;
  isPickupFree: boolean;
} {
  let pkgRate = 70;
  if (customConfig && customConfig.packages && customConfig.packages[pkg]) {
    pkgRate = customConfig.packages[pkg].pricePerKg;
  } else {
    switch (pkg) {
      case 'laundry-only':
        pkgRate = 70;
        break;
      case 'wash-iron':
        pkgRate = 110;
        break;
      case 'iron-only':
        pkgRate = 50;
        break;
      case 'dry-cleaning':
        pkgRate = 190;
        break;
    }
  }

  let subtotal = Math.round(weightKg * pkgRate);

  const premRate = customConfig?.premiumCareSurchargePerKg ?? 35;
  const qualityExtra = quality === 'premium' ? Math.round(weightKg * premRate) : 0;

  const expressCharge = customConfig?.expressSurcharge ?? 199;
  const speedExtra = speed === 'express' ? expressCharge : 0;

  const isPickupFree = weightKg >= (customConfig?.freePickupMinWeight ?? 2);
  const pickupFee = isPickupFree ? 0 : (customConfig?.pickupFee ?? 80);

  const total = subtotal + qualityExtra + speedExtra + pickupFee;

  return {
    subtotal,
    pickupFee,
    speedExtra,
    qualityExtra,
    total,
    isPickupFree
  };
}

export function getHouseCleaningPrice(
  categoryKey: HouseCategoryKey,
  planType: 'standard' | 'premium'
): { priceDisplay: string; priceNumeric: number | null } {
  const cat = HOUSE_CATEGORIES.find((c) => c.id === categoryKey);
  if (!cat) return { priceDisplay: 'N/A', priceNumeric: null };
  const plan = planType === 'premium' ? cat.premium : cat.standard;
  return {
    priceDisplay: plan.priceDisplay,
    priceNumeric: plan.priceNumeric
  };
}

export function getCarWashPrice(
  vehicleKey: VehicleCategoryKey,
  packageId: 'basic' | 'premium' | 'interior' | 'complete'
): { price: number; name: string } {
  const veh = VEHICLE_CATEGORIES.find((v) => v.id === vehicleKey);
  if (!veh) return { price: 0, name: 'Unknown' };
  const pkg = veh.packages[packageId];
  return { price: pkg.price, name: pkg.name };
}
