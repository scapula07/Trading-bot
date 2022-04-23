const {ethers}= require("ethers")

const {ethProvider,https_provider}=require('./blockConfig')
const  { ChainId,Fetcher,Route } =require("@uniswap/sdk") ;

const Web3 = require("web3")
const chainId = ChainId.MAINNET;



const getUniswapPrice=async(_tokenAddress0,_tokenAddress1)=>{
    const token0 = await Fetcher.fetchTokenData(chainId,_tokenAddress0)
    const token1 = await Fetcher.fetchTokenData(chainId,_tokenAddress1)
    const pair =await Fetcher.fetchPairData(token0,token1)
    const route =new Route([pair],token0)
    console.log(route.midPrice.invert().toSignificant(6))
    //const price =route.midPrice.invert().toSignificant(6)
    //return price  
}


module.exports={getUniswapPrice}