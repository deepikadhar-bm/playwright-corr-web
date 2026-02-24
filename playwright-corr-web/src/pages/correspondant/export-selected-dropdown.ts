import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Export Selected Dropdown
 * Elements: 1
 */
export class ExportSelectedDropdownPage {
  constructor(private page: Page) {}

  get Export_Selected_Dropdown(): Locator {
    return this.page.locator("//button[@id='exportdropdownMenuButton']");
  }

}