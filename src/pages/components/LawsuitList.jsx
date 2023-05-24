import {
  Button, Card, Popconfirm, Popover, Table, Toast, Typography,
} from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { useSubstrateContext } from '@/provider/Substrate';
import { usePolkadotWalletContext } from '@/provider/PolkadotWallet';
import { bytesToString } from '@/utils/polkadot';
import { omitText } from '@/utils/utils';

export default function LawsuitList() {
  const { state: substrateState } = useSubstrateContext();
  const { state } = usePolkadotWalletContext();
  const { address, signer } = state.currAccount || {};
  const { api } = substrateState;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'plaintiff',
      dataIndex: 'plaintiff',
      render: (text) => (
        <Popover
          className="p-2"
          content={<p className="text-white">{text}</p>}
        >
          {omitText(text)}
        </Popover>
      ),
    },
    {
      title: 'defendent',
      dataIndex: 'defendent',
      render: (text) => (
        <Popover
          className="p-2"
          content={<p className="text-white">{text}</p>}
        >
          {omitText(text)}
        </Popover>
      ),
    },
    {
      title: 'statement',
      render: (_, record) => {
        const content = bytesToString(record.statement);
        return (
          <Popover
            className="max-w-[400px] p-2"
            content={
              <Typography.Text className="">{content}</Typography.Text>
            }
          >
            <span className="line-clamp-3">{content}</span>
          </Popover>
        );
      }
      ,
    },
    {
      title: 'votes',
      width: '120px',
      render: (_, record) => (
        <div>
          <p>All: {record.votes.length}</p>
          <p>Agree: {record.votes.filter((vote) => vote).length}</p>
          <p>Refuse: {record.votes.filter((vote) => !vote).length}</p>
        </div>
      ),
    },

    {
      title: 'status',
      render: (_, record) => (record.approved ? 'Approved' : 'Unapproved'),
    },
    {
      title: 'operator',
      render: (_, record, i) => (
        <div>
          <Popconfirm
            title="Do you agree with the proposal?"
            content="This modification will be irreversible."
            onConfirm={() => onVote(i, true)}
            onCancel={(event) => {
              const { target, target: { parentNode } } = event;
              if ([target.dataset.type, parentNode.dataset.type].includes('cancel')) {
                onVote(i, false);
              }
            }}
            okText="Agree"
            cancelText="Refuse"
          >
            <Button
              className="ml-1"
              type="primary"
              theme="solid"
            >Vote
            </Button>
          </Popconfirm>
          <Button
            className="ml-1 my-1"
            type="secondary"
            theme="solid"
            onClick={() => onApprove(i)}
          >
            Approve
          </Button>
        </div>
      ),
    },
  ];

  const onApprove = async (index) => {
    try {
      await api.tx.court
        .processSue(index)
        .signAndSend(address, { signer });

      Toast.success('Approve successfully.');
      query();
    } catch (error) {
      Toast.error(error.message);
    }
  };

  const onVote = async (index, approve) => {
    try {
      await api.tx.court
        .voteSue(index, approve)
        .signAndSend(address, { signer });

      Toast.success('Vote successfully.');
      query();
    } catch (error) {
      Toast.error(error.message);
    }
  };

  const query = async () => {
    setLoading(true);
    const proposalEntries = await api.query.court.proposals.entries();
    const proposals = proposalEntries.map(([key, value]) => ({ proposalKey: key, ...value.toJSON() }));
    console.log(proposals);

    setData(proposals);
    setLoading(false);
  };

  useEffect(() => {
    if (api) {
      query();
    }
  }, [api]);

  return (
    <div>
      <Card title="List of lawsuits">
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={null}
        />
      </Card>
    </div>
  );
}
