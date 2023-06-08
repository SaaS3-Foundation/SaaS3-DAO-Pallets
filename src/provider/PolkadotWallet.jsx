import { getWallets } from '@talismn/connect-wallets';
import React, {
  createContext, useContext, useEffect, useMemo, useReducer,
} from 'react';

/**
 * @typedef {Object} PolkadotWalletState
 * @property {import('@talismn/connect-wallets').Wallet} wallet
 * @property {import('@talismn/connect-wallets').WalletAccount & {signer: import('@polkadot/api/types').Signer}} currAccount
 * @property {bool} isConnected
 * @property {import('@talismn/connect-wallets').WalletAccount[]} accounts
 */

/**
 * @typedef {Object} PolkadotWalletContext
 * @property {PolkadotWalletState} state - The state of the Polkadot wallet.
 * @property {function} dispatch - The dispatch function.
 * @property {function} connect - The connect function.
 * @property {function} disconnect - The disconnect function.
 */

/**
 * @type {PolkadotWalletState}
 */
const initialState = {
  wallet: null,
  isConnected: false,
  currAccount: null,
  accounts: [],
};

const polkadotWalletContext = createContext({
  state: initialState,
  dispatch: () => { },
  connect: () => { },
  disconnect: () => { },
});

export default function PolkadotWalletProvider({ children }) {
  const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'CONNECT_SUCCESS':
        state.wallet = payload;
        state.isConnected = true;
        localStorage.setItem('__extensionName', payload.extensionName);
        break;
      case 'SET_ACCOUNTS':
        state.accounts = payload;
        state.currAccount = payload[0];
        break;
      case 'SELECT_ACCOUNT':
        state.currAccount = payload;
        break;
      case 'DISCONNECT':
        state.wallet = null;
        state.isConnected = false;
        state.currAccount = null;
        state.accounts = [];
        localStorage.removeItem('__extensionName');
        break;
      default:

        break;
    }
    return { ...state };
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const connect = async (wallet) => {
    if (!wallet.installed) throw new Error('wallet not installed');
    await wallet.enable('SaaS3 DAO Pallets');

    dispatch({
      type: 'CONNECT_SUCCESS',
      payload: wallet,
    });
  };

  const disconnect = () => {
    dispatch({
      type: 'DISCONNECT',
    });
  };
  useEffect(() => {
    const extensionName = localStorage.getItem('__extensionName');
    if (extensionName) {
      const wallet = getWallets().find((item) => item.extensionName === extensionName);
      wallet && connect(wallet);
    }
  }, []);

  const subscribeAccounts = async () => {
    const unsubscribe = await state.wallet.subscribeAccounts((accounts) => {
      // console.log(accounts);
      dispatch({
        type: 'SET_ACCOUNTS',
        payload: accounts,
      });
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (state.wallet) {
      (async () => {
        const unsubscribe = await subscribeAccounts();
        return () => {
          unsubscribe();
        };
      })();
    }
  }, [state.wallet]);

  const value = useMemo(() => ({
    state,
    dispatch,
    disconnect,
    connect,
  }), [state, dispatch]);

  return (
    <polkadotWalletContext.Provider value={value}>{children}</polkadotWalletContext.Provider>
  );
}

/**
 *
 * @returns {PolkadotWalletContext}
 */
export const usePolkadotWalletContext = () => useContext(polkadotWalletContext);
