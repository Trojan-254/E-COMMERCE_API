const Order = require('../models/Order');
const { 
    verifyToken, 
    verifyTokenAuthorization, 
    verifyTokenAndAdmin 
} = require('./verifyToken');

const router = require('express').Router();

// CREATE ORDER

router.post("/create", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE ORDER

router.put('/update/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
            $set: req.body,
            },
            { new: true }
        );
        res.sendStatus(200).json(updatedOrder);
    }catch (err){
        req.status(500).json(err);
    }
});

// DELETE ORDER

router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json('Order has been deleted succesfully')
        console.log('Order has been deleted succesfully...')
    } catch(err){
        res.status(500).json(err)
    }
});

// GET  USER ORDER

router.get('/find/userId',verifyTokenAuthorization, async (req, res) => {
    try{
        const orders = await Order.find({ userId: req.params.userid });
        res.status(200).json(orders);
    } catch(err){
        res.status(500).json(err)
    }
});
 

// GET ALL ORDERS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try{

        const orders = await Cart.find();
        res.status(200).json(carts);

    } catch {
        res.status(500).json(err);
    }
});

// GET MONTHLY INCOME



router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(lastMonth);
    previousMonth.setMonth(lastMonth.getMonth() - 1);

    try {
        const income = await Order.aggregate([
            {
                $match: { createdAt: { $gte: previousMonth } }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ]);

        res.json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});




// router.get('/income', verifyTokenAndAdmin, async (req, res) => {
//     const date = new Date();
//     const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
//     const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

//     try{

//         const income = await Order.aggregate([
//             { $match: {createdAt: { $gte: previousMonth } } },
//             {
//                 $project: {
//                     month: { $month: "$createdAt" },
//                     sales: "$amount"
//                 },
//                 {
//                     $group: {
//                         _id: "$month",
//                         total: {$sum: "$sales"}
//                     }
//                 }
//             }
//         ]);


//     } catch(err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router
