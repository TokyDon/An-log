/**
 * useAuth — Authentication Hook
 *
 * Listens to Supabase Auth state and syncs to Zustand authStore.
 * Call this once at the root layout level.
 */

import { useEffect } from 'react';
import { supabase } from '../../services/supabase/client';
import { useAuthStore } from '../../store/authStore';

export function useAuth() {
  const { setUser, setLoading, signOut } = useAuthStore();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          username: session.user.email ?? '',
          displayName: session.user.email ?? '',
          avatarUrl: null,
          bio: null,
          createdAt: session.user.created_at,
          emailConfirmed: session.user.email_confirmed_at !== null,
        });
      } else {
        setLoading(false);
      }
    });

    // Real-time auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            username: session.user.email ?? '',
            displayName: session.user.email ?? '',
            avatarUrl: null,
            bio: null,
            createdAt: session.user.created_at,
            emailConfirmed: session.user.email_confirmed_at !== null,
          });
        } else {
          signOut();
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, signOut]);

  return useAuthStore();
}
