//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;
import "https://github.com/Uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router01.sol";
import "https://github.com/Uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol";
import "https://github.com/Uniswap/v2-core/blob/master/contracts/interfaces/IUniswapV2Pair.sol";
import "https://github.com/Uniswap/v2-core/blob/master/contracts/interfaces/IUniswapV2Factory.sol";
import "https://github.com/Uniswap/v2-core/blob/master/contracts/interfaces/IUniswapV2Callee.sol";
import "https://github.com/Uniswap/v2-core/blob/master/contracts/interfaces/IERC20.sol";
import "https://github.com/Uniswap/v2-periphery/blob/master/contracts/libraries/UniswapV2Library.sol";




contract Arbitrage {
    address public factory;   // factory create exchange market for the token pair
    uint constant deadline = block.timestamp + 30 minutes; // transaction deadline
    
     IUniswapV2Router02 public dexRouter; // router of DEX using the uniswap protocol
      
      constructor(address _dexRouter1,address _dexRouter2, address _factory){
           
           dexRouter1 = IUniswapV2Router02(_dexRouter1);
           dexRouter1 = IUniswapV2Router02(_dexRouter2);
           factory =_factory;
           msg.sender =owner;
      }
 
    

       function swap(address _router,address _tokenIn, address _tokenOut, uint256 _amount) private returns(bool){
           
        IERC20(_tokenIn).transferFrom(msg.sender,address(this), _amount); // transfer tokenIn from sender to the contract
		IERC20(_tokenIn).approve(dexrouter, _amount); //approve dex to spend _amount 
		address[] memory path; // list of token addresses
		path = new address[](2);
		path[0] = _tokenIn;
		path[1] = _tokenOut;
		address pairAddress = IUniswapV2Factory(factory).getPair(tokenIn, _tokenOut); //address of pool for both token pairs
        require(pairAddress != address(0), 'This pool does not exist'); // check if such pool exist 
        uint256[] memory amountOutMins = dexRouter.getAmountsOut(_amount, path);
		dexRouter1.swapExactTokensForTokens(_amount,amountOutMins[path.length - 1], path, address(this), deadline);
	    
        return True;
    }
     
      function getAmountOutMin( address _tokenIn, address _tokenOut, uint256 _amount) public view returns (uint256) {
		address[] memory path;
		path = new address[](2);
		path[0] = _tokenIn;
		path[1] = _tokenOut;
		uint256[] memory amountOutMins = IUniswapV2Router(dexRouter1).getAmountsOut(_amount, path);
		return amountOutMins[path.length -1];
	}
   
    function estimateDualDexTrade(address _token1, address _token2, uint256 _amount) external view returns (uint256) {
		uint256 amtBack1 = getAmountOutMin(dexRouter1, _token1, _token2, _amount);
		uint256 amtBack2 = getAmountOutMin(dexRouter2, _token2, _token1, amtBack1);
		return amtBack2;
	}
      
    function dualDexTrade(address _token1, address _token2, uint256 _amount) external onlyOwner {
        uint startBalance = IERC20(_token1).balanceOf(address(this));
        uint token2InitialBalance = IERC20(_token2).balanceOf(address(this));
        swap(dexRouter1,_token1, _token2,_amount);
        uint token2Balance = IERC20(_token2).balanceOf(address(this));
        uint tradeableAmount = token2Balance - token2InitialBalance;
        swap(dexRouter2,_token2, _token1,tradeableAmount);
        uint endBalance = IERC20(_token1).balanceOf(address(this));
       require(endBalance > startBalance, "Trade Reverted, No Profit Made");
  }
    
    function getBalance (address _tokenContractAddress) external view  returns (uint256) {
		uint balance = IERC20(_tokenContractAddress).balanceOf(address(this));
		return balance;
	}
	
	function recoverEth() external onlyOwner {
		payable(msg.sender).transfer(address(this).balance);
	}

	function recoverTokens(address tokenAddress) external onlyOwner {
		IERC20 token = IERC20(tokenAddress);
		token.transfer(msg.sender, token.balanceOf(address(this)));
	}

   function () payable external {

   }


      
     




}