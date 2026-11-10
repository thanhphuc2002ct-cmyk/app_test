import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ControlScreen from './src/screens/ControlScreen';
import HomeScreen from './src/screens/HomeScreen';
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

  const [currentView, setCurrentView] = useState('HOME');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Yêu cầu quyền ngay khi mở ứng dụng
  useEffect(() => {
    requestPermissions();
  }, []);

  // Quản lý hiển thị các màn hình dựa trên state currentView
  return (
    <SafeAreaView style={styles.container}>
      {currentView === 'HOME' && (
        <HomeScreen 
          onSelectProduct={(product) => {
            setSelectedProduct(product);
            setCurrentView('CONTROL');
          }} 
        />
      )}
      {currentView === 'SCAN' && (
        <ScanScreen
          allDevices={allDevices}
          connectToDevice={(device) => { connectToDevice(device); setCurrentView('CONTROL'); }}
          scanForPeripherals={scanForPeripherals}
          connectedDevice={connectedDevice}
          disconnectFromDevice={disconnectFromDevice}
          closeScanner={() => setCurrentView('CONTROL')}
        />
      )}
      {currentView === 'CONTROL' && (
        <ControlScreen
          connectedDevice={connectedDevice}
          sendCommand={sendCommand}
          receivedData={receivedData}
          openScanner={() => setCurrentView('SCAN')}
          goHome={() => setCurrentView('HOME')}
          selectedProduct={selectedProduct}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});