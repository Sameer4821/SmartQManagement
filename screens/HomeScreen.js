import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the current user session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // 2. Clear stack and go back to login
    navigation.reset({
      index: 0,
      routes: [{ name: 'PhoneLoginScreen' }],
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerAll]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>

      {user ? (
        <View style={styles.card}>
          <Text style={styles.infoLabel}>User ID:</Text>
          <Text style={styles.infoValue}>{user.id}</Text>
          
          <Text style={styles.infoLabel}>Phone Number:</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No user session found.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  centerAll: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#f9fafb',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 32,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 24,
  }
});
