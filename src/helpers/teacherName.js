function teacherNameDivider(string){

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

    else return result[0];
}

function teacherSearch(string, listOfOptions) {
    for(let i = 0 ; i < listOfOptions.length ; i++){
        if(string.includes(listOfOptions[i])) return true;
    }
    return false;
}

export { teacherNameDivider, teacherSearch };
