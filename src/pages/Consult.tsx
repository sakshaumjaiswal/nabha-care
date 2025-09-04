import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingModal } from '@/components/modals/BookingModal';
import { Star, Search, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Consult: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    doctorName: string;
  }>({
    isOpen: false,
    doctorName: ''
  });

  const specialties = [
    'General Physician', 'Dermatology', 'Psychiatry', 'Pediatrics',
    'Gynecology', 'ENT', 'Cardiology', 'Gastroenterology'
  ];

  const doctors = [
    {
      id: '1',
      name: 'Dr. Rachna Kucheria',
      specialty: 'General Physician',
      experience: '26+ years',
      rating: 4.9,
      image: 'https://placehold.co/100x100/E2F5F3/333333?text=Dr',
      isOnline: true,
      languages: ['Hindi', 'English']
    },
    {
      id: '2',
      name: 'Dr. Shehla Agarwal',
      specialty: 'Dermatology',
      experience: '25+ years',
      rating: 4.8,
      image: 'https://placehold.co/100x100/E2F5F3/333333?text=Dr',
      isOnline: true,
      languages: ['English', 'Hindi']
    },
    {
      id: '3',
      name: 'Dr. Sandip Agnihotri',
      specialty: 'Dermatology',
      experience: '25+ years',
      rating: 4.8,
      image: 'https://placehold.co/100x100/E2F5F3/333333?text=Dr',
      isOnline: false,
      languages: ['English', 'Hindi', 'Punjabi']
    },
    {
        id: '4',
        name: 'Dr. Vinayak Agarwal',
        specialty: 'Cardiology',
        experience: '23+ years',
        rating: 4.9,
        image: 'https://placehold.co/100x100/E2F5F3/333333?text=Dr',
        isOnline: true,
        languages: ['Hindi', 'English']
    },
    {
        id: '5',
        name: 'Dr. Kaushal Madan',
        specialty: 'Gastroenterology',
        experience: '25+ years',
        rating: 4.7,
        image: 'https://placehold.co/100x100/E2F5F3/333333?text=Dr',
        isOnline: true,
        languages: ['Hindi', 'English']
    },
    {
      id: '6',
      name: 'Dr. Rachna Jain',
      specialty: 'Gynecology',
      experience: '15+ years',
      rating: 4.8,
      image: 'https://placehold.co/100x100/E2F5F3/333333?text=Dr',
      isOnline: false,
      languages: ['Hindi', 'English']
    }
  ];

  const handleBooking = (doctorName: string) => {
    setBookingModal({
      isOpen: true,
      doctorName,
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
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
                  <SelectValue placeholder="All Specialties" />
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
                                <AvatarImage src={doctor.image} alt={doctor.name} />
                                <AvatarFallback>DR</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold">{doctor.name}</h3>
                              <p className="text-medical-primary font-medium">{doctor.specialty}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">{doctor.rating}</span>
                              </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <p><strong>Experience:</strong> {doctor.experience}</p>
                          <p><strong>Languages:</strong> {doctor.languages.join(', ')}</p>
                        </div>
                    </div>
                    
                    <div className="mt-auto">
                        {doctor.isOnline ? (
                             <Button 
                             variant="medical" 
                             className="w-full"
                             onClick={() => handleBooking(doctor.name)}
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
        onClose={() => setBookingModal({ isOpen: false, doctorName: '' })}
        doctorName={bookingModal.doctorName}
      />
    </div>
  );
};

export default Consult;