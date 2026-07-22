import { useEffect, useState } from 'react';
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

  const [showScanner, setShowScanner] = useState(false);

  // Yêu cầu quyền ngay khi mở ứng dụng
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {showScanner ? (
        <ScanScreen
          allDevices={allDevices}
          connectToDevice={(device) => { connectToDevice(device); setShowScanner(false); }}
          scanForPeripherals={scanForPeripherals}
          connectedDevice={connectedDevice}
          disconnectFromDevice={disconnectFromDevice}
          closeScanner={() => setShowScanner(false)}
        />
      ) : (
        <ControlScreen
          connectedDevice={connectedDevice}
          sendCommand={sendCommand}
          receivedData={receivedData}
          openScanner={() => setShowScanner(true)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});