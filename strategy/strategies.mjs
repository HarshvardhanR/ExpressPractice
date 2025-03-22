import passport from "passport";
import { Strategy } from "passport-local";
import data from '../data.mjs'
import User from '../mongoose/schema.mjs';
import {compared} from '../helper/hasher.mjs'

passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) =>{
    try{
        const user = await User.findById(id);
        if(!user){
            throw new Error("User not Found");
        }
        done(null, user)
    }
    catch(err){
        done(err, null);
    }
})

passport.use(new Strategy({usernameField : "email"}, async(email, password, done) =>{
    try{
        const findUser = await User.findOne({email});
        if(!findUser){
            throw new Error('User not Found');
        }
        if(!compared(password, findUser.password)){
            throw new Error('Invalid Password');
        }
        done(null, findUser);
    }
    catch(err){
        done(err, null);
    }
}) );

export default passport;