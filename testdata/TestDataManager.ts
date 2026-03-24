// testdata/TestDataManager.ts
import * as fs from 'fs';
import * as path from 'path';

export interface TestDataProfile {
  id: number;
  testDataName: string;
  data: Record<string, string>[] | null;
  columns: string[];
}

class TestDataManager {
  private profiles: TestDataProfile[] = [];
  private readonly filePath: string;
  constructor() {
    this.filePath = path.resolve(process.cwd(), 'testdata/test_data_profiles.json');
    try {
      // Adjust path if your JSON is in a different folder
      // const filePath = path.resolve(process.cwd(), 'testdata/test_data_profiles.json');
      if (fs.existsSync(this.filePath)) {
        const rawData = fs.readFileSync(this.filePath, 'utf-8');
        this.profiles = JSON.parse(rawData);
      }
    } catch (e) {
      console.error("TestDataManager: Could not load JSON file", e);
    }
  }

  public getProfileByName(name: string) {
    return this.profiles.find(p => p.testDataName === name);
  }

  public createRecord(profileName: string, row: string[]): Record<string, string> {
    const profile = this.getProfileByName(profileName);
    if (!profile) return {};

    const record: Record<string, string> = {};
    profile.columns.forEach((col, index) => {
      record[col] = row[index];
    });
    return record;
  }

  private saveToFile(): void {
    try {
      // Convert the current profiles array back into a JSON string
      // null, 2 adds indentation so the file stays readable
      const updatedJson = JSON.stringify(this.profiles, null, 2);
      fs.writeFileSync(this.filePath, updatedJson, 'utf-8');
      console.log("TestDataManager: Successfully saved changes to disk.");
    } catch (e) {
      console.error("TestDataManager: Failed to write to JSON file", e);
    }
  }
  /**
 * Updates the 'data' object of a profile and simulates saving.
 * @param profileName The name of the profile (e.g., 'CommitmentList')
 * @param updatedRecord A record containing the updated values for the profile's columns
 */
  public updateProfileData(profileName: string, updatedRecord: Record<string, string>): void {
    const profile = this.getProfileByName(profileName);

    if (!profile) {
      throw new Error(`TestDataManager: Profile '${profileName}' not found.`);
    }

    // 1. Initialize the array if it is null
    if (profile.data === null) {
      profile.data = [{}];
    }

    // 2. If array is empty, add an empty object to update
    if (profile.data.length === 0) {
      profile.data.push({});
    }

    // 3. Update the first record in the array (index 0)
    const firstRow = profile.data[0];

    profile.columns.forEach((col) => {
      if (updatedRecord[col] !== undefined) {
        // TypeScript now knows firstRow is a Record<string, string>
        firstRow[col] = updatedRecord[col];
        console.log(`Updated column '${col}' to value '${updatedRecord[col]}' in profile '${profileName}'`);
      }
    });

    console.log(`Successfully updated the first row of profile: ${profileName}`);
    this.saveToFile();
  }
  /**
 * Updates a specific row in a test data profile.
 *
 * Row mapping (1-based input → 0-based index):
 *   rowIndex 1 → data[0]  (first data row)
 *   rowIndex 2 → data[1]  (second data row)
 *   rowIndex 3 → data[2]  (third data row)
 *
 * @param profileName   - Name of the profile to update
 * @param updatedRecord - Key-value pairs to update. All keys must exist in profile.columns.
 * @param rowIndex      - 1-based row number. Accepts number, string, or vars string (e.g. vars['count']).
 *                        Required — throws if missing, null, blank or < 1.
 *
 * Usage:
 *   // vars['count'] starts at appconstants.ONE = '1' → writes to data[0]
 *   testDataManager.updateProfileData1('Store All Loans Tab...', { 'Corr Loan Num': vars['CorrLoan'] }, vars['count']);
 *
 *   // explicit number
 *   testDataManager.updateProfileData1('Store All Loans Tab...', { 'Corr Loan Num': vars['CorrLoan'] }, 1);
 */
public updatePartialProfileDataByDataIndex(
  profileName: string,
  updateRecord: Record<string, string>,
  rowIndex: string | number
): void {

  // Guard 1 — rowIndex must be provided and non-blank
  if (rowIndex === undefined || rowIndex === null || String(rowIndex).trim() === '') {
    throw new Error(
      `TestDataManager: rowIndex is required for profile '${profileName}'. ` +
      `Pass a row number or vars string (e.g. vars['count']). Row index starts at 1.`
    );
  }

  // Guard 2 — resolve rowIndex to integer (handles '1', '1.0', 1, 2.0 from MathematicalOperation)
  const resolvedRowNumber: number = typeof rowIndex === 'number'
    ? Math.floor(rowIndex)
    : Math.floor(parseFloat(String(rowIndex)));

  if (isNaN(resolvedRowNumber) || resolvedRowNumber < 1) {
    throw new Error(
      `TestDataManager: Invalid rowIndex '${rowIndex}' → resolved to '${resolvedRowNumber}' ` +
      `for profile '${profileName}'. Must be >= 1.`
    );
  }

  // Guard 3 — profile must exist
  const profile = this.getProfileByName(profileName);
  if (!profile) {
    throw new Error(`TestDataManager: Profile '${profileName}' not found.`);
  }

  // Guard 4 — all keys in updatedRecord must exist in profile.columns
  const invalidColumns = Object.keys(updateRecord).filter(
    (key) => !profile.columns.includes(key)
  );
  if (invalidColumns.length > 0) {
    throw new Error(
      `TestDataManager: The following column(s) do not exist in profile '${profileName}': ` +
      `[${invalidColumns.join(', ')}]. ` +
      `Valid columns are: [${profile.columns.join(', ')}]`
    );
  }

  // Ensure profile.data array exists
  if (profile.data === null || profile.data === undefined) {
    profile.data = [];
  }

  // Convert 1-based rowIndex to 0-based array index
  // rowIndex 1 → dataIndex 0, rowIndex 2 → dataIndex 1, etc.
  const dataIndex: number = resolvedRowNumber - 1;

  // Create the target row if it does not exist yet
  // Direct index assignment — never shifts existing rows or creates extra empty rows
  if (profile.data[dataIndex] === undefined || profile.data[dataIndex] === null) {
    profile.data[dataIndex] = {};
  }

  // Update only the provided columns in the target row
  const targetRow = profile.data[dataIndex];

  console.log(
    `[updateProfileData1] Profile: '${profileName}' | ` +
    `rowIndex param: ${rowIndex} | resolvedRowNumber: ${resolvedRowNumber} | dataIndex: ${dataIndex} | ` +
    `Current data length: ${profile.data.length}`
  );

  Object.keys(updateRecord).forEach((col) => {
    targetRow[col] = updateRecord[col];
    console.log(
      `  → Set data[${dataIndex}]['${col}'] = '${updateRecord[col]}'`
    );
  });

  console.log(`[updateProfileData1] Done. data[${dataIndex}] = ${JSON.stringify(targetRow)}`);
  this.saveToFile();
}
}

export const testDataManager = new TestDataManager();