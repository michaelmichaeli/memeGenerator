'use strict'


function getRandomInteger(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max));
}

function makeId(length = 6) {
    var txt = '';
    var possible = '0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}