const mongoose=require('mongoose');
require("dotenv").config();
mongoose.connect("mongodb+srv://mukul96:z1iLy2cImO8u4ypx@cluster0.pc4ff.mongodb.net/voting");

const voterSchema=mongoose.Schema({
    name:String,
    password:String,
    email:String,
    voted: { type: Boolean, default: false }
});
const partySchema=mongoose.Schema({
    name:String,
    img:String,
    votes:[String]
    });
    const adminSchema=mongoose.Schema({
        name:String,
        email:String,
        password:String
        });
        const Voter = mongoose.model('Voter', voterSchema);
        const Party = mongoose.model('Party', partySchema);
        const Admin = mongoose.model('Admin', adminSchema);
        module.exports = {Voter,Admin,Party};