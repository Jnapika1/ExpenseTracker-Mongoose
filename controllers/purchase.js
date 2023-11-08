const Razorpay = require('razorpay');
const Order = require('../models/order');
require('dotenv').config();
const userController = require('./login');


const purchasepremium = async(req, res)=>{
    console.log(req);
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        rzp.orders.create({amount, currency: "INR"}, (err, order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            const newOrder = new Order({orderid: order.id, status: 'PENDING', userId: req.user});
            newOrder.save().then(()=>{
                return res.status(201).json({order, key_id: rzp.key_id});
            })
            .catch(err=>{
                throw new Error(err);
            })
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err});
    }
}

const updateTransaction = async(req, res)=>{
    try{
        const{payment_id, order_id} = req.body;
        const userId = req.user._id;
        const order = await Order.findOne({orderid: order_id});
        await order.updateOne({paymentid: payment_id, status: 'SUCCESSFUL'});
        const user = await User.findById(userId);
        await user.updateOne({ispremium: true});
        res.status(202).json({success: true, message: "Transcation Successful", token: userController.generateAccessToken(userId, undefined, true)});


        // Order.findOne({where: {orderid: order_id}}).then(order=>{
        //     order.update({paymentid: payment_id, status: 'SUCCESSFUL'}).then(()=>{
        //         req.user.update({ispremium: true}).then(()=>{
        //             return res.status(202).json({success: true, message: "Transcation Successful"});
        //     }).catch(err=>{
        //         throw new Error(err);
        //         })
        //      }).catch(err=>{
        //             throw new Error(err);
        //      })
        // }).catch(err=>{
        //     throw new Error(err);
        //     })

}
catch(err){
    console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err});
}
}

const failedTransaction = async(req, res)=>{
    try{
        const{payment_id, order_id} = req.body;
        const userId = req.user._id;
        const order = await Order.findOne({orderid: order_id});
        await order.updateOne({paymentid: payment_id, status: 'FAILED'});
        const user = await User.findById(userId);
        await user.updateOne({ispremium: false});
        // await req.user.update({ispremium: false});
        res.status(202).json({success: false, message: "Transcation Failed"});
    }
    catch(err){
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err});
    }
}

module.exports= {
    purchasepremium, updateTransaction, failedTransaction
}