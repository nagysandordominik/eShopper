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

app.get('/', (req,res) =>{
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


app.post('/', async (req,res) => {
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

app.listen(3000, () => {
    console.log('Listening');
});