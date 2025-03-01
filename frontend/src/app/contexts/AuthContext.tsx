'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';  // import your supabase client

interface AuthContextType {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // Check for existing session and set user
      if (session?.user) {
        setUser(session.user);
      }

      // Listen for authentication state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_, session) => {
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(null);
          }
        }
      );

      // Mark loading as done after session check
      setLoading(false);

      // Cleanup on component unmount by using a cleanup function
      return () => {
        subscription?.unsubscribe();  // Correct way to unsubscribe
      };
    };

    // Call the fetchSession function to initialize auth state
    fetchSession();

  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
