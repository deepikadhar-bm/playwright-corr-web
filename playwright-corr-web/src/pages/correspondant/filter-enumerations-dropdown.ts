import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Filter Enumerations Dropdown
 * Elements: 17
 */
export class FilterEnumerationsDropdownPage {
  constructor(private page: Page) {}

  get Bid_field_Searched_for(): Locator {
    return this.page.locator("//label[@class=\"dropdown-item d-flex\"]//*[@title=\"$|FirstBidField|\"]");
  }

  get Cancel_Search_Button(): Locator {
    return this.page.locator("//button[@class=\"search-cancel-btn btn\"]");
  }

  get Count_Of_BidFields_In_Dropdown(): Locator {
    return this.page.locator("(//*[@aria-label=\"Filter Enumeration Dropdown\"]//*[@class=\"dropdown-item d-flex\"]//input[@type=\"checkbox\"])");
  }

  get Count_of_Bids_Checkbox(): Locator {
    return this.page.locator("//*[@aria-label=\"Filter Enumeration Dropdown\"]//*[@class=\"dropdown-overflow\"]//input");
  }

  get Filter_Enumerations_Dropdown(): Locator {
    return this.page.locator("//button[@id='multiSelectDropDown']");
  }

  get Filtered_BidFields(): Locator {
    return this.page.locator("//div[contains(@class,\"mapping-card rounded-3\")]");
  }

  get First_BidField_Checkbox(): Locator {
    return this.page.locator("(//*[@aria-label=\"Filter Enumeration Dropdown\"]//*[@class=\"dropdown-item d-flex\"]//input[@type=\"checkbox\"])[1]");
  }

  get First_BidField_Checkbox_2(): Locator {
    return this.page.locator("(//*[@aria-label=\"Filter Enumeration Dropdown\"]//input[@type=\"checkbox\"])[2]");
  }

  get First_check_box_text(): Locator {
    return this.page.locator("(//*[@aria-label=\"Filter Enumeration Dropdown\"]//input[@type=\"checkbox\"])[2]/..//span");
  }

  get First_Checkbox_filter_enum(): Locator {
    return this.page.locator("(//*[@aria-label=\"Filter Enumeration Dropdown\"]//input[@type=\"checkbox\"])[2]");
  }

  get Individual_BidSampleChasename_In_Dropdown(): Locator {
    return this.page.locator("//div[@class=\"dropdown-overflow\"]//*[contains(text(),\"$|ChaseName|\")]");
  }

  get Search_Box(): Locator {
    return this.page.locator("//*[@aria-label=\"Filter Enumeration Dropdown\"]//input[@type=\"text\"]");
  }

  get Second_Bidfield_Checkbox_Text(): Locator {
    return this.page.locator("(//*[@aria-label=\"Filter Enumeration Dropdown\"]//input[@type=\"checkbox\"])[4]/..//span");
  }

  get Second_Checkbox_filter_enum(): Locator {
    return this.page.locator("(//*[@aria-label=\"Filter Enumeration Dropdown\"]//input[@type=\"checkbox\"])[4]");
  }

  get Selected_BidFields(): Locator {
    return this.page.locator("//div[@class=\"dropdown-overflow\"]//input");
  }

  get Show_ALL_Filter(): Locator {
    return this.page.locator("//div[@class=\"filter-sort\" and text()=\" Show All \"]");
  }

  get Show_Selected_Filter(): Locator {
    return this.page.locator("//div[@class=\"filter-sort\" and text()=\" Show Selected \"]");
  }

}