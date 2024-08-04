import React, { useState, useEffect } from "react";

type Props = {
}

export default function AgritelMarket(props: Props) {
    const getData = async () => {
        const res = fetch('https://www.agritel.com/').then(function (response) {
            // When the page is loaded convert it to text
            return response.text()
        })
            .then(function (html) {
                // Initialize the DOM parser
                var parser = new DOMParser();

                // Parse the text
                var doc = parser.parseFromString(html, "text/html");

                // You can now even select part of that html as you would in the regular DOM 
                // Example:
                // var docArticle = doc.querySelector('article').innerHTML;

                console.log(doc);
            })
            .catch(function (err) {
                console.log('Failed to fetch page: ', err);
            });
    }

    useEffect(() => {
        //getData();
    }, []);

    return (
        <>
            <p>Estimation market - Sept 24</p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '5px' }}>
                <p>Wheat (€/t) <span>219.00</span> <span style={{ marginRight: '15px', background: 'tomato', color: 'white', padding: '2px' }}>-0.50</span></p>
                <p>Corn (€/t) <span>204.00</span> <span style={{ marginRight: '15px', background: 'tomato', color: 'white', padding: '2px' }}>-0.50</span></p>
                <p>Rapeseed (€/t) <span>472.25</span> <span style={{ marginRight: '15px', background: 'tomato', color: 'white', padding: '2px' }}>-0.25</span></p>
            </div>
        </>

    );
};
