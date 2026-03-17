import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { useApp, BloodGroup } from '../context/AppContext';
import { Heart, Calendar, Phone, Droplet, Bell, BellOff, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { formatDate } from '../utils/helpers';

export default function DonorProfilePage() {
  const { user, updateUser, donationHistory, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bloodGroup: (user?.bloodGroup || '') as BloodGroup | '',
    age: user?.age?.toString() || '',
    lastDonationDate: user?.lastDonationDate || '',
    isAvailable: user?.isAvailable || false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'donor') {
      toast.error('This page is only for registered donors');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleSave = () => {
    updateUser({
      name: formData.name,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup as BloodGroup,
      age: formData.age ? parseInt(formData.age) : undefined,
      lastDonationDate: formData.lastDonationDate,
      isAvailable: formData.isAvailable,
    });
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  const toggleAvailability = () => {
    const newAvailability = !formData.isAvailable;
    setFormData({ ...formData, isAvailable: newAvailability });
    updateUser({ isAvailable: newAvailability });
    toast.success(
      newAvailability
        ? 'You are now available for donations'
        : 'You are now unavailable for donations'
    );
  };

  const myDonations = donationHistory.filter((d) => d.donorId === user?.id);

  if (!user) return null;

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Donor Profile
          </h1>

          {/* Profile Card */}
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={isDarkMode ? 'text-white' : ''}>Personal Information</CardTitle>
                  <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                    Manage your donor profile and availability
                  </CardDescription>
                </div>
                {!editing && (
                  <Button variant="outline" onClick={() => setEditing(true)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : ''}>
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className={isDarkMode ? 'text-gray-300' : ''}>
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className={isDarkMode ? 'text-gray-300' : ''}>
                      Blood Group
                    </Label>
                    {editing ? (
                      <Select
                        value={formData.bloodGroup}
                        onValueChange={(value: BloodGroup) =>
                          setFormData({ ...formData, bloodGroup: value })
                        }
                      >
                        <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodGroups.map((bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className={`flex items-center h-10 px-3 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'}`}>
                        <Droplet className="w-4 h-4 mr-2 text-red-600" />
                        {formData.bloodGroup || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className={isDarkMode ? 'text-gray-300' : ''}>
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      disabled={!editing}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastDonation" className={isDarkMode ? 'text-gray-300' : ''}>
                    Last Donation Date
                  </Label>
                  <Input
                    id="lastDonation"
                    type="date"
                    value={formData.lastDonationDate}
                    onChange={(e) =>
                      setFormData({ ...formData, lastDonationDate: e.target.value })
                    }
                    disabled={!editing}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>

                {editing && (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name,
                          phone: user.phone || '',
                          bloodGroup: user.bloodGroup || ('' as any),
                          age: user.age?.toString() || '',
                          lastDonationDate: user.lastDonationDate || '',
                          isAvailable: user.isAvailable || false,
                        });
                      }}
                      className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Availability Card */}
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Donation Availability</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                Toggle your availability to receive donation requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  {formData.isAvailable ? (
                    <Bell className="w-5 h-5 text-green-600" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formData.isAvailable ? 'Available for Donation' : 'Not Available'}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.isAvailable
                        ? 'You will receive emergency notifications'
                        : "You won't receive donation requests"}
                    </p>
                  </div>
                </div>
                <Switch checked={formData.isAvailable} onCheckedChange={toggleAvailability} />
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {myDonations.length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Donations</p>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6 text-center">
                <Droplet className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {myDonations.reduce((sum, d) => sum + d.units, 0)}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Units Donated</p>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.lastDonationDate
                    ? Math.floor(
                        (new Date().getTime() - new Date(formData.lastDonationDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : '-'}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Since Last</p>
              </CardContent>
            </Card>
          </div>

          {/* Donation History */}
          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Donation History</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                Your past blood donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myDonations.length > 0 ? (
                <div className="space-y-4">
                  {myDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                          <Droplet className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {donation.hospitalName}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {formatDate(donation.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {donation.bloodGroup}
                        </Badge>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {donation.units} unit{donation.units > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No donation history yet. Start saving lives today!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
