import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Video, Phone, MessageSquare, CreditCard, CheckCircle } from 'lucide-react';
import { useConsultations } from '@/hooks/useConsultations';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: {
    id: string;
    name: string;
  };
}

type ConsultationType = 'chat' | 'voice' | 'video';

export function BookingModal({ isOpen, onClose, doctor }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState<ConsultationType | null>(null);
  const [symptoms, setSymptoms] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { bookConsultation } = useConsultations();

  const prices = {
    chat: 50,
    voice: 100,
    video: 100
  };

  const handleTypeSelect = (type: ConsultationType) => {
    setConsultationType(type);
    setStep(2);
  };

  const handleDetailsSubmit = () => {
    if (!symptoms) {
      toast({
        title: "Please describe your symptoms",
        variant: "destructive",
      });
      return;
    }
    setStep(3);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Book consultation via hook
        await bookConsultation(doctor.id, doctor.name, symptoms, consultationType!);

        setLoading(false);
        setStep(4);
    } catch (error) {
        setLoading(false);
        // Error is handled in the hook
    }
  };
  
  const resetAndClose = () => {
    setStep(1);
    setConsultationType(null);
    setSymptoms('');
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Choose Consultation Type</DialogTitle>
              <DialogDescription>Select how you'd like to connect with {doctor.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <CardButton
                icon={MessageSquare}
                title="Chat"
                price={prices.chat}
                onClick={() => handleTypeSelect('chat')}
              />
              <CardButton
                icon={Phone}
                title="Voice Call"
                price={prices.voice}
                onClick={() => handleTypeSelect('voice')}
              />
              <CardButton
                icon={Video}
                title="Video Call"
                price={prices.video}
                onClick={() => handleTypeSelect('video')}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
            </DialogFooter>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Describe Your Symptoms</DialogTitle>
              <DialogDescription>
                Provide some details for {doctor.name} before your {consultationType} consultation.
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
               <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
               <Button onClick={handleDetailsSubmit}>Proceed to Payment</Button>
            </DialogFooter>
          </>
        );
      case 3:
        return (
            <>
                <DialogHeader>
                    <DialogTitle>Complete Your Payment</DialogTitle>
                    <DialogDescription>Securely pay for your consultation with {doctor.name}.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="p-4 border rounded-lg bg-surface-muted">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Consultation Type</span>
                            <span className="font-semibold capitalize">{consultationType}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-muted-foreground">Doctor</span>
                            <span className="font-semibold">{doctor.name}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <span className="text-lg font-bold">Total Amount</span>
                            <span className="text-lg font-bold">₹{prices[consultationType!]}</span>
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
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button onClick={handlePayment} disabled={loading}>
                        {loading ? 'Processing...' : `Pay ₹${prices[consultationType!]}`}
                    </Button>
                </DialogFooter>
            </>
        );
      case 4:
        return (
            <>
                <DialogHeader className="text-center items-center">
                    <div className="w-16 h-16 rounded-full bg-medical-success/10 flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-medical-success" />
                    </div>
                    <DialogTitle>Booking Confirmed!</DialogTitle>
                    <DialogDescription>
                        Your {consultationType} consultation with {doctor.name} is confirmed. You can check the details in your dashboard.
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

const CardButton = ({ icon: Icon, title, price, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 border rounded-lg text-center hover:bg-surface-muted hover:ring-2 hover:ring-primary transition-all"
  >
    <Icon className="h-8 w-8 mx-auto mb-2 text-medical-primary" />
    <p className="font-semibold">{title}</p>
    <p className="text-sm text-muted-foreground">₹{price}</p>
  </button>
);