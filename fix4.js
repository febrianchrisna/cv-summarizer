const fs = require('fs');

let routeStr = fs.readFileSync('app/api/process-cv/route.js', 'utf8');

// The line is currently:
// ${parameters.requirements?.map(r => `- ${r.field} (Wajib: ${r.mandatory ? 'Ya' : 'Tidak'}): ${r.value}\`).join('\n') || '-'}
// Let's replace it with:
// ${parameters.requirements?.map(r => \`- \${r.field} (Wajib: \${r.mandatory ? 'Ya' : 'Tidak'}): \${r.value}\`).join('\\n') || '-'}
// using proper string literal matching to avoid regex escaping hell

routeStr = routeStr.replace(
  "\\`).join('\\n') || '-'}",
  "`).join('\\n') || '-'}"
);

fs.writeFileSync('app/api/process-cv/route.js', routeStr);
console.log('Fixed route.js nested template literal error');
