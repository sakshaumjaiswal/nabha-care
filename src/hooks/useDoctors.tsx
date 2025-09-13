import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

// Updated interface to include new fields
export interface DoctorProfile {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  is_online: boolean;
  qualifications: string;
  bio: string;
  consultation_fee: number;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      // The RPC function was already updated in Step 1 to return the new fields
      const { data, error } = await supabase.rpc('get_all_doctors');

      if (error) throw error;
      
      setDoctors(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching doctors",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return { doctors, loading, fetchDoctors };
}