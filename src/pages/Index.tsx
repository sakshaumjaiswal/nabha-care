import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { 
  Video, 
  Stethoscope, 
  FileText, 
  MapPin, 
  Shield, 
  Users,
  Star,
  ChevronRight,
  Heart
} from 'lucide-react';
import heroImage from '@/assets/hero-telemedicine.jpg';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

const Index: React.FC = () => {
  const { t } = useTranslation();
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && profile) {
      navigate(`/dashboard/${profile.role}`);
    }
  }, [profile, authLoading, navigate]);

  const ctaLink = profile ? `/dashboard/${profile.role}` : '/auth';

  const features = [
    {
      icon: Video,
      title: t('landing.feature1Title'),
      description: t('landing.feature1Desc')
    },
    {
      icon: Stethoscope,
      title: t('landing.feature2Title'),
      description: t('landing.feature2Desc')
    },
    {
      icon: FileText,
      title: t('landing.feature3Title'),
      description: t('landing.feature3Desc')
    },
    {
      icon: MapPin,
      title: t('landing.feature4Title'),
      description: t('landing.feature4Desc')
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Patients Served' },
    { number: '200+', label: 'Certified Doctors' },
    { number: '50+', label: 'Villages Connected' },
    { number: '24/7', label: 'Emergency Support' }
  ];

  if (authLoading || profile) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h3>Loading...</h3>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-elevated to-background">
        <div className="container px-6 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {t('landing.heroTitle')}{' '}
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    {t('landing.heroTitleHighlight')}
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  {t('landing.heroSubtitle')}
                </p>
              </div>
              
              {!profile ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="medical" size="lg" className="text-lg px-8 py-3" asChild>
                    <Link to="/auth?role=patient">
                      {t('landing.startPatient')}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3" asChild>
                    <Link to="/auth?role=doctor">
                      {t('landing.joinDoctor')}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex">
                    <Button variant="medical" size="lg" className="text-lg px-8 py-3" asChild>
                        <Link to={`/dashboard/${profile.role}`}>
                            Go to Dashboard
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
              )}
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-medical-accent text-medical-accent" />
                  ))}
                  <span className="ml-2 text-sm font-medium">4.8/5 rating</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mr-1" />
                  HIPAA Compliant
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Rural healthcare telemedicine consultation"
                className="rounded-2xl shadow-large w-full h-auto max-w-lg mx-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-medium p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Online Consultation</p>
                    <p className="text-xs text-muted-foreground">Available Now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-surface-elevated">
        <div className="container px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.featuresSubtitle')}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t('landing.ctaTitle')}
            </h2>
            <p className="text-lg text-white/90 mb-8">
              {t('landing.ctaSubtitle')}
            </p>
            <div className="flex justify-center">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-3" asChild>
                <Link to={ctaLink}>{t('landing.getStarted')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Nabha Care</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Nabha Care. Improving rural healthcare access across Punjab.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;