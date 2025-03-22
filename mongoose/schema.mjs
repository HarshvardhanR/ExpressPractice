import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    fullName:{
        type: mongoose.Schema.Types.String,
        required: true,
    },
    email:{
        type: mongoose.Schema.Types.String,
        required: true,
    },
    password:{
        type: mongoose.Schema.Types.String,
        required:true
    }
})

const user = mongoose.model("user", userSchema);
export default user;