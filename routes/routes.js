const path = require('path');
const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');
const loginController = require('../controllers/login');
const expenseController = require('../controllers/expenses');
const userAuthentication = require('../middleware/auth');
const purchaseController = require('../controllers/purchase')
const dashboardController = require('../controllers/dashboard');

const passwordController = require('../controllers/password')

router.post('/user/signup', userController.postSignupUser);

router.post('/user/login', loginController.postUserLogin);

router.get('/expense/getexpense', userAuthentication.authenticate, expenseController.getExpenses );
router.post('/expense/addexpense', userAuthentication.authenticate, expenseController.postExpense);
router.delete('/expense/deleteexpense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

router.get('/user/download', userAuthentication.authenticate, expenseController.downloadExpense );

router.get('/purchase/premiummembership', userAuthentication.authenticate, purchaseController.purchasepremium);
router.post('/purchase/updatetransactionstatus', userAuthentication.authenticate, purchaseController.updateTransaction);
router.post('/purchase/failedtransaction', userAuthentication.authenticate, purchaseController.failedTransaction);
router.get('/purchase/showdashboard',userAuthentication.authenticate, dashboardController.showDashboard);


router.get('/password/resetpassword/:id', passwordController.resetpassword);
router.get('/password/updatepassword/:resetpasswordid', passwordController.updatepassword)
router.post('/password/forgotpassword', passwordController.forgotpassword)

module.exports=router;