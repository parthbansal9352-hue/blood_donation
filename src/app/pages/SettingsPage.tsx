import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { Save, Moon, Sun, Bell, Lock, User, Smartphone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, updateUser, isDarkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSave = () => {
    updateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
    toast.success('Settings saved successfully!');
  };

  if (!user) return null;

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>

          {/* Profile Settings */}
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Profile Settings</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : ''}>
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={isDarkMode ? 'text-gray-300' : ''}>
                  <Lock className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className={isDarkMode ? 'text-gray-300' : ''}>
                  <Smartphone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>

              <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Appearance</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                Customize how the app looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-600" />
                  )}
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isDarkMode ? 'Easy on the eyes' : 'Classic bright theme'}
                    </p>
                  </div>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Notification Preferences</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Email Notifications
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      SMS Notifications
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Get text messages for emergencies
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>

              <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Push Notifications
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Instant alerts on your device
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Account</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Account Type
                </p>
                <p className={`text-lg font-semibold capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.role}
                </p>
              </div>

              <Separator className={isDarkMode ? 'bg-gray-600' : ''} />

              <Button variant="outline" className={`w-full ${isDarkMode ? 'border-gray-600 text-gray-300' : ''}`}>
                Change Password
              </Button>

              <Button
                variant="outline"
                className={`w-full text-red-600 hover:bg-red-50 ${isDarkMode ? 'border-gray-600 hover:bg-red-900/20' : ''}`}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
