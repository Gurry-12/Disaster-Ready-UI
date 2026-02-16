export const environment = {
  production: true,
  apiUrl: 'https://api.aegis-command.gov/api',
  authApiUrl: 'https://api.aegis-command.gov/auth',
  mapApiKey: 'AIzaSyDfhO_xwaZmnD-ps6zXKnw1jFw3u9ePbE4',
  version: '1.0.0',
  appName: 'Aegis Command',
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