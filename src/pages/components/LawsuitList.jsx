import {
  Button, Card, Popconfirm, Popover, Table, Toast, Typography,
} from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { useSubstrateContext } from '@/provider/Substrate';
import { bytesToString } from '@/utils/polkadot';
import { omitText } from '@/utils/utils';
import { useSignAndSend } from '@/hooks/sign';

export default function LawsuitList() {
  const { state: substrateState } = useSubstrateContext();
  const { signAndSend } = useSignAndSend();
  const { api } = substrateState;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'lawsuitId',
      dataIndex: 'lawsuitId',
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
      render: (_, record) => {
        let agreeCount = 0;
        let refuseCount = 0;

        for (const vote of record.votes) {
          if (vote) {
            agreeCount += 1;
          } else {
            refuseCount += 1;
          }
        }

        return (
          <div>
            <p>All: {record.votes.length}</p>
            <p>Agree: {agreeCount}</p>
            <p>Refuse: {refuseCount}</p>
          </div>
        );
      },
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
            onConfirm={() => onVote(record.lawsuitId, true)}
            onCancel={(event) => {
              const { target, target: { parentNode } } = event;
              if ([target.dataset.type, parentNode.dataset.type].includes('cancel')) {
                return onVote(record.lawsuitId, false);
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
            onClick={() => onApprove(record.lawsuitId)}
          >
            Approve
          </Button>
        </div>
      ),
    },
  ];

  const onApprove = async (index) => {
    try {
      const resp = await signAndSend(api.tx.court.processSue(index), {
        content: 'Loading: court.processSue',
      });
      Toast.success('Approve successfully.');
      query();
    } catch (error) {
      Toast.error(error.message);
    }
  };

  const onVote = async (index, approve) => {
    try {
      await signAndSend(api.tx.court.voteSue(index, approve), {
        content: 'Loading: court.voteSue',
      });

      Toast.success('Vote successfully.');
      query();
    } catch (error) {
      Toast.error(error.message);
    }
  };

  const query = async () => {
    setLoading(true);
    const proposalEntries = await api.query.court.proposals.entries();
    const proposals = proposalEntries.map(([lawsuitId, value]) => ({ lawsuitId: lawsuitId.args[0].toNumber(), ...value.toJSON() }));

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
