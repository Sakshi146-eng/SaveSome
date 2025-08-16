import mongoose from 'mongoose';


const userSchema=mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        mobno:{
            type:String,
            unique:true,
            match:/^[0-9]{10}$/
        },
        password:{
            type:String,
        },
        googleId:{
            type:String,
            unique:true,
            sparse:true,
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

const userProfile=mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        aadhar:{
            type:String,
            required:true,
            unique:true,
            match:/^[0-9]{12}$/
        },
        members:{
            type:Number,
            required:true,
        },
        location:{
            area:{
                type:String,
                required:true,
            },
            place:{
                type:String,
                required:true,
            },
            city:{
                type:String,
                required:true,
            },
            state:{
                type:String,
                required:true,
            },
            pincode:{
                type:String,
                required:true,
                match:/^[0-9]{6}$/
            },
            ward:{
                type:String,
                required:true,
            },

        },
    },
    {
        timestamps:true
    }
)
export const UserProfile = mongoose.model('UserProfile', userProfile);

const userComplaint=mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        problem:{
            type:String,
            required:true,
        },
        time:{
            type:Date,
            required:true,
        },
        deadline:{
            type:Date,
            required:true,
        },
        solution:{
            type:String,
        }
    },
    {
        timestamps:true
    }
)
export const UserComplaint = mongoose.model('UserComplaint', userComplaint);

const userCalculate=mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        members:{
            type:Number,
        },
        electricity:{
            type:Number,
            required:true,
        },
        water:{
            type:Number,
            required:true,
        },
    },
    {
        timestamps:true
    }
)
export const UserCalculate = mongoose.model('UserCalculate', userCalculate);

