const { Parser } = require('json2csv');
const fs = require('fs');
const { writeFile } = fs.promises;

const json2CsvCtr = {}

json2CsvCtr.jsonToCSV = async function (json,opts,fileName){
    try {
     const parser = new Parser(opts);
     const csv = parser.parse(json);
    //  console.log(csv);
     await json2CsvCtr.writeCSVToFile(fileName,csv)
   } catch (err) {
     console.error(err);
   }
 }
 
 
 json2CsvCtr.writeCSVToFile = async function(fileName, data) {
   try {
     await writeFile(fileName, data, 'utf8'); 
   } catch (err) {
     console.log(err);
     process.exit(1);
   }
 }  


 module.exports = json2CsvCtr