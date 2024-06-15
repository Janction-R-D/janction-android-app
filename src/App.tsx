import React, {useState, useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import '@walletconnect/react-native-compat';
import {useAccount, useSignMessage, useChainId} from 'wagmi';
import {Web3Modal, W3mButton} from '@web3modal/wagmi-react-native';
import {SiweMessage} from 'siwe';
import {ParamCreateDeviceInfo, ParamLogin} from './types';
import {fetchNonce, fetchDeviceInfo, submitDeviceInfo, login} from './services';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const chainId = useChainId();
  const {address, isConnecting, isDisconnected} = useAccount();
  const {data, isError, isLoading, isSuccess, signMessage} = useSignMessage();

  const [deviceInfo, setDeviceInfo] = useState<ParamCreateDeviceInfo>();
  const [nonce, setNonce] = useState<string>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const info = {
        uniqueId: await DeviceInfo.getUniqueId(),
        instanceId: await DeviceInfo.getInstanceId(),
        serialNumber: await DeviceInfo.getSerialNumber(),
        androidId: await DeviceInfo.getAndroidId(),
        ipAddress: await DeviceInfo.getIpAddress(),
        macAddress: await DeviceInfo.getMacAddress(),
        deviceId: DeviceInfo.getDeviceId(),
        manufacturer: await DeviceInfo.getManufacturer(),
        model: DeviceInfo.getModel(),
        brand: DeviceInfo.getBrand(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
        buildId: await DeviceInfo.getBuildId(),
        apiLevel: await DeviceInfo.getApiLevel(),
        bundleId: DeviceInfo.getBundleId(),
        applicationName: DeviceInfo.getApplicationName(),
        buildNumber: DeviceInfo.getBuildNumber(),
        version: DeviceInfo.getVersion(),
        readableVersion: DeviceInfo.getReadableVersion(),
        deviceName: await DeviceInfo.getDeviceName(),
        usedMemory: await DeviceInfo.getUsedMemory(),
        totalMemory: await DeviceInfo.getTotalMemory(),
        maxMemory: await DeviceInfo.getMaxMemory(),
        totalDiskCapacity: await DeviceInfo.getTotalDiskCapacity(),
        freeDiskStorage: await DeviceInfo.getFreeDiskStorage(),
        batteryLevel: await DeviceInfo.getBatteryLevel(),
        isBatteryCharging: await DeviceInfo.isBatteryCharging(),
        isCameraPresent: await DeviceInfo.isCameraPresent(),
        isEmulator: await DeviceInfo.isEmulator(),
        isTablet: DeviceInfo.isTablet(),
        isLowRamDevice: DeviceInfo.isLowRamDevice(),
        isPinOrFingerprintSet: await DeviceInfo.isPinOrFingerprintSet(),
        hasNotch: DeviceInfo.hasNotch(),
        powerState: JSON.stringify(await DeviceInfo.getPowerState()),
        deviceType: DeviceInfo.getDeviceType(),
        supportedAbis: JSON.stringify(await DeviceInfo.supportedAbis()),
      };
      setDeviceInfo(info);
    };

    fetchData();
  }, []);

  const handleLogin = async () => {
    if (!address) {
      throw new Error('address undefined');
    }
    const nonce = await fetchNonce();

    setNonce(nonce);

    const siweMessage = new SiweMessage({
      domain: 'janction.com',
      address,
      statement: 'Sign in Janction with your wallet.',
      uri: 'https://janction.com',
      version: '1',
      chainId,
      nonce,
    });

    const message = siweMessage.prepareMessage();

    signMessage({
      message,
    });

    if (isSuccess) {
      const signature = data as string;
      const param: ParamLogin = {
        message,
        signature,
      };

      const token = await login(param);
      setToken(token)
    }
  };

  const handleGetAllDevices = async () => {
    const res = await fetchDeviceInfo();
    console.log({res});
  };

  const handleSubmitDeviceInfo = async () => {
    if (!deviceInfo) {
      throw new Error('device info undefined');
    }
    if (!token) {
      throw new Error('token undefined');
    }
    const res = await submitDeviceInfo(token, deviceInfo);
    console.log({res});
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Web3Modal />
          <View style={styles.sectionContainer}>
            <W3mButton />
          </View>
          <View>
            <Text style={styles.deviceInfoItem} key="address">
              {'address'}: {String(address)}
            </Text>
          </View>
          <Button title="login" onPress={handleLogin} />
          <View>
            <Text style={styles.deviceInfoItem} key="nonce">
              {'nonce'}: {String(nonce)}
            </Text>
          </View>
          <View>
            <Text style={styles.deviceInfoItem} key="token">
              {'token'}: {String(token)}
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Device Info</Text>
            {Object.entries(deviceInfo ?? {}).map(([key, value]) => (
              <Text style={styles.deviceInfoItem} key={key}>
                {key}: {String(value)}
              </Text>
            ))}
          </View>
          <View>
            <Button title="submit" onPress={handleSubmitDeviceInfo} />
          </View>
          <View>
            <Button title="devices" onPress={handleGetAllDevices} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  deviceInfoItem: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default App;
