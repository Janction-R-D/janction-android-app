import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import '@walletconnect/react-native-compat';
import {useAccount, useSignMessage, useChainId} from 'wagmi';
import {Web3Modal, W3mButton} from '@web3modal/wagmi-react-native';
import {SiweMessage} from 'siwe';
import {
  Device,
  NodeInfo,
  ParamGetNodeInfos,
  ParamHeartbeat,
  ParamLogin,
} from './types';
import {fetchNonce, performLogin, performHeartbeat} from './services';
import NavigationModule from './utils/NavigationModule';
import CustomButton from './components/CBtn';
import {convertDeviceToParamHeartbeat} from './utils';
import {storeToken, getToken, removeToken} from './store';
import {fetchNodeInfos} from './services/node';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';
  const isDarkMode = true;
  let myHeight = Math.floor((screenWidth / 982) * 199);

  const chainId = useChainId();
  const {address, isConnecting, isDisconnected} = useAccount();
  const {data, isSuccess, signMessageAsync} = useSignMessage();

  const [deviceInfo, setDeviceInfo] = useState<Device>();
  const [nonce, setNonce] = useState<string>();
  const [token, setToken] = useState<string>();
  const [nodeInfos, setNodeInfos] = useState<NodeInfo[]>();
  const showToastWithGravity = (text: string) => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  useEffect(() => {
    if (token) {
      const intervalId = setInterval(handleHeartbeat, 5000);
      return () => clearInterval(intervalId);
    }
  }, [token, deviceInfo]);

  useEffect(() => {
    if (token) {
      const intervalId = setInterval(handleFetchNodeInfos, 10000);
      return () => clearInterval(intervalId);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      handleFetchNodeInfos();
    }
  }, [token]);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      if (token) {
        setToken(token);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchDevice = async () => {
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

    fetchDevice();
  }, []);

  const handleLogin = async () => {
    if (!deviceInfo) {
      showToastWithGravity('Waitting for device info detect!');
      return;
    }
    if (!address) {
      showToastWithGravity('Please Connect Wallet!');
      return;
    }
    showToastWithGravity('Test test ');
    const nonce = await fetchNonce();
    showToastWithGravity('nonnce ' + nonce);

    setNonce(nonce);

    const siweMessage = new SiweMessage({
      domain: 'janction.io',
      address,
      statement: deviceInfo.uniqueId,
      uri: 'https://janction.io',
      version: '1',
      chainId,
      nonce,
    });

    const message = siweMessage.prepareMessage();

    // await signMessageAsync({
    //   message,
    // });

    // if (isSuccess) {
    //   const signature = data as string;
    //   const params: ParamLogin = {
    //     message,
    //     signature,
    //     is_node: true,
    //   };

    //   const token = await performLogin(params);
    //   setToken(token);
    //   await storeToken(token);
    // }

    const signature: string = await signMessageAsync({
      message,
    });

    const params: ParamLogin = {
      message,
      signature,
      is_node: true,
    };

    const token = await performLogin(params);
    setToken(token);
    await storeToken(token);
  };

  const handleFetchNodeInfos = async () => {
    if (!token) {
      throw new Error('token undefined');
    }
    const params: ParamGetNodeInfos = {};
    const nodeInfos = await fetchNodeInfos(token, params);
    setNodeInfos(nodeInfos);
  };

  const handleCPUGPUSetting = async () => {
    console.log('handleCPUGPUSetting');
    NavigationModule.navigateToActivity('com.janctionmobile.YourActivity');
  };

  const handleHeartbeat = async () => {
    if (!deviceInfo) {
      throw new Error('device info undefined');
    }
    if (!token) {
      throw new Error('token undefined');
    }
    const params: ParamHeartbeat = convertDeviceToParamHeartbeat(deviceInfo);
    const res = await performHeartbeat(token, params);
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
          <View style={styles.sectionArea}>
            <Text style={styles.text}>1. Connect To Web3 Wallet</Text>
            <View>
              <W3mButton connectStyle={styles.button} label="Connect Wallet" />
            </View>
            <Text style={styles.text}>2. Sign And Login to Janction</Text>

            <View>
              {!token && (
                <CustomButton
                  style={styles.button}
                  onPress={handleLogin}
                  title={'Login'}
                />
              )}
              {token && (
                <Text style={styles.successText}>
                  Connect to Janction Successful!
                </Text>
              )}
            </View>
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
                {nodeInfos?.map(nodeInfo => (
                  <View style={styles.listRow}>
                    <Text style={styles.listAlive}></Text>
                    <Text style={styles.list}>
                      {`OS(${nodeInfo.node_type}), NodeID(${
                        nodeInfo.node_id
                      }), Online(${nodeInfo.heartbeat_count * 5}s)`}
                    </Text>
                  </View>
                ))}
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

          <Text style={styles.subTitle}>Device Info</Text>

          <View style={styles.table}>
            {Object.entries(deviceInfo ?? {}).map(([key, value]) => (
              <View style={styles.row} key={String(value) + String(key)}>
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
          <Text style={styles.subTitle} key="debug">
            Debug
          </Text>
          <View style={styles.sectionArea}>
            <Text style={styles.deviceInfoItem} key="nonce">
              {'nonce'}: {nonce ? String(nonce) : 'loading...'}
            </Text>
            <Text style={styles.deviceInfoItem} key="dtoken">
              {'token'}: {String(token)}
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 - janction.io </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    // width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  deviceInfoItem: {
    color: 'white',
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
  sectionArea: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#333',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  text: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  successText: {
    margin: 'auto',
    color: '#57d765',
    fontSize: 14,
    marginTop: 5,
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    marginTop: 20,
    marginBottom: 10,
    color: '#DD5ACC',
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
    height: 40,
  },
  listRow: {
    marginTop: 8,
    height: 40,
    flexDirection: 'row',
  },
  nodeGroup: {
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#333',
    borderColor: '#fff',
    borderWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  table: {
    borderWidth: 0,
    borderColor: '#fff',
    marginBottom: 10,
    marginTop: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderWidth: 0,
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
  footer: {
    marginTop: 30,
  },
  footerText: {
    margin: 'auto',
    color: 'white',
  },
});

export default App;
