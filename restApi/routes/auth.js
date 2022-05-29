require("dotenv").config
const express =require("express")
const router=express.Router()
const {userdb,refreshTokensDB} =require("../../model")
const bcrypt = require('bcrypt')
const jwt =require("jsonwebtoken")


const privateKey="9cc676b1e303574bc25f18c14edbd89d341009232ad5e59e9f2dd05249a573cfe42e603934edefa6fb05343265787762c3e72f5f30bcf6dbf3a39b6776f705f2"
const refreshKey ="1e823a05030feaa38c763b93eead51200ddd4eb239b29512e95223440cd1b9fddfd0e792a1acd2139612fadcd70be1605490f921aa1b3db725ea95de563beee3"


router.route("/register")
  .get((req,res,next)=>{

  })
  
  .post(async (req,res,next)=>{
      const {username,email,password}=req.body
      const index = await userdb.createIndex({
         index: {fields: ['email']}
            });
           
       const  users = await userdb.find({
              selector: {email: email}
               });

               
        if(users.docs.length >0) return res.send({msg:"email already exists"})
            
       console.log(password)
      
       const hashpassword = await bcrypt.hash(password, 10)
          user ={
              name:username,
              email:email,
              password:hashpassword
          }
          let docs
         userDB.insert(user,function (err, newDoc) {
              if(err) return res.send({msg:err})
                
                 res.send({
                     msg:"sucess",
                     user:newDoc
                 })
          })
       
        
})

.delete((req,res,next)=>{

})

router.route("/login")
  .get((req,res,next)=>{

  })
  .post( async (req,res,next)=>{
        const {email,password}=req.body
        
         userDB.findOne({ email: email }, async (err, docs) =>{
               if(!docs) return res.status(404).send({ msg:"Account doesnt exists"})
                 const hashpassword=docs.password
               try{
                if (await bcrypt.compare(password,hashpassword)) {
                  const accessToken =generateAccessToken(docs)
                  const refreshToken=jwt.sign(docs,refreshKey)
                  refreshTokensDB.insert({refreshToken:refreshToken}, (err, newDoc)=> {
                       console.log(err)
                      // console.log(newDoc)
                  })
                  res.send({
                    msg:"sucess",
                    accessToken:accessToken,
                    refreshToken:refreshToken
                  })
                 
                }else{
                  res.send({msg:"Not allowed"})
                }
               }catch(err){
                 console.log (process.env)
                  console.log(err)
                   res.status(500).send({msg:err})
               }
                }); 
         
           
  })
  router.route("/token")
    
      .post((req,res)=>{
        const refreshToken =req.body.refreshToken
        if(refreshToken==null) return res.sendStatus(401)
        refreshTokensDB.findOne({refreshToken:refreshToken},(err,token)=>{
            if(token==null) return res.sendStatus(403)
            jwt.verify(token,refreshKey,(err,user)=>{
              if(err) return res.sendStatus(403)
              const accessToken =generateAccessToken({user})
              res.send({
                accessToken:accessToken
              })
            })