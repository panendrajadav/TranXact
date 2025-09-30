// Application configuration
export const APP_CONFIG = {
  // Environment settings
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Algorand network settings
  algorand: {
    useTestNet: import.meta.env.DEV, // Use TestNet in development, MainNet in production
    chainId: import.meta.env.DEV ? 416002 : 416001, // TestNet: 416002, MainNet: 416001
  },
  
  // Application metadata
  app: {
    name: 'TranXact',
    version: '1.0.0',
    description: 'Transparent donation ecosystem on Algorand blockchain'
  },
  
  // Feature flags
  features: {
    realTransactions: import.meta.env.DEV, // Enable real transactions in development
    mockData: import.meta.env.DEV, // Use mock data in development
    analytics: import.meta.env.PROD // Enable analytics in production
  }
};

// Validation function
export function validateConfig() {
  const errors: string[] = [];
  
  if (!APP_CONFIG.app.name) {
    errors.push('App name is required');
  }
  
  if (APP_CONFIG.algorand.chainId !== 416001 && APP_CONFIG.algorand.chainId !== 416002) {
    errors.push('Invalid Algorand chain ID');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }
  
  return true;
}