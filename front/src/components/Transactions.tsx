import React, { useState, useEffect } from 'react'
import { strResume, displayDate } from "@/utils";
import { Table, Tooltip } from "antd";

type Props = {
    loading: bool;
    transactions: any;
}

export default function Transactions(props: Props) {
    const [dataSource, setDataSource] = useState(undefined);
    const columns = [
        {
            title: 'date',
            dataIndex: 'timestamp',
            key: 0,
        },
        {
            title: 'Txn hash',
            dataIndex: 'hash',
            key: 1,
            render: (_: any, record: any) => (
                <p key={1 + ' ' + record.timestamp}>
                    <Tooltip title={record.hash}>
                        {strResume(record.hash, 8, '...')}
                    </Tooltip></p>
            ),
        },
        {
            title: 'tx_types',
            dataIndex: 'tx_types',
            key: 2,
        },
        {
            title: 'method',
            dataIndex: 'method',
            key: 3,
        },
        {
            title: 'block',
            dataIndex: 'block',
            key: 4,
        },
        {
            title: 'to',
            dataIndex: 'to',
            key: 5,
            render: (_: any, record: any) => (
                <p key={5 + ' ' + record.timestamp}>
                    <Tooltip title={record.to}>
                        {strResume(record.to, 8, '...')}
                    </Tooltip></p>
            ),
        },
        {
            title: 'value',
            dataIndex: 'value',
            key: 6,
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 7,
        },

    ];

    useEffect(() => {
        if (props.transactions) {
            setDataSource(props.transactions.items.map((elt: any, index: number) => ({
                id: index,
                key: index,
                timestamp: displayDate(elt.timestamp, true),
                hash: elt.hash,
                tx_types: elt.tx_types.join('\n'),
                method: elt.method,
                block: elt.block,
                to: elt.to && elt.to.hash,
                value: elt.value,
                status: elt.status,
            })));
        }
    }, [props.transactions])

    
    if (props.loading) return <div>Fetching tx</div>

    return (
        <div style={{ maxWidth: '100%' }}>
            Transactions time !

            {props.transactions && <Table dataSource={dataSource} columns={columns} />}
            {!props.transactions && <h3>Nothing to show</h3>}
        </div>
    )
}