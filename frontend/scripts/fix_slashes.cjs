const fs = require('fs');

let data = fs.readFileSync('src/data/syllabusData.js', 'utf8');

// Replace any missing leading slashes in the illustration SVGs
data = data.replace(/"src": "([a-z]+_class_\d+_illustration\.svg)"/g, '"src": "/$1"');

fs.writeFileSync('src/data/syllabusData.js', data, 'utf8');
console.log('Fixed missing slashes');
