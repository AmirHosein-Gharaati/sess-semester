function checkClassTimeInterference(course1, course2){
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
            
            if((course1StartTime > course2StartTime && course1StartTime < course2EndTime)  ||
            (course1EndTime < course2EndTime && course1EndTime > course2StartTime) ||
            (course1StartTime <= course2StartTime && course1EndTime >= course2EndTime)
            ){
                return true;
            }
                
        }   
    }
    return false;
}

function checkFinalTimeInterference(course1, course2){

    let course1DateTime = course1['final_date_split'];
    let course2DateTime = course2['final_date_split'];

    let course1ClockTime = course1['final_time_split'];
    let course2ClockTime = course2['final_time_split'];

    // -------
    let course1DayTime = new Date(course1DateTime['y'], course1DateTime['m'], course1DateTime['d']);
    let course2DayTime = new Date(course2DateTime['y'], course2DateTime['m'], course2DateTime['d']);

    if(course1DayTime.getTime() !== course2DayTime.getTime())
        return false;

    let course1StartTime = new Date(course1DateTime['y'], course1DateTime['m'], course1DateTime['d'], course1ClockTime['start_hour'], course1ClockTime['start_minute']);
    let course2StartTime = new Date(course2DateTime['y'], course2DateTime['m'], course2DateTime['d'], course2ClockTime['start_hour'], course2ClockTime['start_minute']);
    
    let course1EndTime = new Date(course1DateTime['y'], course1DateTime['m'], course1DateTime['d'], course1ClockTime['end_hour'], course1ClockTime['end_minute']);
    let course2EndTime = new Date(course2DateTime['y'], course2DateTime['m'], course2DateTime['d'], course2ClockTime['end_hour'], course2ClockTime['end_minute']);

    if((course1StartTime > course2StartTime && course1StartTime < course2EndTime)  ||
    (course1EndTime < course2EndTime && course1EndTime > course2StartTime) ||
    (course1StartTime <= course2StartTime && course1EndTime >= course2EndTime)
    ){
        return true;
    }
    
    return false;
}

export {checkClassTimeInterference, checkFinalTimeInterference};