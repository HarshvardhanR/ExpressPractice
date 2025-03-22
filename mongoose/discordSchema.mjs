import mongoose from 'mongoose';

const userDiscordSchema = new mongoose.Schema({
    username:{
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    discordId:{
        type: mongoose.Schema.Types.String,
        required: true,
        unique:true
    }
})

const userDiscord = mongoose.model("userDiscord", userDiscordSchema);
export default userDiscord;