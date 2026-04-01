import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import { OTPInput } from '../components/OTPInput';

export function OTPVerificationScreen() {
    const { state, setState } = useAppContext();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [otpError, setOtpError] = useState(false);

    const phone = state.pendingRegistrationPhone || '';

    const handleBack = () => {
        setState(prev => ({ ...prev, currentView: 'portal' }));
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({ phone });
            if (error) throw error;
            setOtp(['', '', '', '', '', '']);
            setOtpError(false);
            toast.success('New OTP sent successfully');
        } catch (error) {
            console.error('Resend OTP Error:', error);
            toast.error(error.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setOtpError(true);
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setOtpError(false);

        try {
            // 1. Verify OTP with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.verifyOtp({
                phone,
                token: otpValue,
                type: 'sms'
            });

            if (authError || !authData.session) {
                console.error("Auth Error:", authError);
                throw new Error("Invalid OTP or verification failed.");
            }

            const userId = authData.user.id;

            // 2. Check if patient exists, otherwise insert into `patients` table
            const { data: existingPatient, error: selectError } = await supabase
                .from('patients')
                .select('*')
                .eq('id', userId)
                .single();

            if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means no rows found
                console.error("Select Error:", selectError);
                // Don't throw here, we can still proceed with session
            }

            if (!existingPatient) {
                const { error: insertError } = await supabase
                    .from('patients')
                    .insert([{
                        id: userId,
                        phone_number: phone
                    }]);

                if (insertError) {
                    console.error("Insert Patient Error:", insertError);
                    // Non-blocking but should be logged
                }
            }

            // 3. Update app context with generic patient info (for backward compatibility)
            setState(prev => ({
                ...prev,
                patientInfo: {
                    name: 'Patient', // Placeholder, can be asked later
                    email: '',
                    phone: phone
                },
                currentView: 'patient-dashboard'
            }));

            toast.success('OTP Verified Successfully');

        } catch (error) {
            console.error('Verify OTP Error:', error);
            setOtpError(true);
            toast.error(error.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                            <ArrowLeft size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <Card style={styles.card}>
                        <CardHeader>
                            <View style={styles.rowCentered}>
                                <ShieldCheck size={24} color="#2563eb" style={{ marginRight: 8 }} />
                                <CardTitle>Verify OTP</CardTitle>
                            </View>
                        </CardHeader>
                        <CardContent>
                            <Text style={styles.otpSubtitle}>Enter the OTP sent to {phone}</Text>

                            <OTPInput 
                                length={6} 
                                value={otp} 
                                onChange={setOtp} 
                                editable={!loading} 
                            />

                            {otpError ? <Text style={[styles.errorText, { textAlign: 'center', marginTop: 8 }]}>Invalid OTP. Please try again.</Text> : null}

                            <Button 
                                onPress={handleVerifyOtp} 
                                disabled={loading || otp.join('').length < 6} 
                                style={{ marginTop: 24, paddingVertical: 14 }}>
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </Text>
                            </Button>

                            <View style={styles.resendContainer}>
                                <Text style={styles.resendText}>Didn't receive the code? </Text>
                                <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                                    <Text style={styles.resendBtn}>Resend OTP</Text>
                                </TouchableOpacity>
                            </View>
                        </CardContent>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    content: { padding: 16, paddingBottom: 32 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    backBtn: { padding: 8, marginRight: 8 },
    card: { marginBottom: 24 },
    rowCentered: { flexDirection: 'row', alignItems: 'center' },
    otpSubtitle: { fontSize: 16, color: '#4b5563', marginBottom: 24, textAlign: 'center' },
    resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, alignItems: 'center' },
    resendText: { color: '#6b7280', fontSize: 14 },
    resendBtn: { color: '#2563eb', fontWeight: '600', fontSize: 14 },
    errorText: { fontSize: 12, color: '#ef4444', marginTop: 4 }
});
