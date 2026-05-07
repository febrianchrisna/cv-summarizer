const fs = require('fs');

let pageStr = fs.readFileSync('app/page.js', 'utf8');

// Find where the second `'use client';` begins
const secondUseClient = pageStr.indexOf("'use client'", 10);
if (secondUseClient !== -1) {
  pageStr = pageStr.substring(0, secondUseClient);
  fs.writeFileSync('app/page.js', pageStr);
  console.log('Fixed page.js');
}

let routeStr = fs.readFileSync('app/api/process-cv/route.js', 'utf8');
routeStr = routeStr.replace('param\\eters.requirements?.map', 'parameters.requirements?.map'); // The error said Expected unicode escape \-
routeStr = routeStr.replace(/\`\- \$\{r\.field\}/g, "`- ${r.field}");
fs.writeFileSync('app/api/process-cv/route.js', routeStr);
console.log('Fixed route.js');
