//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;
import  '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';

import "@uniswap/v2-core/contracts/interfaces/IERC20.sol";

contract Arbitrage {
    address public factory;   // factory create exchange market for the token pair
    uint constant deadline = 20 minutes; // transaction deadline
    address public dexRouter1;
    address public dexRouter2;
    string base;
    string assest;
    address owner;
    uint profit;

    
   //  IUniswapV2Router02 public dexRouter; // router of DEX using the uniswap protocol

     event TradeSucces(
          string assest,
          string base,
          uint profit,
          bool success
     );

     enum STATE {
         TRUE,
         FALSE
     }
     STATE dex1state;

      mapping(address => uint) _balance;
      
      constructor(address _dexRouter1,address _dexRouter2, address _factory, string memory _assest ,string memory _base){
           assest =_assest;
           base=_base;
           dexRouter1 = _dexRouter1;
           dexRouter1 = _dexRouter2;
           factory =_factory;
           owner=msg.sender;
      }
 
      modifier onlyOwner(){
          require(msg.sender==owner,"");
          _;
      }

       function swap(address _router,address _token1, address _token2, uint256 _amount) private returns(bool){
           
        IERC20(_token1).transferFrom(msg.sender,address(this), _amount); // transfer tokenIn from sender to the contract
	     	IERC20(_token1).approve(_router, _amount); //approve dex to spend _amount 
	    	address[] memory path; // list of token addresses
	    	path = new address[](2);
	    	path[0] = _token1;
     		path[1] = _token2;
		address pairAddress = IUniswapV2Factory(factory).getPair(_token1, _token2); //address of pool for both token pairs
        require(pairAddress != address(0), 'This pool does not exist'); // check if such pool exist 
        uint256[] memory amountOutMins = IUniswapV2Router02(_router).getAmountsOut(_amount, path);
		IUniswapV2Router02(_router).swapExactTokensForTokens(_amount,amountOutMins[path.length - 1], path, address(this), deadline);
	    
        return true;
    }
     
      function getAmountOutMin( address _router,address _token1, address _token2, uint256 _amount) public view returns (uint256) {
	      	address[] memory path;
	      	path = new address[](2);
	      	path[0] = _token1;
	      	path[1] = _token2;
	      	uint256[] memory amountOutMins = IUniswapV2Router02(_router).getAmountsOut(_amount, path);
	      	return amountOutMins[path.length -1];
	}
   
    function estimateDualDexTrade(address _token1, address _token2, uint256 _amount) external view returns (uint256) {
		uint256 amtBack1 = getAmountOutMin(dexRouter1, _token1, _token2, _amount);
		uint256 amtBack2 = getAmountOutMin(dexRouter2, _token2, _token1, amtBack1);
		return amtBack2;
	}
      
    function dualDexTrade(address _token1, address _token2, uint256 _amount, STATE _dexstate) external onlyOwner {
        uint startBalance = IERC20(_token1).balanceOf(address(this));
        uint token2InitialBalance = IERC20(_token2).balanceOf(address(this));
         dex1state =_dexstate;
         if(dex1state ==STATE.TRUE) {
        swap(dexRouter1,_token1, _token2,_amount);
        uint token2Balance = IERC20(_token2).balanceOf(address(this));
        uint tradeableAmount = token2Balance - token2InitialBalance;
        swap(dexRouter2,_token2, _token1,tradeableAmount);
        uint endBalance = IERC20(_token1).balanceOf(address(this));
       require(endBalance > startBalance, "Trade Reverted, No Profit Made");
       profit= endBalance -startBalance;
       emit TradeSucces(assest,base,profit,true);
       }
       else{
         swap(dexRouter2,_token1, _token2,_amount);
         uint token2Balance = IERC20(_token2).balanceOf(address(this));
         uint tradeableAmount = token2Balance - token2InitialBalance;
         swap(dexRouter1,_token2, _token1,tradeableAmount);
         uint endBalance = IERC20(_token1).balanceOf(address(this));
         require(endBalance > startBalance, "Trade Reverted, No Profit Made");
           profit= endBalance -startBalance;
           emit TradeSucces(assest,base,profit,true);
       }
       dex1state =STATE.FALSE;

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


    receive ()  payable external{
       _balance[msg.sender] += msg.value;

   }

 




}