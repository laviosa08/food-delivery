const fs =  require('fs');
const StreamArray = require( 'stream-json/streamers/StreamArray');

const json2CsvCtr = require('../services/json2Csv');

const transactionsFields = ['dish_name', 'restaurant_name', 'transaction_amount', 'transaction_date', 'user_id'];
const transactionsOpts = { transactionsFields };

const usersFields = ['id', 'name', 'cash_balance'];
const usersOpts = { usersFields };

const jsonStream = StreamArray.withParser();
let transactionsJson = [];
let usersJson = [];

//internal Node readable stream option, pipe to stream-json to convert it
fs.createReadStream('../raw_data/users_with_purchase_history.json').pipe(jsonStream.input);

//Generating transactions table
jsonStream
  .on('data', ({key, value}) => {
    //Transactions data
    setTransactionData(key, value);

    //Users data
    setUsersData(key, value);

  })
  .on('end', () => {
    json2CsvCtr.jsonToCSV(transactionsJson,transactionsOpts,"transaction.csv");
    json2CsvCtr.jsonToCSV(usersJson,usersOpts,"users.csv");
  });

  function setTransactionData(key, value){
    let eachTransactionJson = value.purchaseHistory
    
    eachTransactionJson.forEach(transaction => {
      let transactionEntry = {}
      transactionEntry.user_id = value.id;
      transactionEntry.dish_name = transaction.dishName;
      transactionEntry.restaurant_name = transaction.restaurantName;
      transactionEntry.transaction_amount = transaction.transactionAmount;
      transactionEntry.transaction_date = transaction.transactionDate;

      transactionsJson.push(transactionEntry)
    });
    
  }

  function setUsersData(key, value){    
      let userEntry = {}
      userEntry.id = value.id;
      userEntry.name = value.name;
      userEntry.cash_balance = value.cash_balance;

      usersJson.push(userEntry)
  }