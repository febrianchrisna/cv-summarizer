const fs = require('fs');

let routeStr = fs.readFileSync('app/api/process-cv/route.js', 'utf8');
routeStr = routeStr.replace(/\\-/g, '-');
fs.writeFileSync('app/api/process-cv/route.js', routeStr);
console.log('Fixed route.js');
