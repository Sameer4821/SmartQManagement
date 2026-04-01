import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/card';
import { Clock } from 'lucide-react-native';

export function QueueCard({ token, getDepartmentIcon, formatTokenId, isActive }) {
    return (
        <Card style={[styles.queueCard, isActive && styles.activeCard]}>
            <View style={styles.qRow}>
                <View style={styles.qTokenBadge}>
                    <Text style={styles.qTokenText}>{formatTokenId(token.id)}</Text>
                </View>
                <View style={styles.qInfo}>
                    <Text style={styles.qName}>{token.patient?.name || 'Patient'}</Text>
                    <Text style={styles.qTime}>
                        <Clock size={12} color="#64748b" style={{ marginRight: 4 }} /> 
                        {new Date(token.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <View>
                    {getDepartmentIcon && getDepartmentIcon(token.id)}
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    queueCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    activeCard: {
        borderColor: '#3b82f6',
        backgroundColor: '#eff6ff'
    },
    qRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    qTokenBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 12
    },
    qTokenText: {
        fontWeight: '700',
        color: '#334155',
        fontSize: 16
    },
    qInfo: {
        flex: 1
    },
    qName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 2
    },
    qTime: {
        fontSize: 12,
        color: '#64748b',
        flexDirection: 'row',
        alignItems: 'center'
    }
});
