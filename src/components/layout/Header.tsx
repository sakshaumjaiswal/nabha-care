import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleBookConsultation = () => {
    if (profile) {
      navigate('/consult');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-hero">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Nabha Care
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={handleBookConsultation}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('header.bookConsultation')}
          </button>
          <Link 
            to="/symptom-checker" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('header.symptomChecker')}
          </Link>
          <Link 
            to="/pharmacy" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('header.findPharmacy')}
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          
          {profile ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden md:inline">
                Welcome, {profile.name}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">{t('header.signIn')}</Link>
              </Button>
              <Button variant="medical" size="sm" asChild>
                <Link to="/auth">{t('header.getStarted')}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};