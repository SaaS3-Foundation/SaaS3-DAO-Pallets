import {
  Button, Card, Form, Toast,
} from '@douyinfe/semi-ui';
import { useState } from 'react';
import { usePolkadotWalletContext } from '@/provider/PolkadotWallet';
import { useSubstrateContext } from '@/provider/Substrate';
import { useSignAndSend } from '@/hooks/sign';

export default function UserDonationsForm() {
  const { state } = usePolkadotWalletContext();
  const { state: substrateState } = useSubstrateContext();
  const { signAndSend } = useSignAndSend();
  const { address } = state.currAccount || {};
  const { api } = substrateState;
  const [loading, setLoading] = useState(false);
  const onSubmit = async (formData) => {
    if (!address) {
      return Toast.error('Please connect to your wallet.');
    }
    try {
      setLoading(true);
      const { amount, category_type } = formData;
      const params = [amount, category_type];

      await signAndSend(api.tx.treasury.receive(...params), {
        content: 'Loading: treasury.receive',
      });
      Toast.success('Submit donations successfully.');
    } catch (error) {
      Toast.error(error.message);
    } finally {
      setLoading(false);
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

          <Button
            loading={loading}
            htmlType="submit"
          >Submit
          </Button>
        </Form>
      </Card>
    </div>
  );
}
