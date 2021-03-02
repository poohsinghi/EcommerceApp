import mongoose from "mongoose";

mongoose.connect(
    "mongodb+srv://test:Hshin2007@cluster0.wbuzn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const paymentSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    paid: Boolean,
});

export const Payment = mongoose.model("Payment", paymentSchema);

module.exports = {
    Payment,
};
