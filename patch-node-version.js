const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'node_modules', '@angular', 'cli', 'src', 'utilities', 'node-version.js');

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Patch isNodeVersionSupported
  content = content.replace(
    /function isNodeVersionSupported\(\) \{[\s\S]*?\n\}/,
    'function isNodeVersionSupported() {\n    return true;\n}'
  );
  
  // Patch isNodeVersionMinSupported
  content = content.replace(
    /function isNodeVersionMinSupported\(\) \{[\s\S]*?\n\}/,
    'function isNodeVersionMinSupported() {\n    return true;\n}'
  );
  
  fs.writeFileSync(file, content);
  console.log('Successfully patched Angular CLI node version check.');
} else {
  console.log('Angular CLI node-version.js not found, skipping patch.');
}
