import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { useApp, BloodGroup } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ArrowLeft,
  Droplet,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  calculateDistance,
  formatDate,
  getBloodAvailabilityStatus,
  getStatusBadgeColor,
  getStatusColor,
} from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HospitalDetailPage() {
  const { id } = useParams();
  const { user, hospitals, userLocation, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(hospitals.find((h) => h.id === id));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const found = hospitals.find((h) => h.id === id);
    if (!found) {
      navigate('/dashboard');
    } else {
      setHospital(found);
    }
  }, [id, hospitals, user, navigate]);

  if (!hospital || !user) return null;

  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng)
    : null;

  const totalUnits = Object.values(hospital.bloodStock).reduce((a, b) => a + b, 0);
  const overallStatus = getBloodAvailabilityStatus(totalUnits);

  const chartData = (Object.entries(hospital.bloodStock) as [BloodGroup, number][]).map(
    ([group, units]) => ({
      group,
      units,
      status: getBloodAvailabilityStatus(units),
    })
  );

  const getBarColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#22c55e';
      case 'limited':
        return '#f97316';
      default:
        return '#ef4444';
    }
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
    window.open(url, '_blank');
  };

  const handleEmergencyRequest = () => {
    navigate('/emergency', { state: { hospitalId: hospital.id, hospitalName: hospital.name } });
  };

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className={`mb-6 ${isDarkMode ? 'text-gray-300' : ''}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Header */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {hospital.name}
                    </h1>
                    <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin className="w-4 h-4" />
                      <span>{hospital.address}</span>
                    </div>
                    <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${hospital.phone}`} className="hover:text-red-600">
                        {hospital.phone}
                      </a>
                    </div>
                    {distance && (
                      <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Navigation className="w-4 h-4" />
                        <span>{distance.toFixed(1)} KM away from you</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4" />
                      <span>Last updated: {formatDate(hospital.lastUpdated)}</span>
                    </div>
                  </div>
                  <Badge className={getStatusBadgeColor(overallStatus)} variant="outline">
                    {overallStatus === 'available'
                      ? 'Available'
                      : overallStatus === 'limited'
                      ? 'Limited Stock'
                      : 'Out of Stock'}
                  </Badge>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={handleEmergencyRequest}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Request Blood
                  </Button>
                  <Button variant="outline" className={`flex-1 ${isDarkMode ? 'border-gray-600 text-gray-300' : ''}`} onClick={handleGetDirections}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className={`text-5xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {totalUnits}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Blood Units</p>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full ${
                      overallStatus === 'available'
                        ? 'bg-green-500'
                        : overallStatus === 'limited'
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((totalUnits / 400) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className={`mt-6 space-y-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Availability Status</span>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(overallStatus)}`}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Open 24/7</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Yes
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emergency Services</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Available
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blood Stock Grid */}
          <Card className={`mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Blood Stock by Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {(Object.entries(hospital.bloodStock) as [BloodGroup, number][]).map(([group, units]) => {
                  const status = getBloodAvailabilityStatus(units);
                  return (
                    <div
                      key={group}
                      className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                        status === 'available'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : status === 'limited'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {group}
                        </span>
                        <Droplet
                          className={`w-5 h-5 ${
                            status === 'available'
                              ? 'text-green-600'
                              : status === 'limited'
                              ? 'text-orange-600'
                              : 'text-red-600'
                          }`}
                        />
                      </div>
                      <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {units}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>units</p>
                      <div className="mt-2">
                        <Progress
                          value={Math.min((units / 60) * 100, 100)}
                          className={`h-1 ${
                            status === 'available'
                              ? '[&>div]:bg-green-500'
                              : status === 'limited'
                              ? '[&>div]:bg-orange-500'
                              : '[&>div]:bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Blood Stock Chart */}
          <Card className={`mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Stock Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="group" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  />
                  <Bar dataKey="units" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={isDarkMode ? 'text-white' : ''}>Demand Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-start gap-3 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      High Demand Expected
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      O+ and B+ blood groups may face shortage in next 48 hours based on AI prediction.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={isDarkMode ? 'text-white' : ''}>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Emergency Hotline: {hospital.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Available: 24 Hours / 7 Days</span>
                  </div>
                  <Button
                    variant="outline"
                    className={`w-full mt-4 ${isDarkMode ? 'border-gray-600 text-gray-300' : ''}`}
                    onClick={() => window.open(`tel:${hospital.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
