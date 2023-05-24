import {
  Button, Card, Form, Toast,
} from '@douyinfe/semi-ui';
import { usePolkadotWalletContext } from '@/provider/PolkadotWallet';
import { useSubstrateContext } from '@/provider/Substrate';

export default function UserDonationsForm() {
  const { state } = usePolkadotWalletContext();
  const { state: substrateState } = useSubstrateContext();
  const { address, signer } = state.currAccount || {};
  const { api } = substrateState;

  const onSubmit = async (formData) => {
    if (!address) {
      return Toast.error('Please connect to your wallet.');
    }
    try {
      const { amount, category_type } = formData;
      const params = [amount, category_type];
      console.log(...params);

      await api.tx.treasury
        .receive(...params)
        .signAndSend(address, { signer });

      Toast.success('Submit donations successfully.');
    } catch (error) {
      Toast.error(error.message);
    }
  };

  return (
    <div>
      <Card title="Submit donations">
        <Form onSubmit={onSubmit}>
          <Form.InputNumber
            rules={[{ required: true }]}
            field="amount"
            placeholder="Please enter the amount."
            hideButtons
            min={0}
          />

          <Form.Select
            initValue={0}
            rules={[{ required: true }]}
            field="category_type"
            label="Source of funds"
            placeholder="select"
            optionList={[{ label: 'Other', value: 0 }]}
          />

          <Button htmlType="submit">Submit</Button>
        </Form>
      </Card>
    </div>
  );
}
