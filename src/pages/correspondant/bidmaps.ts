import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bidmaps
 * Elements: 6
 */
export class BidmapsPage {
  constructor(private page: Page) {}

  get Action_SearchFilter_Value_Text(): Locator {
    return this.page.locator("(//*[@aria-label=\"Bid Map Search and Filter\"]//*[text()=\"Action\"]/../following-sibling::div//a)[1]");
  }

  get Required_Bid_Map_CheckBox(): Locator {
    return this.page.locator("//td[@data-title=\"Map Name\"]//button[contains(text(),\"$|UniqueBidMapName|\")]/../preceding-sibling::td//input[@type=\"checkbox\"]");
  }

  get RuleName_Search_Filter_ValueText(): Locator {
    return this.page.locator("(//*[@aria-label=\"Bid Map Search and Filter\"]//*[text()=\"Rule Name\"]/../following-sibling::div//a)[1]");
  }

  get RuleName_SearchFilter_KeyText(): Locator {
    return this.page.locator("(//*[@aria-label=\"Bid Map Search and Filter\"]//*[text()=\"Rule Name\"]/../following-sibling::div//i)[1]");
  }

  get Rules_Conditions_SearchFilter_Key_Text(): Locator {
    return this.page.locator("(//*[@aria-label=\"Bid Map Search and Filter\"]//*[text()=\"Rule Conditions\"]/../following-sibling::div//i)[1]");
  }

  get Rules_Conditions_SearchFilter_Value_Text(): Locator {
    return this.page.locator("(//*[@aria-label=\"Bid Map Search and Filter\"]//*[text()=\"Rule Conditions\"]/../following-sibling::div//a)[1]");
  }

}