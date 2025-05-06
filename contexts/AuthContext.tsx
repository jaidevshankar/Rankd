import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { authService, UserData, LoginData, SignupData } from '../app/services/auth';
import { Alert } from 'react-native';

// Define the shape of the context value
interface AuthContextType {
  user: UserData | null;
  signIn: (data: LoginData) => Promise<void>;
  signUp: (data: SignupData) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

// Create the context with a default undefined value initially
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// AuthProvider component
export function AuthProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check for an existing user session
    const checkUserSession = async () => {
      try {
        const userData = await authService.checkAuth();
        setUser(userData);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserSession();
  }, []);

  useEffect(() => {
    if (isLoading) return; // Don't redirect until initial check is done

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/login' as any);
    } else if (user && inAuthGroup) {
      router.replace('/' as any);
    }
  }, [user, segments, router, isLoading]);

  const signIn = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      setUser({
        user_id: response.user_id,
        username: response.username,
        email: response.email
      });
    } catch (error) {
      console.error('Sign in error:', error);
      let errorMessage = 'Invalid email or password.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Login Failed', errorMessage);
      throw error;
    }
  };

  const signUp = async (data: SignupData) => {
    try {
      await authService.signup(data);
      // Don't automatically sign in after signup, redirect to login instead
    } catch (error) {
      console.error('Sign up error:', error);
      let errorMessage = 'Could not create account.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Signup Failed', errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
} 