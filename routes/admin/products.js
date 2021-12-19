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


router.post('/admin/products/new',
    upload.single('image'),    
    [requireTitle,requirePrice],  
    
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send(productsNewTemp({errors}))
        }

        console.log(req.file.buffer.toString('base64'));
        const {title, price} = req.body;
    await productRepo.create({title,price,image}); 

    res.send('submitted');
    }
);

module.exports = router;