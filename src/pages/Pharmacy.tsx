import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Search, 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Navigation,
  Store,
  Package
} from 'lucide-react';

const Pharmacy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchType, setSearchType] = useState<'medicine' | 'pharmacy'>('medicine');

  const mockPharmacies = [
    {
      id: '1',
      name: 'Nabha Medical Store',
      address: 'Main Market, Nabha',
      phone: '+91 98765 43210',
      distance: '0.5 km',
      isOpen: true,
      openUntil: '10:00 PM',
      rating: 4.5,
      inventory: {
        'Paracetamol': { available: true, stock: 25 },
        'Amoxicillin': { available: false, stock: 0 },
        'Omeprazole': { available: true, stock: 8 },
        'Aspirin': { available: true, stock: 15 }
      }
    },
    {
      id: '2',
      name: 'City Pharmacy',
      address: 'Near Bus Stand, Nabha',
      phone: '+91 98765 43211',
      distance: '1.2 km',
      isOpen: true,
      openUntil: '9:00 PM',
      rating: 4.2,
      inventory: {
        'Paracetamol': { available: true, stock: 45 },
        'Amoxicillin': { available: true, stock: 12 },
        'Omeprazole': { available: false, stock: 0 },
        'Aspirin': { available: true, stock: 30 }
      }
    },
    {
      id: '3',
      name: 'Health Plus Pharmacy',
      address: 'Hospital Road, Nabha',
      phone: '+91 98765 43212',
      distance: '2.1 km',
      isOpen: false,
      openUntil: 'Closed',
      rating: 4.7,
      inventory: {
        'Paracetamol': { available: true, stock: 60 },
        'Amoxicillin': { available: true, stock: 18 },
        'Omeprazole': { available: true, stock: 22 },
        'Aspirin': { available: true, stock: 40 }
      }
    }
  ];

  const commonMedicines = [
    'Paracetamol', 'Amoxicillin', 'Omeprazole', 'Aspirin', 'Ibuprofen', 
    'Cetirizine', 'Metformin', 'Amlodipine', 'Atorvastatin', 'Pantoprazole'
  ];

  const getAvailabilityIcon = (available: boolean, stock: number) => {
    if (!available || stock === 0) return XCircle;
    if (stock < 10) return AlertTriangle;
    return CheckCircle;
  };

  const getAvailabilityColor = (available: boolean, stock: number) => {
    if (!available || stock === 0) return 'text-medical-error';
    if (stock < 10) return 'text-medical-warning';
    return 'text-medical-success';
  };

  const getAvailabilityText = (available: boolean, stock: number) => {
    if (!available || stock === 0) return 'Out of Stock';
    if (stock < 10) return `Low Stock (${stock})`;
    return `In Stock (${stock})`;
  };

  const filteredPharmacies = mockPharmacies.filter(pharmacy => {
    if (searchType === 'pharmacy') {
      return pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      // Filter by medicine availability
      if (!searchQuery) return true;
      return Object.keys(pharmacy.inventory).some(medicine =>
        medicine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Pharmacy</h1>
          <p className="text-muted-foreground">
            Locate nearby pharmacies and check medicine availability
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Select value={searchType} onValueChange={(value: 'medicine' | 'pharmacy') => setSearchType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicine">Search Medicine</SelectItem>
                  <SelectItem value="pharmacy">Search Pharmacy</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchType === 'medicine' ? 'Enter medicine name...' : 'Enter pharmacy name or area...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button variant="outline" className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Use Location
              </Button>
            </div>

            {/* Common Medicines Quick Search */}
            {searchType === 'medicine' && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Common Medicines:</p>
                <div className="flex flex-wrap gap-2">
                  {commonMedicines.slice(0, 6).map((medicine) => (
                    <Badge
                      key={medicine}
                      variant="outline"
                      className="cursor-pointer hover:bg-medical-primary hover:text-white"
                      onClick={() => setSearchQuery(medicine)}
                    >
                      {medicine}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Nearby Pharmacies</h2>
            <p className="text-sm text-muted-foreground">
              {filteredPharmacies.length} pharmacies found
            </p>
          </div>

          {filteredPharmacies.map((pharmacy) => (
            <Card key={pharmacy.id} className="hover:shadow-medium transition-all duration-200">
              <CardContent className="p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Pharmacy Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
                        <Store className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Navigation className="h-4 w-4" />
                          <span>{pharmacy.distance} away</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {pharmacy.isOpen ? (
                            <span className="text-medical-success">Open until {pharmacy.openUntil}</span>
                          ) : (
                            <span className="text-medical-error">Closed</span>
                          )}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${pharmacy.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Medicine Inventory */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="h-5 w-5 text-medical-primary" />
                      <h4 className="font-medium">Medicine Availability</h4>
                    </div>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(pharmacy.inventory).map(([medicine, info]) => {
                        const AvailabilityIcon = getAvailabilityIcon(info.available, info.stock);
                        return (
                          <div
                            key={medicine}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <span className="font-medium text-sm">{medicine}</span>
                            <div className="flex items-center gap-2">
                              <AvailabilityIcon 
                                className={`h-4 w-4 ${getAvailabilityColor(info.available, info.stock)}`} 
                              />
                              <span className={`text-xs ${getAvailabilityColor(info.available, info.stock)}`}>
                                {getAvailabilityText(info.available, info.stock)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="medical" 
                        size="sm"
                        disabled={!pharmacy.isOpen}
                      >
                        Request Delivery
                      </Button>
                      <Button variant="outline" size="sm">
                        View Full Inventory
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Medicine Info */}
        <Card className="mt-8 border-medical-error/30 bg-medical-error/5">
          <CardHeader>
            <CardTitle className="text-base text-medical-error">Emergency Medicine</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Can't find your medicine? Contact these 24/7 pharmacies:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Emergency Pharmacy - Hospital Road</span>
                <Button variant="outline" size="sm" asChild>
                  <a href="tel:+919876543213">Call Now</a>
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">24x7 Medical Store - Main Market</span>
                <Button variant="outline" size="sm" asChild>
                  <a href="tel:+919876543214">Call Now</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pharmacy;