const express=require('express')
const app=express();
const cors=require("cors")
app.use(cors());
app.use(express.json());
const voterRoute=require("./routes/voter")
const adminRoute=require("./routes/admin")
app.use("/voter",voterRoute);
app.use("/admin",adminRoute);
app.listen(process.env.PORT)