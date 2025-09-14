import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import PharmacyDashboard from "./pages/dashboards/PharmacyDashboard";
import GovtDashboard from "./pages/dashboards/GovtDashboard";
import Consult from "./pages/Consult";
// NEW: Import the new VideoCallPage component
import VideoCallPage from "./pages/VideoCallPage";
import SymptomChecker from "./pages/SymptomChecker";
import Pharmacy from "./pages/Pharmacy";
import Records from "./pages/Records";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard/patient" element={<PatientDashboard />} />
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route path="/dashboard/pharmacy" element={<PharmacyDashboard />} />
            <Route path="/dashboard/govt" element={<GovtDashboard />} />
            <Route path="/consult" element={<Consult />} />
            {/* NEW: Add the route for the video call page */}
            <Route path="/consult/call" element={<VideoCallPage />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/records" element={<Records />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;