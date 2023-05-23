import { Modal, Tag } from '@douyinfe/semi-ui';
import React from 'react';
import { omitText } from '@/utils/utils';
import { usePolkadotWalletContext } from '@/provider/PolkadotWallet';

export default function AccountsModal(props) {
  const { state, dispatch, disconnect } = usePolkadotWalletContext();

  return (
    <Modal
      title="Select Account"
      footer={(
        <div>
          <div
            className="bg-red-400 text-center h-10 leading-10 hover:bg-red-500 cursor-pointer rounded-sm"
            onClick={() => {
              disconnect();
              props.onCancel();
            }}
          >
            Disconnect
          </div>
        </div>
      )}
      {...props}
    >

      <div>
        {state.accounts.map((account) => (
          <div
            key={account.address}
            className="rounded-sm flex items-center border-b border-b-white/30 py-3 px-2 cursor-pointer hover:bg-white/10"
            onClick={() => {
              dispatch({
                type: 'SELECT_ACCOUNT',
                payload: account,
              });
              props.onCancel();
            }}
          >
            <img className="w-6 h-6 mr-2" src={account.avatar} alt="" />
            <span>{omitText(account.address)}</span>
            <Tag size="small" className="ml-auto">{account.type}</Tag>
            {state.currAccount?.address === account.address && <span className="w-2 h-2 rounded-full bg-green-400 ml-2" />}
          </div>
        ))}
      </div>
    </Modal>
  );
}
