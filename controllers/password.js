const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/userdetails');

const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        console.log(req);
        const { email } =  req.body;
        const user = await User.findOne({ email });
        if(user){
            const id = uuid.v4();
            const createForgotpassword = new Forgotpassword({id: id, active: true, userId: user._id});
            createForgotpassword.save()
                .catch(err => {
                    throw new Error(err)
                })

            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: email,
                from: 'aishwarya200499@gmail.com',
                subject: 'RESET Password',
                text: 'This is your link to reset password',
                html: `<p>Please click on the given link to reset password</p><a href="http://localhost:8000/password/resetpassword/${id}">Reset password</a>`
            }

            sgMail
            .send(msg)
            .then((response) => {
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true})

            })
            .catch((error) => {
                throw new Error(error);
            })
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    const forgotpasswordrequest = await Forgotpassword.findOne({ id: id, active:true }, {$set: {active: false}});
        if(forgotpasswordrequest){
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ id: resetpasswordid }).then(resetpasswordrequest => {
            User.findById(resetpasswordrequest.userId).then(user => {
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.updateOne({$set: {password: hash} }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}

module.exports={
    forgotpassword,
    resetpassword,
    updatepassword
}