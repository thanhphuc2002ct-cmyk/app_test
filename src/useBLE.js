import { useMemo, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import base64 from 'react-native-base64';
import { BleManager } from 'react-native-ble-plx';
import { BLE_UUIDS } from './constants';

export default function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [receivedData, setReceivedData] = useState([]);

  // Yêu cầu quyền Bluetooth và Vị trí từ hệ điều hành
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Quét tìm thiết bị BLE xung quanh
  const scanForPeripherals = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) return;
      if (device && device.name) {
        setAllDevices((prevState) => {
          if (!prevState.find((dev) => dev.id === device.id)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  // Kết nối và bắt đầu lắng nghe Characteristic TX
  const connectToDevice = async (device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      bleManager.stopDeviceScan();
      await deviceConnection.discoverAllServicesAndCharacteristics();
      
      deviceConnection.monitorCharacteristicForService(
        BLE_UUIDS.SERVICE,
        BLE_UUIDS.TX,
        (error, characteristic) => {
          if (error) return;
          if (characteristic?.value) {
            const rawData = base64.decode(characteristic.value);
            setReceivedData((prev) => [...prev, rawData]);
          }
        }
      );
    } catch (e) {
      console.log('Connection error', e);
    }
  };

  // Ngắt kết nối thiết bị hiện tại
  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setReceivedData([]);
    }
  };

  // Mã hóa chuỗi text sang Base64 và gửi xuống xe qua Characteristic RX
  const sendCommand = async (commandString) => {
    if (connectedDevice) {
      try {
        const payload = base64.encode(commandString);
        await bleManager.writeCharacteristicWithoutResponseForDevice(
          connectedDevice.id,
          BLE_UUIDS.SERVICE,
          BLE_UUIDS.RX,
          payload
        );
      } catch (e) {
        console.log('Send error', e);
      }
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    disconnectFromDevice,
    sendCommand,
    allDevices,
    connectedDevice,
    receivedData,
  };
}