import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/categories';

export function formatPrice(priceInInr: number, currencyCode: CurrencyCode = 'INR'): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = priceInInr / currency.rateToInr;

  if (currencyCode === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  } else if (currencyCode === 'JPY') {
    return `¥${Math.round(converted).toLocaleString('ja-JP')}`;
  } else if (currencyCode === 'USD') {
    return `$${converted.toFixed(2)}`;
  } else if (currencyCode === 'GBP') {
    return `£${converted.toFixed(2)}`;
  } else if (currencyCode === 'EUR') {
    return `€${converted.toFixed(2)}`;
  } else if (currencyCode === 'AED') {
    return `AED ${converted.toFixed(2)}`;
  }

  return `${currency.symbol}${converted.toFixed(2)}`;
}

export function convertFromInr(priceInInr: number, currencyCode: CurrencyCode = 'INR'): number {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  return Number((priceInInr / currency.rateToInr).toFixed(2));
}

export function convertToInr(amount: number, currencyCode: CurrencyCode = 'INR'): number {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  return Math.round(amount * currency.rateToInr);
}
