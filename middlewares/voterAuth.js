require("dotenv").config();
const JWT_SECRET=process.env.SECRET
const jwt=require('jsonwebtoken')

const voterAuth=(req,res,next)=>{
    const auth=req.headers.authorization;
    console.log(auth);
    if(!auth || !auth.startsWith("Bearer "))
        {
            return res.json({
                msg: "Something is wrong with your authorization"
            })
        }
        try{
            const token=auth.split(" ")[1];
            console.log(token);
            const decoded=jwt.verify(token,JWT_SECRET);
            if(decoded)
                {
                    req.voter=decoded;
                    next();
                }
                else {
                    throw new Error("Failed to decode token");
        }
    }
        catch(error){
            return res.status(404).json({
                msg:"Whole middleware authentication is failed "+error})}
}

module.exports= {voterAuth};