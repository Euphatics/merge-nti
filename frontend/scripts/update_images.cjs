const fs = require('fs');
let data = fs.readFileSync('src/data/syllabusData.js', 'utf8');

for (let i = 2; i <= 10; i++) {
  // We want to replace only the first occurrence of math_class_1_illustration.png 
  // after the string 'class-i':
  // Let's use string operations instead of complex regexes.
  
  let classKey = `class-${i}`;
  let startIndex = data.indexOf(`'${classKey}'`);
  if (startIndex === -1) {
    startIndex = data.indexOf(`"${classKey}"`);
  }
  
  if (startIndex !== -1) {
    let nextClassIndex = data.indexOf(`class-${i+1}`, startIndex);
    if (nextClassIndex === -1) nextClassIndex = data.length;
    
    let block = data.substring(startIndex, nextClassIndex);
    let updatedBlock = block.replace(/math_class_1_illustration\.png/g, `math_class_${i}_illustration.png`);
    
    data = data.substring(0, startIndex) + updatedBlock + data.substring(nextClassIndex);
  }
}

fs.writeFileSync('src/data/syllabusData.js', data, 'utf8');
console.log('Updated images in syllabusData.js');
