const mongoose=require("mongoose");
const URI="mongodb+srv://m45928282:muskan%40143@salforddb.xlulqaq.mongodb.net/?retryWrites=true&w=majority"
const connectdb=async(req,res)=>{
    try{
     await mongoose.connect(URI)
     console.log("your database is connected successfully")
     }
    catch(error){
    console.log(error.message)
    }
}
module.exports=connectdb