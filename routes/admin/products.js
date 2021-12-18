const express = require('express');
const {validationResult} = require('express-validator');
const productRepo = require('../../repos/products');
const productsNewTemp = require('../../views/admin/products/new')
const { requireTitle, requirePrice } = require('./validators');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage:multer.memoryStorage() });

router.get('/admin/products',(req,res) => {

});

router.get('/admin/products/new',(req,res) => {
    res.send(productsNewTemp({}));
});


router.post('/admin/products/new', [requireTitle,requirePrice], upload.single('image'), (req,res) => {
    const errors = validationResult(req);

    console.log(req.file); 

    req.on('data' , data => {
        console.log(data.toString());
    });

    res.send('submitted');
});

module.exports = router;