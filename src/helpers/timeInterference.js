function checkTimeInterference(course1, course2){
    const convertDayName =[
        "یکشنبه",
        "دوشنبه",
        "سهشنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
        "شنبه",
      ]

    let c1Time = course1['seperated_time_and_place'];
    let c2Time = course2['seperated_time_and_place'];

    for(let k=0 ; k < c1Time.length ; k++){
        for(let l=0 ; l < c2Time.length ; l++){
            let course1Day = c1Time[k]['day'].replace(/\s/g, '');
            let course2Day = c2Time[l]['day'].replace(/\s/g, '');
            if(convertDayName.indexOf(course1Day) !== convertDayName.indexOf(course2Day)){
                continue;
            }

            let course1StartTime = new Date(2000, 1, 0, c1Time[k]['startHour'], c1Time[k]['startMinute']);
            let course2StartTime = new Date(2000, 1, 0, c2Time[l]['startHour'], c2Time[l]['startMinute']);

            let course1EndTime = new Date(2000, 1, 0, c1Time[k]['endHour'], c1Time[k]['endMinute']);
            let course2EndTime = new Date(2000, 1, 0, c2Time[l]['endHour'], c2Time[l]['endMinute']);
            
            if((course1StartTime > course2StartTime && course1StartTime < course2EndTime)  || (course1EndTime < course2EndTime && course1EndTime > course2StartTime) || (course1StartTime.getTime() === course2StartTime.getTime() && course1EndTime.getTime() === course2EndTime.getTime()))
                return true;
        }   
    }
    return false;
}

export {checkTimeInterference};