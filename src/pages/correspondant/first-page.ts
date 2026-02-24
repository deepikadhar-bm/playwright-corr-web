import { Page, Locator } from '@playwright/test';

/**
 * Page Object: first page
 * Elements: 1
 */
export class FirstPagePage {
  constructor(private page: Page) {}

  get Uploaded_File_Name(): Locator {
    return this.page.locator("//label[text()=\"Upload File\"]/..//div[contains(@class,\"text-truncate flex-grow-1\")]");
  }

}