import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function OtpScreen({ route, navigation }) {
  // Retrieve the phone number passed from PhoneLoginScreen
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      // 1. Call verifyOtp
      const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (verifyError) {
        Alert.alert('Invalid OTP', verifyError.message);
        setLoading(false);
        return;
      }

      const user = session?.user;
      if (user) {
        // 2. Check if patient exists
        const { data: existingPatient, error: fetchError } = await supabase
          .from('patients')
          .select('id')
          .eq('id', user.id)
          .single();

        // 3. If not found (error code PGRST116 means zero rows returned in single()), insert new record
        if (!existingPatient || fetchError?.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('patients')
            .insert([
              {
                id: user.id,
                phone_number: phoneNumber,
              }
            ]);

          if (insertError) {
            console.error('Error inserting new patient:', insertError);
            Alert.alert('Database Error', 'Could not register user correctly.');
          }
        }

        // 4. Navigate to HomeScreen upon successful verification
        navigation.replace('HomeScreen');
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
      <Text style={styles.title}>Verify Code</Text>
      <Text style={styles.subtitle}>Enter the 6-digit OTP sent to {phoneNumber}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
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
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 24,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6ee7b7',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
