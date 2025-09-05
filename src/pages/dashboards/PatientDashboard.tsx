import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useConsultations } from '@/hooks/useConsultations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, Stethoscope, FileText, MapPin, Calendar, Clock, User, Check
} from 'lucide-react';

interface HealthSummary {
  blood_group?: string;
  height_cm?: number;
  weight_kg?: number;
  allergies?: string;
  chronic_conditions?: string;
}

const PatientDashboard: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { consultations, loading: consultationsLoading, updateConsultationStatus } = useConsultations();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [healthSummary, setHealthSummary] = useState<HealthSummary>({});
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [formData, setFormData] = useState<HealthSummary>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchHealthSummary = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('health_summary')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setHealthSummary(data);
        setFormData(data);
      }
    };
    fetchHealthSummary();
  }, [user]);

  const upcomingAppointment = useMemo(() => 
    consultations.find(c => c.status === 'scheduled'), 
  [consultations]);

  const recentConsultations = useMemo(() => 
    consultations.filter(c => c.status === 'completed').slice(0, 2), 
  [consultations]);

  const handleUpdateHealthSummary = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('health_summary')
      .upsert({ user_id: user.id, ...formData }, { onConflict: 'user_id' });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setHealthSummary(formData);
      toast({ title: "Success", description: "Health summary updated." });
      setIsHealthModalOpen(false);
    }
  };

  const markAsComplete = (consultationId: string) => {
    updateConsultationStatus(consultationId, 'completed');
  };

  const quickActions = [
    { title: 'Book Consultation', description: 'Schedule a video call', icon: Video, href: '/consult', variant: 'medical' as const, color: 'text-medical-primary' },
    { title: 'Symptom Checker', description: 'AI-powered health assessment', icon: Stethoscope, href: '/symptom-checker', variant: 'secondary' as const, color: 'text-medical-secondary' },
    { title: 'My Records', description: 'View and download history', icon: FileText, href: '/records', variant: 'secondary' as const, color: 'text-medical-accent' },
    { title: 'Find Pharmacy', description: 'Locate nearby pharmacies', icon: MapPin, href: '/pharmacy', variant: 'secondary' as const, color: 'text-medical-success' }
  ];

  if (authLoading || consultationsLoading) {
    return <div className="min-h-screen flex items-center justify-center"><h3>Loading Dashboard...</h3></div>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name || 'User'}!</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
             <div>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {quickActions.map((action, index) => (
                    <Card key={index} className="group hover:shadow-medium transition-all duration-200 hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-surface-elevated to-surface-muted flex items-center justify-center">
                                <action.icon className={`h-5 w-5 ${action.color}`} />
                            </div>
                            <CardTitle className="text-base">{action.title}</CardTitle>
                        </div>
                        <CardDescription className="text-sm mb-4">{action.description}</CardDescription>
                        <Button variant={action.variant} className="w-full" asChild>
                          <Link to={action.href}>Get Started</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Consultations</h2>
              <div className="space-y-3">
                {recentConsultations.length > 0 ? recentConsultations.map((consultation) => (
                  <Card key={consultation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{consultation.doctors?.profiles?.name || 'Doctor'}</h3>
                            <p className="text-sm text-muted-foreground">Consultation</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(consultation.scheduled_at).toLocaleDateString()}
                              <Clock className="h-3 w-3 ml-2" />
                              {new Date(consultation.scheduled_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs bg-medical-success/10 text-medical-success rounded-full">Completed</span>
                          <Button variant="ghost" size="sm" asChild><Link to="/records">View Record</Link></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card><CardContent className="p-6 text-center text-muted-foreground">No recent consultations yet.</CardContent></Card>
                )}
              </div>
              {consultations.length > 0 && (
                <Button variant="outline" className="w-full mt-4" asChild><Link to="/records">View All Consultations</Link></Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SummaryItem label="Blood Group" value={healthSummary.blood_group} />
                <SummaryItem label="Height" value={healthSummary.height_cm ? `${healthSummary.height_cm} cm` : ''} />
                <SummaryItem label="Weight" value={healthSummary.weight_kg ? `${healthSummary.weight_kg} kg` : ''} />
                <SummaryItem label="Allergies" value={healthSummary.allergies} />
                <SummaryItem label="Chronic Conditions" value={healthSummary.chronic_conditions} />
                <Dialog open={isHealthModalOpen} onOpenChange={setIsHealthModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-4">Update Health Data</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Your Health Summary</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <HealthInput id="blood_group" label="Blood Group" value={formData.blood_group} onChange={setFormData} />
                      <HealthInput id="height_cm" label="Height (cm)" type="number" value={formData.height_cm} onChange={setFormData} />
                      <HealthInput id="weight_kg" label="Weight (kg)" type="number" value={formData.weight_kg} onChange={setFormData} />
                      <HealthInput id="allergies" label="Allergies" value={formData.allergies} onChange={setFormData} />
                      <HealthInput id="chronic_conditions" label="Chronic Conditions" value={formData.chronic_conditions} onChange={setFormData} />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleUpdateHealthSummary}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Next Appointment</CardTitle></CardHeader>
              <CardContent>
                {upcomingAppointment ? (
                  <div>
                     <div className="flex items-center gap-3 mb-3">
                         <User className="h-5 w-5 text-medical-primary"/>
                         <span className="font-medium">{upcomingAppointment.doctors?.profiles?.name}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                         <Calendar className="h-4 w-4"/>
                         <span>{new Date(upcomingAppointment.scheduled_at).toLocaleDateString()} at {new Date(upcomingAppointment.scheduled_at).toLocaleTimeString()}</span>
                     </div>
                     <Button size="sm" className="w-full" onClick={() => markAsComplete(upcomingAppointment.id)}>
                        <Check className="h-4 w-4 mr-2"/>
                        Mark as Completed
                     </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                    <Button variant="medical" size="sm" className="mt-3" asChild><Link to="/consult">Book Now</Link></Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-medical-error/30 bg-medical-error/5">
              <CardHeader><CardTitle className="text-base text-medical-error">Emergency</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">For medical emergencies, call immediately:</p>
                <Button variant="destructive" className="w-full" asChild><a href="tel:102">Call 102 (Ambulance)</a></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value || 'N/A'}</span>
  </div>
);

const HealthInput = ({ id, label, type = "text", value, onChange }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">{label}</Label>
    <Input
      id={id}
      type={type}
      value={value || ''}
      onChange={(e) => onChange(prev => ({...prev, [id]: e.target.value}))}
      className="col-span-3"
    />
  </div>
);

export default PatientDashboard;