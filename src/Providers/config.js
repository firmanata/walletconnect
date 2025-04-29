import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, polygon, sepolia } from '@reown/appkit/networks';

export const projectId = "9e737928914fc80e9959cf9453d9472a";

if (!projectId) {
    throw new Error('Project ID is not defined');
}

export const networks = [mainnet, polygon, sepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
      storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
  })

export const config = wagmiAdapter.wagmiConfig;