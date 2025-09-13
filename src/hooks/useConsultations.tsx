import { useState, useEffect, useCallback } from 'react';
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
    name: string;
  } | null;
  patients: {
    name: string;
  } | null;
}

export function useConsultations() {
  const { user, profile } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConsultations = useCallback(async () => {
    // RPC requires a user and profile to determine which data to fetch
    if (!user || !profile) {
      setLoading(false);
      setConsultations([]);
      return;
    }

    setLoading(true);

    try {
      // FINAL FIX: Call the remote procedure call (RPC) instead of using .select()
      // This moves the complex join logic into the database for better performance and reliability.
      const { data, error } = await supabase.rpc('get_consultations_with_details', {
        user_role: profile.role,
        user_id_param: user.id
      });

      if (error) throw error;

      setConsultations(data as any[] || []);

    } catch (error: any) {
      console.error('[useConsultations] Error fetching data:', error);
      toast({ title: "Error fetching consultations", description: error.message, variant: "destructive" });
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, [user, profile, toast]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // ... (the rest of the file remains the same, no changes needed for book/update functions)
  const bookConsultation = async (doctorId: string, doctorName: string, symptoms: string, type: string) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to book.", variant: "destructive" });
      throw new Error('Not authenticated');
    }
    
    try {
        const { data, error } = await supabase
            .from('consultations')
            .insert({
                patient_id: user.id,
                doctor_id: doctorId,
                symptoms: symptoms,
                scheduled_at: new Date().toISOString(),
                status: 'scheduled',
            })
            .select();
            
        if (error) throw error;
        
        toast({ title: "Booking Confirmed!", description: `Your consultation with ${doctorName} is scheduled.` });
        fetchConsultations();
        return data;

    } catch (error: any) {
        toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
        throw error;
    }
  };
  
  const updateConsultationStatus = async (id: string, status: Consultation['status'], notes?: string) => {
      try {
          const { error } = await supabase
              .from('consultations')
              .update({ status, notes })
              .eq('id', id);
              
          if (error) throw error;
          
          toast({ title: "Success", description: `Consultation status updated to ${status}.` });
          fetchConsultations();
      } catch (error: any) {
          toast({ title: "Update Failed", description: error.message, variant: "destructive" });
      }
  };

  return {
    consultations,
    loading,
    fetchConsultations,
    bookConsultation,
    updateConsultationStatus,
  };
}