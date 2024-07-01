const express=require('express')
const router=express.Router(); 
require('dotenv').config();
const jwt=require('jsonwebtoken')
const JWT_SECRET=process.env.SECRET
const zod=require('zod');
const { Admin, Party, Voter } = require('../schema/database');
const { adminAuth } = require('../middlewares/adminAuth');

const loginSchema = zod.object({
    email: zod.string().email(),
    password:zod.string()
})
const candidateAddSchema = zod.object({
    name: zod.string(),
    img:zod.string()
})
// router.post("/signup",async(req,res)=>{
//     const body=req.body;
//             const admin=await Admin.create({name:body.name,email:body.email,
//                 password:body.password
//             })
//                     const ID=admin._id;
//                     const token=jwt.sign({ID},JWT_SECRET);
//                     return res.status(200).json({"msg":"welcome",token:token});
//         }
//     )

router.post("/signin",async(req,res)=>{
    const valid=loginSchema.safeParse(req.body)
    if(valid.success)
        {
            const admin=await Admin.findOne({email:req.body.email});
            if(admin && admin.password==req.body.password)
                {
                    const ID=admin._id;
                    const token=jwt.sign({ID},JWT_SECRET);
                    return res.status(200).json({"msg":"welcome",token:token});
                }
        }
        return res.status(404).json({
            msg: "The Information added by you is not valid"
        })
    })

    router.post("/party/add",adminAuth,async(req,res)=>{
        const body=req.body;
        const response=candidateAddSchema.safeParse(body);
        if(response.success)
            {
                const exist=await Party.findOne({name:body.name});
                if(!exist)
                    {
                        const newParty=await Party.create(
                            {
                                name:body.name,
                                img:body.img,
                                votes:[]
                            }
                        );
                        await newParty.save();
                    return res.status(200).json({"message":"Candidate added successfully"});
                    }
                return res.status(411).json({"message":"Party already Listed"});
            }
            return res.status(411).json({"message":"invalid parameters"});
    
    })
    router.put("/reset",adminAuth,async(req,res)=>{
        try{
            await Party.updateMany({},{$set:{votes:[]}});
        await Voter.updateMany({},{$set:{voted:false}});
        return res.status(200).json({"msg":"data reseted"});
        }
        catch(error)
        {
            return res.status(400).json({"msg":error});
        }

    })
   
    router.delete('/party/delete/:name', async (req, res) => {
        const { name } = req.params;
    
        try {
            const deletedParty = await Party.findOneAndDelete(name );
    
            if (!deletedParty) {
                return res.status(404).json({ message: 'Party not found' });
            }
    
            res.json({ message: 'Party deleted successfully' });
        } catch (error) {
            console.error('Error deleting party:', error);
            res.status(500).json({ error: 'Failed to delete party' });
        }
    });
    router.get("/stats", adminAuth, async (req, res) => {
        try {
            const voters = await Voter.find();
            const totalVoters = voters.length;
    
            let totalVoted = 0;
            for (let i = 0; i < totalVoters; i++) {
                if (voters[i].voted === true) {
                    totalVoted++;
                }
            }
    
            
            const percentage = totalVoters === 0 ? 0 : (totalVoted / totalVoters) * 100;
    
            return res.status(200).json({ percentage });
        } catch (error) {
            console.error('Error fetching stats:', error);
            return res.status(500).json({ message: "Error occurred" });
        }
    });
    router.get("/results",adminAuth,async(req,res)=>{
        const data=await Party.find();
        return res.status(200).json(data);
    })
    module.exports=router;