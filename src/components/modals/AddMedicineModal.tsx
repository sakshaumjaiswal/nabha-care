import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePharmacy } from '@/hooks/usePharmacy';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddMedicineModal({ isOpen, onClose }: AddMedicineModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    manufacturer: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { addMedicine } = usePharmacy();

  const categories = [
    'Analgesics', 'Antibiotics', 'Antacids', 'Antidiabetic', 
    'Antihypertensive', 'Vitamins', 'Supplements', 'Other'
  ];

  const handleSubmit = async () => {
    if (!formData.name) return;

    try {
      setLoading(true);
      await addMedicine(formData);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        generic_name: '',
        manufacturer: '',
        description: '',
        category: ''
      });
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
          <DialogDescription>
            Add a new medicine to the inventory database
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Medicine Name *</Label>
            <Input
              id="name"
              placeholder="Enter medicine name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="generic">Generic Name</Label>
            <Input
              id="generic"
              placeholder="Enter generic name"
              value={formData.generic_name}
              onChange={(e) => updateFormData('generic_name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              placeholder="Enter manufacturer name"
              value={formData.manufacturer}
              onChange={(e) => updateFormData('manufacturer', e.target.value)}
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter medicine description..."
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !formData.name}
          >
            {loading ? 'Adding...' : 'Add Medicine'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}