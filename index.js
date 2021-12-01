const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repos/users');
const users = require('./repos/users');
const cookieSession = require('cookie-session')


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['asdaskg2fa2d244caws']
}));

app.get('/signup', (req,res) =>{
    res.send(`
    <div>
        <form method='POST'>
            <input name='email' placeholder='email' />
            <input name='password' placeholder='password' />
            <input name='passwordConfirmation' placeholder='password confirmation' />
            <button> Sign up </button>
        </form>
    </div>
    `);
});

app.post('/signup', async (req,res) => {
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
    res.send(`<div> Your id: ${req.session.userId} </div>`);
});

app.get('/signout', (req,res) =>{
    req.session = null;
    res.send('You are logged out!')
});

app.get('/signin', (req,res) =>{
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

app.post('/signin', async (req,res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user){
        return res.send('Email not found...');
    }

    if (user.password != password) {
        return res.send('Invalid password...');
    }
    req.session.userId = user.id;

    res.send('You are signed in!')
});


app.listen(3000, () => {
    console.log('Listening');
});