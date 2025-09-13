import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DoctorDetails {
  user_id: string;
  specialties: string[];
  qualifications: string;
  bio: string;
  consultation_fee: number;
}

export function useDoctorProfile() {
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDoctorProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
        throw error;
      }
      setDoctorProfile(data);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDoctorProfile();
  }, [fetchDoctorProfile]);

  return { doctorProfile, loading, refetch: fetchDoctorProfile };
}