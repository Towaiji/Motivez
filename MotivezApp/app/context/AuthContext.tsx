import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { router } from 'expo-router';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUri?: string;
  // add more fields as needed
}

interface AuthContextValue {
  session: Session | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error: any } | void>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any } | void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  profile: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signIn: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signUp: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch profile for current session
  const fetchProfile = async (userEmail?: string) => {
    const email = userEmail || session?.user?.email;
    if (!email) return setProfile(null);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();
    if (error || !data) {
      setProfile(null);
    } else {
      setProfile({
        id: data.id,
        name: data.name,
        email: data.email,
        avatarUri: data.avatar_uri || undefined,
      });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user?.email) fetchProfile(data.session.user.email);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.email) fetchProfile(newSession.user.email);
      else setProfile(null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    session,
    profile,
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      await fetchProfile(email);
      // Check profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();
      if (profileError || !profileData) {
        await supabase.auth.signOut();
        setProfile(null);
        return { error: { message: "No profile found for this account." } };
      }
      setProfile({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        avatarUri: profileData.avatar_uri || undefined,
      });
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
      await fetchProfile(email);
      return {};
    },
    signOut: async () => {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      router.replace('/login'); // Ensure navigation to login
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}