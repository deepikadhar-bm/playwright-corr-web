import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Chase field
 * Elements: 4
 */
export class ChaseFieldPage {
  constructor(private page: Page) {}

  get Chase_Values_Field(): Locator {
    return this.page.locator("(//div[@class=\"mb-2\"]//..//select[@class=\"form-select\"])[$|count|]");
  }

  get Disabled_Chase_Filed_Value(): Locator {
    return this.page.locator("(//select[@class=\"form-select\"])[$|count|]");
  }

  get Enumeration_Chase_Filed(): Locator {
    return this.page.locator("(//*[text()=\"Chase Field\"]/../..//div[@class=\"my-2\"])[$|Number|]");
  }

  get Verification_of_Bid_sample_Field(): Locator {
    return this.page.locator("(//div[contains(text(),\"$|ChaseField|\")]/../../..//div[contains(text(),\"$|BidsampleFiedNameEnum|\")])[1]");
  }

}