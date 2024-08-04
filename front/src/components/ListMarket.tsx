import React from 'React';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    name: string;
    sales: number;
    stocks: number;
    amount: number;
    tags: string[];
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
        title: 'Number of investors',
        dataIndex: 'sales',
        key: 'sales',
    },
    {
        title: 'Available tokens',
        dataIndex: 'stocks',
        key: 'stocks',
    },
    {
        title: 'Token',
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
        title: 'Minimum amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Return period',
        dataIndex: 'expiration',
        key: 'expiration',
    },
    {
        title: 'Return value',
        dataIndex: 'value',
        key: 'value',
        render: (text) => (
            <p style={{ color: '#389e0d' }}>
                {text}
            </p>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Invest</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'Georges Tie - 0x80...C4',
        sales: 32,
        stocks: 158,
        tags: ['wheat'],
        amount: 500,
        expiration: '2026-07-12',
        value: '+0,5%',
    },
    {
        key: '2',
        name: 'Violette Trouch - 0x7F...AB',
        sales: 42,
        stocks: 878,
        tags: ['corn'],
        amount: 450,
        expiration: '2025-05-11',
        value: '+1,5%',
    },
    {
        key: '3',
        name: 'Patrick Toura - 0xB0...a2',
        sales: 32,
        stocks: 97,
        tags: ['soilbean'],
        amount: 250,
        expiration: '2024-11-20',
        value: '+3,5%',
    },
];

const App: React.FC = () => <Table pagination={false} columns={columns} dataSource={data} />;

export default App;