const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
const files = [
'./dist/moldeojs/runtime.js',
'./dist/moldeojs/polyfills.js',
'./dist/moldeojs/scripts.js',
'./dist/moldeojs/main.js',
]
await fs.ensureDir('elements')
await concat(files, 'elements/moldeojs-element.js');
await fs.copyFile('./dist/moldeojs/styles.css', 'elements/styles.css')
await fs.copy('./dist/moldeojs/assets/', 'elements/assets/' )
})()
