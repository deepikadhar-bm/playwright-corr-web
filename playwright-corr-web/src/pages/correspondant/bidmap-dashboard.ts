import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bidmap dashboard
 * Elements: 4
 */
export class BidmapDashboardPage {
  constructor(private page: Page) {}

  get Clone_Button_of_BidMap(): Locator {
    return this.page.locator("//button[contains(text(),\"$|BidMapName|\")]/../..//button[@aria-label=\"Clone Map\"]");
  }

  get Created_Bid_Map_In_the_List(): Locator {
    return this.page.locator("//td[@data-title=\"Map Name\"]//button[text()=\" $|CreatedBidMap| \"]");
  }

  get IF_Bid_Field_Dropdownnew(): Locator {
    return this.page.locator("//label[text()=\"If Bid Field\"]/../..//select/ancestor::div//*[@aria-label=\"Bid Map Field\"]//select");
  }

  get Operations_Dropdown_Advance_Search(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"rulesGroup\"]/following-sibling::div//*[@aria-label=\"Operator\"]//select");
  }

}