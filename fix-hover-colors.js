const fs = require('fs');
const path = require('path');

const replacements = [
  ['hover:bg-emerald-700', 'hover:bg-indigo-800'],
  ['hover:bg-emerald-800', 'hover:bg-indigo-900'],
  ['hover:text-emerald-700', 'hover:text-indigo-700'],
  ['hover:text-emerald-600', 'hover:text-indigo-600'],
  ['hover:border-emerald-700', 'hover:border-indigo-700'],
  ['hover:border-emerald-600', 'hover:border-indigo-600'],
  ['hover:border-emerald-500', 'hover:border-indigo-500'],
  ['hover:border-emerald-400', 'hover:border-indigo-400'],
  ['hover:border-emerald-300', 'hover:border-indigo-300'],
  ['hover:border-emerald-200', 'hover:border-indigo-200'],
  ['hover:text-green-700', 'hover:text-indigo-700'],
  ['hover:bg-green-700', 'hover:bg-indigo-800'],
  ['hover:bg-green-600', 'hover:bg-indigo-700'],
  ['group-hover:text-emerald-700', 'group-hover:text-indigo-700'],
  ['group-hover:text-emerald-300', 'group-hover:text-indigo-300'],
  ['group-hover:border-emerald-500', 'group-hover:border-indigo-500'],
  ['group-hover:bg-emerald-100', 'group-hover:bg-indigo-100'],
  ['hover:bg-brandGreenHover', 'hover:bg-indigo-800']
];

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
        walkDirectory(filePath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      replacements.forEach(([from, to]) => {
        if (content.includes(from)) {
          content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
      }
    }
  });
}

console.log('Starting hover color replacement...');
walkDirectory('.');
console.log('Done!');
