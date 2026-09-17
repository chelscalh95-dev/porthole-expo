import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Porthole, Transaction } from '../modules/porthole/src';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (id) {
      Porthole.getTransaction(id).then(setTransaction);
    }
  }, [id]);

  if (!transaction) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#4caf50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {transaction.request.method} {transaction.request.url}
      </Text>

      <Text style={styles.section}>Response</Text>
      <Text style={styles.value}>
        Status: {transaction.response?.statusCode ?? 'N/A'}
      </Text>
      {transaction.error && (
        <Text style={styles.errorValue}>
          Error: {transaction.error.code} — {transaction.error.message}
        </Text>
      )}

      <Text style={styles.section}>Request Headers</Text>
      {transaction.request.headers.map((h, i) => (
        <Text key={i} style={styles.header}>{h.key}: {h.value}</Text>
      ))}

      {transaction.response && transaction.response.headers.length > 0 && (
        <>
          <Text style={styles.section}>Response Headers</Text>
          {transaction.response.headers.map((h, i) => (
            <Text key={i} style={styles.header}>{h.key}: {h.value}</Text>
          ))}
        </>
      )}

      {transaction.responseBody && (
        <>
          <Text style={styles.section}>Response Body</Text>
          <Text style={styles.body}>{atob(transaction.responseBody)}</Text>
        </>
      )}

      {transaction.websocketMessages.length > 0 && (
        <>
          <Text style={styles.section}>WebSocket / SSE Messages</Text>
          {transaction.websocketMessages.map((m, i) => (
            <View key={i} style={styles.wsRow}>
              <Text style={styles.wsMeta}>
                {new Date(m.createdAt * 1000).toLocaleTimeString()} · {m.messageType}
              </Text>
              <Text style={styles.wsBody}>
                {m.stringValue ?? (m.dataValue ? atob(m.dataValue) : '')}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 16 },
  loader: { flex: 1, justifyContent: 'center', backgroundColor: '#1a1a1a' },
  title: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 16 },
  section: {
    color: '#4caf50', fontSize: 13, fontWeight: 'bold',
    marginTop: 16, marginBottom: 6,
  },
  value: { color: '#ddd', fontSize: 13 },
  errorValue: { color: '#f44336', fontSize: 13 },
  header: { color: '#aaa', fontSize: 12, fontFamily: 'Courier' },
  body: { color: '#ddd', fontSize: 12, fontFamily: 'Courier' },
  wsRow: {
    borderLeftWidth: 2, borderLeftColor: '#4caf50',
    paddingLeft: 8, marginBottom: 8,
  },
  wsMeta: { color: '#666', fontSize: 11 },
  wsBody: { color: '#ddd', fontSize: 12, fontFamily: 'Courier' },
});