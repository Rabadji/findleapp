        //  name: String,
        // email:String,
        // password:String,
        // facebook_id:String,
        // date:Date,
        // gneder:String,
        // interests:[String],
        // pictures:[String],
        // description:[String],
        // is_active:Boolean,
        // raiting:Number,
        // like:Number


const mongoose =require("mongoose");
const userSchema=mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        name:{type:String, required:true} ,
        email:{type:String, 
                required:true,
                unique:true,
                match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        } ,
        password:{type:String, required:true} ,
        facebook_id:{type:String} ,
        date:{type:String, required:true} ,
        city:{type:String } ,
        gender:{type:String} ,
        interests:{type:[String] } ,
        pictures:{type:String},
        description:{type:[String] },
        is_active:{type:Boolean },
        raiting:{type:Number },
        like:{type:Number}
        });
module.exports=mongoose.model('User',userSchema);