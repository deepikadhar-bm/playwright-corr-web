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
}

export const testDataManager = new TestDataManager();