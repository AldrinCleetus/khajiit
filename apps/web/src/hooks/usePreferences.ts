import { useState, useEffect } from 'react';

export function formatIndianPrice(amount: number, isProperty: boolean = false): string {
  if (isProperty) {
    if (amount >= 10000000) {
      const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
      return `₹${cr} Cr`;
    }
    if (amount >= 100000) {
      const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
      return `₹${lakh} Lakh`;
    }
  }
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

export function usePreferences() {
  const [locale, setLocale] = useState('en-IN');
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    // 1. Check if user has a saved preference in localStorage
    const savedCurrency = localStorage.getItem('user_currency');
    const savedLocale = localStorage.getItem('user_locale');
    
    // Always default to Indian market (en-IN / INR) unless explicitly overridden by user settings
    setLocale(savedLocale || 'en-IN');
    setCurrency(savedCurrency || 'INR');
  }, []);

  const formatPrice = (amount: number, isProperty: boolean = false) => {
    return formatIndianPrice(amount, isProperty);
  };

  return { locale, currency, formatPrice, formatIndianPrice };
}
