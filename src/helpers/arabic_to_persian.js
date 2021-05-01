String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

export default String.prototype.toPersianCharacter =  function () {
var string = this;
var obj = {
    'ك' :'ک',
    'دِ': 'د',
    'بِ': 'ب',
    'زِ': 'ز',
    'ذِ': 'ذ',
    'شِ': 'ش',
    'سِ': 'س',
    'ى' :'ی',
    'ي' :'ی',
    '١' :'۱',
    '٢' :'۲',
    '٣' :'۳',
    '٤' :'۴',
    '٥' :'۵',
    '٦' :'۶',
    '٧' :'۷',
    '٨' :'۸',
    '٩' :'۹',
    '٠' :'۰',
};

Object.keys(obj).forEach(function(key) {
    string = string.replaceAll(key, obj[key]);
});
return string
};