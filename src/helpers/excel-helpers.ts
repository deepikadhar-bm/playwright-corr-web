import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All possible cell value types supported by this helper:
 *
 *  string       → plain text, e.g. 'hello'
 *  number       → integer or float, e.g. 42 or 3.14
 *  boolean      → true / false
 *  Date         → JS Date object — written as date+timestamp to Excel
 *  Alphanumeric → mixed text+digits kept as string, e.g. 'TXN-00123', 'V2.4.1'
 *  null         → empty cell (no value)
 *  undefined    → treated as null (empty cell)
 */
export type CellValue = string | number | boolean | Date | null | undefined;

/**
 * Describes what Excel cell type a value should be stored as.
 * 'a' is the new alphanumeric type (stored as string but explicitly declared).
 * 'd' is the new date+timestamp type.
 */
export type ExcelCellType = 's' | 'n' | 'b' | 'd' | 'a' | 'z';

/** Enriched cell read result — includes the raw value AND its resolved type. */
export interface CellResult {
  value: CellValue;
  type: ExcelCellType;
  /** ISO string when type is 'd', formatted string like 'TXN-001' when 'a', raw otherwise */
  formatted: string;
}

export interface ReadCellOptions {
  filePath: string;
  sheetName?: string;
  columnHeader?: string;
  rowIndex?: number;        // 0-based, after header
  cellAddress?: string;     // e.g. 'B3'
  /** Return a CellResult with type info instead of just the raw value */
  withType?: boolean;
}

export interface UpdateCellOptions {
  filePath: string;
  sheetName?: string;
  columnHeader?: string;
  rowIndex?: number;        // 0-based, after header
  cellAddress?: string;     // e.g. 'B3'
  value: CellValue;
  /**
   * Override the detected cell type.
   * - 'a'  → force alphanumeric (store as string, no numeric coercion)
   * - 'd'  → force date+timestamp (value must be a Date or ISO string)
   * - 's'  → plain string
   * - 'n'  → number
   * - 'b'  → boolean
   */
  cellType?: ExcelCellType;
  /**
   * Date/time format string used when cellType is 'd'.
   * Defaults to 'yyyy-mm-dd hh:mm:ss'.
   * Examples: 'yyyy-mm-dd', 'dd/mm/yyyy hh:mm', 'mm/dd/yyyy hh:mm:ss AM/PM'
   */
  dateFormat?: string;
}

export interface ExcelSheetData {
  sheetName: string;
  headers: string[];
  rows: Record<string, CellValue>[];
  rowCount: number;
}

/** Summary of a single sheet returned by getSheetCount / getSheetNames. */
export interface SheetInfo {
  index: number;       // 0-based
  name: string;
  rowCount: number;
  headers: string[];
}

/** Stateful session returned by switchToSheetByIndex / switchToSheetByName. */
export interface ExcelSession {
  /** The workbook file path this session is bound to. */
  filePath: string;
  /** 0-based index of the currently active sheet. */
  sheetIndex: number;
  /** Name of the currently active sheet. */
  sheetName: string;
  /** Total number of sheets in the workbook. */
  totalSheets: number;
  /** All sheet names in order. */
  allSheetNames: string[];

  // ── Convenience reads scoped to the active sheet ──────────────────────────

  /** Read a single cell in the active sheet. */
  readCell(options: Omit<ReadCellOptions, 'filePath' | 'sheetName'>): CellValue | CellResult;
  /** Read an entire column in the active sheet. */
  readColumn(columnHeader: string): CellValue[];
  /** Read a row (0-based) in the active sheet. */
  readRow(rowIndex: number): Record<string, CellValue>;
  /** Read all data from the active sheet. */
  readSheet(): ExcelSheetData;
  /** Get the data row count of the active sheet. */
  getRowCount(): number;

  // ── Convenience writes scoped to the active sheet ─────────────────────────

  /** Update a single cell in the active sheet. */
  updateCell(options: Omit<UpdateCellOptions, 'filePath' | 'sheetName'>): void;
  /** Batch update multiple cells in the active sheet. */
  updateCells(updates: Omit<UpdateCellOptions, 'filePath' | 'sheetName'>[]): void;

  // ── Navigation ────────────────────────────────────────────────────────────

