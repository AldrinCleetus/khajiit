import { useState, useEffect } from 'react';

export function usePreferences() {
  const [locale, setLocale] = useState('en-IN');
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    // 1. Check if user has a saved preference in localStorage
    const savedCurrency = localStorage.getItem('user_currency');
    const savedLocale = localStorage.getItem('user_locale');
    
    // Always default to Indian market (en-IN / INR) unless explicitly overridden by user settings
    // Do not use navigator.language here to prevent 1,00,000 INR from displaying as $100,000 USD
    setLocale(savedLocale || 'en-IN');
    setCurrency(savedCurrency || 'INR');
  }, []);

  const formatPrice = (amount: number) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (e) {
      // Fallback if currency code is invalid
      return `₹${amount.toLocaleString()}`;
    }
  };

  return { locale, currency, formatPrice };
}
