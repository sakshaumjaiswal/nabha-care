import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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

  const fetchConsultations = useCallback(async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('consultations')
        .select(`
          *,
          doctors (
            profiles (
              name
            )
          )
        `)
        .order('scheduled_at', { ascending: false });
      
      if (profile.role === 'patient') {
        query = query.eq('patient_id', user.id);
      } else if (profile.role === 'doctor') {
        query = query.eq('doctor_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setConsultations(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching consultations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, profile, toast]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const bookConsultation = async (doctorId: string, doctorName: string, symptoms: string, type: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          doctor_id: doctorId,
          patient_id: user.id,
          scheduled_at: new Date().toISOString(),
          symptoms: `${type} consultation for: ${symptoms}`,
          status: 'scheduled'
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Also create a medical record for this consultation
      await supabase.from('medical_records').insert({
          patient_id: user.id,
          consultation_id: data.id,
          type: 'consultation',
          title: `Consultation with ${doctorName}`,
          summary: `Symptoms: ${symptoms}`,
          created_by: user.id
      });

      toast({
        title: "Success",
        description: "Consultation booked successfully",
      });

      fetchConsultations();
      return data;
    } catch (error: any) {
      toast({
        title: "Error booking consultation",
        description: error.message,
        variant: "destructive",
      });
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

      toast({
        title: "Success",
        description: "Consultation updated successfully",
      });

      fetchConsultations();
    } catch (error: any) {
      toast({
        title: "Error updating consultation",
        description: error.message,
        variant: "destructive",
      });
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