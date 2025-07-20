import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../User.js';

const router=express.Router();


const generateToken=(userId)=>{
    return jwt.sign({id:userId}, process.env.JWT_SECRET || 'secret key', {
        expiresIn:'7d'
    })
}

router.post('/user',async (request,response)=>{

    const {username, mobno, password}=request.body
    try{
        if(!username ||
           !mobno ||
           !password
        )
        return response.status(400).send({
            message:`Send all required fields : username, mobno, password`
        })

        const existingUser=await User.findOne({username})
        if(existingUser){
            return response.status(400).send({message:'User already exists'})
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            username,
            mobno,
            password:hashedPassword
        })

        const token=generateToken(newUser._id);
        newUser.authToken=token;
        newUser.save();

        return response.status(200).json({message:`User created sucessfully`,
            token
    })

    }catch(error){
        console.log(error.message)
        return response.status(500).send({message:error.message})
    }
})

router.post('/user/login', async(request,response)=>{
    const {username,password}=request.body;
    try{
        const user=await User.findOne({username});
        if(!user){
            return response.status(401).json({message:`Username not found`});
        }
        
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return response.status(401).json({message:`Invalid password`}); 
        }

        const token=generateToken(user._id);
        user.authToken=token;
        await user.save();

        return response.status(200).json({
            message:`Login successful`,
            token:user.authToken,
            userId:user._id,
        })
    
    }catch(error){
        return response.status(500).json({message:error.message})
    }

})


export default router;