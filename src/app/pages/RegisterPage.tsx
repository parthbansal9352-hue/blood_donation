import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useApp, BloodGroup } from '../context/AppContext';
import { Droplet, Mail, Lock, User, Phone, Calendar, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function RegisterPage() {
  const { register: registerUser, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    bloodGroup: '' as BloodGroup | '',
    role: 'user' as 'user' | 'donor' | 'admin',
    isAvailable: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'donor' && !formData.bloodGroup) {
      toast.error('Please select your blood group');
      return;
    }

    setLoading(true);

    try {
      const success = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        bloodGroup: formData.bloodGroup || undefined,
        role: formData.role,
        isAvailable: formData.isAvailable,
      });

      if (success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 to-white'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-red-600 p-3 rounded-lg">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>BloodBank</span>
          </Link>
        </div>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={isDarkMode ? 'text-white' : ''}>Create Account</CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
              Join our blood donation network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : ''}>
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={isDarkMode ? 'text-gray-300' : ''}>
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className={isDarkMode ? 'text-gray-300' : ''}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pl-10 pr-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={isDarkMode ? 'text-gray-300' : ''}>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className={isDarkMode ? 'text-gray-300' : ''}>
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91-9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className={isDarkMode ? 'text-gray-300' : ''}>
                    Age (Optional)
                  </Label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      min="18"
                      max="65"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Register As</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="reg-user" />
                    <Label htmlFor="reg-user" className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : ''}`}>
                      User (Find Blood)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donor" id="reg-donor" />
                    <Label htmlFor="reg-donor" className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : ''}`}>
                      Blood Donor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="reg-admin" />
                    <Label htmlFor="reg-admin" className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : ''}`}>
                      Hospital Admin
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {(formData.role === 'donor' || formData.role === 'user') && (
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup" className={isDarkMode ? 'text-gray-300' : ''}>
                    Blood Group {formData.role === 'donor' && <span className="text-red-500">*</span>}
                  </Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value: BloodGroup) =>
                      setFormData({ ...formData, bloodGroup: value })
                    }
                  >
                    <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.role === 'donor' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isAvailable: checked as boolean })
                    }
                  />
                  <Label
                    htmlFor="available"
                    className={`text-sm cursor-pointer ${isDarkMode ? 'text-gray-300' : ''}`}
                  >
                    I am available to donate blood
                  </Label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className={`text-center text-sm mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
