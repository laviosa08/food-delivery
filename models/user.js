const userDbClient = require('../config/database')

const userModel = {};

userModel.getUserCashBalance = async (userId)=>{
    let queryString = 'select name, cash_balance as "cashBalance" from users where id = '+userId;
    return await userModel.executeQuery(queryString);
}

userModel.getDishesTotalPrice = async (restaurantId,dishes)=>{
    let params = getParams(dishes)
    let queryString = 'select sum(price) as "totalPrice" from menu_items where restaurant_id = \''+restaurantId+'\' AND id In (' + params.join(',') + ')';
    return await userModel.executeInArrayQuery(queryString, dishes);
}

userModel.addTransactionInfo = async({userId, dishNames, restaurantName, dishTotalPrice, transactionDate})=>{
    let queryString= 'INSERT INTO transactions (user_id, dish_name, restaurant_name, transaction_amount, transaction_date) VALUES (' + userId +', \''+ dishNames +'\', \''+ restaurantName +'\', '+ dishTotalPrice +', \''+ transactionDate + '\' ) RETURNING id'
    return await userModel.executeQuery(queryString);
}

userModel.updateUserCashBalance = async(updatedUserBalance, userId)=>{
    let queryString = 'update users set cash_balance = '+updatedUserBalance+' where id = '+userId;
    return await userModel.executeQuery(queryString);
}

userModel.getDishNames = async(restaurantId,dishes)=>{
    let params = getParams(dishes);
    let queryString = 'select dish_name as "name" from menu_items where restaurant_id = \''+restaurantId+'\' AND id In (' + params.join(',') + ')';
    return await userModel.executeInArrayQuery(queryString, dishes);
}


userModel.executeQuery = async (queryString)=>{
    let data = await userDbClient
        .query(queryString)
        .then(result => {
            return result.rows
        })
        .catch(error => console.error(error.stack))
    return data;

}

userModel.executeInArrayQuery = async (queryString, dishes)=>{
    let data = await userDbClient
        .query(queryString, dishes)
        .then(result => {
            return result.rows
        })
        .catch(error => console.error(error.stack))
    return data;

}

function getParams(dishes){
    var params = [];
    for(var i = 1; i <= dishes.length; i++) {
        params.push('$' + i);
    }
    return params
}
module.exports = userModel;
