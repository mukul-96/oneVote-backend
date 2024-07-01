require("dotenv").config()
const JWT_SECRET=process.env.SECRET
const jwt=require('jsonwebtoken')

const adminAuth=(req,res,next)=>{
    const auth=req.headers.authorization;
    
    if(!auth || !auth.startsWith("Bearer "))
        {
            return res.json({
                msg: "Something is wrong with your authorization"
            })
        }
        try{
            const token=auth.split(" ")[1];
            console.log(token);
            const response=jwt.verify(token,JWT_SECRET)
            if(response)
                {
                    req.admin=response;
                    next();
                }
        }
        catch(error){
            return res.status(404).json({
                msg:"Whole middleware authentication is failed " +error})
                }
}
                module.exports={adminAuth};