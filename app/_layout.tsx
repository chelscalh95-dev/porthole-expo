import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#111' },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: '#1a1a1a' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Traffic' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail' }} />
    </Stack>
  );
}