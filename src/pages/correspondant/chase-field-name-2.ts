import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Chase Field Name
 * Elements: 5
 */
export class ChaseFieldName2Page {
  constructor(private page: Page) {}

  get Add_Actions_Chase_Field_Name(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[1]");
  }

  get Add_Chase_Field_Name_In_Duplicate_Rule_Action(): Locator {
    return this.page.locator("(//select[@id=\"id\"])[5]");
  }

  get Disabled_Filed_CountOf_Chase_Value(): Locator {
    return this.page.locator("//select[@class=\"form-select\"]");
  }

  get Duplicate_Chase_Field_Name(): Locator {
    return this.page.locator("(//select[@id=\"id\"])[6]");
  }

  get Duplicate_Chase_Field_Name1(): Locator {
    return this.page.locator("(//select[@title=\"$|duplicatechasefieldname|\"])[2]");
  }

}