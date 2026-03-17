import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { useApp, BloodGroup } from '../context/AppContext';
import {
  Map,
  AlertCircle,
  Activity,
  Heart,
  MapPin,
  Phone,
  Clock,
  TrendingUp,
  Users,
  Droplet,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  calculateDistance,
  formatDate,
  getBloodAvailabilityStatus,
  getStatusBadgeColor,
  getStatusColor,
} from '../utils/helpers';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, hospitals, emergencyRequests, userLocation, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'all'>('all');
  const [nearbyHospitals, setNearbyHospitals] = useState(hospitals);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userLocation) {
      const sorted = [...hospitals]
        .map((h) => ({
          ...h,
          distance: calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 6);
      setNearbyHospitals(sorted);
    }
  }, [user, navigate, userLocation, hospitals]);

  const bloodGroups: (BloodGroup | 'all')[] = ['all', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredHospitals = nearbyHospitals.filter((hospital) => {
    if (selectedBloodGroup === 'all') return true;
    return hospital.bloodStock[selectedBloodGroup] > 0;
  });

  const userRequests = emergencyRequests.filter((req) => req.userId === user?.id);
  const totalDonors = 500; // Mock data
  const activeDonors = 345; // Mock data

  const getOverallBloodStock = () => {
    const totals: Record<BloodGroup, number> = {
      'A+': 0,
      'A-': 0,
      'B+': 0,
      'B-': 0,
      'O+': 0,
      'O-': 0,
      'AB+': 0,
      'AB-': 0,
    };

    hospitals.forEach((hospital) => {
      Object.entries(hospital.bloodStock).forEach(([group, units]) => {
        totals[group as BloodGroup] += units;
      });
    });

    return totals;
  };

  const overallStock = getOverallBloodStock();

  if (!user) return null;

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user.name}! 👋
            </h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {user.role === 'admin'
                ? 'Manage hospital blood stock and requests'
                : user.role === 'donor'
                ? 'Thank you for being a life saver'
                : 'Find blood availability near you'}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Hospitals</p>
                      <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {hospitals.length}
                      </p>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                      <Activity className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-red-600"
                      onClick={() => navigate('/map')}
                    >
                      View on map →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Donors</p>
                      <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activeDonors}
                      </p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <Progress value={(activeDonors / totalDonors) * 100} className="mt-4" />
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {activeDonors} of {totalDonors} donors
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Requests</p>
                      <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {userRequests.length}
                      </p>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-red-600"
                      onClick={() => navigate('/emergency')}
                    >
                      Create new →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Blood Units</p>
                      <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {Object.values(overallStock).reduce((a, b) => a + b, 0)}
                      </p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                      <Droplet className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-red-600"
                      onClick={() => navigate('/analytics')}
                    >
                      View analytics →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className={`bg-gradient-to-br from-red-600 to-red-700 border-0 text-white cursor-pointer hover:shadow-lg transition-shadow ${isDarkMode ? '' : ''}`} onClick={() => navigate('/emergency')}>
              <CardContent className="p-6">
                <AlertCircle className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Emergency Request</h3>
                <p className="text-red-100 text-sm">Need blood urgently? Create an emergency request</p>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`} onClick={() => navigate('/map')}>
              <CardContent className="p-6">
                <Map className={`w-8 h-8 mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Find Blood</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Search nearby hospitals with interactive map
                </p>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`} onClick={() => navigate(user.role === 'donor' ? '/donor-profile' : '/register')}>
              <CardContent className="p-6">
                <Heart className={`w-8 h-8 mb-3 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.role === 'donor' ? 'Donor Profile' : 'Become a Donor'}
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {user.role === 'donor' ? 'Manage your donor profile' : 'Register as a blood donor'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overall Blood Stock */}
          <Card className={`mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Overall Blood Stock (All Hospitals)</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                Real-time availability across Jaipur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {(Object.entries(overallStock) as [BloodGroup, number][]).map(([group, units]) => {
                  const status = getBloodAvailabilityStatus(units);
                  return (
                    <div
                      key={group}
                      className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{group}</span>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                      </div>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{units}</p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>units</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Nearby Hospitals */}
          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={isDarkMode ? 'text-white' : ''}>Nearby Hospitals</CardTitle>
                  <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                    Hospitals closest to your location
                  </CardDescription>
                </div>
                <Select value={selectedBloodGroup} onValueChange={(value: any) => setSelectedBloodGroup(value)}>
                  <SelectTrigger className={`w-32 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg === 'all' ? 'All' : bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredHospitals.map((hospital, index) => {
                  const distance = userLocation
                    ? calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng)
                    : null;
                  const stock =
                    selectedBloodGroup === 'all'
                      ? Object.values(hospital.bloodStock).reduce((a, b) => a + b, 0)
                      : hospital.bloodStock[selectedBloodGroup];
                  const status = getBloodAvailabilityStatus(stock);

                  return (
                    <motion.div
                      key={hospital.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`p-4 rounded-lg border hover:shadow-md transition-shadow ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {hospital.name}
                          </h3>
                          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <MapPin className="w-4 h-4" />
                            <span>
                              {distance ? `${distance.toFixed(1)} KM away` : hospital.address}
                            </span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Phone className="w-4 h-4" />
                            <span>{hospital.phone}</span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Clock className="w-4 h-4" />
                            <span>Updated {formatDate(hospital.lastUpdated)}</span>
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(status)} variant="outline">
                          {status === 'available'
                            ? 'Available'
                            : status === 'limited'
                            ? 'Limited'
                            : 'Unavailable'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {selectedBloodGroup === 'all'
                            ? (['O+', 'O-', 'A+', 'B+'] as BloodGroup[]).map((bg) => (
                                <div
                                  key={bg}
                                  className={`px-3 py-1 rounded text-sm ${
                                    isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                                  }`}
                                >
                                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {bg}:{' '}
                                  </span>
                                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    {hospital.bloodStock[bg]}
                                  </span>
                                </div>
                              ))
                            : (
                                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {stock} units available
                                </div>
                              )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/hospital/${hospital.id}`)}
                          className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                        >
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate('/map')}
                  className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                >
                  <Map className="w-4 h-4 mr-2" />
                  View All on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
