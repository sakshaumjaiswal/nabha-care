import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingModal } from '@/components/modals/BookingModal';
import { Star, Search, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface DoctorProfile {
    id: string; // This is the user_id from auth.users
    name: string;
    specialties: string[];
    rating: number;
    is_online: boolean;
}

const Consult: React.FC = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    doctor: { id: string, name: string };
  }>({
    isOpen: false,
    doctor: { id: '', name: '' }
  });

  useEffect(() => {
    if (!authLoading && !profile) {
      navigate('/auth');
    }
  }, [profile, authLoading, navigate]);
  
  useEffect(() => {
    const fetchDoctors = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                user_id,
                name,
                doctors (
                    specialties,
                    rating,
                    is_online
                )
            `)
            .eq('role', 'doctor');

        if (error) {
            console.error("Error fetching doctors", error);
        } else {
            const transformedData = data
                .filter(d => d.doctors.length > 0) // Ensure profile is associated with a doctor entry
                .map(d => ({
                    id: d.user_id,
                    name: d.name,
                    specialties: d.doctors[0]?.specialties || ['General'],
                    rating: d.doctors[0]?.rating || 4.5,
                    is_online: d.doctors[0]?.is_online || false,
                }));
            setDoctors(transformedData);
        }
        setLoading(false);
    };
    fetchDoctors();
  }, []);

  const specialties = [
    'General Physician', 'Dermatology', 'Psychiatry', 'Pediatrics',
    'Gynecology', 'ENT', 'Cardiology', 'Gastroenterology'
  ];

  const handleBooking = (doctor: DoctorProfile) => {
    if (!profile) {
        navigate('/auth');
        return;
    }
    setBookingModal({
      isOpen: true,
      doctor: { id: doctor.id, name: doctor.name },
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'all' || doctor.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book a Consultation</h1>
          <p className="text-muted-foreground">
            Find and connect with top-rated doctors for your health needs.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
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
                  <SelectValue placeholder="Filter by specialty..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
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

        <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Available Doctors</h2>
              <p className="text-sm text-muted-foreground">
                {filteredDoctors.length} doctors found
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-medium transition-all duration-200 flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-20 w-20 border-2 border-medical-primary/20">
                                <AvatarImage src={`https://placehold.co/100x100/E2F5F3/333333?text=${doctor.name.charAt(0)}`} alt={doctor.name} />
                                <AvatarFallback>{doctor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold">{doctor.name}</h3>
                              <p className="text-medical-primary font-medium">{doctor.specialties.join(', ')}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">{doctor.rating}</span>
                              </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-auto">
                        {doctor.is_online ? (
                             <Button 
                             variant="medical" 
                             className="w-full"
                             onClick={() => handleBooking(doctor)}
                           >
                             Consult Now
                           </Button>
                        ) : (
                            <Button variant="outline" disabled className="w-full">
                                Currently Offline
                            </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>
      </div>

      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, doctor: {id: '', name: ''} })}
        doctor={bookingModal.doctor}
      />
    </div>
  );
};

export default Consult;