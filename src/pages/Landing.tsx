import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { 
  Video, 
  Stethoscope, 
  FileText, 
  MapPin, 
  Shield, 
  Clock,
  Users,
  Star,
  ChevronRight,
  Heart
} from 'lucide-react';
import heroImage from '@/assets/hero-telemedicine.jpg';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Video,
      title: 'Video Consultations',
      description: 'Connect with certified doctors through secure video calls from anywhere in rural Punjab.'
    },
    {
      icon: Stethoscope,
      title: 'AI Symptom Checker',
      description: 'Get preliminary health assessments and recommendations using our intelligent symptom analysis.'
    },
    {
      icon: FileText,
      title: 'Digital Health Records',
      description: 'Store and access your medical history offline. Share with doctors instantly via QR codes.'
    },
    {
      icon: MapPin,
      title: 'Local Pharmacy Network',
      description: 'Find nearby pharmacies, check medicine availability, and get delivery updates in real-time.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Patients Served' },
    { number: '200+', label: 'Certified Doctors' },
    { number: '50+', label: 'Villages Connected' },
    { number: '24/7', label: 'Emergency Support' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-elevated to-background">
        <div className="container px-6 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Healthcare for{' '}
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    Rural Punjab
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Connecting villages to quality healthcare through telemedicine. 
                  Consult doctors, check symptoms, and access your medical records - all from your mobile.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="medical" size="lg" className="text-lg px-8 py-3" asChild>
                  <Link to="/auth/signup?role=patient">
                    Start as Patient
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-3" asChild>
                  <Link to="/auth/signup?role=doctor">
                    Join as Doctor
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-medical-accent text-medical-accent" />
                  ))}
                  <span className="ml-2 text-sm font-medium">4.8/5 rating</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mr-1" />
                  HIPAA Compliant
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Rural healthcare telemedicine consultation"
                className="rounded-2xl shadow-large w-full h-auto max-w-lg mx-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-medium p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Dr. Amar Singh</p>
                    <p className="text-xs text-muted-foreground">Online - Nabha PHC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-surface-elevated">
        <div className="container px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Complete Healthcare Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From symptom checking to prescription delivery, we've built everything 
              you need for comprehensive rural healthcare access.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Transform Rural Healthcare?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of patients and doctors already using Nabha Care 
              to deliver quality healthcare across Punjab's villages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-3" asChild>
                <Link to="/auth/signup">Get Started Today</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to="/demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Nabha Care</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Nabha Care. Improving rural healthcare access across Punjab.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;