import { configureChains, createClient } from 'wagmi';
import { bsc } from '@wagmi/core/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

export const chains = [bsc];

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const { provider } = configureChains(chains, [
  jsonRpcProvider({ rpc: (_chain) => ({ http: _chain.rpcUrls.default }) }),
  publicProvider(),
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
