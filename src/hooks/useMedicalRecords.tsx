import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface MedicalRecord {
  id: string;
  patient_id: string;
  consultation_id?: string;
  type: string;
  title: string;
  summary?: string;
  data?: any;
  files?: any[];
  created_at: string;
  // Joined data from consultations
  consultations?: {
    doctors?: {
      name: string;
    }
  }
}

export function useMedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRecords = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      // CORRECTED JOIN SYNTAX: Applied the same fix here.
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          consultations (
            doctors:profiles!doctor_id (
              name
            )
          )
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data as any[] || []);
 
    } catch (error: any) {
      toast({
        title: "Error fetching records",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (record: Omit<MedicalRecord, 'id' | 'created_at' | 'patient_id'>) => { /* ... (no changes in this function) ... */ };

  return {
    records,
    loading,
    fetchRecords,
    addRecord
  };
}