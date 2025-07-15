module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sl', 'zh-HK', 'hr', 'sr'],
  },
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  // Namespace configuration
  ns: ['common', 'story', 'auth', 'dashboard', 'pricing'],
  defaultNS: 'common',
  
  // Enable key separator for nested translations
  keySeparator: '.',
  nsSeparator: ':',
  
  // Interpolation settings
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  
  // Backend configuration for loading translations
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  
  // Detection settings for browser language
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
  },
  
  // React specific settings
  react: {
    useSuspense: false,
  },
} 