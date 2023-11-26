const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema(
    {
        number: { type: String, required: true },
        trnx_id: { type: String, required: true },
        amount: { type: Number, required: true },
    },
    { timestamp: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;