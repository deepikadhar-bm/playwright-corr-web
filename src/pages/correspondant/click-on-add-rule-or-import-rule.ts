import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Click on Add Rule Or Import Rule...
 * Elements: 2
 */
export class ClickOnAddRuleOrImportRulePage {
  constructor(private page: Page) {}

  get Click_on_Add_Rule_Or_Import_Rule(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Click on Add Rule Or Import Rule...\"]]");
  }

  get Select_Category_Dropdwon(): Locator {
    return this.page.locator("(//button[@id=\"multiSelectDropDown\"])[1]");
  }

}