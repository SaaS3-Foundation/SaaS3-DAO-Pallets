import {
  Button, Card, Form, Toast,
} from '@douyinfe/semi-ui';
import { u8aToHex } from '@polkadot/util';
import { usePolkadotWalletContext } from '@/provider/PolkadotWallet';
import { useSubstrateContext } from '@/provider/Substrate';
import { stringToBytes } from '@/utils/polkadot';

export default function UserVoteForm() {
  const { state } = usePolkadotWalletContext();
  const { state: substrateState } = useSubstrateContext();
  const { address, signer } = state.currAccount || {};
  const { api } = substrateState;

  const onSubmit = async (formData) => {
    console.log(state.currAccount);

    if (!address) {
      return Toast.error('Please connect to your wallet.');
    }
    const { statement, reward } = formData;

    const balance = api.createType('Balance', reward);
    const defendent = api.createType('AccountId', address);
    const _statement = api.createType('Bytes', stringToBytes(statement));
    const params = [balance, defendent, _statement];
    console.log(...params, 'params----------------------------------');

    const txHash = await api.tx.court
      .submitSue(...params)
      .signAndSend(address, { signer });

    console.log(`Transaction hash: ${u8aToHex(txHash)}`);
  };

  return (
    <div>
      <Card title="Submit lawsuit">
        <Form onSubmit={onSubmit}>
          <Form.InputNumber
            rules={[{ required: true }]}
            field="reward"
            placeholder="Please enter the reward you expect."
            hideButtons
            min={0}
          />
          <Form.TextArea
            rules={[{ required: true }]}
            field="statement"
            placeholder="Please enter your statement."
          />
          <Button htmlType="submit">Submit</Button>
        </Form>
      </Card>
    </div>
  );
}
