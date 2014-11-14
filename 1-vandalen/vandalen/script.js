"use strict";

var makePerson = function(persArr){
    var result = {minAge: Number.MAX_VALUE, maxAge: 0, averageAge: 0, names: ""};
    var names = [];
    persArr.forEach(function(p){
        if (typeof(p.name) !== "string")
            throw new Error("ERROR");
        result.minAge = Math.min(result.minAge,p.age);
        result.maxAge = Math.max(result.maxAge,p.age);
        names.push(p.name);
        result.averageAge += p.age;
    });
    names.sort(function (a,b){
        return a.localeCompare(b);
    });
    result.averageAge = Math.round(result.averageAge/persArr.length);
    result.names = names.join(", ");
    return result;
}

