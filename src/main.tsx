import React from 'react';
import {mainnet, polygon, arbitrum} from 'viem/chains';
import {
  createWeb3Modal,
  defaultWagmiConfig,
} from '@web3modal/wagmi-react-native';
import {WagmiConfig} from 'wagmi';
import App from './App';

const projectId = '1dbb1d99d61bae1544b4a7f06b9f2575';

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

const wagmiConfig = defaultWagmiConfig({chains, projectId, metadata});

createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

const Root = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  );
};

export default Root;
