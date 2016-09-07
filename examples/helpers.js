import fs from 'fs';
import sanitizeHtml from 'sanitize-html';
import Constants from 'constant-fox';
import jsesc from 'jsesc';

// helper functions to check run condition, sanitize and write data

export const getLineNum = filepath => {
  const path = process.cwd() + filepath.replace(/./, '');
  let count = 0;
  const stream = fs.createReadStream(filepath);
  if (!stream) {
    console.log('Bad file path');
    return;
  }
  const fileBuffer = fs.readFileSync(filepath);
  const toString = fileBuffer.toString();
  const splitLines = toString.split('\n');
  return (splitLines.length - 1);
}

export const writeToDisk = (filename, items) => {
  fs.writeFileSync(filename, JSON.stringify(items), 'utf8');
}

export const escape = item => {
  return jsesc(item, {
    quotes: 'double',
    wrap: true
  });
}

export const sanitize = item => {
  return sanitizeHtml(item, {
    allowedTags: [],
    allowedAttributes: []
  });
}
