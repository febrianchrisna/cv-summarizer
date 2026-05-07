const fs = require('fs');

let routeStr = fs.readFileSync('app/api/process-cv/route.js', 'utf8');
// remove backslash escape before hyphen in the template string
routeStr = routeStr.replace('=> \\`- ${r.field}', '=> `- ${r.field}');
fs.writeFileSync('app/api/process-cv/route.js', routeStr);
console.log('Fixed route.js');
