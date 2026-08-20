// Build the final syllabusData.js by reading existing class-1 data
// and injecting generated classes 2-10
const fs = require('fs');

// Read the current file
const current = fs.readFileSync('./src/data/syllabusData.js', 'utf8');

// Read generated data
const generated = fs.readFileSync('./generated-math-classes.txt', 'utf8');

// Find the insertion point: after class-1 closing `},` (line 208) and before the other subjects
// Replace the unpublished class stubs
const newContent = current.replace(
  /    \/\/ Classes 2-10: unpublished — content to be added gradually\r?\n    'class-2': \{ published: false \},\r?\n    'class-3': \{ published: false \},\r?\n    'class-4': \{ published: false \},\r?\n    'class-5': \{ published: false \},\r?\n    'class-6': \{ published: false \},\r?\n    'class-7': \{ published: false \},\r?\n    'class-8': \{ published: false \},\r?\n    'class-9': \{ published: false \},\r?\n    'class-10': \{ published: false \},/,
  generated.trimEnd()
);

fs.writeFileSync('./src/data/syllabusData.js', newContent, 'utf8');
console.log('syllabusData.js updated with classes 2-10!');
console.log('File size:', newContent.length, 'bytes');
