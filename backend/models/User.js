import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema=mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        mobno:{
            type:String,
            required:true,
            unique:true,
            match:/^[0-9]{10}$/
        },
        password:{
            type:String,
            required:true,
        },
        authToken:{
            type:String,
        }

    },
    {
        timestamps:true
    }
);

export const User = mongoose.model('User', userSchema);