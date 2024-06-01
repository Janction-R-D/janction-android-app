import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import '@walletconnect/react-native-compat';
import { WagmiConfig } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'viem/chains';
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
  W3mButton,
} from '@web3modal/wagmi-react-native';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '1dbb1d99d61bae1544b4a7f06b9f2575';

// 2. Create config
const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

const chains = [mainnet, polygon, arbitrum];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [deviceInfo, setDeviceInfo] = useState({});

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
        getPowerState: await DeviceInfo.getPowerState(),
        deviceType: DeviceInfo.getDeviceType(),
        supportedAbis: await DeviceInfo.supportedAbis(),
      };
      setDeviceInfo(info);
    };

    fetchData();
  }, []);

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
          <WagmiConfig config={wagmiConfig}>
            <Web3Modal />
          </WagmiConfig>
          <View style={styles.sectionContainer}>
            <W3mButton />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Device Info</Text>
            {Object.entries(deviceInfo).map(([key, value]) => (
              <Text style={styles.deviceInfoItem} key={key}>
                {key}: {String(value)}
              </Text>
            ))}
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
