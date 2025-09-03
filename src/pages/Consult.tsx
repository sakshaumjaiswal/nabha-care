import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { BookingModal } from '@/components/modals/BookingModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, 
  Clock, 
  Star, 
  MapPin, 
  Search,
  Filter,
  Calendar as CalendarIcon,
  User
} from 'lucide-react';

const Consult: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    doctorId: string;
    doctorName: string;
    isImmediate: boolean;
  }>({
    isOpen: false,
    doctorId: '',
    doctorName: '',
    isImmediate: false
  });
  
  const { toast } = useToast();

  const specialties = [
    'General Medicine',
    'Gynecology',
    'Pediatrics',
    'Cardiology',
    'Dermatology',
    'Orthopedics'
  ];

  const mockDoctors = [
    {
      id: '1',
      name: 'Dr. Amar Singh',
      specialty: 'General Medicine',
      rating: 4.8,
      village: 'Nabha',
      availability: 'Available Now',
      consultationFee: '₹200',
      experience: '15 years',
      nextSlot: '2:30 PM',
      isOnline: true
    },
    {
      id: '2',
      name: 'Dr. Seema Kaur',
      specialty: 'Gynecology',
      rating: 4.7,
      village: 'Nabha',
      availability: 'Next Available: 3:00 PM',
      consultationFee: '₹300',
      experience: '12 years',
      nextSlot: '3:00 PM',
      isOnline: false
    },
    {
      id: '3',
      name: 'Dr. Rajesh Patel',
      specialty: 'Pediatrics',
      rating: 4.9,
      village: 'Patran',
      availability: 'Available Now',
      consultationFee: '₹250',
      experience: '18 years',
      nextSlot: '2:45 PM',
      isOnline: true
    }
  ];

  const availableSlots = [
    '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_online', true);

      if (error) throw error;
      
      // Use fetched doctors if available, otherwise fall back to mock data
      const doctorsWithProfiles = (data || []).map(doctor => ({
        id: doctor.id,
        name: `Doctor ${doctor.id.substring(0, 8)}`, // Temporary name since we can't join profiles
        specialty: doctor.specialties?.[0] || 'General Medicine',
        rating: doctor.rating || 4.5,
        village: 'Available',
        availability: 'Available Now',
        consultationFee: `₹${doctor.consultation_fee || 200}`,
        experience: '10+ years',
        nextSlot: '2:30 PM',
        isOnline: doctor.is_online
      }));

      setDoctors(doctorsWithProfiles.length > 0 ? doctorsWithProfiles : mockDoctors);
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
      // Use mock data as fallback
      setDoctors(mockDoctors);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (doctorId: string, doctorName: string, isImmediate: boolean = false) => {
    setBookingModal({
      isOpen: true,
      doctorId,
      doctorName,
      isImmediate
    });
  };

  const handleTimeSlotClick = (slot: string) => {
    toast({
      title: "Time Slot Selected",
      description: `Selected ${slot} - Please select a doctor to book this slot`,
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Consultation</h1>
          <p className="text-muted-foreground">
            Connect with certified doctors via video call or schedule an appointment
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Find Your Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors or specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Doctors List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Available Doctors</h2>
              <p className="text-sm text-muted-foreground">
                {filteredDoctors.length} doctors found
              </p>
            </div>
            
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-medium transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{doctor.name}</h3>
                            {doctor.isOnline && (
                              <Badge variant="secondary" className="bg-medical-success/10 text-medical-success">
                                Online
                              </Badge>
                            )}
                          </div>
                          <p className="text-medical-primary font-medium mb-2">{doctor.specialty}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{doctor.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{doctor.village}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{doctor.experience}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {doctor.availability}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-medical-primary mb-2">
                          {doctor.consultationFee}
                        </p>
                        <div className="space-y-2">
                          {doctor.isOnline ? (
                            <Button 
                              variant="medical" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleBooking(doctor.id, doctor.name, true)}
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Start Now
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleBooking(doctor.id, doctor.name, false)}
                            >
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              Schedule
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="w-full">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </CardContent>
            </Card>

            {/* Available Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Available Slots</CardTitle>
                <CardDescription>
                  {selectedDate?.toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant="outline"
                      size="sm"
                      className="justify-center"
                      onClick={() => handleTimeSlotClick(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="border-medical-error/30 bg-medical-error/5">
              <CardHeader>
                <CardTitle className="text-base text-medical-error">Emergency?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  For medical emergencies, call immediately:
                </p>
                <Button variant="destructive" className="w-full" asChild>
                  <a href="tel:102">Call 102 (Ambulance)</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal(prev => ({ ...prev, isOpen: false }))}
        doctorId={bookingModal.doctorId}
        doctorName={bookingModal.doctorName}
        isImmediate={bookingModal.isImmediate}
      />
    </div>
  );
};

export default Consult;