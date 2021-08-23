import { createReadStream } from 'fs';
import { withParser } from 'stream-json/streamers/StreamArray';

import { jsonToCSV } from '../services/json2Csv';

const fields = ['dish_name', 'restaurant_name', 'transaction_amount', 'transaction_date', 'user_id'];
const opts = { fields };
const jsonStream = withParser();
let transactionsJson = [];
//internal Node readable stream option, pipe to stream-json to convert it
createReadStream('../users_with_purchase_history.json').pipe(jsonStream.input);

jsonStream
  .on('data', ({key, value}) => {
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
  })
  .on('end', () => {
    console.log(transactionsJson);
    let fileName = "transaction.csv"
    jsonToCSV(transactionsJson,opts,fileName);
  });