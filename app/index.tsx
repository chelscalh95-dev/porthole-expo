import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Link } from 'expo-router';
import { Porthole, PackageSummary } from '../modules/porthole/src';

export default function TrafficListScreen() {
  const [transactions, setTransactions] = useState<PackageSummary[]>([]);

  useEffect(() => {
    Porthole.startCapture();
    Porthole.getTransactions(0, 100).then(data => {
      setTransactions(data.map(t => ({
        id: t.id,
        url: t.request.url,
        method: t.request.method,
        statusCode: t.response?.statusCode,
        packageType: t.packageType,
        startAt: t.startAt,
        endAt: t.endAt,
        hasError: !!t.error,
      })));
    });

    const subscription = Porthole.addListener('onNewPackage', (pkg) => {
      setTransactions(prev => {
        const idx = prev.findIndex(p => p.id === pkg.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = pkg;
          return next;
        }
        return [pkg, ...prev];
      });
    });

    return () => subscription.remove();
  }, []);

  const renderItem = ({ item }: { item: PackageSummary }) => (
    <Link href={`/${item.id}`} asChild>
      <TouchableOpacity style={styles.row}>
        <Text style={styles.method}>{item.method}</Text>
        <Text style={styles.url} numberOfLines={1}>{item.url}</Text>
        {item.statusCode !== undefined && (
          <Text style={[
            styles.status,
            item.statusCode >= 400 && styles.statusError,
          ]}>
            {item.statusCode}
          </Text>
        )}
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No traffic captured yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a2a',
  },
  method: { width: 55, color: '#4caf50', fontWeight: 'bold', fontSize: 12 },
  url: { flex: 1, color: '#ccc', fontSize: 13, marginHorizontal: 8 },
  status: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  statusError: { color: '#f44336' },
  empty: { color: '#666', textAlign: 'center', marginTop: 40 },
});