import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Share, QrCode, Upload, Camera } from 'lucide-react';

interface RecordActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'export' | 'share' | 'qr' | 'upload' | 'photo' | 'backup';
  recordTitle?: string;
}

export function RecordActionsModal({ isOpen, onClose, action, recordTitle }: RecordActionsModalProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleAction = async () => {
    setLoading(true);
    
    try {
      switch (action) {
        case 'export':
          // Simulate export functionality
          await new Promise(resolve => setTimeout(resolve, 2000));
          toast({
            title: "Export Successful",
            description: recordTitle ? `${recordTitle} has been downloaded` : "Records exported successfully",
          });
          break;
          
        case 'share':
          if (!email) return;
          // Simulate sharing functionality
          await new Promise(resolve => setTimeout(resolve, 1500));
          toast({
            title: "Shared Successfully",
            description: `Record shared with ${email}`,
          });
          break;
          
        case 'qr':
          // Simulate QR generation
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast({
            title: "QR Code Generated",
            description: "Emergency access QR code created",
          });
          break;
          
        case 'upload':
          // Simulate file upload
          await new Promise(resolve => setTimeout(resolve, 2000));
          toast({
            title: "File Uploaded",
            description: "Medical record uploaded successfully",
          });
          break;
          
        case 'photo':
          // Simulate camera capture
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast({
            title: "Photo Captured",
            description: "Medical record photo saved",
          });
          break;
          
        case 'backup':
          // Simulate backup creation
          await new Promise(resolve => setTimeout(resolve, 3000));
          toast({
            title: "Backup Created",
            description: "Encrypted backup downloaded to your device",
          });
          break;
      }
      
      onClose();
      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Action failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalContent = () => {
    switch (action) {
      case 'export':
        return {
          title: 'Export Record',
          description: recordTitle ? `Export ${recordTitle} as PDF` : 'Export all records as PDF',
          icon: Download,
          buttonText: loading ? 'Exporting...' : 'Export PDF',
          content: (
            <p className="text-sm text-muted-foreground">
              The record will be downloaded as a secure PDF file to your device.
            </p>
          )
        };
        
      case 'share':
        return {
          title: 'Share Record',
          description: 'Share record with healthcare provider',
          icon: Share,
          buttonText: loading ? 'Sharing...' : 'Share Record',
          content: (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Healthcare Provider Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                A secure link will be sent to the healthcare provider.
              </p>
            </div>
          )
        };
        
      case 'qr':
        return {
          title: 'Emergency QR Code',
          description: 'Generate QR code for emergency access',
          icon: QrCode,
          buttonText: loading ? 'Generating...' : 'Generate QR',
          content: (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Creates a QR code that emergency responders can scan to access your critical medical information.
              </p>
              <div className="p-4 bg-medical-error/5 border border-medical-error/30 rounded-lg">
                <p className="text-sm font-medium text-medical-error">⚠️ Security Notice</p>
                <p className="text-sm text-muted-foreground mt-1">
                  QR code will contain limited emergency information only.
                </p>
              </div>
            </div>
          )
        };
        
      case 'upload':
        return {
          title: 'Upload Medical Record',
          description: 'Upload a new medical document',
          icon: Upload,
          buttonText: loading ? 'Uploading...' : 'Select File',
          content: (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to select PDF, images, or other medical documents
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, JPG, PNG, DICOM. Max size: 10MB
              </p>
            </div>
          )
        };
        
      case 'photo':
        return {
          title: 'Capture Medical Record',
          description: 'Take a photo of a medical document',
          icon: Camera,
          buttonText: loading ? 'Processing...' : 'Open Camera',
          content: (
            <div className="space-y-4">
              <div className="bg-surface-muted rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Camera will open to capture your medical document
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Ensure good lighting and document is clearly visible
              </p>
            </div>
          )
        };
        
      case 'backup':
        return {
          title: 'Create Secure Backup',
          description: 'Download encrypted backup of all records',
          icon: Download,
          buttonText: loading ? 'Creating Backup...' : 'Create Backup',
          content: (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Creates an encrypted backup file containing all your medical records.
              </p>
              <div className="p-4 bg-medical-primary/5 border border-medical-primary/30 rounded-lg">
                <p className="text-sm font-medium">🔒 Encrypted & Secure</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Backup is password-protected and can only be restored with your credentials.
                </p>
              </div>
            </div>
          )
        };
        
      default:
        return { title: '', description: '', icon: Download, buttonText: '', content: null };
    }
  };

  const modalContent = getModalContent();
  const IconComponent = modalContent.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {modalContent.title}
          </DialogTitle>
          <DialogDescription>
            {modalContent.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {modalContent.content}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAction} 
            disabled={loading || (action === 'share' && !email)}
          >
            {modalContent.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}