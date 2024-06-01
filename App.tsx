/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [deviceInfo, setDeviceInfo] = useState({
    systemName: '',
    systemVersion: '',
    apiLevel: 0,
    model: '',
    manufacturer: '',
    brand: '',
    serialNumber: '',
    androidId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const systemName = DeviceInfo.getSystemName();
      const systemVersion = DeviceInfo.getSystemVersion();
      const apiLevel = await DeviceInfo.getApiLevel();
      const model = DeviceInfo.getModel();
      const manufacturer = await DeviceInfo.getManufacturer();
      const brand = DeviceInfo.getBrand();
      const serialNumber = await DeviceInfo.getSerialNumber();
      const androidId = await DeviceInfo.getAndroidId();

      setDeviceInfo({
        systemName,
        systemVersion,
        apiLevel,
        model,
        manufacturer,
        brand,
        serialNumber,
        androidId,
      });
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
        style={backgroundStyle}
      >
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Section title="Device Info">
            <Text style={styles.deviceInfoItem}>System Name: {deviceInfo.systemName}</Text>
            <Text style={styles.deviceInfoItem}>System Version: {deviceInfo.systemVersion}</Text>
            <Text style={styles.deviceInfoItem}>API Level: {deviceInfo.apiLevel}</Text>
            <Text style={styles.deviceInfoItem}>Model: {deviceInfo.model}</Text>
            <Text style={styles.deviceInfoItem}>Manufacturer: {deviceInfo.manufacturer}</Text>
            <Text style={styles.deviceInfoItem}>Brand: {deviceInfo.brand}</Text>
            <Text style={styles.deviceInfoItem}>Serial Number: {deviceInfo.serialNumber}</Text>
            <Text style={styles.deviceInfoItem}>Android ID: {deviceInfo.androidId}</Text>
          </Section>
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
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  sectionContent: {
    marginTop: 8,
  },
  deviceInfoItem: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default App;
