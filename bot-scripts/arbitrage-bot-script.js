

const Web3 = require("web3")
const erc20min=require("../build/contracts/IERC20Minimal.json")
const HDWalletProvider =require("@truffle/hdwallet-provider")







const arbTrade =async (token1,token2,amount,publicAddress,privateKey,greater)=>{
 
   console.log("Executing Trade")
   const http_Url=process.env.INFURA_HTTP
   const https_provider = new HDWalletProvider(
      privateKey,
       http_Url
       )
   const web3 = new Web3(https_provider)

   
    const contract_address =process.env.ARB_CONTRACT_ADDRESS
    const contract = new web3.eth.Contract(
                         ARB_contract.abi,
                         contract_address
                 )
    
  
      const TokenContract = new web3.eth.Contract(
      erc20min.abi, 
      token1)
       try{
         const approveData = await TokenContract.methods.approve(contract_address, amount).send({
            from:publicAddress
         })
        
         console.log(approveData)
         console.log(".......APPROVED")
       }catch(error){
          console.log(error)
       }
     
   

   if(greater){
      try{
         const res=await contract.methods.SushiwapToUniswapTrade(token1,token2,amount).send({
            from:publicAddress
      })
        console.log(res)
        console.log(".....SUSHITRADE")
   }
      catch(error){
         console.log(error)}
     
        }else{
         try{
            const res=await contract.methods.UniswapToSushiwapTrade(token1,token2,amount).send({
               from:publicAddress})
               
               console.log(res)
               console.log(".....UNITRADE")
            }catch(error){
            console.log(error)
         }
        
   }
     
   
    console.log("Executed")
  
}


module.exports=arbTrade




