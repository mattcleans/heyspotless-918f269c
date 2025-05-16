
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://abtufqgsgwlbkaatyqyg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidHVmcWdzZ3dsYmthYXR5cXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NDUyMjYsImV4cCI6MjA1NTMyMTIyNn0.N3z-gOzI-9O6PZM1605mDIiX32r8gG9fOEZ902qAkJo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'heyspotless-auth-storage',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to clean up auth state - important for preventing auth limbo states
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('heyspotless-auth-storage');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Authentication helper functions
export const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
  try {
    // Clean up existing state first to prevent auth limbo
    cleanupAuthState();
    
    // Attempt global sign out first
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.log("Pre-signUp signOut failed (expected):", err);
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error("SignUp error:", error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Clean up existing state first to prevent auth limbo
    cleanupAuthState();
    
    // Attempt global sign out first
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.log("Pre-signIn signOut failed (expected):", err);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // For most production apps, this is where you'd refresh the page to ensure clean state
    // window.location.href = '/';
    
    return { data, error };
  } catch (error) {
    console.error("SignIn error:", error);
    return { data: null, error: error as Error };
  }
};

export const signOut = async () => {
  try {
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    // Force page reload for a clean state (in production apps)
    // window.location.href = '/auth';
    
    return { error };
  } catch (error) {
    console.error("SignOut error:", error);
    return { error: error as Error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  } catch (error) {
    console.error("Reset password error:", error);
    return { data: null, error: error as Error };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  } catch (error) {
    console.error("Update password error:", error);
    return { data: null, error: error as Error };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    return { user: data?.user || null, error };
  } catch (error) {
    console.error("Get current user error:", error);
    return { user: null, error: error as Error };
  }
};

// Get current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data?.session || null, error };
  } catch (error) {
    console.error("Get session error:", error);
    return { session: null, error: error as Error };
  }
};

// Helper function to check if we have an active session
export const checkAuthSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return !!session;
  } catch (error) {
    console.error("Error checking session:", error);
    return false;
  }
};

// Auth state change listener with safeguards
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const subscription = supabase.auth.onAuthStateChange((event, session) => {
    // Only do the sync state update first
    callback(event, session);
    
    // If there's a need to fetch additional data, use setTimeout to prevent deadlocks
    if (event === 'SIGNED_IN' && session) {
      setTimeout(() => {
        console.log('Auth state changed - deferred data loading can happen here');
        // This is where you could safely fetch additional user data
      }, 0);
    }
  });
  
  return subscription;
};
