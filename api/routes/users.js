const express=require("express");
const router=express.Router();
const User=require('../models/users');
const mongoose =require("mongoose");
const multer=require('multer');
const bcrypt =require("bcrypt");
const jwt=require("jsonwebtoken");

 const storage=multer.diskStorage({
     destination:function(req,file,cb){
         cb(null,"./uploads/");
     },
      filename: function(req, file, cb){
         cb(null, new Date().toISOString().replace(/:/g, '-')+file.originalname);
      }
 });


const upload =multer({storage: storage});
//############################SINGUP##############################


router.post('/singup',(req,res,next)=>{
User.find({email:req.body.email})
.exec()
.then(user=>{
    if(user.length>=1){
        return res.status(409).json({
            message:"mail Exist"
        })
    }else {

         bcrypt.hash(req.body.password,10,(err,hash)=>{
            if (err){
                return res.status(500).json({
                    error:err
                });
            }else{
         const user=new User({
         _id:new mongoose.Types.ObjectId(),
            name:req.body.name,
            email:req.body.email,
            password:hash,
            facebook_id:req.body.facebook_id,
            date:req.body.date,
        });
       user
       .save()
       .then(result=>{
           res.status(201).json({
               message:"USer Created"
           });
       })
       .catch(err=>{
           console.log(err);
        res.status(500).json({error:err});
       })
     }
})
    }
})
.catch()  
})
//###############################LOGIN
router.post("/singin",(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            res.status(401).json({
                message:"faild"
            });
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                 return res.status(401).json({
                message:"faild"
                     });
            }
            if (result){
              const token=  jwt.sign(
                  {
                    email:user[0].email,
                    userId:user[0]._id
                },
                "secret",
                {
                    expiresIn:'1h'
                });
                return res.status(200).json({
                    message:"Auth Succeseful",
                    token:token
                });
            }
             res.status(401).json({
                message:"faild"});
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
        });
})
//##############################GET all USERS#####################
router.get('/',(req,res,next)=>{
    User.find()
    .exec()
    .then(docs =>{
        console.log(docs);
        if (docs){
        res.status(200).json(docs);}
        else{res.status(404)}
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
        });

});
//########################POST#####################,
router.post('/',upload.single('pictures'),(req,res,next)=>{
    const user=new User({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        facebook_id:req.body.facebook_id,
        date:req.body.date,
        city:req.body.city,
        gender:req.body.gender,
        interests:req.body.interests,
        pictures:req.file.path,
        description:req.body.description,
        is_active:req.body.is_active,
        raiting:req.body.raiting,
        like:req.body.like
    });
    user
        .save()
        .then(result=>{
        console.log(result)
          res.status(201).json({
        message:"handling post",
        createdUser:result
    });
        })
        .catch(err=>{console.log(err);
            res.status(500).json({
                error:err
            });
            });
  
});
//#########################GET BY ID###################
router.get("/:userId",(req,res,next)=>{
    const id=req.params.userId;
    User.findById(id)
    .exec()
    .then(doc =>{
        console.log(doc);
        if (doc){
        res.status(200).json(doc);}
        else{res.status(404).json({message:"no such ID"})}
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
        });
});
//##########################PATCH###############
router.patch("/:userId",(req,res,next)=>{
    const id=req.params.userId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
   User.update({_id:id}, { $set:updateOps})
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
        });
});
//####################DELETE##############################
router.delete("/:userId",(req,res,next)=>{
    const id=req.params.userId;
   User.remove({_id:id})
   .exec()
   .then(result=>{
       res.status(200).json(result);
   })
   .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
        });
});
module.exports=router;