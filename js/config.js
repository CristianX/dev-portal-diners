/**
 * Configuration file for Diners Club Developer Portal
 * Update these values based on your environment
 */

const CONFIG = {
  // API Base URLs
  sandbox: {
    baseUrl: 'https://sandbox-api.dinersclub.com/v1',
    oauthUrl: 'https://sandbox-api.dinersclub.com/oauth/token',
    websiteUrl: 'https://sandbox.dinersclub.com',
  },
  production: {
    baseUrl: 'https://api.dinersclub.com/v1',
    oauthUrl: 'https://api.dinersclub.com/oauth/token',
    websiteUrl: 'https://www.dinersclub.com',
  },

  // Current Environment
  currentEnv: 'sandbox', // Change to 'production' for prod

  // API Endpoints
  endpoints: {
    accounts: '/accounts',
    transactions: '/transactions',
    payments: '/payments',
    cardApplication: '/cards/application',
  },

  // OAuth Configuration
  oauth: {
    clientId: 'YOUR_CLIENT_ID_HERE',
    clientSecret: 'YOUR_CLIENT_SECRET_HERE', // Never expose in production
    grantType: 'client_credentials',
    scopes: ['read', 'write'],
  },

  // Rate Limiting
  rateLimits: {
    default: {
      requests: 100,
      period: 'hour',
    },
    premium: {
      requests: 1000,
      period: 'hour',
    },
  },

  // Timeout settings (milliseconds)
  timeouts: {
    apiCall: 30000,
    tokenRefresh: 5000,
  },

  // Feature Flags
  features: {
    apiPlayground: true,
    mockResponses: true, // Set to false in production
    analytics: true,
    darkMode: false, // Future feature
  },

  // Contact Information
  support: {
    email: 'developers@dinersclub.com',
    phone: '+1-800-DINERS-API',
    website: 'https://developer.dinersclub.com',
    community: 'https://community.dinersclub.com',
  },
};

// Get current configuration based on environment
function getConfig() {
  const env = CONFIG.currentEnv;
  return {
    ...CONFIG,
    api: CONFIG[env],
  };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
