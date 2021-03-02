import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import {Payment} from "./db";
const ethers = require('ethers')
import PaymentProcessor from "../build/contracts/PaymentProcessor.json";

const app = new Koa();
const router = new Router();

const items = {
    "1": {id: 1, url: "http://UrlToDownloadItem1"},
    "2": {id: 2, url: "http://UrlToDownloadItem2"},
};

router.get("/api/getPaymentId/:itemId", async (ctx) => {
    const paymentId = (Math.random() * 10000).toFixed(0);
    await Payment.create({
        id: paymentId,
        itemId: ctx.params.itemId,
        paid: false,
    });
    ctx.body = {
        paymentId,
    };
});

interface Payment {
    id: String;
    itemId: String;
    paid: Boolean;
}
router.get("/api/getItemUrl/:paymentId", async (ctx) => {
    const payment: Payment | any = await Payment.findOne({id: ctx.params.paymentId});
    if (payment && payment.paid === true) {
        ctx.body = {
            url: items[payment.itemId].url,
        };
    } else {
        ctx.body = {
            url: "",
        };
    }
});

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

const port = 8080;
app.listen(port, () => {
    console.log("listening on http://localhost:" + port);
});

const listenToEvents = () => {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:9545");
    const networkId = "5777";

    const paymentProcessor = new ethers.Contract(
        PaymentProcessor.networks[networkId].address,
        PaymentProcessor.abi,
        provider
    );

    paymentProcessor.on("PaymentDone", async (payer: any, amount: any, paymentId: any, date: any) => {
        console.log(`
        from ${payer}
        amount ${amount}
        paymentId ${paymentId}
        date ${new Date(date.toNumber() * 1000).toLocaleString()}
        `);
        const payment: any = await Payment.findOne({id: paymentId});
        if (payment) {
            payment.paid = true;
            await payment.save();
        }
    });
};
listenToEvents()