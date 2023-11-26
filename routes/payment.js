const router = require('express').Router();
const axios = require('axios');
const Payment = require('../models/Payment');

const generateToken = async (req, res, next) => {

  const secret = process.env.CONSUMER_SECRET
  const consumer = process.env.CONSUMER_KEY
  const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");

  await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers:{
      authorization: `Basic ${auth}`
    },
  }).then((response) => {
    // console.log(response.data.access_token);
    token = response.data.access_token;
    next();
  }).catch((err) => {
    console.log(err);
    
  })
}

router.get('/token', (req, res) => {
  generateToken();
})

router.post('/stk',generateToken, async (req, res) => {
  const phone = req.body.phone.slice(1);
  const amount = req.body.amount;
  const date = new Date();

  const timestamp = 
   date.getFullYear() + 
   ("0" + (date.getMonth() + 1)).slice(-2) +
   ("0" + (date.getDate() + 1)).slice(-2) +
   ("0" + (date.getHours() + 1)).slice(-2) +
   ("0" + (date.getMinutes() + 1)).slice(-2) +
   ("0" + (date.getSeconds() + 1)).slice(-2);
   

  const shortcode = process.env.MPESA_PAYBILL;
  const passkey = process.env.MPESA_PASSKEY;
  const password = new Buffer.from(shortcode + passkey + timestamp).toString("base64");


  await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {    
      BusinessShortCode: shortcode,    
      Password: password,    
      Timestamp: timestamp,    
      TransactionType: "CustomerPayBillOnline",    
      Amount: amount,    
      PartyA: `254${phone}`, 
      PartyB: shortcode,
      PhoneNumber: `254${phone}`,    
      CallBackURL: " https://6c73-41-89-129-11.ngrok-free.app/api/payment/callback",    
      AccountReference:"Artista Web agency",    
      TransactionDesc:"Payment of X"
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }

  ).then((data) => {
    console.log(data.data);
    res.status(200).json(data.data)
  }).catch((err) => {
    console.log(err.message);
    res.status(400).json(err.message)
  });

  // res.json({ phone, amount })
});


router.post('/callback', (req, res) => {
  const callbackData = req.body;
  console.log(callbackData.Body);
  if(!callbackData.Body.stkCallback.callbackMetadata){
    console.log(callbackData.Body);
    return res.json("ok");
  }
  console.log(callbackData.Body.stkCallback.callbackMetadata);

  const phone = callbackData.Body.stkCallback.callbackMetadata.Item[4].Value;
  const amount = callbackData.Body.stkCallback.callbackMetadata.Item[0].Value;
  const trnx_id = callbackData.Body.stkCallback.callbackMetadata.Item[1].Value;

  console.log({ phone, amount, trnx_id });

  const payment = new Payment();

  payment.number = phone;
  payment.amount = amount;
  payment.trnx_id = trnx_id;

  payment
  .save()
  .then((data) => {
    console.log({ message: "Saved sucessfully", data });
  })
  .catch((err) => {
    console.log(err.message);
  })
});




module.exports = router

