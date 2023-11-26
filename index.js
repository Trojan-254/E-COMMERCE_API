const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');
const cartRoute = require('./routes/cart');
const paymentRoute = require('./routes/payment');



port = 3000

mongoose
 .connect(process.env.MONGO_URL)
 .then(() => console.log("DB Connection was succesfull.."))
 .catch((err) => {
    console.log(err); 
});

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);  
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);
app.use('/api/payment', paymentRoute);



app.listen(process.env.PORT || 3000, () => {
    console.log("Backend server is running!.....");
    console.log(`Listening on port ${port}...`);
})