import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Stethoscope,
  Activity,
  Syringe,
  Hospital,
  UserCheck,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Building2,
  Shield,
  FileText,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { calculateDistance, formatDate } from '../utils/helpers';

export default function HealthcarePage() {
  const { user, hospitals, healthcareAppointments, createHealthcareAppointment, userLocation, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedGovernmentScheme, setSelectedGovernmentScheme] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const governmentHospitals = hospitals.filter(h => h.isGovernment);

  const healthcareServices = [
    {
      id: 'checkup',
      name: 'General Check-up',
      icon: Stethoscope,
      description: 'Free comprehensive health examination',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      id: 'consultation',
      name: 'Specialist Consultation',
      icon: UserCheck,
      description: 'Consult with medical specialists',
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    },
    {
      id: 'blood-test',
      name: 'Blood Tests',
      icon: Activity,
      description: 'Free diagnostic blood tests',
      color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    },
    {
      id: 'vaccination',
      name: 'Vaccination',
      icon: Syringe,
      description: 'Free immunization services',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    },
    {
      id: 'surgery',
      name: 'Surgery',
      icon: Hospital,
      description: 'Free surgical procedures (eligible)',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    },
    {
      id: 'emergency',
      name: 'Emergency Care',
      icon: AlertCircle,
      description: '24/7 free emergency treatment',
      color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    },
  ];

  const governmentSchemes = [
    'Ayushman Bharat (PMJAY)',
    'Rajasthan Bhamashah Swasthya Bima Yojana',
    'Chief Minister Jan Arogya Yojana',
    'Mahatma Gandhi Rajasthan Swasthya Bima Yojana',
    'BPL Card Holder',
    'Senior Citizen (Above 60)',
    'Government Employee/Officer',
    'None - General Category',
  ];

  const handleBookAppointment = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsDialogOpen(true);
  };

  const handleSubmitAppointment = () => {
    if (!selectedHospitalId || !appointmentDate || !selectedService) {
      toast.error('Please fill all required fields');
      return;
    }

    const hospital = hospitals.find(h => h.id === selectedHospitalId);
    if (!hospital) return;

    const isFree = hospital.isGovernment || selectedGovernmentScheme !== 'None - General Category';

    const verificationId = createHealthcareAppointment({
      userId: user!.id,
      userName: user!.name,
      userPhone: user!.phone || '',
      serviceType: selectedService as any,
      hospitalId: selectedHospitalId,
      hospitalName: hospital.name,
      appointmentDate,
      isFree,
      governmentScheme: isFree ? selectedGovernmentScheme : undefined,
    });

    setIsDialogOpen(false);
    toast.success(
      <div>
        <p className="font-semibold">Appointment Booked Successfully!</p>
        <p className="text-sm mt-1">Verification ID: <span className="font-mono font-bold">{verificationId}</span></p>
        <p className="text-xs mt-1">Show this ID at the hospital</p>
      </div>,
      { duration: 8000 }
    );

    // Reset form
    setSelectedService('');
    setSelectedHospitalId('');
    setAppointmentDate('');
    setSelectedGovernmentScheme('');
  };

  const userAppointments = healthcareAppointments.filter(app => app.userId === user?.id);
  const sortedAppointments = [...userAppointments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sortedHospitals = [...governmentHospitals].sort((a, b) => {
    if (!userLocation) return 0;
    const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
    const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
    return distA - distB;
  });

  if (!user) return null;

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Government Healthcare Services
              </h1>
              <Badge className="bg-green-600 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2 inline" />
                100% Free
              </Badge>
            </div>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Access free healthcare services at government hospitals in Jaipur, Rajasthan
            </p>
          </motion.div>

          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
              <TabsTrigger value="services">Healthcare Services</TabsTrigger>
              <TabsTrigger value="hospitals">Government Hospitals</TabsTrigger>
              <TabsTrigger value="appointments">My Appointments</TabsTrigger>
              <TabsTrigger value="schemes">Government Schemes</TabsTrigger>
            </TabsList>

            {/* Healthcare Services */}
            <TabsContent value="services">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {healthcareServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className={isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-green-600' : 'hover:border-green-500'}>
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-3`}>
                          <service.icon className="w-6 h-6" />
                        </div>
                        <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {service.name}
                        </CardTitle>
                        <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => handleBookAppointment(service.id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Book Appointment
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Government Hospitals */}
            <TabsContent value="hospitals">
              <div className="space-y-4">
                {sortedHospitals.map((hospital) => {
                  const distance = userLocation
                    ? calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng)
                    : null;

                  return (
                    <Card key={hospital.id} className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {hospital.name}
                              </h3>
                              <Badge className="bg-green-600 text-white">Government</Badge>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                              {hospital.address}
                            </p>
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <Phone className="w-4 h-4" />
                                <span>{hospital.phone}</span>
                              </div>
                              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <Mail className="w-4 h-4" />
                                <span>{hospital.email}</span>
                              </div>
                              {distance && (
                                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <MapPin className="w-4 h-4" />
                                  <span>{distance.toFixed(1)} KM away</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => navigate(`/hospital/${hospital.id}`)}
                            variant="outline"
                            className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                          >
                            View Details
                          </Button>
                        </div>

                        {hospital.freeHealthcareServices && hospital.freeHealthcareServices.length > 0 && (
                          <div className={`border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Free Services Available:
                            </h4>
                            <div className="grid md:grid-cols-2 gap-2">
                              {hospital.freeHealthcareServices.map((service, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span>{service}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* My Appointments */}
            <TabsContent value="appointments">
              {sortedAppointments.length === 0 ? (
                <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                  <CardContent className="p-12 text-center">
                    <CalendarCheck className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      No Appointments Yet
                    </h3>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Book your first healthcare appointment to see it here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sortedAppointments.map((appointment) => (
                    <Card key={appointment.id} className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {appointment.serviceType.charAt(0).toUpperCase() + appointment.serviceType.slice(1).replace('-', ' ')}
                              </h3>
                              <Badge
                                className={
                                  appointment.status === 'confirmed'
                                    ? 'bg-green-600 text-white'
                                    : appointment.status === 'completed'
                                    ? 'bg-blue-600 text-white'
                                    : appointment.status === 'cancelled'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-yellow-600 text-white'
                                }
                              >
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                              {appointment.isFree && (
                                <Badge className="bg-green-600 text-white">Free</Badge>
                              )}
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                              {appointment.hospitalName}
                            </p>
                            <div className="grid md:grid-cols-2 gap-2 text-sm mb-3">
                              <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                <span className="font-medium">Appointment Date:</span> {new Date(appointment.appointmentDate).toLocaleDateString()}
                              </div>
                              <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                <span className="font-medium">Booked On:</span> {formatDate(appointment.createdAt)}
                              </div>
                              {appointment.governmentScheme && (
                                <div className={`col-span-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <span className="font-medium">Scheme:</span> {appointment.governmentScheme}
                                </div>
                              )}
                            </div>
                            <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3`}>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-yellow-600" />
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                                  Verification ID:
                                </span>
                                <span className={`text-sm font-mono font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                                  {appointment.verificationId}
                                </span>
                              </div>
                              <p className={`text-xs mt-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                                Please show this ID at the hospital for verification
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Government Schemes */}
            <TabsContent value="schemes">
              <div className="space-y-4">
                <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      Available Government Health Schemes in Rajasthan
                    </CardTitle>
                    <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      These schemes provide free or subsidized healthcare services to eligible citizens
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: 'Ayushman Bharat (PMJAY)',
                          description: 'Provides health coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization',
                          eligibility: 'Based on SECC 2011 database, covers poor and vulnerable families',
                        },
                        {
                          name: 'Rajasthan Bhamashah Swasthya Bima Yojana',
                          description: 'Comprehensive health insurance scheme covering ₹3-5 lakh per family',
                          eligibility: 'All families with Bhamashah card',
                        },
                        {
                          name: 'Chief Minister Jan Arogya Yojana',
                          description: 'Free OPD and IPD services at government hospitals',
                          eligibility: 'All residents of Rajasthan',
                        },
                        {
                          name: 'Mahatma Gandhi Rajasthan Swasthya Bima Yojana',
                          description: 'Insurance coverage for critical illnesses and surgeries',
                          eligibility: 'BPL families and unorganized workers',
                        },
                      ].map((scheme, idx) => (
                        <div
                          key={idx}
                          className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {scheme.name}
                              </h4>
                              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {scheme.description}
                              </p>
                              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                <span className="font-medium">Eligibility:</span> {scheme.eligibility}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Book Appointment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Book Healthcare Appointment
            </DialogTitle>
            <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Fill in the details to book your free healthcare appointment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="hospital" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Select Government Hospital *
              </Label>
              <Select value={selectedHospitalId} onValueChange={setSelectedHospitalId}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                  <SelectValue placeholder="Choose a hospital" />
                </SelectTrigger>
                <SelectContent>
                  {governmentHospitals.map((hospital) => (
                    <SelectItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scheme" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Government Scheme / Eligibility *
              </Label>
              <Select value={selectedGovernmentScheme} onValueChange={setSelectedGovernmentScheme}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                  <SelectValue placeholder="Select your scheme" />
                </SelectTrigger>
                <SelectContent>
                  {governmentSchemes.map((scheme) => (
                    <SelectItem key={scheme} value={scheme}>
                      {scheme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Preferred Appointment Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>
            <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3`}>
              <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                <strong>Note:</strong> You will receive a unique verification ID after booking. Please bring your Aadhaar card and the verification ID to the hospital.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className={`flex-1 ${isDarkMode ? 'border-gray-600 text-gray-300' : ''}`}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAppointment}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
