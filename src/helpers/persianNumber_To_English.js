function convertPersianNumToEng(number){
  const persianNumDifference = "۱".charCodeAt()-"1".charCodeAt();
  let res=0
  for(let i=0; i<number.length;i++){
    res*=10
    res += ((number[i].charCodeAt()>256? number[i].charCodeAt()- persianNumDifference:number[i].charCodeAt())-"0".charCodeAt());
  }
  return res;
}

export { convertPersianNumToEng };