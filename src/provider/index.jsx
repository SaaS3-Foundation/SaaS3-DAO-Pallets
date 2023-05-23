import React from 'react';
import PolkadotWalletProvider from './PolkadotWallet';
import SubstrateProvider from './Substrate';

export default function Providers({ children }) {
  return (
    <SubstrateProvider>
      <PolkadotWalletProvider>{children}</PolkadotWalletProvider>
    </SubstrateProvider>
  );
}
