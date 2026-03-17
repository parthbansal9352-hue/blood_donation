import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Droplet, Eye, EyeOff, Mail, Lock, UserCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { login, continueAsGuest, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'donor' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole: 'user' | 'donor' | 'admin') => {
    setLoading(true);
    try {
      await login(`demo_${demoRole}@bloodbank.com`, 'demo123', demoRole);
      toast.success(`Logged in as Demo ${demoRole.charAt(0).toUpperCase() + demoRole.slice(1)}`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    continueAsGuest();
    toast.success('Continuing as guest');
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 to-white'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
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
            <CardTitle className={isDarkMode ? 'text-white' : ''}>Welcome Back</CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={isDarkMode ? 'text-gray-300' : ''}>
                  Email
                </Label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                    required
                  />
                </div>
              </div>

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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Login As</Label>
                <RadioGroup value={role} onValueChange={(value: any) => setRole(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : ''}`}>
                      User
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donor" id="donor" />
                    <Label htmlFor="donor" className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : ''}`}>
                      Donor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : ''}`}>
                      Hospital Admin
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                    Or
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className={`w-full ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                onClick={handleGuestLogin}
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Continue as Guest
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                🎯 Quick Demo Login (For Testing):
              </p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDemoLogin('user')}
                  disabled={loading}
                >
                  Demo User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDemoLogin('donor')}
                  disabled={loading}
                >
                  Demo Donor
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                >
                  Demo Admin
                </Button>
              </div>
            </div>

            <p className={`text-center text-sm mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 hover:text-red-700 font-medium">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
