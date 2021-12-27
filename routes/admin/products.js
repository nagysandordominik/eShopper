const express = require('express');

const productRepo = require('../../repos/products');
const productsNewTemp = require('../../views/admin/products/new')
const productsIndexTemp = require('../../views/admin/products/index')
const { requireTitle, requirePrice } = require('./validators');
const multer = require('multer');
const { handleErrors, requireAuth } = require('./middlewares');

const router = express.Router();
const upload = multer({ storage:multer.memoryStorage() });

router.get('/admin/products',requireAuth, async(req,res) => {
    const products = await productRepo.getAll();
    res.send(productsIndexTemp({products}))
});

router.get('/admin/products/new',requireAuth,(req,res) => {
    res.send(productsNewTemp({}));
});

router.post('/admin/products/new',
    requireAuth,
    upload.single('image'),    
    [requireTitle,requirePrice],
    handleErrors(productsNewTemp),  
    async (req,res) => {
        const image = req.file.buffer.toString('base64');
        const {title, price} = req.body;
        await productRepo.create({title,price,image}); 

    res.redirect('/admin/products');
    }
);

module.exports = router;