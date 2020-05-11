const Utilities = {
    ToRegex (palabra){
        var regex = '';
        for(var i = 0; i<palabra.length;i++){
            var char = palabra[i];
            if(char != ' '){
                regex += '['+char.toUpperCase() +char.toLowerCase()+']';
            }else{
                regex += char;
            }
        }
        return regex;
    }
};
module.exports= Utilities;