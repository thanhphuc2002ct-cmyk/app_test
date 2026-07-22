import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanScreen({ allDevices, connectToDevice, scanForPeripherals }) {
  // Hiển thị từng thiết bị trong danh sách
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.deviceBtn} onPress={() => connectToDevice(item)}>
      <Text style={styles.deviceText}>{item.name}</Text>
      <Text style={styles.deviceSub}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quét Robot A30</Text>
      <TouchableOpacity style={styles.scanBtn} onPress={scanForPeripherals}>
        <Text style={styles.scanBtnText}>Bắt đầu quét</Text>
      </TouchableOpacity>
      <FlatList
        data={allDevices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  scanBtn: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, marginBottom: 20 },
  scanBtnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  deviceBtn: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8 },
  deviceText: { fontSize: 16, fontWeight: 'bold' },
  deviceSub: { fontSize: 12, color: 'gray' }
});