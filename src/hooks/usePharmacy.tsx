import { useState, useEffect } from 'react';
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

export function usePharmacy() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [inventory, setInventory] = useState<PharmacyInventory[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name');

      if (error) throw error;
      setMedicines(data || []);
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

  const fetchInventory = async (pharmacyId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('pharmacy_inventory')
        .select('*, medicines(*)')
        .order('created_at', { ascending: false });

      if (pharmacyId) {
        query = query.eq('pharmacy_id', pharmacyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInventory(data || []);
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

  const fetchPharmacies = async () => {
    try {
      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPharmacies(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addMedicine = async (medicine: Omit<Medicine, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .insert([medicine])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medicine added successfully",
      });

      fetchMedicines();
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

  const updateInventory = async (inventoryId: string, quantity: number, price?: number) => {
    try {
      const { error } = await supabase
        .from('pharmacy_inventory')
        .update({ quantity, price })
        .eq('id', inventoryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory updated successfully",
      });

      fetchInventory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const checkMedicineAvailability = async (medicineName: string) => {
    try {
      const { data, error } = await supabase
        .from('pharmacy_inventory')
        .select(`
          *,
          medicines(*),
          pharmacies(*)
        `)
        .gt('quantity', 0)
        .ilike('medicines.name', `%${medicineName}%`);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchPharmacies();
  }, []);

  return {
    medicines,
    inventory,
    pharmacies,
    loading,
    fetchMedicines,
    fetchInventory,
    fetchPharmacies,
    addMedicine,
    updateInventory,
    checkMedicineAvailability
  };
}