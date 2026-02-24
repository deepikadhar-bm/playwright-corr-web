import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Chase Value
 * Elements: 4
 */
export class ChaseValuePage {
  constructor(private page: Page) {}

  get Add_Actions_Chase_Value(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[1]");
  }

  get Chase_Value_List(): Locator {
    return this.page.locator("//label[normalize-space(text())='Chase Value']//..//select");
  }

  get Chase_Values_In_Enumration_Page(): Locator {
    return this.page.locator("//div[@class=\"mb-2\"]//..//select[@class=\"form-select\"]");
  }

  get Stored_Chase_Value(): Locator {
    return this.page.locator("//label[normalize-space(text())='Chase Value']//..//select[@title=\"$|ChasevalueOnAddActions|\"]");
  }

}