import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { router } from 'expo-router';

interface AuthContextValue {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any } | void>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any } | void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signIn: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signUp: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    session,
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      // Check profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();
      if (profileError || !profile) {
        await supabase.auth.signOut();
        return { error: { message: "No profile found for this account." } };
      }
      return {};
    },
    signUp: async (email, password, name) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) return { error };
      const userId = data?.user?.id;
      if (!userId) return { error: { message: "Could not get user ID." } };
      // Insert into profiles table with id = user.id
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: userId, email, name }]);
      if (profileError) {
        return { error: { message: "Failed to save profile." } };
      }
      return {};
    },
    signOut: async () => {
      await supabase.auth.signOut();
      setSession(null);
      router.replace('/login');
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}