  /** Switch to another sheet by 0-based index and return an updated session. */
  switchToSheetByIndex(index: number): ExcelSession;
  /** Switch to another sheet by name and return an updated session. */
  switchToSheetByName(name: string): ExcelSession;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Private helpers
// ─────────────────────────────────────────────────────────────────────────────

function loadWorkbook(filePath: string): XLSX.WorkBook {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Excel file not found: ${resolved}`);
  }
  return XLSX.readFile(resolved);
}

function resolveSheet(wb: XLSX.WorkBook, sheetName?: string): XLSX.WorkSheet {
  const name = sheetName ?? wb.SheetNames[0];
  const sheet = wb.Sheets[name];
  if (!sheet) {
    throw new Error(
      `Sheet "${name}" not found. Available sheets: ${wb.SheetNames.join(', ')}`
    );
  }
  return sheet;
}

function resolveSheetName(wb: XLSX.WorkBook, sheetName?: string): string {
  return sheetName ?? wb.SheetNames[0];
}

function findColumnIndex(headers: string[], columnHeader: string): number {
  const idx = headers.findIndex(
    (h) => h?.toString().trim().toLowerCase() === columnHeader.trim().toLowerCase()
  );
  if (idx === -1) {
    throw new Error(
      `Column header "${columnHeader}" not found. Available headers: ${headers.join(', ')}`
    );
  }
  return idx;
}

/**
 * Detects whether a string is alphanumeric (contains both letters and digits,
 * or contains non-numeric special characters mixed with digits — e.g. IDs, codes, versions).
 */
function isAlphanumeric(value: string): boolean {
  // Has at least one letter AND at least one digit, OR has non-numeric chars that prevent pure number parse
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSpecial = /[-_./\\#@]/.test(value);
  return hasLetter || (hasDigit && hasSpecial);
}

/**
 * Resolves a raw cell value from xlsx to a typed CellResult.
 * Handles: string, number, boolean, Date, alphanumeric, date+timestamp.
 */
function resolveCellResult(cell: XLSX.CellObject | undefined): CellResult {
  if (!cell || cell.v === undefined || cell.v === null) {
    return { value: null, type: 'z', formatted: '' };
  }

  const xlType = cell.t;

  // ── Date / timestamp ──────────────────────────────────────────────────────
  if (xlType === 'd' || cell.w?.match(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/) ||
      (xlType === 'n' && cell.z && /[yYmMdDhHsS]/.test(String(cell.z)))) {
    const dateVal = xlType === 'd'
      ? (cell.v as Date)
      : XLSX.SSF.is_date(cell.z ?? '')
        ? new Date(XLSX.utils.sheet_to_json<{ v: number }>([{ v: cell.v as number }] as any)[0]?.v)
        : new Date((cell.v as number - 25569) * 86400 * 1000); // Excel serial → JS Date

    const iso = cell.v instanceof Date
      ? cell.v.toISOString()
      : new Date((cell.v as number - 25569) * 86400 * 1000).toISOString();

    return {
      value: cell.v instanceof Date ? cell.v : new Date((cell.v as number - 25569) * 86400 * 1000),
      type: 'd',
      formatted: cell.w ?? iso,
    };
  }

  // ── Boolean ───────────────────────────────────────────────────────────────
  if (xlType === 'b') {
    return { value: cell.v as boolean, type: 'b', formatted: String(cell.v) };
  }

  // ── Number ────────────────────────────────────────────────────────────────
  if (xlType === 'n') {
    return { value: cell.v as number, type: 'n', formatted: cell.w ?? String(cell.v) };
  }

  // ── String → check if alphanumeric ───────────────────────────────────────
  if (xlType === 's') {
    const str = String(cell.v);
    if (isAlphanumeric(str)) {
      return { value: str, type: 'a', formatted: str };
    }
    return { value: str, type: 's', formatted: str };
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return { value: String(cell.v), type: 's', formatted: String(cell.v) };
}

/**
 * Converts any CellValue to a raw value + xlsx cell type string.
 * Handles alphanumeric (forced string), Date, ISO date strings, numbers, booleans.
 */
function resolveWriteType(
  value: CellValue,
  cellType?: ExcelCellType
): { v: CellValue; t: string; z?: string } {
  // Explicit override: alphanumeric → always string, no coercion
  if (cellType === 'a') {
    return { v: value == null ? '' : String(value), t: 's' };
  }

  // Explicit override: date+timestamp
  if (cellType === 'd') {
    const d = value instanceof Date ? value : new Date(value as string);
    if (isNaN(d.getTime())) throw new Error(`Invalid date value: "${value}"`);
    return { v: d, t: 'd', z: 'yyyy-mm-dd hh:mm:ss' };
  }

  // Explicit: string
  if (cellType === 's') return { v: value == null ? '' : String(value), t: 's' };

  // Explicit: number
  if (cellType === 'n') return { v: Number(value), t: 'n' };

  // Explicit: boolean
  if (cellType === 'b') return { v: Boolean(value), t: 'b' };

  // ── Auto-detect ───────────────────────────────────────────────────────────

  if (value == null) return { v: null, t: 'z' };

  if (value instanceof Date) {
    return { v: value, t: 'd', z: 'yyyy-mm-dd hh:mm:ss' };
  }

  if (typeof value === 'boolean') return { v: value, t: 'b' };

  if (typeof value === 'number') return { v: value, t: 'n' };

  if (typeof value === 'string') {
    // ISO date string: '2024-06-15' or '2024-06-15T10:30:00' or '2024-06-15T10:30:00.000Z'
    const isoDateRe = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;
    if (isoDateRe.test(value.trim())) {
      const d = new Date(value.trim());
      if (!isNaN(d.getTime())) {
        return { v: d, t: 'd', z: value.includes('T') ? 'yyyy-mm-dd hh:mm:ss' : 'yyyy-mm-dd' };
      }
    }

    // Alphanumeric: mixed letters+digits (e.g. IDs, codes, versions)
    if (isAlphanumeric(value)) {
      return { v: value, t: 's' }; // stored as string, never coerced to number
    }

    // Pure numeric string → store as number
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') return { v: num, t: 'n' };

    // Plain string
    return { v: value, t: 's' };
  }

  return { v: String(value), t: 's' };
}

/**
 * Writes a resolved cell value into the sheet object at the given address.
 */
function setCellValue(
  sheet: XLSX.WorkSheet,
  addr: string,
  value: CellValue,
  cellType?: ExcelCellType,
  dateFormat?: string
): void {
  const { v, t, z } = resolveWriteType(value, cellType);
  if (!sheet[addr]) sheet[addr] = {};

  sheet[addr].v = v;
  sheet[addr].t = t as XLSX.ExcelDataType;

  // Apply date format: caller override > auto-detected > default
  if (t === 'd') {
    sheet[addr].z = dateFormat ?? z ?? 'yyyy-mm-dd hh:mm:ss';
  } else {
    delete sheet[addr].z;
  }

  // Extend sheet range
  const ref = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1:A1');
  const cell = XLSX.utils.decode_cell(addr);
  if (cell.r > ref.e.r) ref.e.r = cell.r;
  if (cell.c > ref.e.c) ref.e.c = cell.c;
  sheet['!ref'] = XLSX.utils.encode_range(ref);
}

// ─────────────────────────────────────────────────────────────────────────────
//  Exported functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all sheet names from the workbook.
 *
 * @example
 * const sheets = getSheetNames('tests/data/testdata.xlsx');
 * // ['Users', 'Products', 'Results']
 */
export function getSheetNames(filePath: string): string[] {
  const wb = loadWorkbook(filePath);
  return wb.SheetNames;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the number of data rows (excluding the header row).
 *
 * @example
 * const count = getRowCount('tests/data/testdata.xlsx', 'Users');
 * // 10
 */
export function getRowCount(filePath: string, sheetName?: string): number {
  const wb = loadWorkbook(filePath);
  const sheet = resolveSheet(wb, sheetName);
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const dataRows = rows.slice(1).filter((r) => r.some((c) => c !== null && c !== ''));
  return dataRows.length;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads a single cell value.
 * Provide either (columnHeader + rowIndex) OR cellAddress.
 *
 * Set withType: true to receive a CellResult object with .value, .type, .formatted.
 * Types returned: 's' string | 'n' number | 'b' boolean | 'd' date+timestamp | 'a' alphanumeric | 'z' empty
 *
 * @example
 * // Plain value
 * const name = readCell({ filePath: FILE, columnHeader: 'Username', rowIndex: 0 });
 * // → 'alice'
 *
 * // With type info
 * const result = readCell({ filePath: FILE, columnHeader: 'OrderID', rowIndex: 0, withType: true });
 * // → { value: 'TXN-00123', type: 'a', formatted: 'TXN-00123' }
 *
 * // Date+timestamp cell
 * const ts = readCell({ filePath: FILE, columnHeader: 'CreatedAt', rowIndex: 0, withType: true });
 * // → { value: Date, type: 'd', formatted: '2024-06-15 10:30:00' }
 *
 * // By direct address
 * const val = readCell({ filePath: FILE, cellAddress: 'B3', sheetName: 'Users' });
 */
export function readCell(options: ReadCellOptions): CellValue | CellResult {
  const { filePath, sheetName, columnHeader, rowIndex, cellAddress, withType = false } = options;
  const wb = XLSX.readFile(path.resolve(filePath), { cellDates: true, cellNF: true });
  const sheet = resolveSheet(wb, sheetName);

  let cell: XLSX.CellObject | undefined;

  if (cellAddress) {
    cell = sheet[cellAddress.toUpperCase()];
  } else if (columnHeader !== undefined && rowIndex !== undefined) {
    const rows: CellValue[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    const headers = (rows[0] ?? []) as string[];
    const colIdx = findColumnIndex(headers, columnHeader);
    const excelRow = rowIndex + 2; // +1 header, +1 for 1-based
    const addr = `${XLSX.utils.encode_col(colIdx)}${excelRow}`;
    cell = sheet[addr];
  } else {
    throw new Error('Provide either (columnHeader + rowIndex) or cellAddress.');
  }

  if (withType) return resolveCellResult(cell);
  if (!cell) return null;

  // Return native value — Date for date cells, raw value otherwise
  return cell.v instanceof Date ? cell.v : (cell.v ?? null);
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all values from a column identified by its header name.
 *
 * @example
 * const ids   = readColumn(FILE, 'OrderID', 'Orders');
 * // → ['TXN-001', 'TXN-002', ...]  (alphanumeric, preserved as string)
 *
 * const dates = readColumn(FILE, 'CreatedAt', 'Orders');
 * // → [Date, Date, ...]
 */
export function readColumn(filePath: string, columnHeader: string, sheetName?: string): CellValue[] {
  const wb = XLSX.readFile(path.resolve(filePath), { cellDates: true });
  const sheet = resolveSheet(wb, sheetName);
  const rows: CellValue[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const headers = (rows[0] ?? []) as string[];
  const colIdx = findColumnIndex(headers, columnHeader);
  return rows.slice(1).map((row) => row[colIdx] ?? null);
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a single row as a { header: value } object.
 * rowIndex is 0-based and counts data rows after the header.
 *
 * @example
 * const row = readRow(FILE, 0, 'Orders');
 * // { OrderID: 'TXN-001', Amount: 250, CreatedAt: Date, Status: 'PASS' }
 */
export function readRow(
  filePath: string,
  rowIndex: number,
  sheetName?: string
): Record<string, CellValue> {
  const wb = XLSX.readFile(path.resolve(filePath), { cellDates: true });
  const sheet = resolveSheet(wb, sheetName);
  const rows: CellValue[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const headers = (rows[0] ?? []) as string[];
  const dataRow = rows[rowIndex + 1];
  if (!dataRow) {
    throw new Error(`Row index ${rowIndex} is out of range. Total data rows: ${rows.length - 1}`);
  }
  return Object.fromEntries(headers.map((h, i) => [h, dataRow[i] ?? null]));
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all data from a sheet, including headers, all rows, and row count.
 * Dates are returned as JS Date objects. Alphanumeric values are preserved as strings.
 *
 * @example
 * const { headers, rows, rowCount } = readSheet(FILE, 'Orders');
 */
export function readSheet(filePath: string, sheetName?: string): ExcelSheetData {
  const wb = XLSX.readFile(path.resolve(filePath), { cellDates: true });
  const resolvedName = resolveSheetName(wb, sheetName);
  const sheet = wb.Sheets[resolvedName];
  const jsonRows: Record<string, CellValue>[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const rawRows: CellValue[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const headers = (rawRows[0] ?? []) as string[];
  return {
    sheetName: resolvedName,
    headers,
    rows: jsonRows,
    rowCount: jsonRows.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Updates a single cell and saves the file.
 * Provide either (columnHeader + rowIndex) OR cellAddress.
 *
 * Supported value types (auto-detected or set via cellType):
 *   - string          → plain text
 *   - number          → numeric
 *   - boolean         → true/false
 *   - Date            → stored as date+timestamp (default format: 'yyyy-mm-dd hh:mm:ss')
 *   - ISO string      → '2024-06-15' or '2024-06-15T10:30:00Z' → auto-converted to date
 *   - Alphanumeric    → 'TXN-001', 'V2.4.1', 'REF#99' → stored as string, never coerced
 *   - cellType: 'a'   → force alphanumeric (e.g. '007' stays '007', not 7)
 *   - cellType: 'd'   → force date+timestamp with optional dateFormat
 *
 * @example
 * // String
 * updateCell({ filePath: FILE, columnHeader: 'Status', rowIndex: 0, value: 'PASS' });
 *
 * // Alphanumeric ID (auto-detected)
 * updateCell({ filePath: FILE, columnHeader: 'OrderID', rowIndex: 1, value: 'TXN-00456' });
 *
 * // Force alphanumeric (preserve leading zeros)
 * updateCell({ filePath: FILE, columnHeader: 'Code', rowIndex: 2, value: '007', cellType: 'a' });
 *
 * // Date only
 * updateCell({ filePath: FILE, columnHeader: 'StartDate', rowIndex: 0, value: '2024-06-15', dateFormat: 'yyyy-mm-dd' });
 *
 * // Date + timestamp via JS Date
 * updateCell({ filePath: FILE, columnHeader: 'CreatedAt', rowIndex: 0, value: new Date(), dateFormat: 'yyyy-mm-dd hh:mm:ss' });
 *
 * // Date + timestamp via ISO string
 * updateCell({ filePath: FILE, columnHeader: 'UpdatedAt', rowIndex: 1, value: '2024-06-15T10:30:00Z' });
 *
 * // Force date type with custom format
 * updateCell({ filePath: FILE, cellAddress: 'D5', value: new Date(), cellType: 'd', dateFormat: 'dd/mm/yyyy hh:mm' });
 */
export function updateCell(options: UpdateCellOptions): void {
  const { filePath, sheetName, columnHeader, rowIndex, cellAddress, value, cellType, dateFormat } = options;
  const resolved = path.resolve(filePath);
  const wb = XLSX.readFile(resolved, { cellDates: true, cellNF: true });
  const name = resolveSheetName(wb, sheetName);
  const sheet = wb.Sheets[name];

  if (cellAddress) {
    setCellValue(sheet, cellAddress.toUpperCase(), value, cellType, dateFormat);
  } else if (columnHeader !== undefined && rowIndex !== undefined) {
    const rows: CellValue[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    const headers = (rows[0] ?? []) as string[];
    const colIdx = findColumnIndex(headers, columnHeader);
    const addr = `${XLSX.utils.encode_col(colIdx)}${rowIndex + 2}`;
    setCellValue(sheet, addr, value, cellType, dateFormat);
  } else {
    throw new Error('Provide either (columnHeader + rowIndex) or cellAddress.');
  }

  XLSX.writeFile(wb, resolved);
  console.log(`Cell updated: ${resolved}`);
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Updates multiple cells in a single file save.
 * Each update supports value, cellType, and dateFormat independently.
 *
 * @example
 * updateCells(FILE, [
 *   { columnHeader: 'Status',    rowIndex: 0, value: 'PASS' },
 *   { columnHeader: 'OrderID',   rowIndex: 1, value: 'TXN-007', cellType: 'a' },
 *   { columnHeader: 'CreatedAt', rowIndex: 2, value: new Date(), cellType: 'd', dateFormat: 'yyyy-mm-dd hh:mm:ss' },
 *   { cellAddress: 'E6',         value: '2024-01-01T09:00:00Z' },
 * ], 'Results');
 */
export function updateCells(
  filePath: string,
  updates: Omit<UpdateCellOptions, 'filePath' | 'sheetName'>[],
  sheetName?: string
): void {
  const resolved = path.resolve(filePath);
  const wb = XLSX.readFile(resolved, { cellDates: true, cellNF: true });
  const name = resolveSheetName(wb, sheetName);
  const sheet = wb.Sheets[name];
  const rows: CellValue[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const headers = (rows[0] ?? []) as string[];

  for (const upd of updates) {
    if (upd.cellAddress) {
      setCellValue(sheet, upd.cellAddress.toUpperCase(), upd.value, upd.cellType, upd.dateFormat);
    } else if (upd.columnHeader !== undefined && upd.rowIndex !== undefined) {
      const colIdx = findColumnIndex(headers, upd.columnHeader);
      const addr = `${XLSX.utils.encode_col(colIdx)}${upd.rowIndex + 2}`;
      setCellValue(sheet, addr, upd.value, upd.cellType, upd.dateFormat);
    } else {
      throw new Error('Each update must have either (columnHeader + rowIndex) or cellAddress.');
    }
  }

  XLSX.writeFile(wb, resolved);
  console.log(` ${updates.length} cells updated: ${resolved}`);
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all rows where a column's value matches the given value (case-insensitive string match).
 *
 * @example
 * const failed   = findRowsByValue(FILE, 'Status', 'FAIL', 'Results');
 * const txnRows  = findRowsByValue(FILE, 'OrderID', 'TXN-007', 'Orders');
 */
export function findRowsByValue(
  filePath: string,
  columnHeader: string,
  matchValue: CellValue,
  sheetName?: string
): Record<string, CellValue>[] {
  const { rows } = readSheet(filePath, sheetName);
  return rows.filter(
    (row) =>
      row[columnHeader]?.toString().trim().toLowerCase() ===
      matchValue?.toString().trim().toLowerCase()
  );
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves a (columnHeader, rowIndex) pair to an Excel cell address like "C4".
 *
 * @example
 * const addr = getCellAddress(FILE, 'OrderID', 2, 'Orders');
 * // 'C4'
 */
export function getCellAddress(
  filePath: string,
  columnHeader: string,
  rowIndex: number,
  sheetName?: string
): string {
  const wb = loadWorkbook(filePath);
  const sheet = resolveSheet(wb, sheetName);
  const rows: CellValue[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const headers = (rows[0] ?? []) as string[];
  const colIdx = findColumnIndex(headers, columnHeader);
  return `${XLSX.utils.encode_col(colIdx)}${rowIndex + 2}`;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the total number of sheets in the workbook.
 *
 * @example
 * const count = getSheetCount('tests/data/testdata.xlsx');
 * // 3
 */
export function getSheetCount(filePath: string): number {
  const wb = loadWorkbook(filePath);
  return wb.SheetNames.length;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns detailed info for every sheet: index, name, header list, and row count.
 * Useful for logging, assertions, or building dynamic test loops.
 *
 * @example
 * const info = getAllSheetsInfo('tests/data/testdata.xlsx');
 * // [
 * //   { index: 0, name: 'Users',   rowCount: 10, headers: ['Username', 'Email', ...] },
 * //   { index: 1, name: 'Orders',  rowCount: 25, headers: ['OrderID', 'Amount', ...] },
 * //   { index: 2, name: 'Results', rowCount: 10, headers: ['Status', 'ExecutedAt', ...] },
 * // ]
 */
export function getAllSheetsInfo(filePath: string): SheetInfo[] {
  const wb = XLSX.readFile(path.resolve(filePath), { cellDates: true });
  return wb.SheetNames.map((name, index) => {
    const sheet = wb.Sheets[name];
    const rawRows: CellValue[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    const headers = (rawRows[0] ?? []) as string[];
    const dataRows = rawRows.slice(1).filter((r) => r.some((c) => c !== null && c !== ''));
    return { index, name, rowCount: dataRows.length, headers };
  });
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Internal factory — builds a bound ExcelSession for a given sheet name.
 */
function buildSession(filePath: string, activeSheetName: string): ExcelSession {
  const wb = XLSX.readFile(path.resolve(filePath), { cellDates: true });
  const allSheetNames = wb.SheetNames;
  const sheetIndex = allSheetNames.indexOf(activeSheetName);

  if (sheetIndex === -1) {
    throw new Error(
      `Sheet "${activeSheetName}" not found. Available: ${allSheetNames.join(', ')}`
    );
  }

  const session: ExcelSession = {
    filePath,
    sheetIndex,
    sheetName: activeSheetName,
    totalSheets: allSheetNames.length,
    allSheetNames,

    readCell: (opts) =>
      readCell({ ...opts, filePath, sheetName: activeSheetName }),

    readColumn: (columnHeader) =>
      readColumn(filePath, columnHeader, activeSheetName),

    readRow: (rowIndex) =>
      readRow(filePath, rowIndex, activeSheetName),

    readSheet: () =>
      readSheet(filePath, activeSheetName),

    getRowCount: () =>
      getRowCount(filePath, activeSheetName),

    updateCell: (opts) =>
      updateCell({ ...opts, filePath, sheetName: activeSheetName }),

    updateCells: (updates) =>
      updateCells(filePath, updates, activeSheetName),

    switchToSheetByIndex: (index) =>
      switchToSheetByIndex(filePath, index),

    switchToSheetByName: (name) =>
      switchToSheetByName(filePath, name),
  };

  return session;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Switches to a sheet by its 0-based index and returns a bound ExcelSession.
 * All methods on the session (readCell, readRow, updateCell, etc.) automatically
 * target the active sheet — no need to pass sheetName on every call.
 *
 * @param filePath   Path to the Excel file.
 * @param index      0-based sheet index (0 = first sheet, 1 = second, etc.).
 *
 * @example
 * const session = switchToSheetByIndex('tests/data/testdata.xlsx', 1);
 * console.log(session.sheetName);   // 'Orders'
 * console.log(session.sheetIndex);  // 1
 * console.log(session.totalSheets); // 3
 *
 * const row   = session.readRow(0);
 * const count = session.getRowCount();
 *
 * // Chain to a different sheet
 * const next  = session.switchToSheetByIndex(2);
 * console.log(next.sheetName);      // 'Results'
 */
export function switchToSheetByIndex(filePath: string, index: number): ExcelSession {
  const wb = XLSX.readFile(path.resolve(filePath), { cellDates: true });
  const total = wb.SheetNames.length;

  if (index < 0 || index >= total) {
    throw new Error(
      `Sheet index ${index} is out of range. Workbook has ${total} sheet(s) (indices 0–${total - 1}).`
    );
  }

  const sheetName = wb.SheetNames[index];
  console.log(` Switched to sheet [${index}]: "${sheetName}" (${total} total sheets)`);
  return buildSession(filePath, sheetName);
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Switches to a sheet by name and returns a bound ExcelSession.
 * Matching is case-insensitive. All session methods target this sheet automatically.
 *
 * @param filePath   Path to the Excel file.
 * @param name       Sheet name (case-insensitive).
 *
 * @example
 * const session = switchToSheetByName('tests/data/testdata.xlsx', 'orders');
 * console.log(session.sheetName);   // 'Orders'
 * console.log(session.sheetIndex);  // 1
 *
 * const orderId = session.readCell({ columnHeader: 'OrderID', rowIndex: 0 });
 * session.updateCell({ columnHeader: 'Status', rowIndex: 0, value: 'PASS' });
 *
 * // Jump to the next sheet
 * const next = session.switchToSheetByIndex(session.sheetIndex + 1);
 */
export function switchToSheetByName(filePath: string, name: string): ExcelSession {
  const wb = XLSX.readFile(path.resolve(filePath), { cellDates: true });
  const matched = wb.SheetNames.find(
    (s) => s.trim().toLowerCase() === name.trim().toLowerCase()
  );

  if (!matched) {
    throw new Error(
      `Sheet "${name}" not found. Available sheets: ${wb.SheetNames.join(', ')}`
    );
  }

  const index = wb.SheetNames.indexOf(matched);
  console.log(` Switched to sheet [${index}]: "${matched}" (${wb.SheetNames.length} total sheets)`);
  return buildSession(filePath, matched);
}

/**
 * Returns the value of a cell identified by file path, sheet index, row number,
 * and column number — all positional, no header names needed.
 *
 * @param filePath    Path to the Excel file.
 * @param sheetIndex  0-based sheet index  (0 = first sheet, 1 = second, …).
 * @param rowNumber   1-based row number   (1 = first row, matches Excel row numbers).
 * @param colNumber   1-based column number (1 = column A, 2 = column B, …).
 * @param withType    When true, returns a full CellResult with .value, .type, .formatted.
 *
 * Row / column numbering mirrors what you see in Excel:
 *   Row 1, Col 1  →  A1  (usually the header row)
 *   Row 2, Col 1  →  A2  (first data row)
 *   Row 2, Col 3  →  C2
 *
 * @example
 * // Raw value — sheet 0, Excel row 2, column A
 * const val = getCellByPosition('tests/data/testdata.xlsx', 0, 2, 1);
 * // → 'alice'
 *
 * // With type info — sheet 1, Excel row 3, column D
 * const result = getCellByPosition('tests/data/testdata.xlsx', 1, 3, 4, true);
 * // → { value: 'TXN-007', type: 'a', formatted: 'TXN-007' }
 *
 * // Date+timestamp — sheet 2, row 2, column E
 * const ts = getCellByPosition('tests/data/testdata.xlsx', 2, 2, 5, true);
 * // → { value: Date, type: 'd', formatted: '2024-06-15 10:30:00' }
 */
export function getCellByPosition(
  filePath: string,
  sheetIndex: number,
  rowNumber: number,
  colNumber: number,
  withType: boolean = false
): CellValue | CellResult {
  // ── Validate file ─────────────────────────────────────────────────────────
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Excel file not found: ${resolved}`);
  }

  const wb = XLSX.readFile(resolved, { cellDates: true, cellNF: true });

  // ── Validate sheet index ──────────────────────────────────────────────────
  const totalSheets = wb.SheetNames.length;
  if (sheetIndex < 0 || sheetIndex >= totalSheets) {
    throw new Error(
      `Sheet index ${sheetIndex} is out of range. ` +
      `Workbook has ${totalSheets} sheet(s) (indices 0–${totalSheets - 1}).`
    );
  }

  const sheetName = wb.SheetNames[sheetIndex];
  const sheet = wb.Sheets[sheetName];

  // ── Validate row / col numbers ────────────────────────────────────────────
  if (rowNumber < 1) {
    throw new Error(`rowNumber must be >= 1 (got ${rowNumber}). Row 1 = first Excel row.`);
  }
  if (colNumber < 1) {
    throw new Error(`colNumber must be >= 1 (got ${colNumber}). Column 1 = column A.`);
  }

  // ── Build cell address (e.g. colNumber=3, rowNumber=2 → "C2") ─────────────
  const colLetter = XLSX.utils.encode_col(colNumber - 1);   // encode_col is 0-based
  const cellAddr  = `${colLetter}${rowNumber}`;             // rowNumber is already 1-based

  const cell = sheet[cellAddr];

  console.log(
    `getCellByPosition → sheet[${sheetIndex}]:"${sheetName}" | ` +
    `row ${rowNumber}, col ${colNumber} (${cellAddr}) | ` +
    `value: ${cell?.v ?? '(empty)'}`
  );

  if (withType) {
    return resolveCellResult(cell);
  }

  if (!cell) return null;
  return cell.v instanceof Date ? cell.v : (cell.v ?? null);
}
/**
 * Returns a single row as a comma-separated string.
 * If rowIndex is 0, it returns the header row.
 * rowIndex 1 and above return data rows.
 */
export function getRowDataWithCommaSeperator(
  filePath: string,
  rowIndex: number, // 0 = Header, 1 = First Data Row
  sheetName?: string
): string {
  const wb = XLSX.readFile(path.resolve(filePath), { cellDates: true });
  const sheet = resolveSheet(wb, sheetName);
  
  // Convert sheet to 2D array: [[A1, B1], [A2, B2]]
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (!rows[rowIndex]) {
    throw new Error(
      `Row index ${rowIndex} is out of range. Total rows (including header): ${rows.length}`
    );
  }

  // Map row values to string and join with commas
  return rows[rowIndex].map(cell => String(cell).trim()).join(", ");
}