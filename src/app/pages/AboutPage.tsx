import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { Droplet, Heart, Map, Users, Shield, Award, Zap, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export default function AboutPage() {
  const { user, isDarkMode } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
              <Droplet className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Blood Donation & Availability Tracker
            </h1>
            <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              A Government-Level Healthcare Emergency Platform
            </p>
          </div>

          {/* Mission */}
          <Card className={`mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Mission
              </h2>
              <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                To bridge the gap between blood donors and those in need through real-time tracking,
                GPS-based location services, and instant emergency notifications. We aim to save lives
                by making blood availability transparent and accessible to everyone in Jaipur.
              </p>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Our platform connects 15+ hospitals, 500+ active donors, and thousands of users in
                need, creating a robust ecosystem for blood donation management.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                    <Map className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Live GPS Tracking
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Find the nearest hospitals with real-time distance calculation and interactive
                      map visualization.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Real-Time Updates
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Live blood stock availability from hospitals updated every few minutes with
                      instant notifications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Emergency SOS
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      One-click emergency blood requests that instantly notify nearby registered donors
                      and hospitals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Donor Network
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Connect with 500+ verified blood donors with smart matching based on blood group
                      and location.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Secure & Private
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your data is encrypted and secure. We follow strict privacy guidelines for all
                      medical information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      24/7 Availability
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Access blood availability information anytime, anywhere. Emergency support always
                      available.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tech Stack */}
          <Card className={`mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Technology Stack
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Frontend
                  </h3>
                  <ul className={`list-disc list-inside space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>React 18 with TypeScript</li>
                    <li>Tailwind CSS for styling</li>
                    <li>React Leaflet for interactive maps</li>
                    <li>Recharts for data visualization</li>
                    <li>Motion for smooth animations</li>
                  </ul>
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Backend & Services
                  </h3>
                  <ul className={`list-disc list-inside space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Node.js & Express.js</li>
                    <li>MongoDB Database</li>
                    <li>JWT Authentication</li>
                    <li>Geolocation API</li>
                    <li>REST API Architecture</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact */}
          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Impact
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="bg-red-100 dark:bg-red-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-red-600" />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1200+</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lives Saved</p>
                </div>
                <div>
                  <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>500+</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Donors</p>
                </div>
                <div>
                  <div className="bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>15</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Partner Hospitals</p>
                </div>
                <div>
                  <div className="bg-purple-100 dark:bg-purple-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>8 min</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Response</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className={`text-center mt-8 py-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2026 Blood Donation & Availability Tracker
            </p>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              A Government of Rajasthan Healthcare Initiative
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
