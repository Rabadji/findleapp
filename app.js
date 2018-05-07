const express=require('express');
const app=express();
const morgan=require("morgan");
const bodyParser=require("body-parser");
const mongoose =require("mongoose");



const usersRoutes=require("./api/routes/users");
mongoose.connect("mongodb://localhost:27017/findle");


app.use(morgan("dev"));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","*");
    if(req.method=="OPTIONS"){
        res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE,GET");
        return res.status(200).json({});
    }
    next();
});


app.use('/users',usersRoutes);

app.use((req,res,next)=>{
    const error=new Eroor("not found");
    error.status=400;
    next(error);
})

app.use((error, req,res,next)=>{
    res.status(error,status||500);
    res.json({
        error:{
            message:error.message
        }
    })
})
module.exports=app;