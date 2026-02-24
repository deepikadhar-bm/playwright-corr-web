import { Page, Locator } from '@playwright/test';

/**
 * Page Object: 15 - Active..
 * Elements: 7
 */
export class P15Active2Page {
  constructor(private page: Page) {}

  get Apply_Selected_Button(): Locator {
    return this.page.locator("//div[@id=\"multiSelectOptionsDropDown\"]//button[text()=\" Apply Selected \"]");
  }

  get Apply_Selected_Button_for_more_companies(): Locator {
    return this.page.locator("//button[@class=\"btn bg-transparent fs-xs text-white\"]");
  }

  get Bid_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"input-field-name text-truncate cursor-pointer\"]/../..//div)[1]");
  }

  get Company_Name_in_Customer_Permission(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\"]");
  }

  get Company_Name_in_default_value(): Locator {
    return this.page.locator("//span[contains(text(),\"$|Companyname|\")]");
  }

  get Select_Company_2(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'@|Company name 2|')]");
  }

  get SelectChaseValue(): Locator {
    return this.page.locator("(//label[text()=\"If Chase Field\"]/../../..//select[@class=\"form-select ng-untouched ng-pristine ng-valid\"])[1]");
  }

}