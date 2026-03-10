// Application configuration
export const APP_CONFIG = {
  // Environment settings
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Algorand network settings - Always use TestNet for testing
  algorand: {
    useTestNet: true, // Always use TestNet for testing
    chainId: 416002, // TestNet: 416002
  },
  
  // Application metadata
  app: {
    name: 'TranXact',
    version: '1.0.0',
    description: 'Transparent donation ecosystem on Algorand blockchain'
  },
  
  // Feature flags
  features: {
    realTransactions: import.meta.env.DEV,
    mockData: import.meta.env.DEV,
    analytics: import.meta.env.PROD
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
