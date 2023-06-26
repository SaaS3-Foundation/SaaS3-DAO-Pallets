import { Notification, Spin } from '@douyinfe/semi-ui';
import { usePolkadotWalletContext } from '@/provider/PolkadotWallet';

/**
 * @typedef {import("@polkadot/api/types").SubmittableExtrinsic<"promise", import('@polkadot/types/types/extrinsic.d').ISubmittableResult>} TxEvent
 */

export function useSignAndSend() {
  const { state } = usePolkadotWalletContext();
  const { address, signer } = state.currAccount || {};

  /**
   * sign and send tx
   * @param {TxEvent} txEvent
   * @param {import('@douyinfe/semi-foundation/lib/es/notification/notificationFoundation.d').NoticeProps} options
   */
  function signAndSend(txEvent, options) {
    return call(txEvent, options || {});
  }

  /**
   * sign and send tx
   * @param {TxEvent} txEvent
   * @param {import('@douyinfe/semi-foundation/lib/es/notification/notificationFoundation.d').NoticeProps} options
   */
  function call(txEvent, {
    content = 'Loading...',
    title = 'Processing TX',
  }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      let unsub = null;
      const notificationId = Notification.open({
        content,
        title,
        duration: 0,
        icon: <Spin />,
      });
      try {
        unsub = await txEvent.signAndSend(address, { signer }, (result) => {
          const { status, events } = result;

          if (status.isInBlock) {
            const errorEvent = events.find((event) => event.event.method === 'ExtrinsicFailed');
            if (errorEvent) {
              const { data: [error] } = errorEvent.event;
              reject(new Error(`Transaction failed: ${error}`));
            } else {
              resolve('Transaction confirmed');
            }
            removeEventListener(notificationId, unsub);
          } else if (status.isFinalized) {
            removeEventListener(notificationId, unsub);
            resolve('Transaction finalized');
          } else if (status.isDropped || status.isInvalid || status.isUsurped) {
            removeEventListener(notificationId, unsub);
            reject(new Error('Transaction status is abnormal'));
          }
          //  else {
          //   reject(new Error('Unknown status'));
          // }
        });
      } catch (error) {
        reject(error);
        removeEventListener(notificationId, unsub);
      }
    });
  }

  const removeEventListener = (notifiId, unsub) => {
    if (notifiId) Notification.close(notifiId);
    if (unsub) unsub();
  };

  return { signAndSend };
}
