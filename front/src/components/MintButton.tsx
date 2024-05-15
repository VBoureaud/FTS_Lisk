"use client";

import React from "react";

type Props = {
    loading: boolean;
    address: string;
    typeToken: number;
    actionMint: Function;
}

export default function MintButton(props: Props) {
    if (props.address) {
        return (
            <div>
                <button onClick={() => props.actionMint(props.address, props.typeToken)}>Mint type{props.typeToken}</button>
                {props.loading && <p>Mint is loading</p>}
            </div>
        );
    }

    return (
        <p>Mint - Not connected</p>
    );
};
