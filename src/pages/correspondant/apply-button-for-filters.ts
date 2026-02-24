import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Apply button for Filters
 * Elements: 5
 */
export class ApplyButtonForFiltersPage {
  constructor(private page: Page) {}

  get Apply_button_for_Filters(): Locator {
    return this.page.locator("//button[text()[normalize-space() ]= \"Apply Filters\"]");
  }

  get Bid_Enumerated_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[3]");
  }

  get Map_Name(): Locator {
    return this.page.locator("//td[@data-title=\"Map Name\"][contains(.,\"$|Create New Map|\")]");
  }

  get Search_Field_When_Bid_Field(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[4]");
  }

  get Select_Add_Actions(): Locator {
    return this.page.locator("(//div[@class=\"row rules-actions\"])[2]");
  }

}