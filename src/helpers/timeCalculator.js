function isTimeInBetween(startTime, endTime, obj) {
  
  let isInBetween = false;

  let start = new Date(2000, 0, 1, startTime.split(":")[0], startTime.split(":")[1]);
  let end = new Date(2000, 0, 1, endTime.split(":")[0], endTime.split(":")[1]);

  
  for (let i = 0; i < obj.length; i++){
    
    let startCourse = new Date(2000, 0, 1, obj[i].startHour, obj[i].startMinute);
    let endCourse = new Date(2000, 0, 1, obj[i].endHour, obj[i].endMinute);
  
    if (start <= startCourse && endCourse <= end) {
      isInBetween = true;
      break;
    }
  }



  return isInBetween;
}

export { isTimeInBetween };