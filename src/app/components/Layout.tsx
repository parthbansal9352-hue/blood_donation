import React, { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  Droplet,
  Map,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  AlertCircle,
  Menu,
  X,
  Moon,
  Sun,
  Heart,
  Activity,
  Info,
  Hospital,
  Stethoscope,
  MessageSquare,
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export default function Layout({ children, showNav = true }: LayoutProps) {
  const { user, logout, isDarkMode, toggleDarkMode, isHealthcareMode, toggleHealthcareMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const bloodBankNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/map', label: 'Find Blood', icon: Map },
    { path: '/emergency', label: 'Emergency', icon: AlertCircle },
    { path: '/analytics', label: 'Analytics', icon: Activity },
  ];

  const healthcareNavItems = [
    { path: '/healthcare', label: 'Healthcare', icon: Hospital },
    { path: '/map', label: 'Hospitals', icon: Map },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const navItems = isHealthcareMode ? healthcareNavItems : bloodBankNavItems;

  if (user?.role === 'donor') {
    navItems.push({ path: '/donor-profile', label: 'Donor Profile', icon: Heart });
  }

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin Panel', icon: Settings });
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {showNav && user && (
        <nav
          className={`border-b sticky top-0 z-50 backdrop-blur-sm ${isDarkMode
            ? 'bg-gray-900/95 border-gray-800'
            : 'bg-white/95 border-gray-200'
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 font-bold text-lg"
              >
                <div className="bg-red-600 p-2 rounded-lg">
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  BloodBank
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className={
                          isActive
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : isDarkMode
                              ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                              : ''
                        }
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className={isDarkMode ? 'text-gray-300 hover:bg-gray-800' : ''}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`hidden md:flex items-center gap-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : ''
                        }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-red-600 text-white text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        Role: {user.role}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/about')}>
                      <Info className="w-4 h-4 mr-2" />
                      About
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/contact')}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`md:hidden ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : ''
                    }`}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div
              className={`md:hidden border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                }`}
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className={`w-full justify-start ${isActive
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : isDarkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                            : ''
                          }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : ''
                      }`}
                    onClick={() => {
                      navigate('/settings');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </nav>
      )}

      <main className={isDarkMode ? 'text-white' : ''}>{children}</main>

      {/* Floating Mode Switcher */}
      {showNav && user && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => {
              toggleHealthcareMode();
              if (!isHealthcareMode) {
                navigate('/healthcare');
              } else {
                navigate('/dashboard');
              }
            }}
            className={`shadow-lg ${isHealthcareMode
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
              } text-white px-4 py-6 rounded-full flex items-center gap-2`}
          >
            {isHealthcareMode ? (
              <>
                <Droplet className="w-5 h-5" />
                <span className="hidden md:inline">Switch to Blood Bank</span>
              </>
            ) : (
              <>
                <Hospital className="w-5 h-5" />
                <span className="hidden md:inline">Switch to Healthcare</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}