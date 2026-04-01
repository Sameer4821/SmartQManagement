import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function PhoneLoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    // Validate phone number format (must include country code)
    if (!phoneNumber || phoneNumber.length < 10 || !phoneNumber.startsWith('+')) {
      Alert.alert('Invalid Format', 'Please enter a valid phone number with country code (e.g., +91XXXXXXXXXX)');
      return;
    }

    setLoading(true);
    try {
      // 1. Send OTP to the phone number using Supabase Auth
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        Alert.alert('OTP Send Failure', error.message);
      } else {
        // 2. On success, navigate to OtpScreen passing the phone number
        navigation.navigate('OtpScreen', { phoneNumber });
      }
    } catch (err) {
      Alert.alert('Network Error', 'An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Enter your phone number to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="+91XXXXXXXXXX"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCapitalize="none"
        editable={!loading}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
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
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
