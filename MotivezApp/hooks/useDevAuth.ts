import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useDevAuth = () => {
  useEffect(() => {
    const signInDev = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session) {
        await supabase.auth.signInWithPassword({
          email: 'test@motivez.com',
          password: 'test1234',
        });
      }
    };

    signInDev();
  }, []);
};
