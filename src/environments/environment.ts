export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  authApiUrl: 'http://localhost:3000/auth',
  // SECURITY WARNING: Never commit real API keys to source control
  // Use environment variables or backend proxy for production
  // Set this via environment variable: process.env['GOOGLE_MAPS_API_KEY']
  mapApiKey: '', // TODO: Load from environment variable or backend
  version: '1.0.0',
  appName: 'Disaster Ready',
  features: {
    realTimeAlerts: true,
    liveMap: true,
    incidentReporting: true,
    resourceManagement: true,
    analytics: true
  },
  endpoints: {
    login: '/auth/login',
    signup: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    incidents: '/incidents',
    alerts: '/alerts',
    resources: '/resources',
    users: '/users'
  }
}; 