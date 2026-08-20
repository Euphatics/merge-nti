const fs = require('fs');

let data = fs.readFileSync('src/data/syllabusData.js', 'utf8');

const subjects = [
  { id: 'english', png: 'english_illustration.png' },
  { id: 'science', png: 'science_illustration.png' },
  { id: 'information-technology', png: 'it_illustration.png' },
  { id: 'finance', png: 'finance_illustration.png' },
];

for (const subject of subjects) {
  // Find subject block start
  let subjectStartIndex = data.indexOf(`'${subject.id}': {`);
  if (subjectStartIndex === -1) {
    subjectStartIndex = data.indexOf(`"${subject.id}": {`);
  }
  
  if (subjectStartIndex === -1) continue;

  let nextSubjectIndex = data.indexOf(`': {`, subjectStartIndex + 10);
  if (nextSubjectIndex === -1) nextSubjectIndex = data.length;

  let subjectBlock = data.substring(subjectStartIndex, nextSubjectIndex);

  for (let i = 2; i <= 10; i++) {
    let classKey = `class-${i}`;
    let classStartIndex = subjectBlock.indexOf(`'${classKey}'`);
    if (classStartIndex === -1) {
      classStartIndex = subjectBlock.indexOf(`"${classKey}"`);
    }
    
    if (classStartIndex !== -1) {
      let nextClassIndex = subjectBlock.indexOf(`class-${i+1}`, classStartIndex);
      if (nextClassIndex === -1) nextClassIndex = subjectBlock.length;
      
      let block = subjectBlock.substring(classStartIndex, nextClassIndex);
      
      // Replace the default PNG with the new SVG for this specific class
      let updatedBlock = block.replace(new RegExp(subject.png, 'g'), `${subject.id}_class_${i}_illustration.svg`);
      
      subjectBlock = subjectBlock.substring(0, classStartIndex) + updatedBlock + subjectBlock.substring(nextClassIndex);
    }
  }

  data = data.substring(0, subjectStartIndex) + subjectBlock + data.substring(nextSubjectIndex);
}

fs.writeFileSync('src/data/syllabusData.js', data, 'utf8');
console.log('Updated images in syllabusData.js for other subjects!');
