const fs = require('fs');

let data = fs.readFileSync('src/data/syllabusData.js');
let strData = data.toString('utf8');

let closingIndex = strData.lastIndexOf('};');
strData = strData.substring(0, closingIndex + 2);

strData += '\n\n';
strData += '/**\n';
strData += ' * Lookup a specific subject + class syllabus entry.\n';
strData += ' * Returns null if the combination does not exist.\n';
strData += ' */\n';
strData += 'export const getSyllabusData = (subjectSlug, classSlug) =>\n';
strData += '  syllabusData[subjectSlug]?.[classSlug] || null;\n';
strData += '\n';
strData += '/**\n';
strData += ' * Check if a specific subject + class is published.\n';
strData += ' */\n';
strData += 'export const isPublished = (subjectSlug, classSlug) =>\n';
strData += '  syllabusData[subjectSlug]?.[classSlug]?.published === true;\n';

fs.writeFileSync('src/data/syllabusData.js', strData, 'utf8');
console.log('Fixed file corruption and appended properly.');
