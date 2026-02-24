import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal................
 * Elements: 8
 */
export class CorrespondentPortal9Page {
  constructor(private page: Page) {}

  get BidUploadDate(): Locator {
    return this.page.locator("//div[@class='col-6'][contains(.,'$|Bid Upload Date|')]");
  }

  get Chase_Value_Dropdowns(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select False True\")]");
  }

  get Chase_Only_Batch(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]");
  }

  get Custome_Header(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//input[contains(@class, 'form-control')]");
  }

  get Search_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Search\"]");
  }

  get Select_Category(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[2]");
  }

  get Select_Dropdown_for_Chase_Values(): Locator {
    return this.page.locator("(//select[contains(@class, 'form-select')])[2]");
  }

  get Select_Select_Dropdown_in_Enumeration_Mapping(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Select\"]]");
  }

}