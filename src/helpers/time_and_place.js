function timeAndPlaceDivider(string){
    let stringLength = string.length;
    let index = 0;
    let lastIndex = 0;
    let result = [];

    while(index < stringLength){
        let arr = [];

        while(string[index] != '(')
            index++;
        arr.push(string.substring(lastIndex, index));
        index++;
        while(string[index] == ' ') index++;
        lastIndex = index;

        while(string[index] != ')')
            index++;
        arr.push(string.substring(lastIndex, index));
        index++;
        while(string[index] == ' ') index++;
        lastIndex = index;
        
        result.push(arr);
    }

    return result;
}

function timeAndPlaceCorrector(string){
    string = string.replace(')', ")\n");
    return string;
}

export { timeAndPlaceDivider, timeAndPlaceCorrector };