import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Medicine {
  id: string;
  name: string;
  generic_name?: string;
  manufacturer?: string;
  description?: string;
  category?: string;
}

export interface PharmacyInventory {
  id: string;
  pharmacy_id: string;
  medicine_id: string;
  quantity: number;
  price?: number;
  expiry_date?: string;
  low_stock_threshold?: number;
  medicines?: Medicine;
}

export interface Pharmacy {
  id: string;
  name: string;
  village: string;
  address?: string;
  phone?: string;
  is_active?: boolean;
}

export interface PrescriptionOrder {
    id: string;
    created_at: string;
    title: string;
    summary?: string;
    data?: { items: { name: string; dosage: string; }[] };
    consultations: {
        patients: { name: string; };
        doctors: { name: string; };
    } | null;
}

export function usePharmacy() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [inventory, setInventory] = useState<PharmacyInventory[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [prescriptionOrders, setPrescriptionOrders] = useState<PrescriptionOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMedicines = async () => { /* ... (no changes in this function) ... */ };
  const fetchInventory = async (pharmacyId?: string) => { /* ... (no changes in this function) ... */ };
  const fetchPharmacies = async () => { /* ... (no changes in this function) ... */ };
  
  const fetchPrescriptionOrders = useCallback(async () => {
    try {
        setLoading(true);
        // CORRECTED JOIN SYNTAX: Applied the same fix here for fetching patient and doctor names.
        const { data, error } = await supabase
            .from('medical_records')
            .select(`
                id,
                created_at,
                title,
                summary,
                data,
                consultations (
                    patients:profiles!patient_id(name),
                    doctors:profiles!doctor_id(name)
                )
            `)
            .eq('type', 'prescription')
            .order('created_at', { ascending: false });

        if (error) throw error;
        setPrescriptionOrders(data as PrescriptionOrder[] || []);
    } catch (error: any) {
        toast({ title: "Error Fetching Orders", description: error.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  }, [toast]);

  const addMedicine = async (medicine: Omit<Medicine, 'id'>) => { /* ... (no changes in this function) ... */ };
  const updateInventory = async (inventoryId: string, updates: { quantity?: number; price?: number }) => { /* ... (no changes in this function) ... */ };
  const checkMedicineAvailability = async (medicineName: string) => { /* ... (no changes in this function) ... */ };

  return {
    medicines,
    inventory,
    pharmacies,
    prescriptionOrders,
    loading,
    fetchMedicines,
    fetchInventory,
    fetchPharmacies,
    fetchPrescriptionOrders,
    addMedicine,
    updateInventory,
    checkMedicineAvailability
  };
}