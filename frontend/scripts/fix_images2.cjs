const fs = require('fs');

let data = fs.readFileSync('src/data/syllabusData.js', 'utf8');

const subjects = [
  { id: 'english', prefix: 'english' },
  { id: 'science', prefix: 'science' },
  { id: 'information-technology', prefix: 'it' },
  { id: 'finance', prefix: 'finance' },
];

for (const subject of subjects) {
  let subjectStartIndex = data.indexOf(`'${subject.id}': {`);
  if (subjectStartIndex === -1) {
    subjectStartIndex = data.indexOf(`"${subject.id}": {`);
  }
  
  if (subjectStartIndex === -1) continue;

  let nextSubjectIndex = data.indexOf(`': {`, subjectStartIndex + 10);
  if (nextSubjectIndex === -1) {
      nextSubjectIndex = data.indexOf(`": {`, subjectStartIndex + 10);
  }
  if (nextSubjectIndex === -1) nextSubjectIndex = data.length;

  let subjectBlock = data.substring(subjectStartIndex, nextSubjectIndex);

  for (let c = 2; c <= 10; c++) {
    let classKey = `class-${c}`;
    let classStartIndex = subjectBlock.indexOf(`'${classKey}'`);
    if (classStartIndex === -1) {
      classStartIndex = subjectBlock.indexOf(`"${classKey}"`);
    }
    
    if (classStartIndex !== -1) {
      let nextClassIndex = subjectBlock.indexOf(`class-${c+1}`, classStartIndex);
      if (nextClassIndex === -1) nextClassIndex = subjectBlock.length;
      
      let block = subjectBlock.substring(classStartIndex, nextClassIndex);
      
      // Fix: Account for quotes around src
      let updatedBlock = block.replace(/"?src"?:\s*('|")[^'"]+('|")/, `"src": "/${subject.prefix}_class_${c}_illustration.svg"`);
      
      subjectBlock = subjectBlock.substring(0, classStartIndex) + updatedBlock + subjectBlock.substring(nextClassIndex);
    }
  }
  
  // Now fix class 1
  let class1StartIndex = subjectBlock.indexOf(`'class-1'`);
  if (class1StartIndex === -1) {
    class1StartIndex = subjectBlock.indexOf(`"class-1"`);
  }
  if (class1StartIndex !== -1) {
      let nextClassIndex = subjectBlock.indexOf(`class-2`, class1StartIndex);
      if (nextClassIndex === -1) nextClassIndex = subjectBlock.length;
      
      let block = subjectBlock.substring(class1StartIndex, nextClassIndex);
      let originalPng = subject.id === 'information-technology' ? 'it_illustration.png' : `${subject.id}_illustration.png`;
      let updatedBlock = block.replace(/"?src"?:\s*('|")[^'"]+('|")/, `"src": "/${originalPng}"`);
      
      subjectBlock = subjectBlock.substring(0, class1StartIndex) + updatedBlock + subjectBlock.substring(nextClassIndex);
  }

  data = data.substring(0, subjectStartIndex) + subjectBlock + data.substring(nextSubjectIndex);
}

fs.writeFileSync('src/data/syllabusData.js', data, 'utf8');
console.log('Fixed syllabusData images accurately');
