-- Create health_summary table
CREATE TABLE public.health_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  blood_group VARCHAR(5),
  height_cm INT,
  weight_kg NUMERIC(5, 2),
  allergies TEXT,
  chronic_conditions TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.health_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health summary" ON public.health_summary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own health summary" ON public.health_summary FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health summary" ON public.health_summary FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for updated_at column
CREATE TRIGGER update_health_summary_updated_at BEFORE UPDATE ON public.health_summary FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();