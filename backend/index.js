import express from "express";
import {PORT} from "./config.js";

const app=express();
app.listen(PORT, () => {
    console.log(`App is listening to ${PORT}`);
});

app.get('/',(request,response)=>{
    console.log(response);
    return response.status(234).send('Welcome to MERN stack');
})