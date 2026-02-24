/**
 * Excel helper functions for reading/writing Excel files in Playwright tests.
 * Uses the xlsx package.
 */
import * as XLSX from 'xlsx';

function getWorkbook(filePath: string): XLSX.WorkBook {
  return XLSX.readFile(filePath);
}

function getSheet(wb: XLSX.WorkBook, sheetRef: string): XLSX.WorkSheet {
  const sheetName = /^\d+$/.test(sheetRef)
    ? wb.SheetNames[parseInt(sheetRef)] || wb.SheetNames[0]
    : sheetRef;
  return wb.Sheets[sheetName] || wb.Sheets[wb.SheetNames[0]];
}

export function readCell(filePath: string, row: number | string, col: number | string, sheet = '0'): string {
  try {
    const wb = getWorkbook(filePath);
    const ws = getSheet(wb, sheet);
    const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
    const r = typeof row === 'string' ? parseInt(row) : row;
    const c = typeof col === 'string' ? parseInt(col) : col;
    return String(data[r]?.[c] ?? '');
  } catch {
    return '';
  }
}

export function writeCell(filePath: string, row: number | string, col: number | string, value: string, sheet = '0'): void {
  try {
    const wb = getWorkbook(filePath);
    const ws = getSheet(wb, sheet);
    const r = typeof row === 'string' ? parseInt(row) : row;
    const c = typeof col === 'string' ? parseInt(col) : col;
    const cellRef = XLSX.utils.encode_cell({ r, c });
    if (!ws[cellRef]) ws[cellRef] = { t: 's', v: value };
    else ws[cellRef].v = value;
    XLSX.writeFile(wb, filePath);
  } catch {
    // Silently fail on write errors
  }
}

export function readRow(filePath: string, row: number | string, sheet = '0'): string {
  try {
    const wb = getWorkbook(filePath);
    const ws = getSheet(wb, sheet);
    const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
    const r = typeof row === 'string' ? parseInt(row) : row;
    return (data[r] || []).join(',');
  } catch {
    return '';
  }
}

export function readColumn(filePath: string, col: number | string, sheet = '0'): string {
  try {
    const wb = getWorkbook(filePath);
    const ws = getSheet(wb, sheet);
    const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
    const c = typeof col === 'string' ? parseInt(col) : col;
    return data.map((row: string[]) => String(row[c] ?? '')).join(',');
  } catch {
    return '';
  }
}

export function countNonEmptyCells(filePath: string, row: number | string, sheet = '0'): number {
  try {
    const wb = getWorkbook(filePath);
    const ws = getSheet(wb, sheet);
    const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
    const r = typeof row === 'string' ? parseInt(row) : row;
    return (data[r] || []).filter((cell: unknown) => cell !== null && cell !== undefined && String(cell).trim() !== '').length;
  } catch {
    return 0;
  }
}

export function getColumnCount(filePath: string, sheet = '0'): number {
  try {
    const wb = getWorkbook(filePath);
    const ws = getSheet(wb, sheet);
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    return range.e.c + 1;
  } catch {
    return 0;
  }
}

export function getRowCount(filePath: string, sheet = '0'): number {
  try {
    const wb = getWorkbook(filePath);
    const ws = getSheet(wb, sheet);
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    return range.e.r + 1;
  } catch {
    return 0;
  }
}
