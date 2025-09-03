import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { 
  Video, 
  Stethoscope, 
  FileText, 
  MapPin, 
  Calendar,
  Clock,
  User,
  Download,
  Wifi,
  WifiOff
} from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const recentConsultations = [
    {
      id: 1,
      doctor: 'Dr. Amar Singh',
      specialty: 'General Medicine',
      date: '2024-01-15',
      time: '14:30',
      status: 'completed'
    },
    {
      id: 2,
      doctor: 'Dr. Seema Kaur',
      specialty: 'Gynecology',
      date: '2024-01-12',
      time: '10:00',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Book Consultation',
      description: 'Schedule a video call with a certified doctor',
      icon: Video,
      href: '/consult',
      variant: 'medical' as const,
      color: 'text-medical-primary'
    },
    {
      title: 'Symptom Checker',
      description: 'Get AI-powered health assessment',
      icon: Stethoscope,
      href: '/symptom-checker',
      variant: 'secondary' as const,
      color: 'text-medical-secondary'
    },
    {
      title: 'My Records',
      description: 'View and download medical history',
      icon: FileText,
      href: '/records',
      variant: 'secondary' as const,
      color: 'text-medical-accent'
    },
    {
      title: 'Find Pharmacy',
      description: 'Locate nearby pharmacies and check stock',
      icon: MapPin,
      href: '/pharmacy',
      variant: 'secondary' as const,
      color: 'text-medical-success'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={{ name: 'Sahil Kumar', role: 'patient' }} />
      
      <div className="container px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Sahil!</h1>
          <p className="text-muted-foreground">
            Your health dashboard • Last visit: January 15, 2024
          </p>
        </div>

        {/* Offline Sync Status */}
        <Card className="mb-8 border-l-4 border-l-medical-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 text-medical-success" />
                <div>
                  <p className="font-medium">Records Synced</p>
                  <p className="text-sm text-muted-foreground">
                    Last synced: 2 minutes ago • All data is up to date
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Offline
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action, index) => (
                <Card key={index} className="group hover:shadow-medium transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-surface-elevated to-surface-muted flex items-center justify-center">
                        <action.icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{action.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant={action.variant} className="w-full" asChild>
                      <Link to={action.href}>
                        Get Started
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recent Consultations</h2>
              <div className="space-y-3">
                {recentConsultations.map((consultation) => (
                  <Card key={consultation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{consultation.doctor}</h3>
                            <p className="text-sm text-muted-foreground">
                              {consultation.specialty}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              {consultation.date}
                              <Clock className="h-3 w-3 ml-2" />
                              {consultation.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs bg-medical-success/10 text-medical-success rounded-full">
                            Completed
                          </span>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Consultations
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Blood Pressure</span>
                  <span className="text-sm font-medium">120/80 mmHg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Weight</span>
                  <span className="text-sm font-medium">72 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Checkup</span>
                  <span className="text-sm font-medium">Jan 15, 2024</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Update Health Data
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Next Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No upcoming appointments
                  </p>
                  <Button variant="medical" size="sm" className="mt-3" asChild>
                    <Link to="/consult">
                      Book Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-medical-error/30 bg-medical-error/5">
              <CardHeader>
                <CardTitle className="text-base text-medical-error">Emergency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  For medical emergencies, call immediately:
                </p>
                <Button variant="destructive" className="w-full">
                  Call 102 (Ambulance)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;