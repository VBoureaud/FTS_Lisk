import ReactDOM from 'react-dom/client';
import React, { useState, useEffect, useContext } from 'react';
import Home from "@/pages/Home";
import AddItem from "@/pages/AddItem";
import Nfts from "@/pages/Nfts";
import Market from "@/pages/Market";
import Account from "@/pages/Account";
import ErrorPage from "@/pages/ErrorPage";
import Footer from "@/components/Footer/Footer";
import Providers from "./providers";
import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/addItem",
    element: <AddItem />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/market",
    element: <Market />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account",
    element: <Account />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/nfts/:nftId",
    element: <Nfts />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
    <footer style={{
      display: 'block',
      color: 'white',
      maxWidth: '850px',
      textAlign: 'center',
      padding: '5px',
      margin: 'auto',
      marginTop: '100px'
    }}>
      <p>v1.0.0<br />last update 01/08/2024</p>
    </footer>
  </React.StrictMode>,
)
