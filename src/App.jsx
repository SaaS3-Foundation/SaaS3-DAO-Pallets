import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { LocaleProvider } from '@douyinfe/semi-ui';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
import { RenderRouters } from './router';
import { chains, wagmiClient } from './config/wagmiClient';
import Providers from './provider';

export default function App() {
  return (
    <LocaleProvider locale={en_US}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Providers>
            <BrowserRouter>
              <Suspense>
                <RenderRouters />
              </Suspense>
            </BrowserRouter>
          </Providers>
        </RainbowKitProvider>
      </WagmiConfig>
    </LocaleProvider>
  );
}
