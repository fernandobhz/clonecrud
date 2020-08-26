#!/usr/bin/env node
const recursive = require("recursive-readdir");
const path = require('path');
const fs = require('fs');

if (process.argv.length !== 5) {
  console.error('Usage npx clonecrud oldName newName .js');
  console.log('Received: ', process.argv);
  process.exit(0);
}

const towrite = true;
const oldName = process.argv[2];
const newName = process.argv[3];
const fileEnding = process.argv[4];
const currentPath = path.resolve(".");

const oldname = oldName.toLowerCase();
const newname = newName.toLowerCase();

const OLDNAME = oldName.toUpperCase();
const NEWNAME = newName.toUpperCase();

recursive(currentPath, function (err, files) {
  files = files.filter(x => x.endsWith(fileEnding));

  dupFiles = files.filter(x => x.toLowerCase().includes(oldname));

  dupLines = files.filter(x => !x.toLowerCase().includes(oldname));

  dupLines = dupLines.filter(x => {
    var content = fs.readFileSync(x, 'utf8');
    return content.toLowerCase().includes(oldname);
  });

  console.log('dupFiles: ', dupFiles.map(x => x.substring(currentPath.length)));
  console.log('dupLines: ', dupLines.map(x => x.substring(currentPath.length)));

  const reold = new RegExp(oldname, 'g');
  const reOld = new RegExp(oldName, 'g');
  const REOLD = new RegExp(OLDNAME, 'g');

  dupFiles.forEach(x => {
    let content = fs.readFileSync(x, 'utf8');
    content = content.replace(reold, newname);
    content = content.replace(reOld, newName);
    content = content.replace(REOLD, NEWNAME);

    let y = x;
    y = y.replace(reold, newname);
    y = y.replace(reOld, newName);
    y = y.replace(REOLD, NEWNAME);

    fs.mkdirSync(path.dirname(y), { recursive: true });
    if (towrite) fs.writeFileSync(y, content);
  });

  dupLines.forEach(x => {
    const before = fs.readFileSync(x, 'utf8').replace(/\r/g, '').split(/\n/);
    const after = [];

    before.forEach(l => {
      after.push(l);

      if (l.includes(oldname) || l.includes(oldName)) {
        l = l.replace(reold, newname);
        l = l.replace(reOld, newName);
        l = l.replace(REOLD, NEWNAME);
        after.push(l);
      }
    });

    if (towrite) fs.writeFileSync(x, after.join('\n'));
  });
});
