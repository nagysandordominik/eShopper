const express = require('express');

const productsRepo = require('../../repos/products');
const productsNewTemp = require('../../views/admin/products/new')
const productsIndexTemp = require('../../views/admin/products/index')
const productsEditTemp = require('../../views/admin/products/edit')
const { requireTitle, requirePrice } = require('./validators');
const multer = require('multer');
const { handleErrors, requireAuth } = require('./middlewares');


const router = express.Router();
const upload = multer({ storage:multer.memoryStorage() });

router.get('/admin/products',requireAuth, async(req,res) => {
    const products = await productsRepo.getAll();
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
        await productsRepo.create({title,price,image}); 

    res.redirect('/admin/products');
    }
);

router.get('/admin/products/:id/edit', async (req, res) => {
    const product = await productsRepo.getOne(req.params.id);
    
    if (!product) {
        return res.send('Product not found!');
    }

    res.send(productsEditTemp({ product }));
}); 

router.post('/admin/products/:id/edit',
    requireAuth,
    upload.single('image'),
    [requireTitle,requirePrice],
    handleErrors(productsEditTemp, async (req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req,res) =>  {
        const changes = req.body;

        if (req.file) {
            changes.image = req.file.buffer.toString('base64');
        }

        try {
            await productsRepo.update(req.params.id, changes)
        }   catch (err) {
            return res.send('Could not find item!');
        }

        res.redirect('/admin/products');    
    }
);

module.exports = router;