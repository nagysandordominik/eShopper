const express = require('express');
const usersRepo = ('../../repos/users');
const signupTemp = require('../../views/admin/auth/signup');

const router = express.Router();

router.get('/signup', (req,res) =>{
    res.send(signupTemp({req}));
});

router.post('/signup', async (req,res) => {
    const { email, password, passwordConfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email is already used...')
    }

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
    res.send(`
    <div>
        <form method='POST'>
            <input name='email' placeholder='email' />
            <input name='password' placeholder='password' />
            <button> Sign in </button>
        </form>
    </div>
    `);
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