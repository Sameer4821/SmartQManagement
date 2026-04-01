import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export function OTPInput({ length = 6, value, onChange, editable = true }) {
    const inputRefs = useRef([]);

    const handleOtpChange = (val, index) => {
        if (isNaN(Number(val))) return;

        const newOtp = [...value];
        newOtp[index] = val;
        onChange(newOtp);

        if (val && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1].focus();
            const newOtp = [...value];
            newOtp[index - 1] = '';
            onChange(newOtp);
        }
    };

    return (
        <View style={styles.otpContainer}>
            {Array(length).fill(0).map((_, idx) => (
                <TextInput
                    key={idx}
                    ref={el => inputRefs.current[idx] = el}
                    style={styles.otpInput}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={value[idx] || ''}
                    onChangeText={val => handleOtpChange(val, idx)}
                    onKeyPress={e => handleOtpKeyPress(e, idx)}
                    editable={editable}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    otpContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: 8,
        marginVertical: 16 
    },
    otpInput: { 
        width: 48, 
        height: 60, 
        borderWidth: 1, 
        borderColor: '#d1d5db', 
        borderRadius: 12, 
        fontSize: 24, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        backgroundColor: '#fff', 
        color: '#111827' 
    }
});
