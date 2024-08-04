import React, { useEffect, useContext } from "react";
import {
    useAccount,
} from 'wagmi';
import styles from './additem.module.css'
//import Web3Context, { tradesEnum } from "@/store/Web3Context";
import Web2Context from "@/store/Web2Context";

import config from "@/config/index";

import Navigation from "@/components/Navigation/Navigation";
import { Link } from "react-router-dom";

// Token
import { nameTypeToken } from "@/utils/gameEngine";
import FormItem from "@/components/FormItem";

type Props = {};

const AddItemPage = (props: Props) => {
    const {
        address,
    } = useAccount();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navigation />
            <div
                style={{
                    maxWidth: "768px",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: '25px',
                    margin: 'auto',
                }}
            >
                <h1>Add a token</h1>
                <FormItem />
            </div>
        </>
    );
};

export default AddItemPage;
