import React from 'React';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    name: string;
    tags: string[];
    amount: number;
    expiration: string;
    value: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Owner',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Stocks',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 6 ? 'geekblue' : 'green';
                    if (tag === 'corn') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Expiration',
        dataIndex: 'expiration',
        key: 'expiration',
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Reward</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown - 0x80...C4',
        tags: ['wheat'],
        amount: 10,
        expiration: '2026-07-12',
        value: '0,5%',
    },
    {
        key: '2',
        name: 'Jim Green - 0x7F...AB',
        tags: ['corn'],
        amount: 35,
        expiration: '2025-05-11',
        value: '2%',
    },
    {
        key: '3',
        name: 'Joe Black - 0xB0...a2',
        tags: ['soilbean'],
        amount: 5,
        expiration: '2024-11-20',
        value: '0,4%',
    },
];

const App: React.FC = () => <Table pagination={false} columns={columns} dataSource={data} />;

export default App;