import { Page, Locator } from '@playwright/test';

/**
 * Page Object: VIf3t Mo1f4 In8XI - A4841 Dropdown
 * Elements: 1
 */
export class Vif3tMo1f4In8xiA4841DropdownPage {
  constructor(private page: Page) {}

  get VIf3t_Mo1f4_In8XI_A4841_Dropdown(): Locator {
    return this.page.locator("//input[@id=\"chkItem67cb477dd4856740c2565edfundefined\"]");
  }

}