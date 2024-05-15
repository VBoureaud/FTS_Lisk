"use client";

import { useEffect, useRef } from "react";
import {
    useAccount,
    useDisconnect,
} from 'wagmi'
import WalletOptions from './WalletOptions';

export const ConnectWallet = () => {
    const { isConnecting, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <div>
                <button
                    style={{
                        cursor: 'pointer',
                        padding: '5px'
                    }}
                    onClick={() => disconnect()}
                >Disconnect</button>
            </div>
        );
    }

    return (
        <WalletOptions />
    );
};