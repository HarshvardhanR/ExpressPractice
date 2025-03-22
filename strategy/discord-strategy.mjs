import passport from "passport";
import {Strategy} from 'passport-discord';
import userDiscord from "../mongoose/discordSchema.mjs";

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser(async(id, done)=>{
    let userD;
    try{
        userD = userDiscord.findById(id);
        return done(null, userD)
    }
    catch(err){
        done(err, null);
    }
})

passport.use(
    new Strategy({
        clientID: '1351091536678486037',
        clientSecret: '_qzb6LZCMTmtqNEOOvK2pGOSeE0KLH9d',
        callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
        scope: ["identify", "guilds"]

    }, async (accessToken, refreshToken, profile, done) =>{
        let findUser;
        try{
            findUser = await userDiscord.findOne({discordId: profile.id});
        }
        catch(err){
            return done(err, null)
        }
        try{
            if(!findUser){
                const newUser = new userDiscord({username:profile.username, discordId:profile.id});
                const newSavedUser = await newUser.save();
                return done(null, newSavedUser);
            }
            return done(null, findUser);
        }
        catch(err){
            return done(err, null);
        }
    })
)