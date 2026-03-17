import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { useApp, BloodGroup } from '../context/AppContext';
import { TrendingUp, Users, Activity, Droplet, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const { user, hospitals, emergencyRequests, donationHistory, isDarkMode } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Calculate overall blood stock
  const bloodStockData = (['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as BloodGroup[]).map(
    (group) => ({
      group,
      units: hospitals.reduce((sum, h) => sum + h.bloodStock[group], 0),
    })
  );

  // Request status data
  const statusData = [
    {
      name: 'Pending',
      value: emergencyRequests.filter((r) => r.status === 'pending').length,
      color: '#f97316',
    },
    {
      name: 'Accepted',
      value: emergencyRequests.filter((r) => r.status === 'accepted').length,
      color: '#3b82f6',
    },
    {
      name: 'Fulfilled',
      value: emergencyRequests.filter((r) => r.status === 'fulfilled').length,
      color: '#22c55e',
    },
    {
      name: 'Cancelled',
      value: emergencyRequests.filter((r) => r.status === 'cancelled').length,
      color: '#ef4444',
    },
  ];

  // Monthly trend data (mock)
  const monthlyData = [
    { month: 'Jan', requests: 24, donations: 32 },
    { month: 'Feb', requests: 28, donations: 35 },
    { month: 'Mar', requests: 32, donations: 38 },
    { month: 'Apr', requests: 30, donations: 42 },
    { month: 'May', requests: 35, donations: 45 },
    { month: 'Jun', requests: 38, donations: 48 },
  ];

  // Top hospitals by blood stock
  const topHospitals = [...hospitals]
    .map((h) => ({
      name: h.name.split(' ')[0],
      stock: Object.values(h.bloodStock).reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8);

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Analytics Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Blood Units</p>
                    <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {bloodStockData.reduce((sum, item) => sum + item.units, 0)}
                    </p>
                  </div>
                  <Droplet className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Requests</p>
                    <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {emergencyRequests.length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Donations</p>
                    <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {donationHistory.length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Hospitals</p>
                    <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {hospitals.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="stock" className="space-y-6">
            <TabsList className={isDarkMode ? 'bg-gray-800' : ''}>
              <TabsTrigger value="stock">Blood Stock</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>

            {/* Blood Stock Analytics */}
            <TabsContent value="stock">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? 'text-white' : ''}>Blood Stock by Group</CardTitle>
                    <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                      Total units available across all hospitals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={bloodStockData}>
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
                        <Bar dataKey="units" fill="#ef4444" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? 'text-white' : ''}>Top Hospitals by Stock</CardTitle>
                    <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                      Hospitals with highest blood availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topHospitals} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis type="number" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                        <YAxis dataKey="name" type="category" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: isDarkMode ? '#ffffff' : '#000000',
                          }}
                        />
                        <Bar dataKey="stock" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Trends */}
            <TabsContent value="trends">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? 'text-white' : ''}>Monthly Trends</CardTitle>
                    <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                      Requests vs Donations over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: isDarkMode ? '#ffffff' : '#000000',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="requests"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="donations"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? 'text-white' : ''}>Growth Metrics</CardTitle>
                    <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                      Key performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Fulfillment Rate
                          </span>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>87%</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          +5% from last month
                        </p>
                      </div>

                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Response Time
                          </span>
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>8 min</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Average response time
                        </p>
                      </div>

                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Active Donors
                          </span>
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>345</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          +12 new this month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Requests Analytics */}
            <TabsContent value="requests">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : ''}>Request Status Distribution</CardTitle>
                  <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                    Breakdown of emergency request statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: isDarkMode ? '#ffffff' : '#000000',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="flex flex-col justify-center space-y-4">
                      {statusData.map((item) => (
                        <div key={item.name} className={`flex items-center justify-between p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{item.name}</span>
                          </div>
                          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
