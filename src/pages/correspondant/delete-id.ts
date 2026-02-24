import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Delete Id
 * Elements: 5
 */
export class DeleteIdPage {
  constructor(private page: Page) {}

  get Click_on_Show_All(): Locator {
    return this.page.locator("//a[text()='Show All']");
  }

  get Delete_Map(): Locator {
    return this.page.locator(" //button[normalize-space(text())='@|DeleteId|']//..//..//span[@class=\"fas fa-trash-alt text-danger\"]");
  }

  get Deleted_Id(): Locator {
    return this.page.locator("//button[contains(text(), 'Delete - ')]");
  }

  get Deleted_Map_Id_On_HomePage(): Locator {
    return this.page.locator(" //button[normalize-space(text())='@|DeleteId|']");
  }

  get Highlighted_Map_Name(): Locator {
    return this.page.locator("//span[@class=\"highlighted-text\"]");
  }

}