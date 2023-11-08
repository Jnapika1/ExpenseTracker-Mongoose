const path = require('path');
const express = require('express');

const router = express.Router();

const userAuthentication = require('../middleware/auth');
const purchaseController = require('../controllers/purchase')

router.get('/purchase/premiummembership', userAuthentication.authenticate, (req, res)=>{
    console.log(req);
});

module.exports = router;