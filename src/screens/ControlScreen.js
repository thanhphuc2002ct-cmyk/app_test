import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ControlScreen({ connectedDevice, sendCommand, receivedData, openScanner }) {
  const [activeMode, setActiveMode] = useState(1);
  const [mazeSteps, setMazeSteps] = useState([]);
  const [logs, setLogs] = useState([]);
  const [speedStep, setSpeedStep] = useState(1);
  const speedBase = 180 + (speedStep - 1) * 10;
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (receivedData && receivedData.length > 0) {
      addLog("RX", receivedData[receivedData.length - 1]);
    }
  }, [receivedData]);

  const addLog = (type, message) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${type}: ${message}`]);
  };

  const handleSendCommand = (cmd) => {
    sendCommand(cmd);
    addLog("TX", cmd);
  };

  const startSending = (cmd) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    handleSendCommand(cmd);
    intervalRef.current = setInterval(() => handleSendCommand(cmd), 100);
  };

  const stopSending = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    handleSendCommand("0,0");
  };

  // Tính toán giá trị dựa trên mốc tốc độ hiện tại và gửi lệnh
  const move = (mLeft, mRight) => {
    const left = mLeft === 0 ? 0 : (mLeft > 0 ? speedBase : -speedBase);
    const right = mRight === 0 ? 0 : (mRight > 0 ? speedBase : -speedBase);
    startSending(`${left},${right}`);
  };

  const handleModeSelect = (modeStr) => {
    setActiveMode(parseInt(modeStr));
    handleSendCommand(modeStr);
  };

  const handleMazeCommand = (cmd) => {
    if (cmd === '#') {
      handleSendCommand(cmd);
      setMazeSteps([]);
    } else {
      setMazeSteps((prev) => [...prev, cmd]);
      handleSendCommand(cmd);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.deviceName}>Đã kết nối: {connectedDevice ? connectedDevice.name : "Chưa kết nối"}</Text>
        <TouchableOpacity style={styles.disconnectBtn} onPress={openScanner}>
          <Text style={styles.btnText}>Bluetooth</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Log Gửi/Nhận</Text>
      <View style={styles.logContainer}>
        <FlatList
          ref={flatListRef}
          data={logs}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.logText}>{item}</Text>}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      </View>

      <Text style={styles.sectionTitle}>Chọn Chế Độ</Text>
      <View style={styles.row}>
        {['1', '2', '3', '4', '5', '6'].map((mode) => (
          <TouchableOpacity 
            key={mode} 
            style={[styles.modeBtn, activeMode === parseInt(mode) && styles.modeActive]}
            onPress={() => handleModeSelect(mode)}
          >
            <Text style={styles.btnText}>M{mode}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeMode === 4 && (
        <View style={styles.controlBox}>
          <Text style={styles.sectionTitle}>Điều khiển Mê Cung</Text>
          <Text style={{textAlign: 'center', marginBottom: 10}}>Đã nhập: {mazeSteps.join(', ')}</Text>
          <View style={styles.dpad}>
            <TouchableOpacity style={styles.dirBtn} onPress={() => handleMazeCommand('U')}><Text>U</Text></TouchableOpacity>
            <View style={styles.row}>
              <TouchableOpacity style={styles.dirBtn} onPress={() => handleMazeCommand('L')}><Text>L</Text></TouchableOpacity>
              <TouchableOpacity style={styles.dirBtn} onPress={() => handleMazeCommand('D')}><Text>D</Text></TouchableOpacity>
              <TouchableOpacity style={styles.dirBtn} onPress={() => handleMazeCommand('R')}><Text>R</Text></TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.runBtn} onPress={() => handleMazeCommand('#')}>
            <Text style={styles.btnText}>Bắt đầu chạy (#)</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeMode === 5 && (
        <View style={styles.controlBox}>
          <Text style={styles.sectionTitle}>Đổi âm sắc</Text>
          <View style={styles.row}>
            {['A', 'B', 'C'].map((note) => (
              <TouchableOpacity key={note} style={styles.noteBtn} onPress={() => handleSendCommand(note)}>
                <Text style={styles.btnText}>Nốt {note}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {activeMode === 6 && (
        <View style={styles.padBox}>
          <View style={styles.sliderContainer}>
            <Text style={styles.sectionTitle}>Tốc độ hiện tại: {speedBase}</Text>
            <View style={styles.sliderTrack}>
              {[1, 2, 3, 4, 5].map((step) => (
                <TouchableOpacity 
                  key={step} 
                  style={[styles.sliderThumb, speedStep >= step ? styles.sliderThumbActive : null]}
                  onPress={() => setSpeedStep(step)}
                >
                  <Text style={styles.sliderText}>{step}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.padRow}>
            <TouchableOpacity style={styles.padBtn} onPressIn={() => move(-1, -1)} onPressOut={stopSending}><Text>Tiến Trái</Text></TouchableOpacity>
            <TouchableOpacity style={styles.padBtn} onPressIn={() => move(-1, 0)} onPressOut={stopSending}><Text>Tiến</Text></TouchableOpacity>
            <TouchableOpacity style={styles.padBtn} onPressIn={() => move(-1, 1)} onPressOut={stopSending}><Text>Tiến Phải</Text></TouchableOpacity>
          </View>
          <View style={styles.padRow}>
            <TouchableOpacity style={styles.padBtn} onPressIn={() => move(0, -1)} onPressOut={stopSending}><Text>Xoay Trái</Text></TouchableOpacity>
            <TouchableOpacity style={styles.padBtn} onPressIn={() => stopSending()} onPressOut={stopSending}><Text>Dừng</Text></TouchableOpacity>
            <TouchableOpacity style={styles.padBtn} onPressIn={() => move(0, 1)} onPressOut={stopSending}><Text>Xoay Phải</Text></TouchableOpacity>
          </View>
          <View style={styles.padRow}>
            <TouchableOpacity style={styles.padBtn} onPressIn={() => move(1, -1)} onPressOut={stopSending}><Text>Lùi Trái</Text></TouchableOpacity>
            <TouchableOpacity style={styles.padBtn} onPressIn={() => move(1, 0)} onPressOut={stopSending}><Text>Lùi</Text></TouchableOpacity>
            <TouchableOpacity style={styles.padBtn} onPressIn={() => move(1, 1)} onPressOut={stopSending}><Text>Lùi Phải</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  deviceName: { fontSize: 16, fontWeight: 'bold' },
  disconnectBtn: { backgroundColor: '#2196F3', padding: 8, borderRadius: 5 },
  btnText: { color: 'white', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  logContainer: { height: 120, backgroundColor: '#1e1e1e', padding: 10, borderRadius: 8 },
  logText: { color: '#00ff00', fontSize: 12, fontFamily: 'monospace', marginBottom: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  modeBtn: { backgroundColor: '#9e9e9e', padding: 15, borderRadius: 5, width: 50, alignItems: 'center' },
  modeActive: { backgroundColor: '#4CAF50' },
  controlBox: { marginTop: 20, padding: 10, backgroundColor: 'white', borderRadius: 10 },
  dpad: { alignItems: 'center' },
  dirBtn: { backgroundColor: '#e0e0e0', padding: 20, margin: 5, borderRadius: 5, width: 60, alignItems: 'center' },
  runBtn: { backgroundColor: '#FF9800', padding: 15, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  noteBtn: { backgroundColor: '#673AB7', padding: 15, borderRadius: 5, width: 80, alignItems: 'center' },
  padBox: { marginTop: 10, padding: 10, backgroundColor: 'white', borderRadius: 10 },
  padRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  padBtn: { flex: 1, height: 60, backgroundColor: '#007AFF', marginHorizontal: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  sliderContainer: { marginBottom: 15, alignItems: 'center' },
  sliderTrack: { flexDirection: 'row', backgroundColor: '#e0e0e0', borderRadius: 10, padding: 5, width: '100%', justifyContent: 'space-between' },
  sliderThumb: { flex: 1, alignItems: 'center', paddingVertical: 10, marginHorizontal: 2, borderRadius: 8, backgroundColor: '#bdbdbd' },
  sliderThumbActive: { backgroundColor: '#FF9800' },
  sliderText: { color: 'white', fontWeight: 'bold' }
});