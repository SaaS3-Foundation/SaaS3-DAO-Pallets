import {
  Button, Card, Form, Toast,
} from '@douyinfe/semi-ui';
import { isAddress } from '@polkadot/util-crypto';
import { usePolkadotWalletContext } from '@/provider/PolkadotWallet';
import { useSubstrateContext } from '@/provider/Substrate';
import { stringToBytes } from '@/utils/polkadot';

export default function UserVoteForm({ className }) {
  const { state } = usePolkadotWalletContext();
  const { state: substrateState } = useSubstrateContext();
  const { address, signer } = state.currAccount || {};
  const { api } = substrateState;

  const onSubmit = async (formData) => {
    if (!address) {
      return Toast.error('Please connect to your wallet.');
    }
    try {
      const { statement, reward, defendent } = formData;
      const balance = api.createType('Balance', reward);
      // const _defendent = api.createType('AccountId', address);
      const _statement = api.createType('Bytes', stringToBytes(statement));
      const params = [balance, defendent, _statement];

      await api.tx.court
        .submitSue(...params)
        .signAndSend(address, { signer });

      Toast.success('Submit successfully.');
    } catch (error) {
      Toast.error(error.message);
    }
  };

  return (
    <div className={className}>
      <Card title="Submit lawsuit">
        <Form onSubmit={onSubmit}>
          <Form.InputNumber
            rules={[{ required: true }]}
            field="reward"
            placeholder="Please enter the reward you expect."
            hideButtons
            min={0}
          />

          <Form.Input
            rules={[
              { required: true },
              {
                validator: (rules, value, call) => {
                  if (!value) {
                    return call();
                  }
                  if (isAddress(value)) {
                    return call();
                  }
                  return call(new Error('Please enter the correct address.'));
                },
              }]}
            field="defendent"
            placeholder="Please enter defendent."
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
