import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User, UserProfile, UserComplaint, UserCalculate } from '../User.js';

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

router.post('/user/google-login',async(request,response)=>{
    const {token}=request.body;
    try{
        const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket=await client.verifyIdToken({
            idToken:token,
            audience:process.env.GOOGLE_CLIENT_ID
        })
        const {sub,email,name}=ticket.getPayload();
        let user=await User.findOne({googleId:sub});
        if(!user){
            user=new User({
        googleId:sub,
        username:email,
       });
       await user.save();
    }
    const appToken=generateToken(user._id);
    user.authToken=appToken;
    await user.save();
    return response.status(200).json({
        message:`Google Login Successful`,
        token:user.authToken,
    userId:user._id})
    }
    catch(error){
        return response.status(500).json({message:error.message})
    }
})

router.post('/user/:id', async(request,response)=>{
    const {id}=request.params;
    const {aadhar,members,location}=request.body;
    try{
        if(!aadhar || 
           !members ||
           !location
        )
        {
            return response.status(401).json({message:`Please fill all the required fields`});
        }

        const result=await UserProfile.findOneAndUpdate({userId:id},
            {
                userId:id,
                aadhar,
                members,
                location
            },
            {upsert:true, new:true, runValidators:true}
        )
        if(!result){
            return response.status(401).json({message:`Could not save Profile`});
        }

        return response.status(200).json({
            message:`Profile saved successfully`,
            profile:result
        })
    
    }catch(error){
        return response.status(500).json({message:error.message})
    }

})

router.get('/user/:id', async(request,response)=>{
    try{
        const {id}=request.params;
        const profile=await UserProfile.findOne({userId:id});
        return response.status(200).json({
            message:`Profile saved successfully`,
            profile:profile
        })
    
    }catch(error){
        return response.status(500).json({message:error.message})
    }

})

router.post('/user/complaint/:id', async(request,response)=>{
    const {id}=request.params;
    const {problem,time,deadline}=request.body;
    try{
        if(!problem || 
           !time ||
           !deadline
        )
        {
            return response.status(401).json({message:`Please fill all the required fields`});
        }

        const complaint=await UserComplaint.findOneAndUpdate({userId:id},
            {
                userId:id,
                problem,
                time,
                deadline,
                solution:''
            },
            {upsert:true, new:true, runValidators:true}
        )
        if(!complaint){
            return response.status(401).json({message:`Failed to register the complaint`});
        }

        return response.status(200).json({
            message:`Complaint registered successfully`,
            complaint
        })
    
    }catch(error){
        return response.status(500).json({message:error.message})
    }

})

router.post('/user/calculate/:id', async(request,response)=>{
    const {id}=request.params;
    const {electricity,water}=request.body;
    try{
        if(!electricity || 
           !water 
        )
        {
            return response.status(401).json({message:`Please fill all the required fields`});
        }
        const user=await UserProfile.findOne({userId:id});
        const calculate=await UserCalculate.findOneAndUpdate({userId:id},
            {
                userId:id,
                members:user.members,
                electricity,
                water,
            },
            {upsert:true, new:true, runValidators:true}
        )
        if(!calculate){
            return response.status(401).json({message:`Insufficient data provided for request`});
        }

        return response.status(200).json({
            message:`Request saved successfully`,
            calculate
        })
    
    }catch(error){
        return response.status(500).json({message:error.message})
    }

})


export default router;