import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useConsultations } from '@/hooks/useConsultations';
import { DoctorProfile } from '@/hooks/useDoctors';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorProfile | null;
}

export function BookingModal({ isOpen, onClose, doctor }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { bookConsultation } = useConsultations();

  const handleDetailsSubmit = () => {
    if (!symptoms) {
      toast({
        title: "Please describe your symptoms",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    if (!doctor) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await bookConsultation(doctor.id, doctor.name, symptoms, 'video');
      setLoading(false);
      setStep(3);
    } catch (error) {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSymptoms('');
    onClose();
  };
  
  if (!doctor) {
    return null;
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Describe Your Symptoms</DialogTitle>
              <DialogDescription>
                Provide some details for Dr. {doctor.name} before your consultation.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="symptoms">Symptoms / Reason for consultation</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms, how long you've had them, and any other relevant details..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={5}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
              <Button onClick={handleDetailsSubmit}>Proceed to Payment</Button>
            </DialogFooter>
          </>
        );
      case 2:
        return (
            <>
                <DialogHeader>
                    <DialogTitle>Complete Your Payment</DialogTitle>
                    <DialogDescription>Securely pay for your consultation with Dr. {doctor.name}.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="p-4 border rounded-lg bg-surface-muted">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Consultation Type</span>
                            <span className="font-semibold capitalize">Video Call</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-muted-foreground">Doctor</span>
                            <span className="font-semibold">{doctor.name}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <span className="text-lg font-bold">Total Amount</span>
                            <span className="text-lg font-bold">₹{doctor.consultation_fee}</span>
                        </div>
                    </div>
                    <div>
                        <Label>Payment Method</Label>
                        <div className="p-3 border rounded-md flex items-center justify-between">
                           <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5"/>
                                <span>Credit/Debit Card / UPI</span>
                           </div>
                            <span className="text-sm text-muted-foreground">Default</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={handlePayment} disabled={loading}>
                        {loading ? 'Processing...' : `Pay ₹${doctor.consultation_fee}`}
                    </Button>
                </DialogFooter>
            </>
        );
      case 3:
        return (
            <>
                <DialogHeader className="text-center items-center">
                    <div className="w-16 h-16 rounded-full bg-medical-success/10 flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-medical-success" />
                    </div>
                    <DialogTitle>Booking Confirmed!</DialogTitle>
                    <DialogDescription>
                        Your consultation with Dr. {doctor.name} is confirmed. You can check the details in your dashboard.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-4">
                    <Button className="w-full" onClick={resetAndClose}>Done</Button>
                </DialogFooter>
            </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}