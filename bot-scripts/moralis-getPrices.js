
const Moralis = require("moralis/node");
const {serverUrl, appId, masterKey,moralisSecret }=require("./blockConfig")
 const web3 = require("web3")




const sushiPrice = async (_tokenInAddress) => {
    await Moralis.start({ serverUrl:"https://twyrtcrfrfkd.usemoralis.com:2053/server", appId, moralisSecret });
  
    const price = await Moralis.Web3API.token.getTokenPrice({
      address:_tokenInAddress,
      chain: "eth",
      exchange:"sushiswap"
    });
    //console.log(price)
    return price.usdPrice
  };

  
const uniPrice = async (_tokenInAddress) => {
  await Moralis.start({ serverUrl:"https://twyrtcrfrfkd.usemoralis.com:2053/server", appId, moralisSecret });

  const price = await Moralis.Web3API.token.getTokenPrice({
    address:_tokenInAddress,
    chain: "eth",
    exchange:"uniswap-V3"
  });
   return price.usdPrice
};

module.exports={uniPrice,sushiPrice}