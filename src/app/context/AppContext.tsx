import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type BloodStock = {
  [key in BloodGroup]: number;
};

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  ambulanceNumber: string;
  lat: number;
  lng: number;
  bloodStock: BloodStock;
  lastUpdated: string;
  isGovernment?: boolean;
  freeHealthcareServices?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'donor' | 'admin';
  phone?: string;
  bloodGroup?: BloodGroup;
  age?: number;
  lastDonationDate?: string;
  isAvailable?: boolean;
  hospitalId?: string;
}

export interface EmergencyRequest {
  id: string;
  verificationId: string; // Unique 8-digit verification ID
  userId: string;
  userName: string;
  userPhone: string;
  bloodGroup: BloodGroup;
  units: number;
  hospitalId: string;
  hospitalName: string;
  status: 'pending' | 'accepted' | 'fulfilled' | 'cancelled';
  createdAt: string;
  acceptedBy?: string;
  fulfilledAt?: string;
}

export interface DonationHistory {
  id: string;
  donorId: string;
  donorName: string;
  hospitalId: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  units: number;
  date: string;
}

export interface HealthcareAppointment {
  id: string;
  verificationId: string;
  userId: string;
  userName: string;
  userPhone: string;
  serviceType: 'checkup' | 'consultation' | 'blood-test' | 'vaccination' | 'surgery' | 'emergency';
  hospitalId: string;
  hospitalName: string;
  appointmentDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  isFree: boolean;
  governmentScheme?: string;
}

