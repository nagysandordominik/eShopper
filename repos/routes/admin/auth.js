const express = require('express');
const {check, validationResult} = require('express-validator');

const usersRepo = require('../../../repos/users');
const signupTemp = require('../../../views/admin/auth/signup');
const signinTemp = require('../../../views/admin/auth/signin');
const {requireEmail, requirePassword,requirePasswordConfirmation} = require('./validators');

const router = express.Router();

router.get('/signup', (req,res) =>{
    res.send(signupTemp({req}));
});

router.post('/signup',
    [ requireEmail, requirePassword, requirePasswordConfirmation ],  
    async (req,res) => {
    const errors = validationResult(req);
    console.log(errors);
    
    const { email, password, passwordConfirmation} = req.body;

    

    if (password !== passwordConfirmation) {
        return res.send('Password must match...')
    }
    
    const user = await usersRepo.create({email, password});

    req.session.userId = user.id;

    res.send('Account succesfully created!');
});

router.get('/signout', (req,res) =>{
    req.session = null;
    res.send('You are logged out!')
});

router.get('/signin', (req,res) =>{
    res.send(signinTemp({req}));
});

router.post('/signin', async (req,res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user){
        return res.send('Email not found...');
    }

    const validPassword = await usersRepo.comparePass(
        user.password,
        password
    );
    if (!validPassword){
        return res.send('Invalid password!')
    }
    req.session.userId = user.id;

    res.send('You are signed in!')
});

module.exports = router;