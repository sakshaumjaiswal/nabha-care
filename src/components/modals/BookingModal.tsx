import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConsultations } from '@/hooks/useConsultations';
import { CalendarIcon, Clock } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  isImmediate?: boolean;
}

export function BookingModal({ isOpen, onClose, doctorId, doctorName, isImmediate }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { bookConsultation } = useConsultations();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ];

  const handleBooking = async () => {
    if (!selectedTime && !isImmediate) return;

    try {
      setLoading(true);
      
      const scheduledDateTime = isImmediate 
        ? new Date().toISOString()
        : new Date(`${selectedDate.toDateString()} ${selectedTime}`).toISOString();

      await bookConsultation(doctorId, scheduledDateTime, symptoms);
      onClose();
      
      // Reset form
      setSelectedTime('');
      setSymptoms('');
      setSelectedDate(new Date());
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isImmediate ? 'Start Consultation Now' : 'Schedule Consultation'}
          </DialogTitle>
          <DialogDescription>
            Book a consultation with {doctorName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isImmediate && (
            <>
              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div>
                <Label>Select Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {slot}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="symptoms">Symptoms / Reason for consultation</Label>
            <Textarea
              id="symptoms"
              placeholder="Describe your symptoms or reason for consultation..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleBooking} 
            disabled={loading || (!isImmediate && !selectedTime)}
          >
            {loading ? 'Booking...' : (isImmediate ? 'Start Now' : 'Book Consultation')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}