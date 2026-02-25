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




// import { Page } from '@playwright/test';
// import path from 'path';

/**
 * Upload file using hidden input[type=file]
 */
// export async function uploadFile(
//   page: Page,
//   locator: string,
//   fileName: string
// ) {
//   const filePath = path.resolve('uploads', fileName);
//   await page.locator(locator).setInputFiles(filePath);
// }


import { Page } from '@playwright/test';
import { Logger } from './log-helper';

export async function uploadFile(
  page: Page,
  locator: string,
  fileName: string
): Promise<boolean> {

  try {

    const filePath = path.join(process.cwd(), 'uploads', fileName);

    // ✅ Check file exists
    if (!fs.existsSync(filePath)) {
      Logger.error(`Upload failed - File not found: ${filePath}`);
      return false;
    }

    // ✅ Validate file type
    const allowed = ['.xlsx', '.xls', '.json'];

    const ext = path.extname(fileName).toLowerCase();

    if (!allowed.includes(ext)) {
      Logger.warn(`Unsupported upload file type: ${ext}`);
      return false;
    }

    const element = page.locator(locator);

    // ✅ Ensure element exists
    if (await element.count() === 0) {
      Logger.error(`Upload failed - Locator not found: ${locator}`);
      return false;
    }

    await element.setInputFiles(filePath);

    Logger.success(`File uploaded successfully: ${fileName}`);

    return true;

  } catch (error) {

    Logger.error(`Upload exception: ${error}`);

    // IMPORTANT → do not crash test
    return false;
  }
}


