const express = require('express');
const cartsRepo = require('../repos/carts');
const router = express.Router();

router.post('/cart/products', async (req,res) => {
    let cart;
   if (!req.session.cartId) {
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
   } else { 
        cart = await cartsRepo.getOne(req.session.cartId);
   }
   console.log(cart);
});

module.exports = router;