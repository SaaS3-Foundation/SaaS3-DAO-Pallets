import { Card, Table } from '@douyinfe/semi-ui';
import React, { useEffect } from 'react';
import { useSubstrateContext } from '@/provider/Substrate';

export default function LawsuitList() {
  const { state: substrateState } = useSubstrateContext();
  const { api } = substrateState;
  const columns = [
    {
      title: 'index',
    },
    {
      title: 'lawsuitId',
    },
    {
      title: 'statement',
    },
  ];

  const query = async () => {
    const proposals = await api.query.court.proposals.entries();
    console.log(proposals);
  };

  useEffect(() => {
    query();
  }, []);
  return (
    <div>
      <Card title="List of lawsuits">
        <Table
          dataSource={[]}
          columns={columns}
          pagination={null}
        />
      </Card>
    </div>
  );
}
