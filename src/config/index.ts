export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  powerbi: {
    apiKey: import.meta.env.VITE_POWER_BI_API_KEY,
    tenantId: import.meta.env.VITE_POWER_BI_TENANT_ID,
  },
  claude: {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  },
  app: {
    name: 'Power BI AI Assistant',
    version: '1.0.0',
    environment: import.meta.env.MODE,
  },
  features: {
    darkMode: true,
    analytics: false,
    betaFeatures: false,
  },
};

export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';
