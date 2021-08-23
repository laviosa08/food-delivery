const { Parser } = require('json2csv');
const fs = require('fs');
const { writeFile } = fs.promises;

const json2CsvCtrl = {}

json2CsvCtrl.jsonToCSV = async function (json,opts,fileName){
    try {
     const parser = new Parser(opts);
     const csv = parser.parse(json);
    //  console.log(csv);
     await json2CsvCtrl.writeCSVToFile(fileName,csv)
   } catch (err) {
     console.error(err);
   }
 }
 
 
 json2CsvCtrl.writeCSVToFile = async function(fileName, data) {
   try {
     await writeFile(fileName, data, 'utf8'); 
   } catch (err) {
     console.log(err);
     process.exit(1);
   }
 }  


 module.exports = json2CsvCtrl