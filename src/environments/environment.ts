export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  authApiUrl: 'http://localhost:3000/auth',
  mapApiKey: 'AIzaSyDfhO_xwaZmnD-ps6zXKnw1jFw3u9ePbE4',
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