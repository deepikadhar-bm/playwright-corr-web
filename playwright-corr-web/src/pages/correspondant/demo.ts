import { Page, Locator } from '@playwright/test';

/**
 * Page Object: demo
 * Elements: 8
 */
export class DemoPage {
  constructor(private page: Page) {}

  get demo_xpath_div(): Locator {
    return this.page.locator("(//div[not(@class=\"my-2\") and text()=\"Impound Type\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"mb-2\"]//*[@class=\"form-control p-0\" or @class=\"form-select\"])[1]");
  }

  get demo_xpath_sel(): Locator {
    return this.page.locator("//div[text()=\"Loan Type\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"field-pair col-3\"]//*[@title=\"\" or @title=\"[object Object]\"]");
  }

  get demo_xpath_select(): Locator {
    return this.page.locator("(//div[not(@class=\"my-2\") and text()=\"Impound Type\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"mb-2\"]//*[@class=\"form-control p-0\" or @class=\"form-select\"])[1]");
  }

  get demobhuh(): Locator {
    return this.page.locator("(//div[not(@class=\"my-2\") and text()=\"Loan Purpose\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"mb-2\"]//*[@class=\"form-control p-0\" or @class=\"form-select\"])");
  }

  get demoo(): Locator {
    return this.page.locator("(//div[@class=\"my-2\" and text()=\"Property Valuation Type\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")]");
  }

  get demopath1div(): Locator {
    return this.page.locator("//div[not(@class=\"my-2\") and text()=\"Loan Term\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"mb-2\"]//*[@class=\"form-control p-0\" or @class=\"form-select\"]");
  }

  get demopath2sel(): Locator {
    return this.page.locator("//div[not(@class=\"my-2\") and text()=\"Loan Purpose\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"mb-2\"]//*[@class=\"form-control p-0\" or @class=\"form-select\"]");
  }

  get tag_name(): Locator {
    return this.page.locator("((//div[@class=\"my-2\" and text()=\"Loan Term\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")])[1]");
  }

}