import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from './lib/supabase';

// Import Screens
import PhoneLoginScreen from './screens/PhoneLoginScreen';
import OtpScreen from './screens/OtpScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App_OTP() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes (e.g., login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide headers for a cleaner visual
        }}
      >
        {session && session.user ? (
          // If User is authenticated, show Home Screen
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        ) : (
          // Unauthenticated Stack
          <>
            <Stack.Screen name="PhoneLoginScreen" component={PhoneLoginScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
