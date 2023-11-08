const User = require('../models/userdetails');
const bcrypt = require('bcrypt');

exports.postSignupUser = async (req, res, next)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    // console.log(req);

    let user = await User.findOne({email: email});
    // console.log(user);
    let saltrounds =10;

    try{
        if(user._id!=null){
            res.status(409).json({success: false, message: 'Error: User already exists!!'})
        }
        else{
        bcrypt.hash(password, saltrounds, async(err, hash)=>{
            let user =new User({
                username: username,
                email: email,
                password: hash,
                ispremium: false
              })
              await user.save();
            //   console.log(user);
              res.status(201).json({success: true, message: 'Successfully signed up!!'});
        })
    }
    
        
    }
    catch(err){
        // console.log(err);
        res.status(500).json({success: false, message:err});
    }
}

