"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ConnectWallet } from "@/components/WagmiWallet/ConnectWallet";

type Props = {};

enum Route {
  HOME = "Home",
  MARKET = "Market",
  ACCOUNT = "Account",
}

const routes = {
  [Route.HOME]: "/",
  [Route.MARKET]: "/market",
  [Route.ACCOUNT]: "/account",
};

const Navigation = (props: Props) => {
  const basePath = usePathname();

  return (
    <>
      <nav
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          background: '#222',
        }}
      >
        <h3>FTS</h3>
        {Object.entries(routes).map(([name, path]) => (
          <Link href={path} key={path} style={{ textDecoration: "none" }}>
            {basePath === path ? <strong>{name}</strong> : name}
          </Link>
        ))}
        <ConnectWallet />
      </nav>
    </>
  );
};

export default Navigation;
