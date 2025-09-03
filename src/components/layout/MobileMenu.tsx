import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Heart, Video, Stethoscope, MapPin, FileText } from 'lucide-react';

interface MobileMenuProps {
  currentUser?: any;
  onLogout?: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ currentUser, onLogout }) => {
  const navigationLinks = [
    { 
      to: '/consult', 
      label: 'Book Consultation',
      icon: Video,
      description: 'Connect with doctors'
    },
    {
      to: '/symptom-checker',
      label: 'Symptom Checker',
      icon: Stethoscope,
      description: 'AI health assessment'
    },
    {
      to: '/pharmacy',
      label: 'Find Pharmacy',
      icon: MapPin,
      description: 'Locate medicines'
    },
    {
      to: '/records',
      label: 'Medical Records',
      icon: FileText,
      description: 'Your health history'
    }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-hero">
              <Heart className="h-4 w-4 text-white" />
            </div>
            Nabha Care
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center">
                  <link.icon className="h-5 w-5 text-medical-primary" />
                </div>
                <div>
                  <p className="font-medium">{link.label}</p>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="border-t pt-6">
            {currentUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {currentUser.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{currentUser.role}</p>
                  </div>
                </div>
                
                <Link
                  to={`/dashboard/${currentUser.role}`}
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                
                <Button variant="ghost" className="w-full" onClick={onLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button variant="medical" className="w-full" asChild>
                  <Link to="/auth/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};