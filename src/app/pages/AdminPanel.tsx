import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { useApp, BloodGroup, BloodStock } from '../context/AppContext';
import { Save, RefreshCw, CheckCircle, XCircle, Users, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { formatDateTime } from '../utils/helpers';

export default function AdminPanel() {
  const { user, hospitals, emergencyRequests, updateHospitalStock, updateRequestStatus, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState('');
  const [stockData, setStockData] = useState<BloodStock>({
    'A+': 0,
    'A-': 0,
    'B+': 0,
    'B-': 0,
    'O+': 0,
    'O-': 0,
    'AB+': 0,
    'AB-': 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }

    // Set default hospital if user has hospitalId
    if (user.hospitalId) {
      setSelectedHospital(user.hospitalId);
      const hospital = hospitals.find((h) => h.id === user.hospitalId);
      if (hospital) {
        setStockData(hospital.bloodStock);
      }
    } else if (hospitals.length > 0) {
      setSelectedHospital(hospitals[0].id);
      setStockData(hospitals[0].bloodStock);
    }
  }, [user, navigate, hospitals]);

  const handleHospitalChange = (hospitalId: string) => {
    setSelectedHospital(hospitalId);
    const hospital = hospitals.find((h) => h.id === hospitalId);
    if (hospital) {
      setStockData(hospital.bloodStock);
    }
  };

  const handleStockUpdate = () => {
    if (!selectedHospital) {
      toast.error('Please select a hospital');
      return;
    }

    updateHospitalStock(selectedHospital, stockData);
    toast.success('Blood stock updated successfully!');
  };

  const handleRequestAction = (requestId: string, status: 'accepted' | 'fulfilled' | 'cancelled') => {
    updateRequestStatus(requestId, status, user?.name);
    toast.success(`Request ${status}!`);
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const pendingRequests = emergencyRequests.filter((r) => r.status === 'pending');
  const activeRequests = emergencyRequests.filter((r) => r.status === 'accepted');

  if (!user) return null;

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Hospital Admin Panel
          </h1>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {emergencyRequests.length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Requests</p>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6 text-center">
                <RefreshCw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {pendingRequests.length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {emergencyRequests.filter((r) => r.status === 'fulfilled').length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fulfilled</p>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeRequests.length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="stock" className="space-y-6">
            <TabsList className={isDarkMode ? 'bg-gray-800' : ''}>
              <TabsTrigger value="stock">Blood Stock Management</TabsTrigger>
              <TabsTrigger value="requests">Emergency Requests</TabsTrigger>
            </TabsList>

            {/* Blood Stock Management */}
            <TabsContent value="stock">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : ''}>Update Blood Stock</CardTitle>
                  <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                    Manage blood inventory for your hospital
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className={isDarkMode ? 'text-gray-300' : ''}>Select Hospital</Label>
                      <Select value={selectedHospital} onValueChange={handleHospitalChange}>
                        <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                          <SelectValue placeholder="Choose a hospital" />
                        </SelectTrigger>
                        <SelectContent>
                          {hospitals.map((hospital) => (
                            <SelectItem key={hospital.id} value={hospital.id}>
                              {hospital.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {bloodGroups.map((bg) => (
                        <div key={bg} className="space-y-2">
                          <Label htmlFor={bg} className={isDarkMode ? 'text-gray-300' : ''}>
                            {bg}
                          </Label>
                          <Input
                            id={bg}
                            type="number"
                            min="0"
                            value={stockData[bg]}
                            onChange={(e) =>
                              setStockData({ ...stockData, [bg]: parseInt(e.target.value) || 0 })
                            }
                            className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                          />
                        </div>
                      ))}
                    </div>

                    <Button onClick={handleStockUpdate} className="bg-red-600 hover:bg-red-700">
                      <Save className="w-4 h-4 mr-2" />
                      Update Stock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emergency Requests */}
            <TabsContent value="requests">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : ''}>Emergency Blood Requests</CardTitle>
                  <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                    Review and manage incoming requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emergencyRequests.length > 0 ? (
                      emergencyRequests.map((request) => (
                        <div
                          key={request.id}
                          className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {request.userName}
                              </h3>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {request.userPhone}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {formatDateTime(request.createdAt)}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                request.status === 'fulfilled'
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : request.status === 'accepted'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : request.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : 'bg-orange-100 text-orange-800 border-orange-200'
                              }
                            >
                              {request.status}
                            </Badge>
                          </div>

                          <div className={`grid grid-cols-3 gap-4 p-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                            <div>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Blood Group</p>
                              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {request.bloodGroup}
                              </p>
                            </div>
                            <div>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Units</p>
                              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {request.units}
                              </p>
                            </div>
                            <div>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hospital</p>
                              <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {request.hospitalName}
                              </p>
                            </div>
                          </div>

                          {request.status === 'pending' && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                onClick={() => handleRequestAction(request.id, 'accepted')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestAction(request.id, 'cancelled')}
                                className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}

                          {request.status === 'accepted' && (
                            <div className="mt-3">
                              <Button
                                size="sm"
                                onClick={() => handleRequestAction(request.id, 'fulfilled')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark as Fulfilled
                              </Button>
                            </div>
                          )}

                          {request.acceptedBy && (
                            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Handled by: {request.acceptedBy}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Activity className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          No emergency requests yet
                        </p>
                      </div>
                    )}
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
