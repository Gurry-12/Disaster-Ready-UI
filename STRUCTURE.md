# Disaster-Ready-UI Application Structure

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/                           # 🔐 Auth-related components & logic
│   │   ├── login/                      # Login component
│   │   │   ├── login.ts               # Login component logic
│   │   │   ├── login.html             # Login template
│   │   │   └── login.css              # Login styles
│   │   ├── signup/                    # Signup component
│   │   │   ├── signup.ts              # Signup component logic
│   │   │   ├── signup.html            # Signup template
│   │   │   └── signup.css             # Signup styles
│   │   ├── forgot-password/           # Forgot Password component
│   │   │   ├── forgot-password.ts     # Forgot password logic
│   │   │   ├── forgot-password.html   # Forgot password template
│   │   │   └── forgot-password.css    # Forgot password styles
│   │   ├── reset-password/            # Reset Password component
│   │   │   ├── reset-password.component.ts
│   │   │   ├── reset-password.component.html
│   │   │   └── reset-password.component.css
│   │   ├── auth.service.ts            # Central AuthService (token handling, login/logout)
│   │   └── auth.guard.ts              # AuthGuard to protect routes
│   │
│   ├── dashboard/                     # 📊 Dashboard component (protected)
│   │   ├── dashboard.ts               # Dashboard component logic
│   │   ├── dashboard.html             # Dashboard template
│   │   └── dashboard.css              # Dashboard styles
│   │
│   ├── shared/                        # ♻️ Shared utilities
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    # JWT token interceptor
│   │   ├── components/                # Reusable components
│   │   │   ├── navbar/
│   │   │   │   ├── navbar.component.ts
│   │   │   │   ├── navbar.component.html
│   │   │   │   └── navbar.component.css
│   │   │   └── footer/
│   │   │       ├── footer.component.ts
│   │   │       ├── footer.component.html
│   │   │       └── footer.component.css
│   │   └── models/                    # Interfaces & models
│   │       ├── user.model.ts          # User interface
│   │       └── login-request.model.ts # Auth request/response interfaces
│   │
│   ├── app.routes.ts                  # 🚦 Routing (with guard applied to dashboard)
│   ├── app.ts                         # Root component
│   ├── app.html                       # Root template
│   └── app.css                        # Root styles
│
├── assets/                            # 📁 Static assets (images, icons, etc.)
│
└── environments/                      # 🌐 Environment configs
    ├── environment.ts                 # Development environment
    └── environment.prod.ts            # Production environment
```

## 🔐 Authentication Flow

### Public Routes (No Auth Required)
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password recovery
- `/reset-password` - Password reset

### Protected Routes (Auth Required)
- `/dashboard` - Main dashboard
- `/live-disaster-map` - Real-time disaster map
- `/alert-notification` - Alerts and notifications
- `/incident-reporting` - Report incidents
- `/resource-allocation` - Resource management
- `/resource-overview` - Resource overview
- `/people-shelter-management` - Shelter management
- `/analytics-heatmaps` - Analytics and heatmaps
- `/calendar` - Event calendar
- `/customize-kit` - Emergency kit customization
- `/profile` - User profile
- `/change-password` - Change password

## 🛠️ Key Features

### Authentication System
- **AuthService**: Central authentication service with token management
- **AuthGuard**: Route protection for authenticated users
- **AuthInterceptor**: Automatic JWT token injection for HTTP requests
- **User Models**: TypeScript interfaces for user data

### Shared Components
- **NavbarComponent**: Responsive navigation with user menu
- **FooterComponent**: Application footer with links and contact info
- **Models**: Reusable TypeScript interfaces

### Environment Configuration
- **Development**: Local API endpoints and configuration
- **Production**: Production API endpoints and configuration

## 🚀 Getting Started

### Demo Credentials
- **Email**: admin&#64;disaster-ready.com
- **Password**: password

### Development
```bash
npm install
ng serve
```

### Build for Production
```bash
ng build --configuration production
```

## 📋 Features Implemented

✅ **Authentication System**
- Login/Logout functionality
- User registration
- Password reset flow
- Route protection with guards
- JWT token management

✅ **Shared Components**
- Responsive navbar with user menu
- Footer with links and contact info
- Reusable models and interfaces

✅ **Environment Configuration**
- Development and production configs
- API endpoint management
- Feature flags

✅ **Modern Angular Architecture**
- Standalone components
- Reactive forms
- RxJS for state management
- TypeScript interfaces
- Responsive design

## 🔧 Technical Stack

- **Angular 20** - Modern Angular with standalone components
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **Bootstrap Icons** - Icon library
- **CSS Grid/Flexbox** - Modern layout
- **Responsive Design** - Mobile-first approach

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Collapsible sidebar on mobile
- Responsive navbar with hamburger menu
- Adaptive layouts for all screen sizes

## 🔒 Security Features

- Route protection with AuthGuard
- JWT token management
- Automatic token refresh
- Secure password handling
- Input validation and sanitization 