const express = require('express');
const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repos/users');
const signupTemp = require('../../views/admin/auth/signup');
const signinTemp = require('../../views/admin/auth/signin');
const {requireEmail, requirePassword,requirePasswordConfirmation, requireEmailExists, requireValidPassword} = require('./validators');


const router = express.Router();

router.get('/signup', (req,res) =>{
    res.send(signupTemp({req}));
});

router.post(
     '/signup',
    [ requireEmail, requirePassword, requirePasswordConfirmation ],
    handleErrors(signupTemp),  
    async (req,res) => {

    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.redirect('/admin/products');
});

router.get('/signout', (req,res) =>{
    req.session = null;
    res.send('You are logged out!')
});

router.get('/signin', (req,res) =>{
    res.send(signinTemp({}));
});

router.post(
    '/signin',
    [requireEmailExists, requireValidPassword],
    handleErrors(signinTemp),
    async (req,res) => {
        
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found...');
    }

    
    req.session.userId = user.id;

    res.send('/admin/products');
});

module.exports = router;