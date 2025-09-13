import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signOut: async () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (user: User) => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('user_id', user.id)
        .single();

      if (error && status !== 406) throw error;
      if (data) setProfile(data);
    } catch (error: any) {
      toast({ title: "Error fetching user profile", description: error?.message || String(error), variant: "destructive" });
      setProfile(null);
    }
  }, [toast]);

  useEffect(() => {
    let mounted = true;
    console.log('[useAuth] Simplified Effect is RUNNING.');

    // Immediately get the current session so refresh doesn't hang
    const init = async () => {
      try {
        // Supabase v2: supabase.auth.getSession()
        // (older clients may use supabase.auth.session())
        const getSessionResult: any = await supabase.auth.getSession?.() ?? await supabase.auth.session?.();
        // normalize result
        const initialSession = getSessionResult?.data?.session ?? getSessionResult ?? null;
        if (!mounted) return;

        setSession(initialSession);
        const currentUser = initialSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser);
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        console.error('[useAuth] Error fetching initial session:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }

      // Now subscribe to future auth changes
      const onAuth = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
        console.log('[useAuth] onAuthStateChange', event);
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          fetchProfile(currentUser).catch(e => console.error('[useAuth] fetchProfile after event failed', e));
        } else {
          setProfile(null);
        }

        // Make sure loading is false after any state update
        setLoading(false);

        if (event === 'SIGNED_IN') {
          toast({ title: "Welcome back!", description: "You've been signed in successfully." });
        } else if (event === 'SIGNED_OUT') {
          toast({ title: "Signed out", description: "You've been signed out successfully." });
          navigate('/');
        }
      });

      // Supabase may return different shapes depending on client version
      // For v2, onAuth returns { data: { subscription } }
      // For older versions, it might return just the subscription
      // Normalize unsubscribe function:
      const subscription = onAuth?.data?.subscription ?? onAuth;
      // store for cleanup
      (init as any)._subscription = subscription;
    };

    init();

    return () => {
      mounted = false;
      console.log('[useAuth] Unsubscribing from auth changes.');
      const subscription = (init as any)._subscription;
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      } else if (subscription && typeof subscription === 'function') {
        // sometimes unsubscribe is a function itself
        try { subscription(); } catch (e) { /* ignore */ }
      }
    };

    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to sign out", variant: "destructive" });
    }
  };

  const value = { user, profile, session, loading, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
