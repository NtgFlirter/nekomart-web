import { Product, CountryOrigin } from '../types';

export interface LandingCostBreakdown {
  basePrice: number;
  internationalShipping: number;
  customsDuty: number;
  importHandlingFee: number;
  totalLandedCost: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  carrierName: string;
}

export function calculateLandingCost(
  product: Product,
  shippingMethod: 'standard' | 'express' = 'standard'
): LandingCostBreakdown {
  const basePrice = product.price;

  // Base international shipping rate by origin country & weight
  const originBaseRates: Record<CountryOrigin, number> = {
    USA: 750,
    Japan: 850,
    UK: 800,
    China: 600,
    'Hong Kong': 600
  };

  const baseRate = originBaseRates[product.origin] || 750;
  const weightMultiplier = Math.max(0.5, product.weightKg || 1) * 350;
  let shippingCost = Math.round(baseRate + weightMultiplier);

  if (shippingMethod === 'express') {
    shippingCost = Math.round(shippingCost * 1.45);
  }

  // Calculate Indian Import Customs Duty based on category & price
  // Usually between 12% to 22% for personal imports
  const dutyPercent = product.customsDutyPercent || 18;
  const customsDuty = Math.round((basePrice * dutyPercent) / 100);

  // Regulatory Indian clearance & airway handling
  const importHandlingFee = 199;

  const totalLandedCost = basePrice + shippingCost + customsDuty + importHandlingFee;

  const deliveryDaysMin = shippingMethod === 'express' 
    ? Math.max(3, product.shippingDaysMin - 1)
    : product.shippingDaysMin;

  const deliveryDaysMax = shippingMethod === 'express'
    ? Math.max(5, product.shippingDaysMax - 2)
    : product.shippingDaysMax;

  const carrierName = shippingMethod === 'express' 
    ? (product.origin === 'Japan' || product.origin === 'China' || product.origin === 'Hong Kong' ? 'DHL Express Air' : 'FedEx Priority Global')
    : 'Aramex International';

  return {
    basePrice,
    internationalShipping: shippingCost,
    customsDuty,
    importHandlingFee,
    totalLandedCost,
    deliveryDaysMin,
    deliveryDaysMax,
    carrierName
  };
}

export function getEstimatedDeliveryDateString(minDays: number, maxDays: number): string {
  const now = new Date();
  const minDate = new Date(now.getTime() + minDays * 24 * 60 * 60 * 1000);
  const maxDate = new Date(now.getTime() + maxDays * 24 * 60 * 60 * 1000);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`;
}