interface AppContextType {
  user: User | null;
  hospitals: Hospital[];
  emergencyRequests: EmergencyRequest[];
  donationHistory: DonationHistory[];
  healthcareAppointments: HealthcareAppointment[];
  userLocation: { lat: number; lng: number } | null;
  isDarkMode: boolean;
  isHealthcareMode: boolean;
  login: (email: string, password: string, role?: 'user' | 'donor' | 'admin') => Promise<boolean>;
  register: (data: Partial<User> & { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  createEmergencyRequest: (request: Omit<EmergencyRequest, 'id' | 'createdAt' | 'status' | 'verificationId'>) => string;
  updateRequestStatus: (id: string, status: EmergencyRequest['status'], acceptedBy?: string) => void;
  updateHospitalStock: (hospitalId: string, bloodStock: BloodStock) => void;
  addDonationHistory: (donation: Omit<DonationHistory, 'id' | 'date'>) => void;
  createHealthcareAppointment: (appointment: Omit<HealthcareAppointment, 'id' | 'createdAt' | 'status' | 'verificationId'>) => string;
  updateAppointmentStatus: (id: string, status: HealthcareAppointment['status']) => void;
  setUserLocation: (location: { lat: number; lng: number }) => void;
  toggleDarkMode: () => void;
  toggleHealthcareMode: () => void;
  continueAsGuest: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Demo data - 15 Jaipur hospitals with realistic data
const initialHospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'SMS Hospital',
    address: 'JLN Marg, Jaipur, Rajasthan 302004',
    city: 'Jaipur',
    phone: '+91-141-2560291',
    email: 'sms.hospital@rajasthan.gov.in',
    ambulanceNumber: '108',
    lat: 26.9124,
    lng: 75.7873,
    bloodStock: { 'A+': 45, 'A-': 12, 'B+': 38, 'B-': 8, 'O+': 52, 'O-': 15, 'AB+': 22, 'AB-': 5 },
    lastUpdated: '2026-02-17T14:30:00',
    isGovernment: true,
    freeHealthcareServices: [
      'Free General Consultation',
      'Free Blood Tests',
      'Free X-Ray & ECG',
      'Free Emergency Treatment',
      'Free Surgery (BPL Card holders)',
      'Free Vaccination',
      'Free Maternity Care',
      'Free Medicines (Essential Drugs)',
    ],
  },
  {
    id: 'h2',
    name: 'Fortis Escorts Hospital',
    address: 'Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur 302017',
    city: 'Jaipur',
    phone: '+91-141-2547000',
    email: 'fortis.escorts@jaipur.com',
    ambulanceNumber: '+91-141-2547001',
    lat: 26.8517,
    lng: 75.8138,
    bloodStock: { 'A+': 32, 'A-': 8, 'B+': 28, 'B-': 6, 'O+': 40, 'O-': 10, 'AB+': 18, 'AB-': 4 },
    lastUpdated: '2026-02-17T13:45:00',
    isGovernment: false,
  },
  {
    id: 'h3',
    name: 'Eternal Heart Care Centre',
    address: 'Jagatpura Road, Near Nirman Nagar, Jaipur 302017',
    city: 'Jaipur',
    phone: '+91-141-4018000',
    email: 'eternal.heart@jaipur.com',
    ambulanceNumber: '+91-141-4018001',
    lat: 26.8435,
    lng: 75.8547,
    bloodStock: { 'A+': 28, 'A-': 6, 'B+': 25, 'B-': 4, 'O+': 35, 'O-': 8, 'AB+': 15, 'AB-': 3 },
    lastUpdated: '2026-02-17T15:00:00',
    isGovernment: false,
  },
  {
    id: 'h4',
    name: 'Narayana Multispeciality Hospital',
    address: 'Sector 28, Pratap Nagar, Jaipur 302033',
    city: 'Jaipur',
    phone: '+91-141-6745000',
    email: 'narayana.multispeciality@jaipur.com',
    ambulanceNumber: '+91-141-6745001',
    lat: 26.8756,
    lng: 75.7378,
    bloodStock: { 'A+': 50, 'A-': 14, 'B+': 42, 'B-': 10, 'O+': 58, 'O-': 18, 'AB+': 25, 'AB-': 7 },
    lastUpdated: '2026-02-17T14:15:00',
    isGovernment: false,
  },
  {
    id: 'h5',
    name: 'Manipal Hospital',
    address: 'Sector 5, Vidyadhar Nagar, Jaipur 302039',
    city: 'Jaipur',
    phone: '+91-141-3924444',
    email: 'manipal.hospital@jaipur.com',
    ambulanceNumber: '+91-141-3924445',
    lat: 26.9704,
    lng: 75.7708,
    bloodStock: { 'A+': 38, 'A-': 10, 'B+': 32, 'B-': 7, 'O+': 45, 'O-': 12, 'AB+': 20, 'AB-': 5 },
    lastUpdated: '2026-02-17T14:50:00',
    isGovernment: false,
  },
  {
    id: 'h6',
    name: 'Apex Hospital',
    address: 'Sector 8, Malviya Nagar, Jaipur 302017',
    city: 'Jaipur',
    phone: '+91-141-2502000',
    email: 'apex.hospital@jaipur.com',
    ambulanceNumber: '+91-141-2502001',
    lat: 26.8629,
    lng: 75.8221,
    bloodStock: { 'A+': 30, 'A-': 7, 'B+': 26, 'B-': 5, 'O+': 38, 'O-': 9, 'AB+': 16, 'AB-': 3 },
    lastUpdated: '2026-02-17T13:30:00',
    isGovernment: false,
  },
  {
    id: 'h7',
    name: 'CK Birla Hospital (RBM)',
    address: 'Jawaharlal Nehru Marg, Jaipur 302018',
    city: 'Jaipur',
    phone: '+91-141-3188888',
    email: 'ck.birla@jaipur.com',
    ambulanceNumber: '+91-141-3188889',
    lat: 26.8989,
    lng: 75.7873,
    bloodStock: { 'A+': 42, 'A-': 11, 'B+': 35, 'B-': 8, 'O+': 48, 'O-': 13, 'AB+': 21, 'AB-': 6 },
    lastUpdated: '2026-02-17T15:20:00',
    isGovernment: false,
  },
  {
    id: 'h8',
    name: 'Rukmani Birla Hospital',
    address: 'Gopalbari, Jawahar Lal Nehru Marg, Jaipur 302018',
    city: 'Jaipur',
    phone: '+91-141-2741300',
    email: 'rukmani.birla@jaipur.com',
    ambulanceNumber: '+91-141-2741301',
    lat: 26.8945,
    lng: 75.7916,
    bloodStock: { 'A+': 36, 'A-': 9, 'B+': 30, 'B-': 6, 'O+': 42, 'O-': 11, 'AB+': 19, 'AB-': 4 },
    lastUpdated: '2026-02-17T14:00:00',
    isGovernment: false,
  },
  {
    id: 'h9',
    name: 'JK Lon Hospital (Government)',
    address: 'Near Jawahar Circle, Malviya Nagar, Jaipur 302017',
    city: 'Jaipur',
    phone: '+91-141-2503636',
    email: 'jklon.hospital@rajasthan.gov.in',
    ambulanceNumber: '108',
    lat: 26.8673,
    lng: 75.8195,
    bloodStock: { 'A+': 25, 'A-': 5, 'B+': 22, 'B-': 3, 'O+': 32, 'O-': 7, 'AB+': 14, 'AB-': 2 },
    lastUpdated: '2026-02-17T13:15:00',
    isGovernment: true,
    freeHealthcareServices: [
      'Free OPD Consultation',
      'Free Diagnostic Tests',
      'Free Emergency Care',
      'Free Medicines (Generic)',
      'Free Cancer Treatment (Ayushman Bharat)',
      'Free Dialysis',
    ],
  },
  {
    id: 'h10',
    name: 'Jaipur Golden Hospital',
    address: '2, Institutional Area, Sector 3, Rohini, Jaipur 302012',
    city: 'Jaipur',
    phone: '+91-141-2727272',
    email: 'jaipur.golden@jaipur.com',
    ambulanceNumber: '+91-141-2727273',
    lat: 26.9412,
    lng: 75.7845,
    bloodStock: { 'A+': 40, 'A-': 10, 'B+': 34, 'B-': 7, 'O+': 46, 'O-': 12, 'AB+': 20, 'AB-': 5 },
    lastUpdated: '2026-02-17T14:40:00',
    isGovernment: false,
  },
  {
    id: 'h11',
    name: 'Santokba Durlabhji Hospital',
    address: 'Bhawani Singh Marg, Jaipur 302015',
    city: 'Jaipur',
    phone: '+91-141-2566251',
    email: 'santokba.durlabhji@jaipur.com',
    ambulanceNumber: '+91-141-2566252',
    lat: 26.9023,
    lng: 75.7889,
    bloodStock: { 'A+': 34, 'A-': 8, 'B+': 29, 'B-': 6, 'O+': 41, 'O-': 10, 'AB+': 18, 'AB-': 4 },
    lastUpdated: '2026-02-17T15:10:00',
    isGovernment: false,
  },
  {
    id: 'h12',
    name: 'Zanana Hospital (Government)',
    address: 'C-Scheme, Ashok Nagar, Jaipur 302001',
    city: 'Jaipur',
    phone: '+91-141-4024444',
    email: 'zanana.hospital@rajasthan.gov.in',
    ambulanceNumber: '108',
    lat: 26.9115,
    lng: 75.8012,
    bloodStock: { 'A+': 22, 'A-': 4, 'B+': 19, 'B-': 3, 'O+': 28, 'O-': 6, 'AB+': 12, 'AB-': 2 },
    lastUpdated: '2026-02-17T13:00:00',
    isGovernment: true,
    freeHealthcareServices: [
      'Free Maternity Services',
      'Free Gynecology Consultation',
      'Free Prenatal & Postnatal Care',
      'Free Delivery (Normal & C-Section)',
      'Free Newborn Care',
      'Free Family Planning Services',
    ],
  },
  {
    id: 'h13',
    name: 'Paras JK Hospital',
    address: 'Tonk Road, Opposite Sanganer Airport, Jaipur 302018',
    city: 'Jaipur',
    phone: '+91-141-4093333',
    email: 'paras.jk@jaipur.com',
    ambulanceNumber: '+91-141-4093334',
    lat: 26.8207,
    lng: 75.8073,
    bloodStock: { 'A+': 48, 'A-': 13, 'B+': 40, 'B-': 9, 'O+': 54, 'O-': 16, 'AB+': 24, 'AB-': 6 },
    lastUpdated: '2026-02-17T14:25:00',
    isGovernment: false,
  },
  {
    id: 'h14',
    name: 'Mahatma Gandhi Hospital (Government)',
    address: 'Vaishali Nagar, Jaipur 302021',
    city: 'Jaipur',
    phone: '+91-141-4041000',
    email: 'mg.hospital@rajasthan.gov.in',
    ambulanceNumber: '108',
    lat: 26.9156,
    lng: 75.7312,
    bloodStock: { 'A+': 31, 'A-': 7, 'B+': 27, 'B-': 5, 'O+': 37, 'O-': 9, 'AB+': 17, 'AB-': 3 },
    lastUpdated: '2026-02-17T15:30:00',
    isGovernment: true,
    freeHealthcareServices: [
      'Free General Medicine',
      'Free Pediatric Care',
      'Free Cardiology Check-ups',
      'Free Orthopedic Treatment',
      'Free Physiotherapy',
      'Free Mental Health Services',
    ],
  },
  {
    id: 'h15',
    name: 'Satellite Hospital (Government)',
    address: 'Mansarovar, Jaipur 302020',
    city: 'Jaipur',
    phone: '+91-141-2785000',
    email: 'satellite.hospital@rajasthan.gov.in',
    ambulanceNumber: '108',
    lat: 26.8925,
    lng: 75.7506,
    bloodStock: { 'A+': 27, 'A-': 6, 'B+': 23, 'B-': 4, 'O+': 33, 'O-': 8, 'AB+': 15, 'AB-': 3 },
    lastUpdated: '2026-02-17T14:10:00',
    isGovernment: true,
    freeHealthcareServices: [
      'Free Primary Healthcare',
      'Free TB & HIV Treatment',
      'Free Diabetes Screening',
      'Free Health Check-ups (Senior Citizens)',
      'Free Ambulance Services',
    ],
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);
  const [healthcareAppointments, setHealthcareAppointments] = useState<HealthcareAppointment[]>([]);
  const [userLocation, setUserLocationState] = useState<{ lat: number; lng: number } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHealthcareMode, setIsHealthcareMode] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('bloodbank_user');
    const savedRequests = localStorage.getItem('bloodbank_requests');
    const savedHistory = localStorage.getItem('bloodbank_history');
    const savedHospitals = localStorage.getItem('bloodbank_hospitals');
    const savedDarkMode = localStorage.getItem('bloodbank_darkmode');
    const savedHealthcareMode = localStorage.getItem('bloodbank_healthcaremode');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedRequests) setEmergencyRequests(JSON.parse(savedRequests));
    if (savedHistory) setDonationHistory(JSON.parse(savedHistory));
    if (savedHospitals) setHospitals(JSON.parse(savedHospitals));
    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));
    if (savedHealthcareMode) setIsHealthcareMode(JSON.parse(savedHealthcareMode));

    // Try to get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocationState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Jaipur center if geolocation fails
          setUserLocationState({ lat: 26.9124, lng: 75.7873 });
        }
      );
    } else {
      setUserLocationState({ lat: 26.9124, lng: 75.7873 });
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('bloodbank_user', JSON.stringify(user));
    else localStorage.removeItem('bloodbank_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bloodbank_requests', JSON.stringify(emergencyRequests));
  }, [emergencyRequests]);

  useEffect(() => {
    localStorage.setItem('bloodbank_history', JSON.stringify(donationHistory));
  }, [donationHistory]);

  useEffect(() => {
    localStorage.setItem('bloodbank_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('bloodbank_darkmode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('bloodbank_healthcaremode', JSON.stringify(isHealthcareMode));
  }, [isHealthcareMode]);

  const login = async (email: string, password: string, role?: 'user' | 'donor' | 'admin'): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Demo login - accept any email/password
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      role: role || 'user',
      phone: '+91-9876543210',
      bloodGroup: 'O+',
      age: 25,
      isAvailable: true,
    };

    setUser(newUser);
    return true;
  };

  const register = async (data: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name || data.email.split('@')[0],
      email: data.email,
      role: data.role || 'user',
      phone: data.phone,
      bloodGroup: data.bloodGroup,
      age: data.age,
      isAvailable: data.isAvailable || false,
    };

    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bloodbank_user');
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@bloodbank.com',
      role: 'user',
    };
    setUser(guestUser);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const createEmergencyRequest = (request: Omit<EmergencyRequest, 'id' | 'createdAt' | 'status' | 'verificationId'>): string => {
    const verificationId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const newRequest: EmergencyRequest = {
      ...request,
      id: `req_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      verificationId,
    };
    setEmergencyRequests((prev) => [newRequest, ...prev]);
    return verificationId;
  };

  const updateRequestStatus = (id: string, status: EmergencyRequest['status'], acceptedBy?: string) => {
    setEmergencyRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              acceptedBy,
              fulfilledAt: status === 'fulfilled' ? new Date().toISOString() : req.fulfilledAt,
            }
          : req
      )
    );
  };

  const updateHospitalStock = (hospitalId: string, bloodStock: BloodStock) => {
    setHospitals((prev) =>
      prev.map((hospital) =>
        hospital.id === hospitalId
          ? { ...hospital, bloodStock, lastUpdated: new Date().toISOString() }
          : hospital
      )
    );
  };

  const addDonationHistory = (donation: Omit<DonationHistory, 'id' | 'date'>) => {
    const newDonation: DonationHistory = {
      ...donation,
      id: `don_${Date.now()}`,
      date: new Date().toISOString(),
    };
    setDonationHistory((prev) => [newDonation, ...prev]);
  };

  const createHealthcareAppointment = (appointment: Omit<HealthcareAppointment, 'id' | 'createdAt' | 'status' | 'verificationId'>): string => {
    const verificationId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const newAppointment: HealthcareAppointment = {
      ...appointment,
      id: `app_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      verificationId,
    };
    setHealthcareAppointments((prev) => [newAppointment, ...prev]);
    return verificationId;
  };

  const updateAppointmentStatus = (id: string, status: HealthcareAppointment['status']) => {
    setHealthcareAppointments((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status,
            }
          : app
      )
    );
  };

  const setUserLocation = (location: { lat: number; lng: number }) => {
    setUserLocationState(location);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleHealthcareMode = () => {
    setIsHealthcareMode((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        hospitals,
        emergencyRequests,
        donationHistory,
        healthcareAppointments,
        userLocation,
        isDarkMode,
        isHealthcareMode,
        login,
        register,
        logout,
        updateUser,
        createEmergencyRequest,
        updateRequestStatus,
        updateHospitalStock,
        addDonationHistory,
        createHealthcareAppointment,
        updateAppointmentStatus,
        setUserLocation,
        toggleDarkMode,
        toggleHealthcareMode,
        continueAsGuest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};