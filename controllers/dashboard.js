const User = require('../models/userdetails');
const Expenses = require('../models/expensedetails');
// const sequelize = require('../util/database');

const showDashboard = async(req, res)=>{
    // console.log(req);
    
    try{
        const leaderboard =await User.find().select('username totalExpense').sort('totalExpense');

        // const leaderboard = await User.findAll({
        //     attributes: ['id', 'username', [sequelize.fn('sum', sequelize.col('expensedetails.amount')), 'totalExpense']],
        //     include:[
        //         {
        //             model: Expenses,
        //             attributes: []
        //         }
        //     ],
        //     group:['user.id'],
        //     order:[['totalExpense', 'DESC']]
        // })
    
    
    // const users = await User.findAll();
    // const expenses = await Expenses.findAll();
    //     let userExpenses={}
    // expenses.forEach(expense=>{
       
    //     if(userExpenses[expense.userId]){
    //         userExpenses[expense.userId]=userExpenses[expense.userId]+expense.amount;
    //     }
    //     else{
    //         userExpenses[expense.userId]=expense.amount;
    //     }
    // })
    // var leaderboard = []
    // users.forEach(user=>{
    //     if(userExpenses[user.id]){
    //         leaderboard.push({name: user.username, totalExpense: userExpenses[user.id]});
    //     }
    //     else{
    //         leaderboard.push({name: user.username, totalExpense: 0});
    //     }
        
    // })
    // leaderboard.sort((a, b) => b.totalExpense-a.totalExpense);
    res.status(200).json(leaderboard);
    }
    catch(err){
        console.log(err);
    }
}

module.exports={showDashboard};