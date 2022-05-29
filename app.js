const express =require("express")
const app=express()
const arbbotRoutes=require("./restApi/routes/arbbot")
const bodyParser = require('body-parser')
const authRoutes =require("./restApi/routes/auth")



app.use(bodyParser.json())
app.use("/arbbot",arbbotRoutes)
app.use("/auth",authRoutes)

app.use((req,res,next)=>{
    const error =new Error("not Found")
    error.status(404)
    next(error)
})

app.use((error, req, res, next) => {
    return res.status(500).json({ error: error.toString() });
  });

  module.exports=app
