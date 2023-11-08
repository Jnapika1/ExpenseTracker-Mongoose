const getExpenses = (req, where)=>{
    return req.user.getExpensedetails(where);
}

module.exports={
    getExpenses
}