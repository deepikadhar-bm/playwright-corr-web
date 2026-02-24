import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Batch_In_Bulk_Batch_Timing
 * Elements: 10
 */
export class BatchinbulkbatchtimingPage {
  constructor(private page: Page) {}

  get All_Batch_time(): Locator {
    return this.page.locator("//div[contains(@class,\"card rounded-3\")]");
  }

  get Batch_1_bulk_bacthes(): Locator {
    return this.page.locator("//*[contains(@class,\"card-subtitle\") and contains(text(),\"Batch 1\")]/../..//*[@class=\"mb-0\"]");
  }

  get Batch_2Bulk_batches(): Locator {
    return this.page.locator("//*[contains(@class,\"card-subtitle\") and contains(text(),\"Batch 2\")]/../..//*[@class=\"mb-0\"]");
  }

  get Batch_Time_Last_Before(): Locator {
    return this.page.locator("(//div[@class=\"card-body\"])[last()-1]");
  }

  get Batch_In_Bulk_Batch_Timing(): Locator {
    return this.page.locator("(//div[@class=\"card-body\"])[last()]");
  }

  get Edit_Batch_ButtonLast_Before(): Locator {
    return this.page.locator("(//button[@aria-label=\"Edit Batch Time\"])[last()-1]");
  }

  get Extracted_Batch_Timing(): Locator {
    return this.page.locator("//div[@class=\"col\"]//div//h5");
  }

  get Extracted_Batch_Timing2(): Locator {
    return this.page.locator("(//div[@class=\"col\"]//div//h5)[$|count|]");
  }

  get Last_Before_Batch_Time(): Locator {
    return this.page.locator("(//h5[@class=\"mb-0\"])[position() = last()-1]");
  }

  get Time_Unit_Dropdown(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

}