import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  Droplet,
  Map,
  Heart,
  Activity,
  AlertCircle,
  Phone,
  Clock,
  Users,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  calculateDistance,
  getBloodAvailabilityStatus,
  getStatusBadgeColor,
} from '../utils/helpers';
import { motion } from 'motion/react';

export default function LandingPage() {
  const { user, hospitals, userLocation, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [nearbyHospitals, setNearbyHospitals] = useState(hospitals.slice(0, 5));

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (userLocation) {
      const sorted = [...hospitals]
        .map((h) => ({
          ...h,
          distance: calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
      setNearbyHospitals(sorted);
    }
  }, [userLocation, hospitals]);

  const [sosAnimation, setSosAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSosAnimation((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 to-white'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'bg-white/80 backdrop-blur-sm border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Blood Donation & Availability Tracker
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className={isDarkMode ? 'text-gray-300' : ''}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-red-600 hover:bg-red-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Find Blood.<br />
                <span className="text-red-600">Save Lives.</span>
              </h1>
              <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Real-time blood availability tracking in Jaipur. Connect with nearby hospitals
                and donors instantly. Every second counts in emergencies.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8">
                    <Map className="w-5 h-5 mr-2" />
                    Find Blood Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className={`text-lg px-8 ${isDarkMode ? 'border-gray-700 text-gray-300' : ''}`}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Become a Donor
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
                <div className="grid grid-cols-2 gap-4">
                  <Card className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    <CardContent className="p-6 text-center">
                      <Users className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>500+</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Donors</p>
                    </CardContent>
                  </Card>
                  <Card className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    <CardContent className="p-6 text-center">
                      <Activity className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>15</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hospitals</p>
                    </CardContent>
                  </Card>
                  <Card className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    <CardContent className="p-6 text-center">
                      <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1200+</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lives Saved</p>
                    </CardContent>
                  </Card>
                  <Card className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    <CardContent className="p-6 text-center">
                      <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>24/7</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating SOS Button */}
        <Link to="/emergency">
          <motion.button
            animate={{ scale: sosAnimation ? 1.1 : 1 }}
            className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-6 shadow-2xl"
          >
            <AlertCircle className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
              SOS
            </span>
          </motion.button>
        </Link>
      </section>

      {/* Top Hospitals Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Hospitals in Jaipur
            </h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Real-time blood availability from nearby hospitals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyHospitals.map((hospital) => {
              const distance = userLocation
                ? calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    hospital.lat,
                    hospital.lng
                  )
                : null;
              const totalUnits = Object.values(hospital.bloodStock).reduce(
                (sum, units) => sum + units,
                0
              );
              const status = getBloodAvailabilityStatus(totalUnits);

              return (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className={`hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className={`font-semibold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {hospital.name}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1`}>
                            <MapPin className="w-3 h-3" />
                            {distance ? `${distance.toFixed(1)} KM away` : 'Jaipur'}
                          </p>
                        </div>
                        <Badge className={getStatusBadgeColor(status)} variant="outline">
                          {status === 'available'
                            ? 'Available'
                            : status === 'limited'
                            ? 'Limited'
                            : 'Unavailable'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm mb-4">
                        <Phone className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{hospital.phone}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {(['O+', 'O-', 'A+', 'B+'] as const).map((bg) => (
                          <div
                            key={bg}
                            className={`text-center p-2 rounded ${
                              isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                            }`}
                          >
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{bg}</p>
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {hospital.bloodStock[bg]}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Link to="/register">
                        <Button
                          variant="outline"
                          className={`w-full ${isDarkMode ? 'border-gray-600 text-gray-300' : ''}`}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/register">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                View All Hospitals
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Choose Us?
            </h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Government-level healthcare emergency platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card className={`text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardContent className="p-8">
                  <div className="bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Map className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Live GPS Tracking
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Find nearest hospitals with real-time distance calculation and navigation
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className={`text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardContent className="p-8">
                  <div className="bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Real-Time Updates
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Live blood stock availability from 15+ hospitals across Jaipur
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className={`text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardContent className="p-8">
                  <div className="bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Emergency SOS
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    One-click emergency requests notify nearby donors instantly
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-8 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                BloodBank Jaipur
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2026 Blood Donation & Availability Tracker. A Government Healthcare Initiative.
            </p>
            <div className="flex gap-4">
              <Link to="/about" className={`text-sm hover:text-red-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                About
              </Link>
              <a href="#" className={`text-sm hover:text-red-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Privacy
              </a>
              <a href="#" className={`text-sm hover:text-red-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
