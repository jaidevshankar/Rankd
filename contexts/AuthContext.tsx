import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

// Define the shape of the context value
interface AuthContextType {
  user: any; // Replace 'any' with your user type
  signIn: (data: any) => void; // Replace 'any' with your user data type
  signOut: () => void;
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
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null); // Replace 'any' with your user type
  const [isLoading, setIsLoading] = useState(true); // To check initial auth status
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for an existing session (e.g., from AsyncStorage)
    // In a real app, this would be an async call
    const checkUserSession = async () => {
      // const storedUser = await getStoredUser(); // Your function to get stored user
      // setUser(storedUser);
      setIsLoading(false); // Done checking
    };
    checkUserSession();
  }, []);

  useEffect(() => {
    if (isLoading) return; // Don't redirect until initial check is done

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/');
    }
  }, [user, segments, router, isLoading]);

  const signIn = (data: any) => {
    setUser(data); // Set user state
    // If not redirecting via useEffect, can redirect here:
    // router.replace('/(tabs)/');
  };

  const signOut = () => {
    setUser(null);
    // router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
} 