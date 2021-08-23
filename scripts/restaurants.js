const fs = require('fs');
const StreamArray = require( 'stream-json/streamers/StreamArray');

const json2CsvCtrl = require('../services/json2Csv');
const utilCtrl = require('../services/util');
const restaurantFields = ['restaurant_id', 'cash_balance', 'name'];
const restaurantOpts = { restaurantFields };

const menuFields = ['restaurant_id', 'dish_name', 'price'];
const menuOpts = { menuFields };

const openingHoursfields = ['restaurant_id', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const openingHoursOpts = { openingHoursfields };

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const jsonStream = StreamArray.withParser();
let restaurantsJson = [];
let menuItemJson = [];
let openingHoursJson = [];


//internal Node readable stream option, pipe to stream-json to convert it
fs.createReadStream('../raw_data/restaurant_with_menu.json').pipe(jsonStream.input);

//Generating opening hours, restaurants, menu_items table
jsonStream
  .on('data', ({key, value}) => {    
    
    let restaurantId = utilCtrl.getUUID();

    //Restaurant data
    setRestaurantData(restaurantId, value);

    //Menu items data
    setMenuData(restaurantId, value);

    //Opening hours data
    setOpeningHours(restaurantId, value.openingHours);

  })
  .on('end', () => {
    console.log(openingHoursJson);
    json2CsvCtrl.jsonToCSV(restaurantsJson, restaurantOpts, "restaurant.csv");
    json2CsvCtrl.jsonToCSV(menuItemJson, menuOpts, "menu.csv");
    json2CsvCtrl.jsonToCSV(openingHoursJson, openingHoursOpts, "openingHours.csv");
  });


  function setRestaurantData(id ,data) {
    let restaurantData = {};
    restaurantData.restaurant_id = id;
    restaurantData.name = data.restaurantName.trim();
    restaurantData.cash_balance = data.cashBalance;
    restaurantsJson.push(restaurantData);
  }

  function setMenuData(id ,data) {
    data.menu.forEach( menuItem => {
      let menuItemData = {};
      menuItemData.restaurant_id = id;
      menuItemData.dish_name = menuItem.dishName.trim();
      menuItemData.price = menuItem.price;
      menuItemJson.push(menuItemData);
    });
  }

  function setOpeningHours(id ,data) {
    var openingHoursData = {};

		weekDays.forEach((day)=>{
			openingHoursData[day] = {}
		})

		openingHoursData.restaurant_id = id;

		//Split for each week day
		let openHoursStr = data;
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
							openingHoursData[weekDays[i].trim().substring(0,3)] = time;
						}
						for (let i=0; i<=toDay; i++) {
							openingHoursData[weekDays[i].trim().substring(0,3)] = time;
						}
					} else {
						for (let i=fromDay; i<=toDay; i++) {
							openingHoursData[weekDays[i].trim().substring(0,3)] = time;
						}
					}

				} else {
					openingHoursData[dayStr.trim().substring(0,3)] = time;
				}
				
			});

		});
			openingHoursJson.push(openingHoursData);
  }

  function getStartEndTime(timeRange) {
    var time;
    let startEndTimes = timeRange.split('-');
    var startTime = startEndTimes[0].trim();
    var endTime = startEndTimes[1].trim();
    time = "{" + utilCtrl.convertTimeToInt(startTime) + "," + utilCtrl.convertTimeToInt(endTime) + "}";
    return time;
  }
  
  