const usermodel=require("../model/user")

const registeruser=async(req,res)=>{
    try{
     const {username,email,password}=req.body
     if(!username,email,password)
  return res.status(400).json({
    success:false,
    message:"required filled all",
}
)

const user=await usermodel.create({
    username,
    email,
    password:hashpassword
})
if(user){
    return res(201).json({
     success:true,
     message:"user register succesfully",
     data:user
    })
}
     
    }
    catch(error){
     return res(400).json({
        success:false,
        message:"invalid conditions"
     })
    }
}
module.exports=registeruser