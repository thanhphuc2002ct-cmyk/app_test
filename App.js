import { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ControlScreen from './src/screens/ControlScreen';
import ScanScreen from './src/screens/ScanScreen';
import useBLE from './src/useBLE';

export default function App() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    sendCommand,
    receivedData,
  } = useBLE();

  // Yêu cầu quyền ngay khi mở ứng dụng
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {connectedDevice ? (
        <ControlScreen
          connectedDevice={connectedDevice}
          disconnectFromDevice={disconnectFromDevice}
          sendCommand={sendCommand}
          receivedData={receivedData}
        />
      ) : (
        <ScanScreen
          allDevices={allDevices}
          connectToDevice={connectToDevice}
          scanForPeripherals={scanForPeripherals}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});