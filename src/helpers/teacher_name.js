function teacherNameDivider(string){
    let index = 0;
    let result = [];
    let stringLength = string.length;
    let lastIndex = 0;

    while(index < stringLength){
        let temp = '';
        lastIndex = index;

        while(string[index] !== '*') index++;
        temp += string.substring(lastIndex, index);
        index++;
        lastIndex = index;

        while(string[index] !== '*') index++;
        temp = string.substring(lastIndex, index) + ' ' + temp;
        index++;

        while(string[index] !== '*') index++;
        index++;

        result.push(temp);
    }

    if(result.length > 1)
        return result.join(' | ');
    
    else
        return result[0];
}

export { teacherNameDivider };
