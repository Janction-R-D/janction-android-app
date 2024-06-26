import React from 'react';
import {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  optimismSepolia,
  optimismGoerli,
} from 'viem/chains';
import {
  createWeb3Modal,
  defaultWagmiConfig,
} from '@web3modal/wagmi-react-native';
import {WagmiConfig} from 'wagmi';
import App from './App';

const projectId = '1dbb1d99d61bae1544b4a7f06b9f2575';

const metadata = {
  name: 'Janction App',
  description: 'Janction App For Node',
  url: 'https://janction.io',
  icons: ['https://avatars.githubusercontent.com/u/37784886'], // TODO
  redirect: {
    native: 'YOUR_APP_SCHEME://', // TODO
    universal: 'YOUR_APP_UNIVERSAL_LINK.com', // TODO
  },
};

const chains = [optimism, optimismSepolia, optimismGoerli];

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
