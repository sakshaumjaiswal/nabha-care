import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { VideoCallModal } from '@/components/modals/VideoCallModal';
import { useConsultations, Consultation } from '@/hooks/useConsultations';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useDoctorProfile } from '@/hooks/useDoctorProfile';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { 
  Video, Calendar, Clock, User, FileText, Users, TrendingUp, Phone, Bell, RefreshCw, Loader2, Check, Stethoscope
} from 'lucide-react';

// SECTION 1: ONBOARDING COMPONENT
const DoctorOnboardingForm = ({ onProfileComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    specialties: '',
    qualifications: '',
    bio: '',
    consultation_fee: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    
    const specialtiesArray = formData.specialties.split(',').map(s => s.trim()).filter(s => s);

    const { error } = await supabase
      .from('doctors')
      .upsert({
        user_id: user.id,
        specialties: specialtiesArray,
        qualifications: formData.qualifications,
        bio: formData.bio,
        consultation_fee: Number(formData.consultation_fee),
      });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Complete!", description: "Welcome to Nabha Care. Patients can now see your profile." });
      onProfileComplete();
    }
    setIsSaving(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Professional Profile</CardTitle>
          <CardDescription>
            This information will be visible to patients. Please fill it out to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Input id="specialties" placeholder="e.g., General Physician, Cardiology" value={formData.specialties} onChange={handleInputChange} required />
              <p className="text-xs text-muted-foreground">Separate multiple specialties with a comma.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input id="qualifications" placeholder="e.g., MBBS, MD (Cardiology)" value={formData.qualifications} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultation_fee">Consultation Fee (₹)</Label>
              <Input id="consultation_fee" type="number" placeholder="e.g., 500" value={formData.consultation_fee} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea id="bio" placeholder="Tell patients a little about yourself and your experience." value={formData.bio} onChange={handleInputChange} />
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4" />}
              Save and Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// SECTION 2: MODAL FOR MANAGING CONSULTATIONS
// NOTE: The full code for this modal is now included below as requested.
const ConsultationDetailsModal = ({ consultation, isOpen, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(consultation?.notes || '');
  const [prescriptionItems, setPrescriptionItems] = useState([{ name: '', dosage: '' }]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset form state when a new consultation is passed in
    if (consultation) {
      setNotes(consultation.notes || '');
      // Ensure prescription data is handled correctly, even if null
      const existingPrescription = consultation.prescription?.items;
      setPrescriptionItems(Array.isArray(existingPrescription) && existingPrescription.length > 0 ? existingPrescription : [{ name: '', dosage: '' }]);
    }
  }, [consultation]);

  const handleSave = async () => {
    if (!consultation) return;
    setIsSaving(true);
    try {
      // 1. Update the consultation notes and mark as complete
      const { error: consultationError } = await supabase
        .from('consultations')
        .update({ notes, status: 'completed' })
        .eq('id', consultation.id);
      if (consultationError) throw consultationError;

      // 2. Create a new medical record for the prescription if items are added
      const validPrescriptionItems = prescriptionItems.filter(p => p.name && p.name.trim() !== '');
      if (validPrescriptionItems.length > 0) {
        const { error: recordError } = await supabase
          .from('medical_records')
          .insert({
            patient_id: consultation.patient_id,
            consultation_id: consultation.id,
            type: 'prescription',
            title: `Prescription from ${new Date().toLocaleDateString()}`,
            summary: `${validPrescriptionItems.length} medication(s) prescribed.`,
            data: { items: validPrescriptionItems },
            created_by: consultation.doctor_id,
          });
        if (recordError) throw recordError;
      }
      
      toast({ title: "Success", description: "Consultation updated and prescription issued." });
      onUpdate(); // Re-fetch consultations on the dashboard
      onClose(); // Close the modal
    } catch (error: any) {
      toast({ title: "Error Saving", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrescriptionChange = (index, field, value) => {
    const newItems = [...prescriptionItems];
    newItems[index][field] = value;
    setPrescriptionItems(newItems);
  };

  const addPrescriptionItem = () => {
    setPrescriptionItems([...prescriptionItems, { name: '', dosage: '' }]);
  };
  
  if (!consultation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Consultation with {consultation.patients?.name || 'Patient'}</DialogTitle>
          <DialogDescription>
            Manage notes and issue a prescription. This will mark the consultation as completed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
          <div>
            <Label htmlFor="notes" className="text-base font-medium">Consultation Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="Enter your observations, diagnosis, and advice..."/>
          </div>
          <div>
            <Label className="text-base font-medium">Prescription</Label>
            <div className="space-y-2 mt-2">
              {prescriptionItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input placeholder="Medicine Name" value={item.name} onChange={(e) => handlePrescriptionChange(index, 'name', e.target.value)} />
                  <Input placeholder="Dosage (e.g., 1 tablet twice a day)" value={item.dosage} onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addPrescriptionItem}>Add Medicine</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            Save & Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// SECTION 3: THE MAIN DASHBOARD UI
const MainDoctorDashboard = ({ consultations, loading, fetchConsultations }) => {
  const { profile } = useAuth();
  const [videoCallModal, setVideoCallModal] = useState({ isOpen: false, patientName: '', roomId: '' });
  const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean, consultation: Consultation | null }>({ isOpen: false, consultation: null });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const upcomingConsultations = useMemo(() => 
    consultations.filter(c => c.status === 'scheduled' || c.status === 'in-progress'),
    [consultations]
  );
  
  const todayStats = useMemo(() => {
    const todays = consultations.filter(c => new Date(c.scheduled_at) >= todayStart);
    const completedToday = todays.filter(c => c.status === 'completed');
    return {
        consultations: todays.length,
        patientsSeen: completedToday.length
    };
  }, [consultations, todayStart]);

  const handleJoinCall = (consultation: Consultation) => {
    setVideoCallModal({
      isOpen: true,
      patientName: consultation.patients?.name || 'Patient',
      roomId: consultation.room_id || consultation.id,
    });
  };
  
  const handleManageConsultation = (consultation: Consultation) => {
    setDetailsModal({ isOpen: true, consultation });
  };

  return (
      <div className="container px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Good morning, Dr. {profile?.name || 'Doctor'}!</h1>
          <p className="text-muted-foreground">
            Today's Schedule • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Upcoming Today</p><p className="text-2xl font-bold">{upcomingConsultations.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completed Today</p><p className="text-2xl font-bold">{todayStats.patientsSeen}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Waiting Queue</p><p className="text-2xl font-bold">0</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Avg. Rating</p><p className="text-2xl font-bold">4.8</p></CardContent></Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Consultations</CardTitle>
                    <CardDescription>{upcomingConsultations.length} appointments scheduled</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => fetchConsultations()} disabled={loading}><RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div> :
                 upcomingConsultations.length > 0 ? upcomingConsultations.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border bg-surface-elevated/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center"><User className="h-5 w-5 text-white" /></div>
                      <div>
                        <h3 className="font-medium">{c.patients?.name || 'Unknown Patient'}</h3>
                        <p className="text-sm text-muted-foreground">{c.symptoms || 'No symptoms provided'}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(c.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <span className="mx-1">•</span>
                          <Video className="h-3 w-3" /> Video Call
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleJoinCall(c)}>Join Call</Button>
                      <Button variant="medical" size="sm" onClick={() => handleManageConsultation(c)}>Manage</Button>
                    </div>
                  </div>
                )) : <p className="text-center text-muted-foreground py-4">No upcoming consultations.</p>}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                 <Button variant="secondary" className="w-full justify-start"><User className="h-4 w-4 mr-2" />Search Patient</Button>
                 <Button variant="secondary" className="w-full justify-start"><TrendingUp className="h-4 w-4 mr-2" />View Analytics</Button>
              </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-center py-4 text-muted-foreground">No new notifications.</div>
                    <Button variant="ghost" size="sm" className="w-full mt-3"><Bell className="h-4 w-4 mr-2" />View All</Button>
                </CardContent>
            </Card>
          </div>
        </div>

        <VideoCallModal
          isOpen={videoCallModal.isOpen}
          onClose={() => setVideoCallModal(prev => ({ ...prev, isOpen: false }))}
          patientName={videoCallModal.patientName}
          roomId={videoCallModal.roomId}
        />
        <ConsultationDetailsModal 
          consultation={detailsModal.consultation}
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false, consultation: null })}
          onUpdate={fetchConsultations}
        />
      </div>
  );
};


// SECTION 4: MAIN COMPONENT EXPORT
const DoctorDashboard: React.FC = () => {
  const { doctorProfile, loading: profileLoading, refetch } = useDoctorProfile();
  const { consultations, loading: consultationsLoading, fetchConsultations } = useConsultations();

  const loading = profileLoading || (consultationsLoading && !consultations.length);

  if (loading && !doctorProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const isProfileComplete = doctorProfile && doctorProfile.specialties && doctorProfile.specialties.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {isProfileComplete ? (
        <MainDoctorDashboard 
            consultations={consultations} 
            loading={consultationsLoading} 
            fetchConsultations={fetchConsultations} 
        />
      ) : (
        <DoctorOnboardingForm onProfileComplete={refetch} />
      )}
    </div>
  );
};

export default DoctorDashboard;