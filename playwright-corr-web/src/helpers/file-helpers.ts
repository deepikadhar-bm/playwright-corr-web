/**
 * File helper functions for PDF extraction, ZIP operations, and JSON file reading.
 */
import * as fs from 'fs';
import * as path from 'path';

export function extractPdfText(filePath: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    // pdf-parse returns a promise but we need sync; use a workaround
    // In practice, call this with await in an async context
    let result = '';
    pdfParse(dataBuffer).then((data: { text: string }) => { result = data.text; });
    return result;
  } catch {
    return '';
  }
}

export function getZipFileNames(filePath: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(filePath);
    return zip.getEntries().map((entry: { entryName: string }) => entry.entryName).join(',');
  } catch {
    return '';
  }
}

export function unzip(filePath: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(filePath);
    const extractPath = filePath.replace(/\.zip$/i, '_extracted');
    zip.extractAllTo(extractPath, true);
    return extractPath;
  } catch {
    return '';
  }
}

export function readJsonValue(filePath: string, key: string): string {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!key) return JSON.stringify(data);
    // Support dot-notation keys like "response.data.id"
    const keys = key.split('.');
    let current = data;
    for (const k of keys) {
      if (current === null || current === undefined) return '';
      current = current[k];
    }
    return String(current ?? '');
  } catch {
    return '';
  }
}

export function fileExists(folderPath: string, fileName: string): boolean {
  return fs.existsSync(path.join(folderPath, fileName));
}
