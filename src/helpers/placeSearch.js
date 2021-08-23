function placeSearchHelper(places, course) {
    let timeAndPlace = course['seperated_time_and_place'];
    let arr = [];
    for(let index in timeAndPlace){
      let temp = timeAndPlace[index];
      temp = temp.place;
      arr.push(temp);
    }
    for(let index in arr){
      let place = arr[index];
      if (places.includes(place))
        return true;
    }
    return false;
  }

export {placeSearchHelper};