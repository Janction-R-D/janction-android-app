import React, {useState, useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Pressable,
  View,
  Image,
  Dimensions,
  Alert,
  ToastAndroid,
  FlatList,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import '@walletconnect/react-native-compat';
import {useAccount, useSignMessage, useChainId} from 'wagmi';
import {Web3Modal, W3mButton} from '@web3modal/wagmi-react-native';
import {SiweMessage} from 'siwe';
import {ParamCreateDeviceInfo, ParamLogin} from './types';
import {fetchNonce, fetchDeviceInfo, submitDeviceInfo, login} from './services';
import NavigationModule from './utils/NavigationModule';
import CustomButton from './components/CBtn';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';
  const isDarkMode = true;
  let myHeight = Math.floor((screenWidth / 982) * 199);

  const chainId = useChainId();
  const {address, isConnecting, isDisconnected} = useAccount();
  const {data, isError, isLoading, isSuccess, signMessageAsync} =
    useSignMessage();

  const [deviceInfo, setDeviceInfo] = useState<ParamCreateDeviceInfo>();
  const [nonce, setNonce] = useState<string>();
  const [token, setToken] = useState<string>();
  const showToastWithGravity = text => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };
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
      showToastWithGravity('Please Connect Wallet!');
      return;
      throw new Error('address undefined');
    }
    const nonce = await fetchNonce();

    setNonce(nonce);

    const siweMessage = new SiweMessage({
      domain: 'janction.io',
      address,
      statement: 'Sign in Janction with your wallet.',
      uri: 'https://janction.io',
      version: '1',
      chainId,
      nonce,
    });

    const message = siweMessage.prepareMessage();

    await signMessageAsync({
      message,
    });

    if (isSuccess) {
      const signature = data as string;
      const param: ParamLogin = {
        message,
        signature,
      };

      const token = await login(param);
      setToken(token);
    }
  };

  const handleGetAllDevices = async () => {
    if (!token) {
      showToastWithGravity('Please Login!');
      return;
    }
    const res = await fetchDeviceInfo();
    console.log({res});
  };

  const handleCPUGPUSetting = async () => {
    console.log('handleCPUGPUSetting');
    NavigationModule.navigateToActivity('com.janctionmobile.YourActivity');
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
        <View style={styles.sectionContainer}>
          <Image
            style={styles.logoImage}
            // height={myHeight}
            source={require('./img/icon.png')}
            resizeMode="contain"
          />
          <Web3Modal />

          <Text style={styles.subTitle} key="connect">
            Connect
          </Text>
          <Text style={styles.text}>1. Connect To Web3 Wallet</Text>
          <View>
            <W3mButton connectStyle={styles.button} label="Connect Wallet" />
          </View>
          <Text style={styles.text}>2. Sign And Login to Janction</Text>

          <View>
            <CustomButton
              style={styles.button}
              onPress={handleLogin}
              title={'Login'}
            />
            {/* <CustomButton onPress={handleGetAllDevices} title={'My Nodes'} /> */}
            {/* <View>
                <Button title="CPU/GPU SETTING" onPress={handleCPUGPUSetting} />
              </View> */}
          </View>

          <Text style={styles.subTitle} key="online-nodes">
            Online Nodes
          </Text>

          <View style={styles.nodeGroup}>
            {!token && (
              <View style={styles.listRow}>
                <Text style={styles.listError}></Text>
                <Text style={styles.list}>Please Login.</Text>
              </View>
            )}
            {token && (
              <View>
                <View style={styles.listRow}>
                  <Text style={styles.listAlive}></Text>
                  <Text style={styles.list}>
                    Android, NodeID(12846268743), 1034 Point
                  </Text>
                </View>
                <View style={styles.listRow}>
                  <Text style={styles.listAlive}></Text>
                  <Text style={styles.list}>
                    MacOS, CPU, NodeID(7236726431), 14 Point
                  </Text>
                </View>
                <View style={styles.listRow}>
                  <Text style={styles.listAlive}></Text>
                  <Text style={styles.list}>
                    Linux, GPU, NodeID(12846268743), 1034 Point
                  </Text>
                </View>
              </View>
            )}
          </View>

          <Text style={styles.subTitle} key="token">
            Go to details
          </Text>
          <CustomButton
            style={styles.buttonCell}
            onPress={handleCPUGPUSetting}
            title={'Running Job'}
          />

          {/* <View>
            <Text style={styles.deviceInfoItem} key="address">
              {'address'}: {String(address)}
            </Text>
          </View> */}
          {/* {isConnecting && <>sss</>} */}

          <Text style={styles.subTitle}>Device Info</Text>

          <View style={styles.table}>
            {Object.entries(deviceInfo ?? {}).map(([key, value]) => (
              // <Text style={styles.deviceInfoItem} key={key}>
              //   {key}: {String(value)}
              // </Text>

              <View style={styles.row}>
                <Text style={styles.cell} key={key}>
                  {key}
                </Text>
                <Text style={styles.cell} key={key + '1'}>
                  {String(value)}
                </Text>
              </View>
            ))}

            {/* Add more rows as needed */}
          </View>

          <View>
            <Text style={styles.deviceInfoItem} key="nonce">
              {'nonce'}: {nonce ? String(nonce) : 'loading...'}
            </Text>
          </View>
          <View>
            <Text style={styles.deviceInfoItem} key="token">
              {'token'}: {String(token)}
            </Text>
          </View>
          {/* <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Device Info</Text>
            {Object.entries(deviceInfo ?? {}).map(([key, value]) => (
              <Text style={styles.deviceInfoItem} key={key}>
                {key}: {String(value)}
              </Text>
            ))}
          </View> */}
          {/* <View>
            <Button title="submit" onPress={handleSubmitDeviceInfo} />
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,

    // width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  deviceInfoItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  logoImage: {
    // justifyContent: 'center',
    // alignItems: 'center',
    width: 200,
    height: 100,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 12,
    // paddingHorizontal: 32,
    borderRadius: 6,
    elevation: 5,
    backgroundColor: '#DD5ACC',
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    marginTop: 20,
    color: 'white',
  },
  item: {
    color: 'white',
  },
  listAlive: {
    marginLeft: 15,
    marginTop: 7,
    marginRight: 5,
    width: 7,
    height: 7,
    backgroundColor: '#52ca60',
  },
  listError: {
    marginLeft: 15,
    marginTop: 7,
    marginRight: 5,
    width: 7,
    height: 7,
    backgroundColor: 'red',
  },
  list: {
    color: '#fff',
    height: 30,
  },
  listRow: {
    marginTop: 8,
    flexDirection: 'row',
  },
  nodeGroup: {
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#333',
    borderColor: '#fff',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  cell: {
    flex: 1,
    padding: 10,
    // borderWidth: 1,
    // width: 200,
    // height: 200,
    textAlign: 'center',
    color: '#fff',
    // borderColor: 'black',
  },
  buttonTable: {},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCell: {},
});

export default App;
