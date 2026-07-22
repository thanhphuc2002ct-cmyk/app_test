import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanScreen({ allDevices, connectToDevice, scanForPeripherals, connectedDevice, disconnectFromDevice, closeScanner }) {
  // Hiển thị từng thiết bị trong danh sách
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.deviceBtn} onPress={() => connectToDevice(item)}>
      <Text style={styles.deviceText}>{item.name}</Text>
      <Text style={styles.deviceSub}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={closeScanner}>
        <Text style={styles.closeBtnText}>← Quay lại Control</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Quét Robot A30</Text>
      
      {connectedDevice && (
        <View style={styles.connectedBox}>
          <Text style={styles.deviceText}>Đang kết nối: {connectedDevice.name}</Text>
          <TouchableOpacity style={[styles.scanBtn, { backgroundColor: '#f44336', marginTop: 10, marginBottom: 0 }]} onPress={disconnectFromDevice}>
            <Text style={styles.scanBtnText}>Ngắt kết nối</Text>
          </TouchableOpacity>
        </View>
      )}

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
  closeBtn: { padding: 10, backgroundColor: '#9e9e9e', borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
  closeBtnText: { color: 'white', fontWeight: 'bold' },
  connectedBox: { padding: 15, backgroundColor: '#e0e0e0', borderRadius: 8, marginBottom: 20, alignItems: 'center' },
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  scanBtn: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, marginBottom: 20 },
  scanBtnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  deviceBtn: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8 },
  deviceText: { fontSize: 16, fontWeight: 'bold' },
  deviceSub: { fontSize: 12, color: 'gray' }
});