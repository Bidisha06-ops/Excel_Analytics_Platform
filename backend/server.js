const express=require("express");
const connectdb = require("./database/database");
const router = require("./routes/user");
const server=express();
const PORT=8000;
server.use(express.json());

connectdb()
server.use("/api/excel",router)
server.use("/",(req,res)=>{
    try{
     res.send("this is my home page")
    }
    catch(error){
      res.send(error.message)
    }
})
server.listen(()=>{
    console.log("your server is running at",PORT)
})
