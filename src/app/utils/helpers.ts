import { BloodGroup, Hospital } from '../context/AppContext';

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getBloodAvailabilityStatus = (
  units: number
): 'available' | 'limited' | 'unavailable' => {
  if (units >= 20) return 'available';
  if (units > 0) return 'limited';
  return 'unavailable';
};

export const getStatusColor = (status: 'available' | 'limited' | 'unavailable'): string => {
  switch (status) {
    case 'available':
      return 'bg-green-500';
    case 'limited':
      return 'bg-orange-500';
    case 'unavailable':
      return 'bg-red-500';
  }
};

export const getStatusBadgeColor = (
  status: 'available' | 'limited' | 'unavailable'
): string => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'limited':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'unavailable':
      return 'bg-red-100 text-red-800 border-red-200';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getHospitalAvailability = (
  hospital: Hospital,
  bloodGroup?: BloodGroup
): 'available' | 'limited' | 'unavailable' => {
  if (bloodGroup) {
    return getBloodAvailabilityStatus(hospital.bloodStock[bloodGroup]);
  }

  // Check overall availability
  const totalUnits = Object.values(hospital.bloodStock).reduce((sum, units) => sum + units, 0);
  if (totalUnits >= 100) return 'available';
  if (totalUnits > 0) return 'limited';
  return 'unavailable';
};

export const sortHospitalsByDistance = (
  hospitals: Hospital[],
  userLat: number,
  userLng: number
): Hospital[] => {
  return [...hospitals].sort((a, b) => {
    const distA = calculateDistance(userLat, userLng, a.lat, a.lng);
    const distB = calculateDistance(userLat, userLng, b.lat, b.lng);
    return distA - distB;
  });
};

export const generateMockData = () => {
  // Generate some mock emergency requests
  const mockRequests = [
    {
      id: 'req_1',
      userId: 'user_1',
      userName: 'Rajesh Kumar',
      userPhone: '+91-9876543210',
      bloodGroup: 'O+' as BloodGroup,
      units: 2,
      hospitalId: 'h1',
      hospitalName: 'SMS Hospital',
      status: 'pending' as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'req_2',
      userId: 'user_2',
      userName: 'Priya Sharma',
      userPhone: '+91-9876543211',
      bloodGroup: 'A+' as BloodGroup,
      units: 3,
      hospitalId: 'h2',
      hospitalName: 'Fortis Escorts Hospital',
      status: 'accepted' as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      acceptedBy: 'Donor_1',
    },
  ];

  // Generate mock donation history
  const mockHistory = [
    {
      id: 'don_1',
      donorId: 'donor_1',
      donorName: 'Amit Singh',
      hospitalId: 'h1',
      hospitalName: 'SMS Hospital',
      bloodGroup: 'O+' as BloodGroup,
      units: 1,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    },
    {
      id: 'don_2',
      donorId: 'donor_2',
      donorName: 'Neha Gupta',
      hospitalId: 'h3',
      hospitalName: 'Eternal Heart Care Centre',
      bloodGroup: 'A+' as BloodGroup,
      units: 1,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
  ];

  return { mockRequests, mockHistory };
};
