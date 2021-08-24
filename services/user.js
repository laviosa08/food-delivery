const userModel = require('../models/user');
const restaurantModel  = require('../models/restaurant');
const utilCtr = require('../services/util');
const userCtr = {};

userCtr.purchaseDish = async (req,res) => {

    const {userId, restaurantId, dishes} = req.body;

    //get user's cash balance
    let userCashInfo= await userModel.getUserCashBalance(userId)
        .then((result)=>{
            return result;
        })
    let userCashBalance = userCashInfo[0].cashBalance

    //get total price of all the dishes.    
    let dishTotalPrice = await userModel.getDishesTotalPrice(restaurantId,dishes)
    .then((result)=>{
        return result[0].totalPrice;
    })

    //check if user's cash balance is greator than or equal to total of all dish prices
    if(userCashBalance >= dishTotalPrice){
        
        // dish names comma seperated as single string 
        let dishNames = await userModel.getDishNames(restaurantId,dishes).then((result)=>{
            let dishNamesString = "";
            result.forEach((dish)=>{
                if(dishNamesString != "")
                    dishNamesString = dishNamesString+", "+dish.name;
                else
                    dishNamesString =  dish.name;
            })
            return dishNamesString;
        })

        //get transaction date time
        let transactionDate = utilCtr.getCurrentDateTime();
        
        //Get restaurant Name
        let restaurantName = await restaurantModel.getRestaurantName(restaurantId)
        restaurantName = restaurantName[0].restaurantName;

        //Insert transaction information in transaction table
        let transactionObject = {userId, dishNames, restaurantName , dishTotalPrice, transactionDate}
        
        userModel.addTransactionInfo(transactionObject)
        .then((result)=>{
            return res.status(200).json({ msg: "Success", transactionId: result[0].id});
        })
        .then(()=>{
            //update user's cash balance after transaction is complete
            let updatedUserBalance = (userCashBalance - dishTotalPrice).toFixed(2); ;
            userModel.updateUserCashBalance(updatedUserBalance, userId)
        })
                
    }else{ 
        //send response to add cash balance
        return res.status(200).json({ msg: "Cash Balance of user is Low. Please add Balance."});
    }
    
}

module.exports = userCtr;