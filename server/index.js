import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouting from './routes/userAuth.js'


const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());

const connect =()=>{
    mongoose.connect(process.env.MONGO).then(()=>{
        console.log("Db is connected succesfully")
    }).catch((err)=>{
        throw err;
    })
}
// app.get("/test",(req,res) =>{
//     res.json("test is ok")
// })

app.use('/api/v1',authRouting)

app.listen(8000,()=>{
    console.log("server is run in 8000")
    connect()
})