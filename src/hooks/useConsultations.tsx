import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: string;
  status: string;
  symptoms?: string;
  notes?: string;
  prescription?: any;
  room_id?: string;
}

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bookConsultation = async (doctorId: string, scheduledAt: string, symptoms?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          doctor_id: doctorId,
          patient_id: user.id,
          scheduled_at: scheduledAt,
          symptoms: symptoms || '',
          status: 'scheduled'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consultation booked successfully",
      });

      fetchConsultations();
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateConsultationStatus = async (id: string, status: string, notes?: string) => {
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
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startVideoCall = async (consultationId: string) => {
    try {
      const roomId = `consultation-${consultationId}-${Date.now()}`;
      
      const { error } = await supabase
        .from('consultations')
        .update({ 
          room_id: roomId,
          status: 'in-progress'
        })
        .eq('id', consultationId);

      if (error) throw error;

      // In a real app, this would open a video call interface
      toast({
        title: "Video Call Started",
        description: `Room ID: ${roomId}`,
      });

      fetchConsultations();
      return roomId;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  return {
    consultations,
    loading,
    fetchConsultations,
    bookConsultation,
    updateConsultationStatus,
    startVideoCall
  };
}