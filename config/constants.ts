// App Configuration
export const APP_NAME = 'MathLab';
export const APP_DESCRIPTION = 'AI-Powered Math Solver with Step-by-Step Solutions';

// Limits
export const FREE_SOLVES_PER_DAY = 10;
export const PRO_SOLVES_PER_DAY = 100;
export const PREMIUM_SOLVES_PER_DAY = -1; // Unlimited

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['10 problems/day', 'Basic solutions'],
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    features: ['100 problems/day', 'Advanced solutions', 'PDF export'],
  },
  PREMIUM: {
    name: 'Premium',
    price: 19.99,
    features: ['Unlimited problems', 'Priority support', 'API access'],
  },
};

// API Routes
export const API_ENDPOINTS = {
  SOLVE: '/api/gemini/solve',
  OCR: '/api/gemini/ocr',
  SUBSCRIPTION_CHECK: '/api/subscription/check',
  AUTH_CALLBACK: '/auth/callback',
};

// Supported Languages (i18n)
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];
