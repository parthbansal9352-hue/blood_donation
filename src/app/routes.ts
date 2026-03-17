import { createBrowserRouter } from 'react-router';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import HospitalDetailPage from './pages/HospitalDetailPage';
import EmergencyRequestPage from './pages/EmergencyRequestPage';
import DonorProfilePage from './pages/DonorProfilePage';
import AdminPanel from './pages/AdminPanel';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HealthcarePage from './pages/HealthcarePage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/map',
    Component: MapPage,
  },
  {
    path: '/hospital/:id',
    Component: HospitalDetailPage,
  },
  {
    path: '/emergency',
    Component: EmergencyRequestPage,
  },
  {
    path: '/donor-profile',
    Component: DonorProfilePage,
  },
  {
    path: '/admin',
    Component: AdminPanel,
  },
  {
    path: '/analytics',
    Component: AnalyticsPage,
  },
  {
    path: '/healthcare',
    Component: HealthcarePage,
  },
  {
    path: '/settings',
    Component: SettingsPage,
  },
  {
    path: '/about',
    Component: AboutPage,
  },
  {
    path: '/contact',
    Component: ContactPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
]);