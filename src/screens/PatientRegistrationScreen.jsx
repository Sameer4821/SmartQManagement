import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Phone, ArrowLeft, User } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';

export function PatientRegistrationScreen() {
    const { setState } = useAppContext();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    const handleBack = () => {
        setState(prev => ({ ...prev, currentView: 'portal' }));
    };

    const validatePhone = (p) => {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(p.replace(/\s/g, ''));
    };

    const handleSubmit = async () => {
        if (!phone.trim()) {
            setPhoneError('Mobile number is required');
            return;
        } else if (!validatePhone(phone)) {
            setPhoneError('Invalid mobile number');
            return;
        }

        setLoading(true);
        setPhoneError('');

        // Ensure +91 format if no code provided
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: formattedPhone
            });

            if (error) throw error;

            toast.success('OTP sent to your mobile number');
            setState(prev => ({
                ...prev,
                pendingRegistrationPhone: formattedPhone,
                currentView: 'otp-verification'
            }));
        } catch (error) {
            console.error('OTP Send Error:', error);
            toast.error(error.message || 'Failed to send OTP. Please try again.');
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
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>Patient Registration</Text>
                            <Text style={styles.subtitle}>Enter your details to proceed</Text>
                        </View>
                    </View>

                    <Card style={styles.card}>
                        <CardHeader>
                            <View style={styles.rowCentered}>
                                <User size={20} color="#111827" style={{ marginRight: 8 }} />
                                <CardTitle>Personal Info</CardTitle>
                            </View>
                        </CardHeader>
                        <CardContent>
                            <View style={styles.inputGroup}>
                                <View style={styles.labelRow}>
                                    <Phone size={16} color="#374151" style={{ marginRight: 4 }} />
                                    <Text style={styles.label}>Mobile Number *</Text>
                                </View>
                                <TextInput
                                    style={[styles.input, phoneError && styles.inputError]}
                                    placeholder="Enter 10 digit mobile number"
                                    value={phone}
                                    onChangeText={(val) => {
                                        setPhone(val);
                                        setPhoneError('');
                                    }}
                                    keyboardType="phone-pad"
                                    editable={!loading}
                                    maxLength={10}
                                />
                                {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                            </View>

                            <Button 
                                onPress={handleSubmit} 
                                disabled={loading || !phone.trim()} 
                                style={{ marginTop: 16 }}>
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                                    {loading ? 'Sending OTP...' : 'Continue'}
                                </Text>
                            </Button>

                            <Button 
                                onPress={() => {
                                    setState(prev => ({
                                        ...prev,
                                        patientInfo: {
                                            name: 'Test Patient',
                                            email: '',
                                            phone: '+919999999999'
                                        },
                                        currentView: 'patient-dashboard'
                                    }));
                                }}
                                style={{ marginTop: 16, backgroundColor: '#10b981' }}>
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                                    Skip Login (Dev)
                                </Text>
                            </Button>
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
    title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
    subtitle: { fontSize: 14, color: '#6b7280' },
    card: { marginBottom: 24 },
    rowCentered: { flexDirection: 'row', alignItems: 'center' },
    inputGroup: { marginBottom: 16 },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    label: { fontSize: 14, fontWeight: '500', color: '#374151' },
    input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, backgroundColor: '#fff' },
    inputError: { borderColor: '#ef4444' },
    errorText: { fontSize: 12, color: '#ef4444', marginTop: 4 },
});
