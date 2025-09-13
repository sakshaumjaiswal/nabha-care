import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  symptoms?: string;
  notes?: string;
  prescription?: any;
  room_id?: string;
  doctors: {
    profiles: {
      name: string
    }
  }
}

export function useConsultations() {
  const { user, profile } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user || !profile) {
        console.log('[useConsultations] Effect skipped: User or Profile not available.');
        setConsultations([]);
        return;
      }

      console.log('[useConsultations] Effect triggered: Starting fetch.');
      try {
        setLoading(true);
        
        let query = supabase
          .from('consultations')
          .select(`*`)
          .order('scheduled_at', { ascending: false });
        
        if (profile.role === 'patient') {
          query = query.eq('patient_id', user.id);
        } else if (profile.role === 'doctor') {
          query = query.eq('doctor_id', user.id);
        }

        const { data: consultationsData, error: consultationsError } = await query;
        if (consultationsError) throw consultationsError;
        
        console.log('[useConsultations] Fetched consultations data:', consultationsData);
        
        if (consultationsData && consultationsData.length > 0) {
          const doctorIds = [...new Set(consultationsData.map(c => c.doctor_id))];
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('user_id, name')
            .in('user_id', doctorIds);

          if (profilesError) throw profilesError;
          
          console.log('[useConsultations] Fetched doctor profiles for consultations:', profilesData);

          const profilesMap = new Map(profilesData.map(p => [p.user_id, p.name]));
          const consultationsWithDoctorNames = consultationsData.map(c => ({
            ...c,
            doctors: { profiles: { name: profilesMap.get(c.doctor_id) || 'Unknown Doctor' } }
          }));
          setConsultations(consultationsWithDoctorNames as unknown as Consultation[]);
        } else {
          setConsultations([]);
        }
      } catch (error: any) {
        console.error('[useConsultations] Error fetching consultations:', error);
        toast({ title: "Error fetching consultations", description: error.message, variant: "destructive" });
        setConsultations([]);
      } finally {
        console.log('[useConsultations] Fetch complete. Setting loading to false.');
        setLoading(false);
      }
    };
    
    fetchConsultations();
  }, [user, profile, toast]);
  
  // ... (rest of the hook remains the same)
  const bookConsultation = async (doctorId: string, doctorName: string, symptoms: string, type: string) => {
    if (!user) throw new Error('Not authenticated');
    // ...
  };

  const updateConsultationStatus = async (id: string, status: Consultation['status'], notes?: string) => {
    // ...
  };
  
  console.log('[useConsultations] HOOK RENDER. Current state:', {
    loading,
    consultationsCount: consultations.length
  });

  return {
    consultations,
    loading,
    bookConsultation,
    updateConsultationStatus,
  };
}