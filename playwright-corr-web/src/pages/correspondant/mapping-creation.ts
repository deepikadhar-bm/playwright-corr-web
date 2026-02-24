import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Mapping Creation
 * Elements: 3
 */
export class MappingCreationPage {
  constructor(private page: Page) {}

  get Execution_Type_Dropdown_Value(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]//option");
  }

  get Execution_Type_On_Mapping_Creation(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

  get Map_File_Name(): Locator {
    return this.page.locator("//span[@aria-live=\"polite\"]");
  }

}