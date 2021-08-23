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

module.exports = utilCtrl;