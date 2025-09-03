import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { 
  Video, 
  Calendar, 
  Clock,
  User,
  FileText,
  QrCode,
  Users,
  TrendingUp,
  Phone
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const upcomingConsultations = [
    {
      id: 1,
      patient: 'Sahil Kumar',
      time: '10:00 AM',
      type: 'Video Call',
      condition: 'Follow-up checkup',
      status: 'confirmed'
    },
    {
      id: 2,
      patient: 'Priya Singh',
      time: '11:30 AM',
      type: 'Video Call',
      condition: 'Cold symptoms',
      status: 'waiting'
    },
    {
      id: 3,
      patient: 'Rajesh Sharma',
      time: '2:00 PM',
      type: 'Phone Call',
      condition: 'Diabetes consultation',
      status: 'confirmed'
    }
  ];

  const todayStats = [
    { label: 'Consultations', value: '8', change: '+2' },
    { label: 'Patients Seen', value: '6', change: '+1' },
    { label: 'Prescriptions', value: '5', change: '+3' },
    { label: 'Average Rating', value: '4.8', change: '+0.1' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={{ name: 'Dr. Amar Singh', role: 'doctor' }} />
      
      <div className="container px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Good morning, Dr. Singh!</h1>
          <p className="text-muted-foreground">
            Today's Schedule • {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {todayStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-medical-success bg-medical-success/10 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Consultations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Consultations</CardTitle>
                    <CardDescription>
                      {upcomingConsultations.length} appointments scheduled
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingConsultations.map((consultation) => (
                  <div 
                    key={consultation.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-surface-elevated/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{consultation.patient}</h3>
                        <p className="text-sm text-muted-foreground">
                          {consultation.condition}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {consultation.time}
                          <span className="mx-1">•</span>
                          {consultation.type === 'Video Call' ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <Phone className="h-3 w-3" />
                          )}
                          {consultation.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        consultation.status === 'confirmed' 
                          ? 'bg-medical-success/10 text-medical-success'
                          : 'bg-medical-warning/10 text-medical-warning'
                      }`}>
                        {consultation.status}
                      </span>
                      <Button variant="medical" size="sm">
                        {consultation.type === 'Video Call' ? 'Join Call' : 'Call Patient'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Patient Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Queue</CardTitle>
                <CardDescription>
                  Patients currently waiting for consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No patients currently in queue
                  </p>
                  <Button variant="outline">
                    Refresh Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="medical" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Prescription
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan Patient QR
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Search Patient
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hours Online</span>
                  <span className="text-sm font-medium">6h 30m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="text-sm font-medium">&lt; 2 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                  <span className="text-sm font-medium">98%</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-surface-elevated/50">
                    <p className="text-sm font-medium">New patient registered</p>
                    <p className="text-xs text-muted-foreground">
                      Manpreet Kaur from Nabha • 5 min ago
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-elevated/50">
                    <p className="text-sm font-medium">Prescription delivered</p>
                    <p className="text-xs text-muted-foreground">
                      Order #1234 to Rajesh Sharma - 1h ago
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;