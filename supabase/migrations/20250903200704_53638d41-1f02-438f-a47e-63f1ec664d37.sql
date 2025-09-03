-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'pharmacy', 'govt')),
  village TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  specialties TEXT[] DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  rating NUMERIC(3,2) DEFAULT 0,
  consultation_fee NUMERIC(10,2) DEFAULT 0,
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pharmacies table
CREATE TABLE public.pharmacies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  village TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  location POINT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medicines table
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT,
  manufacturer TEXT,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pharmacy inventory table
CREATE TABLE public.pharmacy_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10,2),
  expiry_date DATE,
  low_stock_threshold INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(pharmacy_id, medicine_id)
);

-- Create consultations table
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  symptoms TEXT,
  notes TEXT,
  prescription JSONB DEFAULT '{}',
  room_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical records table
CREATE TABLE public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('consultation', 'prescription', 'test_result', 'document')),
  title TEXT NOT NULL,
  summary TEXT,
  data JSONB DEFAULT '{}',
  files JSONB DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for doctors
CREATE POLICY "Doctors can manage their own data" ON public.doctors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view doctor profiles" ON public.doctors FOR SELECT USING (true);

-- Create RLS policies for pharmacies  
CREATE POLICY "Pharmacy admins can manage their pharmacy" ON public.pharmacies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view pharmacy information" ON public.pharmacies FOR SELECT USING (true);

-- Create RLS policies for medicines
CREATE POLICY "Anyone can view medicines" ON public.medicines FOR SELECT USING (true);
CREATE POLICY "Pharmacy admins can manage medicines" ON public.medicines FOR ALL USING (EXISTS (SELECT 1 FROM public.pharmacies WHERE user_id = auth.uid()));

-- Create RLS policies for pharmacy inventory
CREATE POLICY "Pharmacy admins can manage their inventory" ON public.pharmacy_inventory FOR ALL USING (EXISTS (SELECT 1 FROM public.pharmacies WHERE id = pharmacy_id AND user_id = auth.uid()));
CREATE POLICY "Anyone can view pharmacy inventory" ON public.pharmacy_inventory FOR SELECT USING (true);

-- Create RLS policies for consultations
CREATE POLICY "Patients can view their consultations" ON public.consultations FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view their consultations" ON public.consultations FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Patients can book consultations" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Doctors can update their consultations" ON public.consultations FOR UPDATE USING (auth.uid() = doctor_id);

-- Create RLS policies for medical records
CREATE POLICY "Patients can view their records" ON public.medical_records FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view patient records during consultations" ON public.medical_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.consultations WHERE doctor_id = auth.uid() AND patient_id = medical_records.patient_id)
);
CREATE POLICY "Healthcare providers can create records" ON public.medical_records FOR INSERT WITH CHECK (
  auth.uid() = created_by AND (
    auth.uid() = patient_id OR 
    EXISTS (SELECT 1 FROM public.consultations WHERE doctor_id = auth.uid() AND patient_id = medical_records.patient_id)
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pharmacies_updated_at BEFORE UPDATE ON public.pharmacies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pharmacy_inventory_updated_at BEFORE UPDATE ON public.pharmacy_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
    NEW.phone
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-records', 'medical-records', false);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', false);

-- Create storage policies for medical records
CREATE POLICY "Patients can upload their medical records" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'medical-records' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Patients can view their medical records" ON storage.objects
FOR SELECT USING (
  bucket_id = 'medical-records' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Doctors can view patient records during consultations" ON storage.objects
FOR SELECT USING (
  bucket_id = 'medical-records' AND
  EXISTS (
    SELECT 1 FROM public.consultations 
    WHERE doctor_id = auth.uid() 
    AND patient_id::text = (storage.foldername(name))[1]
  )
);

-- Create storage policies for prescriptions
CREATE POLICY "Healthcare providers can upload prescriptions" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'prescriptions');

CREATE POLICY "Patients can view their prescriptions" ON storage.objects  
FOR SELECT USING (
  bucket_id = 'prescriptions' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Insert sample medicines data
INSERT INTO public.medicines (name, generic_name, category) VALUES
('Paracetamol 500mg', 'Paracetamol', 'Pain Relief'),
('Amoxicillin 500mg', 'Amoxicillin', 'Antibiotic'),
('Cetirizine 10mg', 'Cetirizine', 'Antihistamine'),
('Omeprazole 20mg', 'Omeprazole', 'Antacid'),
('Metformin 500mg', 'Metformin', 'Diabetes'),
('Amlodipine 5mg', 'Amlodipine', 'Hypertension'),
('Salbutamol Inhaler', 'Salbutamol', 'Respiratory'),
('Ibuprofen 400mg', 'Ibuprofen', 'Pain Relief');