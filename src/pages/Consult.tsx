import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingModal } from '@/components/modals/BookingModal';
// CORRECTED LINE: Added Stethoscope to the import list
import { Star, Search, Filter, Loader2, Stethoscope } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';
import { useDoctors, DoctorProfile } from '@/hooks/useDoctors';

const Consult: React.FC = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { doctors, loading } = useDoctors();

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
                         (doctor.specialties && doctor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                         (doctor.qualifications && doctor.qualifications.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'all' || (doctor.specialties && doctor.specialties.includes(selectedSpecialty));
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book a Consultation</h1>
          <p className="text-muted-foreground">Find and connect with qualified doctors for your health needs.</p>
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

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Available Doctors</h2>
              <p className="text-sm text-muted-foreground">{filteredDoctors.length} doctors found</p>
            </div>
            
            {filteredDoctors.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                        <p>No doctors match your criteria. Please try a different search.</p>
                    </CardContent>
                </Card>
            ) : (
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
                                <p className="text-sm text-medical-primary font-medium">{doctor.specialties?.join(', ')}</p>
                                <p className="text-xs text-muted-foreground">{doctor.qualifications}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-semibold">{doctor.rating || 'New'}</span>
                                </div>
                              </div>
                          </div>
                          <CardDescription className="text-xs mb-4 line-clamp-2">{doctor.bio}</CardDescription>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                          <span className="font-bold text-lg">₹{doctor.consultation_fee}</span>
                          {doctor.is_online ? (
                               <Button variant="medical" onClick={() => handleBooking(doctor)}>Consult Now</Button>
                          ) : (
                              <Button variant="outline" disabled>Currently Offline</Button>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
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