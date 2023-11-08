const Expense = require('../models/expensedetails');
const User = require('../models/userdetails');
const File = require('../models/filehistory');
// const sequelize = require('../util/database');
const S3Services = require('../services/s3services');
const UserServices = require('../services/userservices');


exports.downloadExpense = async(req, res)=>{
    try{
        const userId = req.user._id;
        
    const expenses =await Expense.find({userId: userId}).select('amount description price -_id');
    // console.log(expenses);
    // const userId = req.user._id;
    const stringifyExpenses = JSON.stringify(expenses);
    const date = new Date();
    const filename= `Expense${date}.txt`;
    const fileUrl =await S3Services.uploadToS3(stringifyExpenses, filename);
    const file = new File({
        url: fileUrl,
        date: date,
        userId: req.user
    })
    await file.save();
    let filehistory = await File.find({userId});
    // console.log(filehistory);
    res.status(201).json({filehistory, success:true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({filehistory:'', success: false, err:err});
    }
}

exports.getExpenses = async (req, res, next)=>{
    try{
	    // console.log(req);
        const rows =JSON.parse(req.header('rows'));
        // console.log(rows);
        const page = +req.query.page || 1;
        const userId = req.user._id;
        let totalItems = await Expense.countDocuments({userId});
        let expenses = await Expense.find({userId}).skip((page-1)*rows).limit(rows);
        // console.log(expenses);
        
        // , {
        //     skip: (page-1)*rows,
        //     limit:rows
        //     });
        res.status(200).json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: rows*page<totalItems,
            nextPage: page+1,
            hasPreviousPage: page>1,
            previousPage: page-1,
            lastPage: Math.ceil(totalItems/rows),
            premiumUser: req.user.ispremium
        });
    }
    catch(err){
        console.log(err);
    }
};

exports.postExpense = async (req, res, next) => {
    // console.log(req.user);
    let amt =  req.body.amt;
    let desc = req.body.des;
    let category = req.body.cg;
    // const user = User.findByPk(req.user.id);
    // console.log(name);
    // const t = await sequelize.transaction(); => can use session in mongoose
    try{   
        let expense =new Expense({
            amount: amt,
            description: desc,
            category: category,
            userId : req.user
          });
          await expense.save();
        await User.findByIdAndUpdate(req.user._id, {$inc: {totalExpense: JSON.parse(amt)}});
        // await t.commit();
        res.status(201).json({newExpense: expense});
    }
    catch(err){
        // await t.rollback();
        console.log(err);
        res.status(500).json({success:false, error:err})
    }
  };

  exports.deleteExpense = async (req, res)=>{
      const id = req.params.id;
    //   const t = await sequelize.transaction();
    //   console.log(id);
    try{
        let expense = await Expense.findById(id);
        // console.log(expense);
        User.findByIdAndUpdate(req.user._id, {$inc: {totalExpense: -JSON.parse(expense.amount)}});
        
        await expense.deleteOne();
        // await t.commit();
        res.status(200).json({success:true, message: 'Expense deleted successfully!'})
     }
     
     catch(err){
        //  await t.rollback();
         console.log(err);
     }
  }
