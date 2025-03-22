import express from 'express'
import userRoute from './routes/user.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
// import './strategy/strategies.mjs'
import './strategy/discord-strategy.mjs'
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

const appDemo = express();

mongoose.connect('mongodb://localhost:27017')
.then((data) =>{
    console.log("Connected to Database");
})
.catch((err)=>{
    console.log(err);
})

appDemo.use(express.json());
appDemo.use(cookieParser());
appDemo.use(session({
    secret: 'Halo',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 60 },
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
    }),
}));

appDemo.use(passport.initialize());
appDemo.use(passport.session());

appDemo.use(userRoute);

appDemo.get('/', (req, res) =>{
    res.status(200).send("Welcome to the server");
})

appDemo.get('/cookieDemo', (req, res) => {
    console.log(req.cookies);
    res.send("cookie");
})

appDemo.listen(3000, ()=>{
    console.log("Server Started");
});

//---------------------------------------------without passport-----------------------------------
// appDemo.post('/api/auth', (req, res) =>{
//     const {body:{
//         username, password
//     }} = req;
//     console.log(req.cookies);
//     const findUser = data.find(user => user.username===username)
//     if(!findUser || findUser.password!==password){
//         res.status(401).send("Bad auth");
//     }
//     if(findUser.password===password){
//         req.session.user = findUser;
//         res.status(200).send(findUser);
//     }
// })

//-------------------------------------------with passport----------------------------
appDemo.post('/api/auth', passport.authenticate('local'), (request, response) =>{
    request.user ? response.status(200).send(request.user) : response.sendStatus(401); 
})

appDemo.get('/api/auth/status', (req, res) =>{
    req.user ? res.status(200).send(req.user) : res.status(401).send("User Not Found");
})

appDemo.get('/api/auth/logout', (request, response) =>{
    request.logout((err) => {
        if (err) {
            return response.status(500).send("Error logging out");
        }
        request.session.destroy((err) => {
            if (err) {
                return response.status(500).send("Error destroying session");
            }
            response.status(200).send("Logged out successfully");
        });
    });
    
});


//-----------------------------------------Discord Passport Setup----------------------------------------------

appDemo.get('/api/auth/discord', passport.authenticate('discord'));
appDemo.get('/api/auth/discord/redirect', passport.authenticate('discord'), (request, response)=>{
    response.sendStatus(200);
});
