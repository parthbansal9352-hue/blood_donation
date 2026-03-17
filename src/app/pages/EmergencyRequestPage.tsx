import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Layout from '../components/Layout';
import { useApp, BloodGroup } from '../context/AppContext';
import { AlertCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function EmergencyRequestPage() {
  const { user, hospitals, createEmergencyRequest, isDarkMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [verificationId, setVerificationId] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bloodGroup: (user?.bloodGroup || '') as BloodGroup | '',
    units: '1',
    hospitalId: '',
    hospitalName: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Pre-fill hospital if coming from hospital detail page
    const state = location.state as any;
    if (state?.hospitalId && state?.hospitalName) {
      setFormData((prev) => ({
        ...prev,
        hospitalId: state.hospitalId,
        hospitalName: state.hospitalName,
      }));
    }
  }, [user, navigate, location]);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bloodGroup) {
      toast.error('Please select blood group');
      return;
    }

    if (!formData.hospitalId) {
      toast.error('Please select hospital');
      return;
    }

    setLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const verId = createEmergencyRequest({
        userId: user!.id,
        userName: formData.name,
        userPhone: formData.phone,
        bloodGroup: formData.bloodGroup as BloodGroup,
        units: parseInt(formData.units),
        hospitalId: formData.hospitalId,
        hospitalName: formData.hospitalName,
      });

      // Notify admin via Web3Forms
      try {
        const web3FormData = new FormData();
        web3FormData.append("access_key", "cfe8db01-5b57-4006-95e5-21c63f85b72a");
        web3FormData.append("subject", `EMERGENCY BLOOD REQUEST: ${formData.bloodGroup} needed`);
        web3FormData.append("from_name", "BloodDonation.in Emergency Alert");
        web3FormData.append("patient_name", formData.name);
        web3FormData.append("contact", formData.phone);
        web3FormData.append("blood_group", formData.bloodGroup);
        web3FormData.append("units", formData.units);
        web3FormData.append("hospital", formData.hospitalName);
        web3FormData.append("verification_id", verId);
        web3FormData.append("message", `New emergency blood request for ${formData.bloodGroup} at ${formData.hospitalName}. Patient: ${formData.name}, Units: ${formData.units}, Contact: ${formData.phone}`);

        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: web3FormData
        });
      } catch (e) {
        console.error("Web3Forms notification failed", e);
      }

      setVerificationId(verId);
      setSubmitted(true);
      toast.success(
        <div>
          <p className="font-semibold">Request Submitted!</p>
          <p className="text-sm mt-1">Verification ID: <span className="font-mono font-bold">{verId}</span></p>
        </div>,
        { duration: 8000 }
      );

      // Redirect after 5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (submitted) {
    return (
      <Layout>
        <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card className={`text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardContent className="p-8">
                <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Request Submitted!
                </h2>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your emergency blood request has been submitted successfully.
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    Your Verification ID
                  </p>
                  <p className={`text-3xl font-mono font-bold tracking-wider ${isDarkMode ? 'text-yellow-400' : 'text-yellow-900'}`}>
                    {verificationId}
                  </p>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    Please save this ID and show it at the hospital
                  </p>
                </div>

                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  We are notifying nearby donors. You will receive a call/SMS shortly.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Alert Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-600 text-white p-4 rounded-lg mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="font-semibold mb-1">Emergency Blood Request</h3>
              <p className="text-sm text-red-100">
                This will notify nearby donors and hospitals immediately. Please ensure all
                information is accurate.
              </p>
            </div>
          </motion.div>

          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : ''}>Emergency Request Form</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                Fill in the details for urgent blood requirement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : ''}>
                    Patient Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className={isDarkMode ? 'text-gray-300' : ''}>
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91-9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className={isDarkMode ? 'text-gray-300' : ''}>
                      Blood Group Required <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value: BloodGroup) =>
                        setFormData({ ...formData, bloodGroup: value })
                      }
                      required
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

                  <div className="space-y-2">
                    <Label htmlFor="units" className={isDarkMode ? 'text-gray-300' : ''}>
                      Units Required <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="units"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="1"
                      value={formData.units}
                      onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital" className={isDarkMode ? 'text-gray-300' : ''}>
                    Preferred Hospital <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.hospitalId}
                    onValueChange={(value) => {
                      const hospital = hospitals.find((h) => h.id === value);
                      setFormData({
                        ...formData,
                        hospitalId: value,
                        hospitalName: hospital?.name || '',
                      });
                    }}
                    required
                  >
                    <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                      <SelectValue placeholder="Select hospital" />
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

                {formData.hospitalId && formData.bloodGroup && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Availability at {formData.hospitalName}:
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {hospitals.find((h) => h.id === formData.hospitalId)?.bloodStock[
                        formData.bloodGroup as BloodGroup
                      ] || 0}{' '}
                      units
                    </p>
                  </div>
                )}

                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    What happens next?
                  </h4>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>✓ Nearby donors will be notified via SMS/Push notification</li>
                    <li>✓ Hospital will be informed about your request</li>
                    <li>✓ You will receive confirmation call within 10 minutes</li>
                    <li>✓ Track request status in your dashboard</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                  disabled={loading}
                >
                  {loading ? (
                    'Submitting Request...'
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Emergency Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}