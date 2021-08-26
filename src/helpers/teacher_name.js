function teacherNameDivider(string){
    // let index = 0;
    // let result = [];
    // let stringLength = string.length;
    // let lastIndex = 0;

    // while(index < stringLength){
    //     let temp = '';
    //     lastIndex = index;

    //     while(string[index] !== '*') index++;
    //     temp += string.substring(lastIndex, index);
    //     index++;
    //     lastIndex = index;

    //     while(string[index] !== '*') index++;
    //     temp = string.substring(lastIndex, index) + ' ' + temp;
    //     index++;

    //     while(string[index] !== '*') index++;
    //     index++;

    //     result.push(temp);
    // }

    string = string.split('*');
    let result = []
    for(let i=0 ; i < string.length ; i+=3){
        result.push([string[i+1], string[i]].join(" "));
    }

    if(result.length > 1){
        result = result.join(' | ');
        result = result.substr(0, result.length-3);
        return result;
    }
        
    
    else
        return result[0];
}

export { teacherNameDivider };
