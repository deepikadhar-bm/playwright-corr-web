import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Rules Action
 * Elements: 7
 */
export class RulesActionPage {
  constructor(private page: Page) {}

  get Data_In_Rule_value(): Locator {
    return this.page.locator("//input[@class=\"form-control\"]");
  }

  get Delete_last_Rule(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"Delete Rule\"]])[2]");
  }

  get Deleted_Action_Block(): Locator {
    return this.page.locator("(//div[@class=\"block\"])[2]");
  }

  get Rule_Name1(): Locator {
    return this.page.locator("//input[@class=\"form-control\"]");
  }

  get Select_Button_rules_and_actions(): Locator {
    return this.page.locator("//a[text()=\"Select\"]");
  }

  get Select_tag_New(): Locator {
    return this.page.locator("(//a[text()=\"Select\"])[2]");
  }

  get Storerulename(): Locator {
    return this.page.locator("(//input[@class=\"form-control\"])[$|count|]");
  }

}