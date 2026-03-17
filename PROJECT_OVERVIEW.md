# Blood Donation & Availability Tracker

A comprehensive, government-level healthcare emergency platform for real-time blood availability tracking in Jaipur, Rajasthan.

## 🎯 Features

### Core Functionality
- **Live GPS Tracking**: Find nearest hospitals with real-time distance calculation
- **Interactive Map**: React Leaflet-powered map with hospital markers and radius filters
- **Real-Time Blood Stock**: Live availability tracking across 15+ hospitals
- **Emergency SOS**: One-click emergency blood requests with instant donor notifications
- **Multi-Role System**: User, Donor, and Hospital Admin roles
- **Dark Mode**: Complete dark theme support

### User Features
- Search and filter blood availability by group
- View nearby hospitals sorted by distance
- Submit emergency blood requests
- Track request status
- Guest mode access

### Donor Features
- Donor registration and profile management
- Toggle availability status
- Donation history tracking
- Emergency notifications
- Statistics dashboard

### Admin Features
- Real-time blood stock management
- Emergency request handling
- Hospital inventory updates
- Analytics and reporting
- Donor management

## 🏥 Demo Data

The application includes realistic data for **15 hospitals** in Jaipur:
- SMS Hospital
- Fortis Escorts Hospital
- Eternal Heart Care Centre
- Narayana Multispeciality Hospital
- Manipal Hospital
- And 10 more...

## 🚀 Quick Start

### Demo Login Credentials

The login page includes **one-click demo logins** for testing:

1. **Demo User** - Regular user seeking blood
2. **Demo Donor** - Registered blood donor
3. **Demo Admin** - Hospital administrator

Or use:
- Email: Any email (e.g., `demo@bloodbank.com`)
- Password: Any password
- Select role: User / Donor / Admin

### Guest Access
Click "Continue as Guest" on the login page for immediate access.

## 📱 Application Pages

1. **Landing Page** (`/`) - Public homepage with features overview
2. **Login** (`/login`) - Authentication with demo login options
3. **Register** (`/register`) - New user registration
4. **Dashboard** (`/dashboard`) - Main user dashboard
5. **Interactive Map** (`/map`) - Live GPS-powered hospital map
6. **Hospital Details** (`/hospital/:id`) - Detailed hospital information
7. **Emergency Request** (`/emergency`) - Submit blood requests
8. **Donor Profile** (`/donor-profile`) - Donor management
9. **Admin Panel** (`/admin`) - Hospital administration
10. **Analytics** (`/analytics`) - Data visualization & insights
11. **Settings** (`/settings`) - User preferences
12. **About** (`/about`) - Application information
13. **404 Page** (`*`) - Error handling

## 🗺️ Map Features

### Interactive Elements
- **User Location**: Blue dot showing current position
- **Hospital Markers**: Custom icons for each hospital
- **Radius Filter**: 5, 10, 15, 25, 50 KM options
- **Search Bar**: Search hospitals or Jaipur areas
- **Auto-suggestions**: Dropdown with area names
- **Popup Details**: Click markers for hospital info

### Filter Options
- Blood Group (A+, A-, B+, B-, O+, O-, AB+, AB-)
- City selection (Jaipur, Delhi, Mumbai)
- Distance radius
- Search by name or area

### Hospital Popup Info
- Hospital name and address
- Contact number
- Distance from user (in KM)
- Blood availability for all groups
- Last updated timestamp
- "Get Directions" button (opens Google Maps)
- "View Details" button

## 🎨 Design System

### Colors
- **Primary**: Red (#ef4444) - Emergency/Blood theme
- **Success**: Green - Available blood
- **Warning**: Orange - Limited stock
- **Danger**: Red - Unavailable
- **Dark Mode**: Full support with gray scale

### Typography
- Modern, accessible font system
- Clear hierarchy
- Responsive text sizing

### Components
- Built with Radix UI primitives
- Tailwind CSS styling
- Smooth animations with Motion
- Professional shadows and borders

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router 7** for navigation
- **Tailwind CSS 4** for styling
- **React Leaflet** for interactive maps
- **Recharts** for analytics charts
- **Motion** for animations
- **Radix UI** for accessible components
- **Sonner** for toast notifications

### Backend Simulation
- Context API for state management
- localStorage for data persistence
- Mock API delays for realistic UX
- JWT authentication simulation

### APIs Used
- Geolocation API (browser)
- OpenStreetMap tiles
- Google Maps (directions)

## 📊 Data Management

### State Management
- React Context API (`AppContext`)
- localStorage persistence
- Real-time updates
- Optimistic UI updates

### Data Structure
```typescript
- Hospitals (15 locations)
- Emergency Requests
- Donation History
- User Profiles
- Blood Stock Data
```

## 🎯 Use Cases

### For Patients/Users
1. Search for blood availability near you
2. View real-time stock across hospitals
3. Submit emergency blood requests
4. Track request status
5. Contact hospitals directly

### For Blood Donors
1. Register as a donor
2. Set availability status
3. Receive emergency notifications
4. Track donation history
5. View impact statistics

### For Hospital Admins
1. Update blood stock in real-time
2. Manage emergency requests
3. Accept/reject requests
4. View analytics
5. Manage donor database

## 🚨 Emergency Flow

1. User submits emergency request
2. System checks blood availability
3. Notifies nearby donors via SMS/Push
4. Hospital receives request
5. Admin accepts/rejects
6. User gets confirmation
7. Status tracked in dashboard

## 📈 Analytics Features

- Blood stock distribution charts
- Request status pie charts
- Monthly trends (requests vs donations)
- Hospital comparison
- Growth metrics
- Response time tracking
- Fulfillment rate

## 🔐 Security Features

- JWT token simulation
- Role-based access control
- Secure data handling
- Privacy-first design
- Guest mode limitations

## 🌐 Responsive Design

- Mobile-first approach
- Tablet optimized
- Desktop enhanced
- Touch-friendly controls
- Accessible navigation

## ♿ Accessibility

- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast support
- Focus indicators

## 🎭 Demo Scenarios

### Scenario 1: Emergency Blood Request
1. Login as User
2. Go to Emergency page
3. Select blood group and hospital
4. Submit request
5. View in Dashboard

### Scenario 2: Donor Registration
1. Register as Donor
2. Set blood group and availability
3. View donor profile
4. Toggle availability
5. View donation history

### Scenario 3: Admin Stock Update
1. Login as Admin
2. Go to Admin Panel
3. Select hospital
4. Update blood stock
5. View updated data on map

## 🏆 Key Highlights

- ✅ Fully functional navigation
- ✅ Interactive map with real GPS
- ✅ Real-time data simulation
- ✅ 15+ realistic hospital locations
- ✅ Complete user workflows
- ✅ Professional UI/UX
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ 404 page

## 📝 Notes

This is a **production-ready prototype** demonstrating:
- Complex state management
- Real-world data structures
- Professional UI patterns
- Government healthcare workflows
- Emergency response systems

Perfect for:
- Hackathon demonstrations
- Client presentations
- Portfolio projects
- Healthcare innovation showcases

---

**Built with ❤️ for saving lives**

*A Government of Rajasthan Healthcare Initiative*
