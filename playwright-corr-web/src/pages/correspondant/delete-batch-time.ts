import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Delete Batch Time
 * Elements: 1
 */
export class DeleteBatchTimePage {
  constructor(private page: Page) {}

  get Delete_Batch_Time(): Locator {
    return this.page.locator("(//button[@aria-label=\"Delete Batch Time\"])[last()]");
  }

}