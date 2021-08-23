const fs = require('fs');
const csvReadableStream = require('csv-reader');
const { Parser } = require('json2csv');

const { writeFile } = fs.promises;

const fields = ['restaurant_id', 'id', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const opts = { fields };
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let openingHoursJson = [];

let inputStream = fs.createReadStream('../restaurant.csv', 'utf8');
inputStream
	.pipe(new csvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
	.on('data',  (row) =>{	

		var restaurantHoursJson = {};

		weekDays.forEach((day)=>{
			restaurantHoursJson[day] = {}
		})

		restaurantHoursJson.restaurant_id = row[0];

		//Split for each week day
		let openHoursStr = row[1];
		let openHoursArr = openHoursStr.split('/');

		openHoursArr.forEach ((openingHours) => {

			//Split days and time
			var indexOfFirstDigit = openingHours.search(/\d/);
			var days = openingHours.substring(0, indexOfFirstDigit);
			var timeRange = openingHours.substring(indexOfFirstDigit);

			let time = getStartEndTime(timeRange);

			var daysArr = days.split(',');

			daysArr.forEach((dayStr) => {

				if (dayStr.includes('-')) {

					let dayRange = dayStr.split('-');
					let fromDay = weekDays.indexOf(dayRange[0].trim().substring(0,3));
					let toDay = weekDays.indexOf(dayRange[1].trim().substring(0,3));

					if (toDay < fromDay) {
						for (let i=fromDay; i<weekDays.length; i++) {
							restaurantHoursJson[weekDays[i].trim().substring(0,3)] = time;
						}
						for (let i=0; i<=toDay; i++) {
							restaurantHoursJson[weekDays[i].trim().substring(0,3)] = time;
						}
					} else {
						for (let i=fromDay; i<=toDay; i++) {
							restaurantHoursJson[weekDays[i].trim().substring(0,3)] = time;
						}
					}

				} else {
					restaurantHoursJson[dayStr.trim().substring(0,3)] = time;
				}
				
			});

		});

			openingHoursJson.push(restaurantHoursJson);

	})
	.on('end',  ()=>{
	    console.log(openingHoursJson);
	    jsonToCSV(openingHoursJson);

	});


function getStartEndTime(timeRange) {
	var time = {};
	let startEndTimes = timeRange.split('-');
	var startTime = startEndTimes[0].trim();
	var endTime = startEndTimes[1].trim();
	time.start = convertTimeToInt(startTime);
	time.end = convertTimeToInt(endTime);
	return time;
}

function convertTimeToInt(time) {
	
	time = time.toLowerCase();
	
	let AM_PM = "am";
	if (time.includes('pm')) {
		AM_PM = "pm";
	}
	
	time = time.substring(0, /[a-z]/i.exec(time).index);

	let timeHourMin = time.split(':');
	let hour = timeHourMin[0].trim();
	let min = '0';
	if (timeHourMin.length > 1) {
		min = timeHourMin[1].trim();
	}

	if (AM_PM == "pm" && hour < 12) {
		hour = (parseInt(hour) + 12) % 24;
	}
	if(hour == 12 && AM_PM == "am"){
		hour = 0;
	}

	if (min.length == 1) {
		min = min + "0";
	}

	return parseInt(hour + min);
}


const jsonToCSV = async function (json){
   try {
	  const parser = new Parser(opts);
	  const csv = parser.parse(json);
	  console.log(csv);
	  await writeCSVToFile("openingHours.csv",csv)
	} catch (err) {
	  console.error(err);
	}
}


const writeCSVToFile = async function(fileName, data) {
  try {
  	await writeFile(fileName, data, 'utf8'); 
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}