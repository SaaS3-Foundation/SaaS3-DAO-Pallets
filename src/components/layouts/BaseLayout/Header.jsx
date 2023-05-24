import { getWallets } from '@talismn/connect-wallets';
import React, { useState } from 'react';
import Identicon from '@polkadot/react-identicon';
// import {
//   Button, Container, Menu, Modal,
// } from 'semantic-ui-react';
import {
  Button, Layout, Modal, Toast,
} from '@douyinfe/semi-ui';
import { IconTreeTriangleDown } from '@douyinfe/semi-icons';
import { omitText } from '@/utils/utils';
import AccountsModal from '@/components/comm/AccountsModal';
import { usePolkadotWalletContext } from '@/provider/PolkadotWallet';
import RewardModal from './RewardModal';

export default function Header() {
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const { connect, state } = usePolkadotWalletContext();

  const onConnect = () => {
    setConnectModalVisible(true);
  };

  const onConnectWallet = async (wallet) => {
    const { installed, installUrl } = wallet;
    if (!installed) {
      return window.open(installUrl);
    }
    await connect(wallet);
    setConnectModalVisible(false);
  };

  return (
    <Layout.Header className="border-b border-b-white/40">
      <div className="container mx-auto flex items-center h-[60px] px-2">

        <div>
          <img className="w-10 h-10" src="https://saas3.io/logo.png" alt="" />
        </div>

        <div className="ml-auto flex items-center">
          {state.isConnected && state.currAccount ? (
            <>
              <RewardModal />
              <div
                className="ml-2 flex items-center bg-white/10 py-2 px-4 rounded-full cursor-pointer hover:bg-white/30"
                onClick={() => setAccountModalVisible(true)}
              >
                <span
                  className="text-[0]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Identicon
                    value={state.currAccount.address}
                    size={24}
                    theme="polkadot"
                    onCopy={() => {
                      Toast.success('Copied');
                    }}
                  />
                </span>
                {/* <img className="w-6 h-6" src={state.currAccount.avatar} alt="" /> */}
                <span className="ml-2 text-white">{omitText(state.currAccount.address)}</span>
                <IconTreeTriangleDown className="!text-white ml-2" />
              </div>
            </>
          ) : <Button onClick={onConnect}>Connect Polkadot</Button>}
        </div>

        <Modal
          visible={connectModalVisible}
          onCancel={() => setConnectModalVisible(false)}
          title="Connect Wallet"
          footer={<div />}
        >
          <div>
            {getWallets().map((item) => (
              <div
                key={item.extensionName}
                className="rounded-sm flex items-center border-b border-b-white/30 py-3 px-2 cursor-pointer hover:bg-white/10"
                onClick={() => onConnectWallet(item)}
              >
                <img className="w-6 h-6 mr-2" src={item.logo.src} alt="" />
                <span className="w-[100px] font-bold">{item.extensionName}</span>
                <div className="ml-auto">
                  {item.installed
                    ? <span className="ml-5 text-green-400">Connect</span>
                    : <span className="ml-5 text-red-400">Install</span>}
                </div>
              </div>
            ))}
          </div>
        </Modal>

        <AccountsModal visible={accountModalVisible} onCancel={() => setAccountModalVisible(false)} />

      </div>
    </Layout.Header>
  );
}
