import { Notification, Spin } from '@douyinfe/semi-ui';
import { ApiPromise, WsProvider } from '@polkadot/api';
import React, {
  createContext, useContext, useMemo, useReducer,
} from 'react';

/**
 * @typedef {Object} SubstrateState
 * @property {string} ws ws
 * @property {boolean} isConnected
 * @property {ApiPromise} api polkadot api promise
 * @property {boolean} isConnecting
 * @property {string} connectError
 */

/**
 * @typedef {Object} SubstrateContextAction
 * @property {string} type
 * @property {any} payload
 */

/**
 * @typedef {Object} SubstrateContext
 * @property {SubstrateState} state
 * @property {(action: SubstrateContextAction)=>void} dispatch
 */

/**
 * @type {SubstrateState}
 */
const initialState = {
  ws: import.meta.env.VITE_APP_WS,
  isConnected: false,
  api: null,
  isConnecting: false,
  connectError: null,
};

const SubstrateContext = createContext(initialState);

const connect = (payload) => {
  const { ws, dispatch } = payload;
  const provider = new WsProvider(ws);
  const _api = new ApiPromise({ provider });
  dispatch({ type: 'CONNECTING', payload: true });
  _api.on('connected', () => {
    _api.isReady.then(() => {
      dispatch({ type: 'CONNECT_SUCCESS', payload: _api });
    });
  });
  _api.on('ready', () => {
    dispatch({ type: 'CONNECT_SUCCESS', payload: _api });
  });
  _api.on('error', (err) => dispatch({ type: 'CONNECT_ERROR', payload: err }));
};

export default function SubstrateProvider(props) {
  const { children } = props;

  const reducer = (_state, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'CONNECT':
        connect(payload);
        break;
      case 'CONNECTING':
        _state.isConnecting = payload;
        break;
      case 'CONNECT_SUCCESS':
        _state.isConnecting = false;
        _state.isConnected = true;
        _state.api = payload;
        _state.connectError = null;
        break;
      case 'CONNECT_ERROR':
        _state.isConnecting = false;
        _state.isConnected = false;
        _state.connectError = payload;
        break;
      default:
        break;
    }
    return { ..._state };
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({
    state,
    dispatch,
  }), [
    state,
    dispatch,
  ]);
  return (
    <SubstrateContext.Provider value={value}>{children}</SubstrateContext.Provider>
  );
}

/**
 * SubstrateContext
 * @returns {SubstrateContext}
 */
export const useSubstrateContext = () => useContext(SubstrateContext);
