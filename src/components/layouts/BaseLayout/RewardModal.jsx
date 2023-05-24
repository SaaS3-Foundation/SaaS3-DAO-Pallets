import { Button, Toast, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { usePolkadotWalletContext } from '@/provider/PolkadotWallet';
import { useSubstrateContext } from '@/provider/Substrate';

export default function RewardModal() {
  const { state: substrateState } = useSubstrateContext();
  const { state } = usePolkadotWalletContext();
  const { api } = substrateState;
  const [claim, setClaim] = useState();

  const queryReward = async () => {
    const reward = await api.query.treasury.claims(state.currAccount.address);
    const _claimAmount = reward.unwrapOr(api.createType('Balance'));
    setClaim(Number(_claimAmount.toString()));
  };

  const onChaimReward = async () => {
    const { signer, address } = state.currAccount;

    try {
      const claimNumber = Number(claim);
      if (claimNumber > 0) {
        await api.tx.treasury
          .claimRewards(claimNumber)
          .signAndSend(address, { signer });
        Toast.success('claim reward successfully.');
        queryReward();
      } else {
        Toast.info('No rewards are available for the time being.');
      }
    } catch (error) {
      Toast.success(error.message);
    }
  };

  useEffect(() => {
    if (api) {
      queryReward();
    }
  }, [api]);

  return (
    <div>
      <Typography.Text className="mr-1" type="success">Reward ({Number(claim).toFixed(4)})</Typography.Text>
      <Button
        disabled={Number(claim) <= 0}
        theme="light"
        onClick={onChaimReward}
      >
        Claim
      </Button>
    </div>
  );
}