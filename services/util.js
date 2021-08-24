const utilCtrl = {};

utilCtrl.convertTimeToInt = (time)=>{
  
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

utilCtrl.getUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


utilCtrl.getCurrentDateTime = ()=>{
  let dateObject = new Date();

  // adjust 0 before single digit date
  let date = ("0" + dateObject.getDate()).slice(-2);

  // current month
  let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);

  // current year
  let year = dateObject.getFullYear();

  // current hours
  let hours = dateObject.getHours();

  // current minutes
  let minutes = dateObject.getMinutes();

  // current seconds
  let seconds = dateObject.getSeconds();

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  return(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

}

module.exports = utilCtrl;