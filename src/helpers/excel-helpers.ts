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



// export function readCellByColAndRowIndex(options: ReadCellOptions): CellValue | CellResult {
//   const {
//     filePath,
//     sheetName,
//     columnIndex,
//     rowIndex,
//     cellAddress,
//     withType = false
//   } = options;

//   const wb = XLSX.readFile(path.resolve(filePath), {
//     cellDates: true,
//     cellNF: true
//   });

//   const sheet = resolveSheet(wb, sheetName);

//   let cell: XLSX.CellObject | undefined;

//   // ✅ Case 1 — Direct Excel Address
//   if (cellAddress) {
//     cell = sheet[cellAddress.toUpperCase()];
//   }

//   // ✅ Case 2 — Column Index + Row Index
//   else if (columnIndex !== undefined && rowIndex !== undefined) {

//     // Excel rows are 1-based
//     const excelRow = rowIndex + 2;

//     // Convert column index → Excel column (A,B,C...)
//     const columnLetter = XLSX.utils.encode_col(columnIndex);

//     const addr = `${columnLetter}${excelRow}`;

//     cell = sheet[addr];
//   }

//   else {
//     throw new Error(
//       'Provide either (columnIndex + rowIndex) or cellAddress.'
//     );
//   }

//   if (withType) return resolveCellResult(cell);

//   if (!cell) return null;

//   return cell.v instanceof Date ? cell.v : (cell.v ?? null);
// }


// export function readCellByColAndRowIndex(
//   filePath: string,
//   rowIndex: number | string,
//   columnIndex: number | string,
//   sheetName: string
// ): string {

//   try {
//     const wb = getWorkbook(filePath);

//     // use sheet name directly
//     const ws = wb.Sheets[sheetName];

//     if (!ws) {
//       throw new Error(`Sheet "${sheetName}" not found`);
//     }

//     const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });

//     const r = typeof rowIndex === 'string'
//       ? parseInt(rowIndex)
//       : rowIndex;

//     const c = typeof columnIndex === 'string'
//       ? parseInt(columnIndex)
//       : columnIndex;

//     return String(data[r]?.[c] ?? '');

//   } catch (error) {
//     console.log('Excel Read Error:', error);
//     return '';
//   }
// }

export function readCellByColAndRowIndex(
  filePath: string,
  rowIndex: number | string,
  columnIndex: number | string,
  sheetName: string
): string {

  try {

    if (!filePath)
      throw new Error('File path is empty');

    if (!sheetName)
      throw new Error('Sheet name is required');

    const wb = getWorkbook(filePath);

    const ws = wb.Sheets[sheetName];

    if (!ws)
      throw new Error(`Sheet "${sheetName}" not found`);

    const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });

    const r = Number(rowIndex);
    const c = Number(columnIndex);

    if (isNaN(r) || r < 0)
      throw new Error(`Invalid rowIndex: ${rowIndex}`);

    if (isNaN(c) || c < 0)
      throw new Error(`Invalid columnIndex: ${columnIndex}`);

    if (r >= data.length)
      throw new Error(`Row index out of range: ${r}`);

    if (c >= (data[r]?.length ?? 0))
      throw new Error(`Column index out of range: ${c}`);

    return String(data[r][c]);

  } catch (error) {
    console.error('Excel Read Error:', error);
    return '';
  }
}