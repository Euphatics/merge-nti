import { syllabusData } from './src/data/syllabusData.js';
import fs from 'fs';

for (const subject of ['english', 'science', 'information-technology', 'finance']) {
  let prefix = subject === 'information-technology' ? 'it' : subject;
  
  for (let i = 2; i <= 10; i++) {
     let c = syllabusData[subject]['class-'+i];
     if (c && c.sections && c.sections['olympiad-details'] && c.sections['olympiad-details'].image) {
        c.sections['olympiad-details'].image.src = `/${prefix}_class_${i}_illustration.svg`;
     }
  }
  
  let c1 = syllabusData[subject]['class-1'];
  if (c1 && c1.sections && c1.sections['olympiad-details'] && c1.sections['olympiad-details'].image) {
    let png = subject === 'information-technology' ? 'it_illustration.png' : `${subject}_illustration.png`;
    c1.sections['olympiad-details'].image.src = `/${png}`;
  }
}

fs.writeFileSync('src/data/syllabusData.js', 'export const syllabusData = ' + JSON.stringify(syllabusData, null, 2) + ';\n', 'utf8');
console.log('Successfully updated object and wrote to file.');
