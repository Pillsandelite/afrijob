import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  role: 'freelancer' | 'client';
  avatar_url?: string;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  loadingProfile: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, role: 'freelancer' | 'client', name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          // Handle specific refresh token error
          if (error.message?.includes('Invalid Refresh Token') || 
              error.message?.includes('refresh_token_not_found')) {
            console.warn('Invalid refresh token found, clearing local storage');
            // Clear the invalid session data
            await supabase.auth.signOut({ scope: 'local' });
            localStorage.removeItem('sb-' + supabase.supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
            
            if (mounted) {
              setUser(null);
              setSession(null);
              setProfile(null);
              setLoading(false);
            }
            return;
          }
          throw error;
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          // Load profile if user exists
          if (initialSession?.user) {
            await loadUserProfile(initialSession.user.id);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any corrupted auth state
        if (mounted) {
          setUser(null);
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Load user profile after sign in
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Ensure profile is loaded after token refresh
          if (!profile) {
            await loadUserProfile(session.user.id);
          }
        }
        
        if (event === 'TOKEN_REFRESH_FAILED') {
          console.warn('Token refresh failed, signing out');
          await supabase.auth.signOut({ scope: 'local' });
          setUser(null);
          setSession(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [profile]);

  const loadUserProfile = async (userId: string) => {
    try {
      setLoadingProfile(true);
      
      // First, try to get from user_profiles table
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (userError && userError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw userError;
      }

      if (userProfile) {
        setProfile(userProfile);
        return;
      }

      // Fallback: try the simple profiles table
      const { data: simpleProfile, error: simpleError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (simpleError && simpleError.code !== 'PGRST116') {
        throw simpleError;
      }

      if (simpleProfile) {
        // Map simple profile to user profile format
        const mappedProfile: UserProfile = {
          id: simpleProfile.id,
          first_name: simpleProfile.email.split('@')[0], // Extract name from email as fallback
          last_name: '',
          role: simpleProfile.role,
          avatar_url: undefined,
          is_verified: false,
          created_at: simpleProfile.created_at,
          updated_at: simpleProfile.created_at,
        };
        setProfile(mappedProfile);
        return;
      }

      // If no profile exists, this might be a newly registered user
      console.warn('No profile found for user:', userId);
      setProfile(null);

    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      // Profile loading will be handled by the auth state change listener
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    role: 'freelancer' | 'client',
    name: string
  ) => {
    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
          },
        },
      });
      
      if (error) {
        return { error };
      }

      // If sign up is successful and user is immediately confirmed,
      // create profile record
      if (data.user && !data.user.email_confirmed_at === false) {
        try {
          // Try to create user profile
          await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              role: role,
            });
        } catch (profileError) {
          // If user_profiles doesn't exist, try simple profiles
          try {
            await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: email,
                role: role,
              });
          } catch (simpleProfileError) {
            console.error('Error creating profile:', simpleProfileError);
          }
        }
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    loadingProfile,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}