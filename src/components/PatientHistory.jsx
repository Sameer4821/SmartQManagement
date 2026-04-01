import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, History, FileText, FlaskConical } from 'lucide-react-native';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useAppContext } from '../context/AppContext';

export function PatientHistory({ onBack }) {
    const { state } = useAppContext();

    const patientTokens = state.tokens.filter(tok => 
        (tok.patient?.phone && state.patientInfo?.phone && tok.patient.phone === state.patientInfo.phone) ||
        (tok.patient?.email && state.patientInfo?.email && tok.patient.email === state.patientInfo.email)
    );

    // Sort tokens: Priority (emergency > common > disabled) then by Date (newest first)
    const sortedTokens = [...patientTokens].sort((a, b) => {
        const priorityScore = { 'emergency': 3, 'common': 2, 'disabled': 1 };
        const scoreA = priorityScore[a.type?.toLowerCase()] || 0;
        const scoreB = priorityScore[b.type?.toLowerCase()] || 0;

        if (scoreA !== scoreB) {
            return scoreB - scoreA; // Higher priority first
        }

        const dateA = new Date(a.scheduledTime || a.timestamp || 0).getTime();
        const dateB = new Date(b.scheduledTime || b.timestamp || 0).getTime();
        return dateB - dateA; // Newest first
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1e3a8a" />
                </TouchableOpacity>
                <Text style={styles.title}>Patient History</Text>
            </View>

            {sortedTokens.length === 0 ? (
                <Card style={styles.card}>
                    <CardContent style={styles.emptyContent}>
                        <History size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
                        <Text style={styles.emptyText}>No medical history found.</Text>
                        <Text style={styles.emptySubtext}>Your past consultations and treatments will appear here.</Text>
                    </CardContent>
                </Card>
            ) : (
                sortedTokens.map((token, index) => (
                    <Card key={index} style={[styles.card, token.status === 'active' && { borderColor: '#3b82f6', borderWidth: 2 }]}>
                        <CardHeader style={styles.cardHeader}>
                            <View>
                                <CardTitle>{token.department}</CardTitle>
                                <Text style={styles.dateText}>{token.timestamp ? new Date(token.timestamp).toLocaleDateString() : new Date().toLocaleDateString()}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                <Badge variant="outline" style={{ backgroundColor: token.type === 'emergency' ? '#fee2e2' : '#f3f4f6' }}>
                                    <Text style={{ color: token.type === 'emergency' ? '#dc2626' : '#374151', textTransform: 'capitalize' }}>
                                        {token.type}
                                    </Text>
                                </Badge>
                                {token.status === 'active' && (
                                    <Badge style={{ backgroundColor: '#eff6ff' }}>
                                        <Text style={{ color: '#2563eb', fontSize: 10 }}>ACTIVE</Text>
                                    </Badge>
                                )}
                            </View>
                        </CardHeader>
                        <CardContent>
                            {token.patient && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Patient Details</Text>
                                    <Text style={styles.sectionText}>Name: {token.patient.name}</Text>
                                    <Text style={styles.sectionText}>
                                        Age: {token.patient.age} • Gender: {token.patient.gender}
                                    </Text>
                                    {token.patient.phone && <Text style={styles.sectionText}>Phone: {token.patient.phone}</Text>}
                                    {token.patient.symptoms && <Text style={styles.sectionText}>Symptoms: {token.patient.symptoms}</Text>}
                                </View>
                            )}

                            {token.notes && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Consultation Notes</Text>
                                    <Text style={styles.sectionText}>{token.notes}</Text>
                                </View>
                            )}

                            {token.prescriptions && token.prescriptions.length > 0 && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <FileText size={16} color="#4b5563" style={{ marginRight: 8 }} />
                                        <Text style={styles.sectionTitle}>Prescriptions</Text>
                                    </View>
                                    {token.prescriptions.map((px, i) => (
                                        <Text key={i} style={styles.listItem}>• {px}</Text>
                                    ))}
                                </View>
                            )}

                            {token.labTests && token.labTests.length > 0 && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <FlaskConical size={16} color="#4b5563" style={{ marginRight: 8 }} />
                                        <Text style={styles.sectionTitle}>Lab Tests</Text>
                                    </View>
                                    {token.labTests.map((test, i) => (
                                        <Text key={i} style={styles.listItem}>• {test}</Text>
                                    ))}
                                </View>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    card: {
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    dateText: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 4,
    },
    section: {
        marginTop: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    sectionText: {
        color: '#4b5563',
        lineHeight: 20,
    },
    listItem: {
        color: '#4b5563',
        marginBottom: 4,
        marginLeft: 8,
    },
    emptyContent: {
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    emptySubtext: {
        color: '#6b7280',
        textAlign: 'center',
    },
});

