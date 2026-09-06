import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

const AuthContext = createContext({
  user: null,
  session: null,
  userMetadata: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  resendVerification: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
  updateUserMetadata: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userMetadata, setUserMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session (handles email confirmation link redirect / token in hash)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserMetadata(session?.user?.user_metadata ?? null);
      setLoading(false);
    });

    // Listen for auth changes (automatically fires SIGNED_IN when email confirmation link is clicked)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserMetadata(session?.user?.user_metadata ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { ...metadata, createdAt: new Date().toISOString() }
        }
      });

      if (error) {
        if (error.message.includes('already') || error.message.includes('registered')) {
          return { error: { message: 'This email is already registered. Please sign in instead.', code: 'email_exists' } };
        }
        return { error: { message: error.message, code: error.name } };
      }

      return { error: null, data };
    } catch (e) {
      return { error: { message: 'Signup failed. Please try again.' } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        // If email has not been verified yet via confirmation link
        if (error.message.toLowerCase().includes('email not confirmed') || error.message.toLowerCase().includes('unconfirmed')) {
          return {
            error: {
              message: 'Your email is not verified yet. Please click the verification link sent to your inbox.',
              code: 'email_not_confirmed'
            },
            requiresVerification: true,
            email: email.trim()
          };
        }
        return { error: { message: error.message, code: error.name } };
      }

      // If user exists but email is unconfirmed
      if (data?.user && !data.user.email_confirmed_at && !data.session) {
        return {
          error: {
            message: 'Your email is not verified yet. Please click the verification link sent to your inbox.',
            code: 'email_not_confirmed'
          },
          requiresVerification: true,
          email: email.trim()
        };
      }

      return { error: null, data };
    } catch (e) {
      return { error: { message: 'Sign in failed. Please check your credentials.' } };
    }
  };

  const resendVerification = async (email) => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) {
        return { error: { message: error.message } };
      }
      return { error: null };
    } catch (e) {
      return { error: { message: 'Failed to resend verification email.' } };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` }
      });
      if (error) return { error: { message: error.message } };
      return { error: null };
    } catch (e) {
      return { error: { message: 'Google sign-in failed. Please try again.' } };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserMetadata(null);
  };

  const updateUserMetadata = async (metadata) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { ...user.user_metadata, ...metadata }
      });
      if (!error && data.user?.user_metadata) {
        setUserMetadata(data.user.user_metadata);
      }
    } catch (e) {
      console.error('Failed to update user metadata:', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userMetadata,
      loading,
      signUp,
      signIn,
      resendVerification,
      signInWithGoogle,
      signOut,
      updateUserMetadata
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
