const express =require("express")
const router=express.Router()
const arbTrade=require("../../bot-scripts/arbitrage-bot-script")
const{sushiPrice,uniPrice}=require("../../bot-scripts/moralis-getPrices")
const tokens =require("../../config/ethtokens.json")
const {userdb} =require("../../model")


userdb.info().then(function (info) {
  console.log(info);
})

const currentlyTrading= false;

router.route("/config")
   .get((req,res)=>{
       res.status(200).json({
           msg:"works"
       })

   })
   .post((req,res)=>{
          const {token1,token2,amount,traded,publicAddress,privateKey}=req.body
            const mainnetAddess=tokens.mainnet[token1].address
            const token1Address=tokens.ropsten[token1].address
            const token2Address=tokens.ropsten[parseInt(token2)].address
              console.log(token1,token2,amount,traded,publicAddress,privateKey)

             
         const trades = async () => {
            const queue = new (await import('p-queue')).default({ concurrency: 5, intervalCap: 10, })


           const trade1=async()=>{

              const sushiPriceUsd = await queue.add(() => sushiPrice(mainnetAddess));
              const uniPriceUsd = await queue.add(() => uniPrice(mainnetAddess))
               console.log( sushiPriceUsd,uniPriceUsd)
               let greater=false
              let percentProfit
             if(sushiPriceUsd > uniPriceUsd){
                   greater=true
                  const profitMargin=sushiPriceUsd-uniPriceUsd
                   const quotient =profitMargin/uniPriceUsd
                   const num =quotient.toFixed(3)
                   percentProfit =num *100
                  console.log(percent)
              }else{
                 greater=false
                 const profitMargin=uniPriceUsd -sushiPriceUsd
                 const quotient =profitMargin/sushiPriceUsd
                   const num =quotient.toFixed(3)
                 percentProfit =num *100
        }
         
             if(percentProfit >1){
                 arbTrade(token1Address,token2Address,amount,publicAddress,privateKey,greater)
                console.log("traded")
                }
       
              }

                if (isUser1Active) {
                   setTimeout(() => {
                       queue.add(trade1)
                 }, 65000);
                }
             }
             (async () => {
              console.log("Added User 1 trade");
              trades();
             
             })();
    
    
    res.send({
         publicAddress :req.body.publicAddress,
         privateKey:req.