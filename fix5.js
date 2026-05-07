const fs = require('fs');

// 1. Fix layout.js
let layout = fs.readFileSync('app/layout.js', 'utf8');
layout = layout.replace('bg-slate-950 text-slate-100', 'bg-background text-on-surface');
fs.writeFileSync('app/layout.js', layout);

// 2. Fix globals.css
const themeVars = `
@theme {
  --color-primary: #003e6f;
  --color-on-primary: #ffffff;
  --color-primary-container: #005696;
  --color-on-primary-container: #a5cbff;
  --color-secondary: #904d00;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #fe9835;
  --color-on-secondary-container: #693600;
  --color-tertiary: #373e42;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #4e5559;
  --color-on-tertiary-container: #c2c9ce;
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;
  --color-background: #f8f9fa;
  --color-on-background: #191c1d;
  --color-surface: #f8f9fa;
  --color-on-surface: #191c1d;
  --color-surface-variant: #e1e3e4;
  --color-on-surface-variant: #414750;
  --color-outline: #727781;
  --color-outline-variant: #c1c7d2;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f3f4f5;
  --color-surface-container: #edeeef;
  --color-surface-container-high: #e7e8e9;
  --color-surface-container-highest: #e1e3e4;
  --color-primary-fixed: #d2e4ff;
  --color-primary-fixed-dim: #a1c9ff;
  --color-on-primary-fixed: #001c37;
  --color-on-primary-fixed-variant: #004880;
  --color-surface-dim: #d9dadb;
  --color-surface-bright: #f8f9fa;
}

body {
  background-color: var(--color-background);
  color: var(--color-on-surface);
}
`;

const globals = fs.readFileSync('app/globals.css', 'utf8');
if (!globals.includes('--color-primary: #003e6f')) {
  fs.writeFileSync('app/globals.css', globals + '\\n' + themeVars);
}

console.log('Fixed themes and body');
