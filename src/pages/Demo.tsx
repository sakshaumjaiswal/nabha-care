import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Video, 
  Stethoscope, 
  MapPin, 
  FileText,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

const Demo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentDemo, setCurrentDemo] = useState('overview');

  const demoSections = [
    {
      id: 'overview',
      title: 'Platform Overview',
      duration: '2:30',
      description: 'Introduction to Nabha Care telemedicine platform',
      features: ['Multi-role access', 'Offline support', 'Real-time sync']
    },
    {
      id: 'booking',
      title: 'Book Consultation',
      duration: '3:15',
      description: 'How patients can book video consultations with doctors',
      features: ['Doctor search', 'Slot booking', 'Instant consultation']
    },
    {
      id: 'symptom-checker',
      title: 'AI Symptom Checker',
      duration: '2:45',
      description: 'AI-powered preliminary health assessment',
      features: ['Symptom selection', 'Triage system', 'Care recommendations']
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy Network',
      duration: '3:00',
      description: 'Find medicines and manage pharmacy inventory',
      features: ['Medicine search', 'Stock checking', 'Delivery requests']
    },
    {
      id: 'records',
      title: 'Medical Records',
      duration: '2:20',
      description: 'Digital health records with offline access',
      features: ['Record timeline', 'Secure sharing', 'Offline backup']
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Amar Singh',
      role: 'General Physician, Nabha',
      quote: 'Nabha Care has revolutionized how I connect with patients in remote areas. The platform is intuitive and reliable.',
      rating: 5
    },
    {
      name: 'Sahil Kumar',
      role: 'Patient, Patran',
      quote: 'I can now consult with doctors without traveling to the city. The offline records feature is incredibly useful.',
      rating: 5
    },
    {
      name: 'Rajesh Patel',
      role: 'Pharmacy Owner, Nabha',
      quote: 'Managing inventory and connecting with patients has become so much easier with this platform.',
      rating: 5
    }
  ];

  const usageStats = [
    { label: 'Active Users', value: '2,500+', icon: Users },
    { label: 'Consultations', value: '1,200+', icon: Video },
    { label: 'Partner Pharmacies', value: '45', icon: MapPin },
    { label: 'Digital Records', value: '5,800+', icon: FileText }
  ];

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const currentDemoData = demoSections.find(demo => demo.id === currentDemo);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Platform Demo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore Nabha Care's features through our interactive demo. See how we're transforming rural healthcare access.
          </p>
        </div>

        {/* Demo Player */}
        <Card className="mb-8">
          <CardContent className="p-0">
            {/* Video Player Area */}
            <div className="relative aspect-video bg-gradient-to-br from-medical-primary/10 to-medical-secondary/10 rounded-t-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-medical-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Video className="h-10 w-10 text-medical-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{currentDemoData?.title}</h3>
                <p className="text-muted-foreground mb-4">{currentDemoData?.description}</p>
                <Badge variant="secondary">{currentDemoData?.duration}</Badge>
              </div>
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  variant="medical"
                  onClick={togglePlayback}
                  className="w-16 h-16 rounded-full shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={togglePlayback}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {currentDemoData?.duration}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-medical-primary h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>

              {/* Feature Highlights */}
              <div className="grid gap-2 sm:grid-cols-3">
                {currentDemoData?.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-medical-success" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demo Sections</CardTitle>
            <CardDescription>Click on any section to jump to that part of the demo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {demoSections.map((section) => (
                <Card
                  key={section.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-medium ${
                    currentDemo === section.id ? 'ring-2 ring-medical-primary' : ''
                  }`}
                  onClick={() => setCurrentDemo(section.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{section.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {section.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Platform Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Impact</CardTitle>
              <CardDescription>Real numbers from our rural healthcare network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {usageStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-surface-muted rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-medical-primary/10 flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="h-6 w-6 text-medical-primary" />
                    </div>
                    <div className="text-2xl font-bold text-medical-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card>
            <CardHeader>
              <CardTitle>User Testimonials</CardTitle>
              <CardDescription>What our users say about Nabha Care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-4 bg-surface-muted rounded-lg">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="mt-8 border-medical-primary/30 bg-medical-primary/5">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of users already using Nabha Care to access quality healthcare in rural areas.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="medical" size="lg" asChild>
                <a href="/auth/signup">Sign Up Now</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/consult">Book Consultation</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;