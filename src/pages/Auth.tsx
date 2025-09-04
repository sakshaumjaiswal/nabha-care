import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, User, Stethoscope, Building, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'govt';
interface AuthFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    (searchParams.get('role') as UserRole) || 'patient'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: selectedRole
  });

  const roleConfig = {
    patient: {
      icon: User,
      title: 'Patient Portal',
      description: 'Access consultations, records, and health services',
      color: 'text-medical-primary'
    },
    doctor: {
      icon: Stethoscope,
      title: 'Doctor Dashboard',
      description: 'Manage patients, consultations, and prescriptions',
      color: 'text-medical-secondary'
    },
    pharmacy: {
      icon: Building,
      title: 'Pharmacy Admin',
      description: 'Manage inventory, orders, and delivery tracking',
      color: 'text-medical-accent'
    },
    govt: {
      icon: Shield,
      title: 'Government Portal',
      description: 'Healthcare analytics, monitoring, and oversight',
      color: 'text-medical-success'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        // Login with email/password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully."
        });
        // Redirect based on role
        navigate(`/dashboard/${selectedRole}`);
      } else {
        // Signup flow for all roles
        const redirectUrl = `${window.location.origin}/dashboard/${selectedRole}`;
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: formData.name,
              role: selectedRole,
              phone: formData.phone
            }
          }
        });
        if (error) throw error;

        toast({
          title: "Account Created",
          description: "Please check your email to verify your account."
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-elevated to-background p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Nabha Care
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Join Nabha Care'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Create your account and start accessing quality healthcare'
            }
          </p>
        </div>

        <Card className="shadow-large">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2">
              {/* Role Selection */}
              <div className="p-8 bg-surface-elevated">
                <h3 className="font-semibold mb-4">Select Your Role</h3>
                <div className="grid gap-3">
                  {Object.entries(roleConfig).map(([role, config]) => {
                    const IconComponent = config.icon;
                    return (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role as UserRole)}
                        className={`p-4 rounded-lg border text-left transition-all hover:shadow-soft ${
                          selectedRole === role 
                            ? 'border-primary bg-background shadow-soft' 
                            : 'border-border hover:bg-background'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className={`h-5 w-5 ${config.color}`} />
                          <div>
                            <div className="font-medium">{config.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {config.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auth Form */}
              <div className="p-8">
                <Tabs value={isLogin ? 'login' : 'signup'} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" onClick={() => setIsLogin(false)}>
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="doctor@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" variant="medical" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Dr. Amar Singh"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <>
                        <div>
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                          <Input
                            id="signup-phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </>
                      
                      <Button type="submit" className="w-full" variant="medical" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;