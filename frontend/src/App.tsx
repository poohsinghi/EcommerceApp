import React, { useEffect, useState } from "react";
import getBlockchain from "./ethereum";
import Store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [paymentProcessor, setPaymentProcessor] = useState(undefined);
    const [dai, setDai] = useState(undefined);

    
    useEffect(() => {
        const init = async () => {
            const { paymentProcessor, dai }:any = await getBlockchain();
            // const results = await getBlockchain();
            // console.log(paymentProcessor);
            // console.log(dai);
            
            setPaymentProcessor(paymentProcessor);
            setDai(dai);
        };
        init();
    }, []);

    if (typeof window.ethereum === "undefined") {
        return (
            <div className="container">
                <div className="col-sm-12">
                    <h1>Blockchain ECommerce App</h1>
                    <p>you need to install the latest version of Metamask</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="col-sm-12">
                <h1>Blockchain ECommerce App</h1>
                <Store paymentProcessor={paymentProcessor} dai={dai} />
            </div>
        </div>
    );
}

export default App;
