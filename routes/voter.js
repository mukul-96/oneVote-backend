const express=require('express')
const router=express.Router();
require("dotenv").config()
const JWT_SECRET=process.env.SECRET
const jwt=require('jsonwebtoken')
const zod=require('zod');
const { Voter, Party } = require("../schema/database");
const { voterAuth } = require("../middlewares/voterAuth");
const loginSchema = zod.object({
    email: zod.string().email(),
    password:zod.string()
})
const signupSchema=zod.object({
    name:zod.string(),
    email:zod.string().email(),
    password:zod.string()
});
router.get("/getList",async(req,res)=>{
try{const data=await Party.find();
return res.status(200).json(data);
} 
catch(error)
{
    console.log("Error fetching candidates:", error);
        res.status(500).json({ error: "Failed to fetch candidates" });
}
})
router.post("/signin",async(req,res)=>{
const valid=loginSchema.safeParse(req.body)
if(valid.success)
    {
        const voter=await Voter.findOne({email:req.body.email});
        if(voter && voter.password==req.body.password)
            {
                const ID=voter._id;
                const token=jwt.sign({ID},JWT_SECRET);
                return res.status(200).json({"msg":"welcome",token:token});
            }
    }
    return res.status(404).json({
        msg: "The Information added by you is not valid"
    })
})
router.post("/signup",async(req,res)=>{
const body=req.body;
const valid=signupSchema.safeParse(body);
if(valid.success)
    {
        const emailExist = await Voter.findOne({ email: body.email });
        if (emailExist) {
            return res.status(400).json({ "message": "email already exists" });
        }
        const voter=await Voter.create({
            email:body.email,
            name:body.name,
            password:body.password
        })
        const ID=voter._id;
        const token=jwt.sign({ID},JWT_SECRET)
        return res.status(200).json({token:token,"mssg":"voter created successfully"})
    } 
    return res.status(411).json({ "message": "invalid parameters" });
})

router.put("/voting", voterAuth, async (req, res) => {
    try {
        const voterID=req.voter.ID;
        const voter = await Voter.findById(voterID);
        console.log(voter)



        const voted = voter.voted == undefined ? false : voter.voted;
     if (!voted) {
        
            const voterUpdateResult = await Voter.updateOne(
                { _id: voter._id },
                { $set: { voted: true } }
            );

            
            const name = req.body.voteTo;
            const partyUpdateResult = await Party.updateOne(
                { name: name },
                { $push: { votes: voter.email } }
            );

           

            return res.status(200).json({ "message": "Voted successfully" });
        }
        
        return res.status(400).json({ "message": "Already voted" });
    } catch (error) {
        console.error("Error processing vote:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
});
module.exports = router;


