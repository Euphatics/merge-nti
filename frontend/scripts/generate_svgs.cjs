const fs = require('fs');

const subjects = [
  { id: 'science', name: 'Science', color1: '#4facfe', color2: '#00f2fe' },
  { id: 'english', name: 'English', color1: '#fa709a', color2: '#fee140' },
  { id: 'information-technology', name: 'IT', color1: '#43e97b', color2: '#38f9d7' },
  { id: 'finance', name: 'Finance', color1: '#f83600', color2: '#f9d423' },
];

const generateSVG = (subject, classNum) => {
  // Variations based on classNum to make them look different
  const c1 = subject.color1;
  const c2 = subject.color2;
  const angle = (classNum * 45) % 360;
  
  // Abstract shapes that change position based on classNum
  const circleX = 20 + (classNum * 15) % 60;
  const circleY = 20 + (classNum * 25) % 60;
  const rectX = 70 - (classNum * 10) % 40;
  const rectY = 60 - (classNum * 5) % 40;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="grad_${subject.id}_${classNum}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="500" fill="url(#grad_${subject.id}_${classNum})" rx="20"/>
  
  <!-- Abstract Decorative Shapes -->
  <circle cx="${circleX}%" cy="${circleY}%" r="120" fill="#ffffff" opacity="0.1" />
  <circle cx="${100 - circleX}%" cy="${100 - circleY}%" r="80" fill="#ffffff" opacity="0.15" />
  <rect x="${rectX}%" y="${rectY}%" width="150" height="150" fill="#ffffff" opacity="0.1" rx="30" transform="rotate(${classNum * 15})" />
  
  <!-- Text Content -->
  <g text-anchor="middle" filter="url(#shadow)">
    <text x="400" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="bold" fill="#ffffff">
      ${subject.name} Olympiad
    </text>
    <text x="400" y="300" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="600" fill="#ffffff" opacity="0.9">
      Class ${classNum}
    </text>
    <text x="400" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#ffffff" opacity="0.8">
      Explore, Learn, and Excel
    </text>
  </g>
</svg>`;
};

for (const subject of subjects) {
  for (let i = 2; i <= 10; i++) {
    const svgContent = generateSVG(subject, i);
    const fileName = `public/${subject.id}_class_${i}_illustration.svg`;
    fs.writeFileSync(fileName, svgContent);
  }
}

console.log('SVGs generated successfully!');
