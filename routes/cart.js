const Cart = require('../models/Cart');
const { 
    verifyToken, 
    verifyTokenAuthorization, 
    verifyTokenAndAdmin 
} = require('./verifyToken');

const router = require('express').Router();

// CREATE CART

router.post("/create/:id", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);

    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE CART

router.put('/update/:id', verifyTokenAuthorization, async (req, res) => {
    try{
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
            $set: req.body,
            },
            { new: true }
        );
        res.sendStatus(200).json(updatedCart);
    }catch (err){
        req.status(500).json(err);
    }
});

// DELETE CART

router.delete('/delete/:id', verifyTokenAuthorization, async (req, res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json('Cart has been deleted succesfully')
        console.log('Cart has been deleted succesfully...')
    } catch(err){
        res.status(500).json(err)
    }
});

// GET  USER CART

router.get('/find/userId',verifyTokenAuthorization, async (req, res) => {
    try{
        const cart = await Cart.findOne({ userId: req.params.userid });
        res.status(200).json(cart);
    } catch(err){
        res.status(500).json(err)
    }
});
 

// GET ALL 
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try{

        const carts = await Cart.find();
        res.status(200).json(carts);

    } catch {
        res.status(500).json(err);
    }
})

module.exports = router
