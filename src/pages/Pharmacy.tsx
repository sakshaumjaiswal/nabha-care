import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePharmacy } from '@/hooks/usePharmacy';
import { useToast } from '@/hooks/use-toast';
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
  Package,
  Loader2
} from 'lucide-react';

const Pharmacy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchType, setSearchType] = useState<'medicine' | 'pharmacy'>('medicine');
  const [locationEnabled, setLocationEnabled] = useState(false);
  
  const { pharmacies, loading, fetchPharmacies } = usePharmacy();
  const { toast } = useToast();

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleLocationUse = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationEnabled(true);
          toast({
            title: "Location Access Granted",
            description: "Showing pharmacies near your location",
          });
        },
        (error) => {
          toast({
            title: "Location Access Denied",
            description: "Please enable location access or search manually",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
    }
  };

  const handleRequestDelivery = (pharmacyName: string) => {
    toast({
      title: "Delivery Requested",
      description: `Your delivery request has been sent to ${pharmacyName}. They will contact you shortly.`,
    });
  };

  const handleDirections = (address: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

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

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    if (searchType === 'pharmacy') {
      return pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (pharmacy.address && pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    // Medicine search logic would require fetching inventory for all pharmacies,
    // which is complex for this page. We will focus on pharmacy search for now.
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Pharmacy</h1>
          <p className="text-muted-foreground">
            Locate nearby pharmacies and check medicine availability
          </p>
        </div>

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

              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLocationUse}
                disabled={locationEnabled}
              >
                <Navigation className="h-4 w-4 mr-2" />
                {locationEnabled ? 'Location Enabled' : 'Use Location'}
              </Button>
            </div>

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

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Nearby Pharmacies</h2>
              <p className="text-sm text-muted-foreground">{filteredPharmacies.length} pharmacies found</p>
            </div>

            {filteredPharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="hover:shadow-medium transition-all duration-200">
                <CardContent className="p-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center"><Store className="h-6 w-6 text-white" /></div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1"><MapPin className="h-4 w-4" /><span>{pharmacy.address || pharmacy.village}</span></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {pharmacy.is_active ? <span className="text-medical-success">Open</span> : <span className="text-medical-error">Closed</span>}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" asChild><a href={`tel:${pharmacy.phone}`}><Phone className="h-4 w-4 mr-2" />Call</a></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDirections(pharmacy.address || pharmacy.village)}><MapPin className="h-4 w-4 mr-2" />Directions</Button>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4"><Package className="h-5 w-5 text-medical-primary" /><h4 className="font-medium">Medicine Availability</h4></div>
                        <div className="p-4 border rounded-lg bg-surface-muted text-center text-sm text-muted-foreground">
                            Search for a specific medicine to check availability.
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button variant="medical" size="sm" disabled={!pharmacy.is_active} onClick={() => handleRequestDelivery(pharmacy.name)}>Request Delivery</Button>
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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