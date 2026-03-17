import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import Layout from '../components/Layout';
import { useApp, BloodGroup, Hospital } from '../context/AppContext';
import {
  Search,
  MapPin,
  Navigation,
  Phone,
  Clock,
  Filter,
  X,
  Mail,
  Ambulance,
  Building2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  calculateDistance,
  formatDate,
  getBloodAvailabilityStatus,
  getStatusBadgeColor,
} from '../utils/helpers';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom hospital marker icon
const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619032.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// User location marker icon
const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to recenter map
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function MapPage() {
  const { user, hospitals, userLocation, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Jaipur');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'all'>('all');
  const [radiusFilter, setRadiusFilter] = useState<number>(15);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([26.9124, 75.7873]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [user, navigate, userLocation]);

  const jairpurAreas = [
    'Malviya Nagar',
    'Mansarovar',
    'Vaishali Nagar',
    'Jagatpura',
    'Pratap Nagar',
    'Vidyadhar Nagar',
    'C-Scheme',
    'Raja Park',
    'Tonk Road',
    'Nirman Nagar',
  ];

  const filteredHospitals = useMemo(() => {
    let filtered = hospitals.filter((h) => h.city === selectedCity);

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by blood group
    if (selectedBloodGroup !== 'all') {
      filtered = filtered.filter((h) => h.bloodStock[selectedBloodGroup] > 0);
    }

    // Filter by radius
    if (userLocation) {
      filtered = filtered.filter((h) => {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng);
        return distance <= radiusFilter;
      });
    }

    return filtered;
  }, [hospitals, selectedCity, searchQuery, selectedBloodGroup, radiusFilter, userLocation]);

  const bloodGroups: (BloodGroup | 'all')[] = ['all', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleGetDirections = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
    window.open(url, '_blank');
  };

  if (!user) return null;

  return (
    <Layout>
      <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header Controls */}
        <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <Input
                  placeholder="Search hospitals or areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {/* Search suggestions */}
                {searchQuery && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-md shadow-lg z-50 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border max-h-60 overflow-y-auto`}>
                    {jairpurAreas
                      .filter((area) => area.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((area) => (
                        <button
                          key={area}
                          onClick={() => setSearchQuery(area)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        >
                          <MapPin className="w-4 h-4 inline mr-2" />
                          {area}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className={`w-32 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jaipur">Jaipur</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedBloodGroup} onValueChange={(value: any) => setSelectedBloodGroup(value)}>
                  <SelectTrigger className={`w-32 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                    <SelectValue placeholder="Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg === 'all' ? 'All Groups' : bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={radiusFilter.toString()} onValueChange={(value) => setRadiusFilter(Number(value))}>
                  <SelectTrigger className={`w-32 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 KM</SelectItem>
                    <SelectItem value="10">10 KM</SelectItem>
                    <SelectItem value="15">15 KM</SelectItem>
                    <SelectItem value="25">25 KM</SelectItem>
                    <SelectItem value="50">50 KM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={`flex items-center gap-2 mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Filter className="w-4 h-4" />
              <span>
                Showing {filteredHospitals.length} of {hospitals.length} hospitals
              </span>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={12}
            className="h-full w-full z-0"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} />

            {/* User Location Marker */}
            {userLocation && (
              <>
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                  <Popup>
                    <div className="p-2">
                      <p className="font-semibold">Your Location</p>
                      <p className="text-sm text-gray-600">Current position</p>
                    </div>
                  </Popup>
                </Marker>
                {/* Radius Circle */}
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={radiusFilter * 1000}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
              </>
            )}

            {/* Hospital Markers */}
            {filteredHospitals.map((hospital) => {
              const distance = userLocation
                ? calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng)
                : null;
              const totalUnits = Object.values(hospital.bloodStock).reduce((a, b) => a + b, 0);
              const status = getBloodAvailabilityStatus(totalUnits);

              return (
                <Marker
                  key={hospital.id}
                  position={[hospital.lat, hospital.lng]}
                  icon={hospitalIcon}
                  eventHandlers={{
                    click: () => setSelectedHospital(hospital),
                  }}
                >
                  <Popup>
                    <div className="p-3 min-w-[300px]">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-base">{hospital.name}</h3>
                        {hospital.isGovernment && (
                          <Badge className="bg-green-600 text-white ml-2" variant="default">
                            Govt
                          </Badge>
                        )}
                        <Badge className={`${getStatusBadgeColor(status)} ml-2`} variant="outline">
                          {status === 'available' ? 'Available' : status === 'limited' ? 'Limited' : 'Out'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{hospital.address}</p>
                      
                      {/* Contact Information */}
                      <div className="space-y-2 mb-3 border-t pt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span className="break-all">{hospital.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="break-all">{hospital.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <Ambulance className="w-3 h-3 flex-shrink-0" />
                          <span className="font-semibold">{hospital.ambulanceNumber}</span>
                        </div>
                      </div>
                      
                      {distance && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{distance.toFixed(1)} KM away from you</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Clock className="w-3 h-3" />
                        <span>Updated {formatDate(hospital.lastUpdated)}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-1 mb-3">
                        {(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as BloodGroup[]).map((bg) => (
                          <div
                            key={bg}
                            className={`text-center p-1 rounded text-xs ${
                              hospital.bloodStock[bg] > 10
                                ? 'bg-green-50'
                                : hospital.bloodStock[bg] > 0
                                ? 'bg-orange-50'
                                : 'bg-red-50'
                            }`}
                          >
                            <div className="font-medium">{bg}</div>
                            <div className="text-xs">{hospital.bloodStock[bg]}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigate(`/hospital/${hospital.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={() => handleGetDirections(hospital)}
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Selected Hospital Card (floating) */}
          {selectedHospital && (
            <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:w-96 z-[1000]">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedHospital.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedHospital.address}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedHospital(null)}
                      className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {(['A+', 'B+', 'O+', 'AB+'] as BloodGroup[]).map((bg) => (
                      <div key={bg} className={`text-center p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{bg}</div>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedHospital.bloodStock[bg]}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className={`flex-1 ${isDarkMode ? 'border-gray-600 text-gray-300' : ''}`}
                      onClick={() => navigate(`/hospital/${selectedHospital.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => handleGetDirections(selectedHospital)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Legend */}
          <div className={`absolute top-4 right-4 z-[1000] rounded-lg shadow-lg p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Available (20+ units)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Limited (1-19 units)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Unavailable (0 units)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}