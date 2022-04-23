const Etherscan_apikey=process.env.ETHERSCAN_API_KEY
const axios=require("axios")
require('dotenv').config()



exports.getAbi=async(address)=>{
    const url=`https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${Etherscan_apikey}`
     const data=await axios.get(url)
     const abi=JSON.parse(data.data.result)
     return abi
}

exports.getPoolImmutables=async(poolContract)=>{
    const [token0,token1,fee] =await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee()
    ])

    const immutables={
        token0:token0,
        token1:token1,
        fee:fee
    }
   
    return immutables
}