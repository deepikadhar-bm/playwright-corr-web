import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Map Name
 * Elements: 5
 */
export class MapNamePage {
  constructor(private page: Page) {}

  get Active_Map_Name(): Locator {
    return this.page.locator("//button[normalize-space(text())='$|Create New Map|']//..//..//span[text()='ACTIVE']");
  }

  get Added_On(): Locator {
    return this.page.locator("(//td[@data-title=\"Added On\"])[1]");
  }

  get Map_Name(): Locator {
    return this.page.locator("//td[@data-title=\"Map Name\"]");
  }

  get Map_Name1(): Locator {
    return this.page.locator("(//td[@data-title=\"Map Name\"])[1]");
  }

  get Map_Name_2(): Locator {
    return this.page.locator("//h5[contains(.,'$|Create New Map|')]");
  }

}