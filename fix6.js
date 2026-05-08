const fs = require('fs');

let globals = fs.readFileSync('app/globals.css', 'utf8');
globals = globals.replace('\\\\n\\n@theme', '\\n@theme');
fs.writeFileSync('app/globals.css', globals);
console.log('Fixed css escape bug');

//commmit
