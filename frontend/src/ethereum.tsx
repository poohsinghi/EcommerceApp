import react from "react";
import { ethers, Contract } from "ethers";
import PaymentProcessor from "./contracts/PaymentProcessor.json";
import Dai from "./contracts/Dai.json";

declare global {
    interface Window {
        ethereum: any;
    }
    type tPaymentProcessor = {
        [key: string]: string;
    };
    type tDai = {
        [key: string]: any;
    };
}

window.ethereum = window.ethereum || {};

const getBlockchain = () =>
    new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            if (window.ethereum) {
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                //@ts-ignore
                // console.log(PaymentProcessor.networks[5777].address);
                console.log(window.ethereum.networkVersion);
                // console.log(signer);

                const paymentProcessor = new Contract(
                    //@ts-ignore
                    PaymentProcessor.networks[window.ethereum.networkVersion].address,
                    PaymentProcessor.abi,
                    signer
                );
                const dai = new Contract(
                    //@ts-ignore
                    Dai.networks[window.ethereum.networkVersion].address,
                    Dai.abi,
                    signer
                );
                resolve({ provider, paymentProcessor, dai });
            }
            // resolve({ provider: undefined, paymentProcessor: undefined, dai: undefined });
            resolve({ provider: undefined, paymentProcessor: undefined, dai: undefined });
        });
    });

export default getBlockchain;
