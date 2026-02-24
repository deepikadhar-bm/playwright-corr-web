import { Page, Locator } from '@playwright/test';

/**
 * Page Object: mapping list
 * Elements: 10
 */
export class MappingListPage {
  constructor(private page: Page) {}

  get All_BidMaps_List(): Locator {
    return this.page.locator("//div[@aria-label=\"Pagination Controls\"]//span[text()=\"Showing Page\"]");
  }

  get Bid_Map_Name_New(): Locator {
    return this.page.locator("//h5[contains(text(),\"$|Create New Map|\")]");
  }

  get Bid_Maps(): Locator {
    return this.page.locator("//tbody//tr");
  }

  get BidMap1_Advanced_Search(): Locator {
    return this.page.locator("(//td//button[text()=\" $|BidMapName1| \"])");
  }

  get checkbox_Element(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[$|count|]");
  }

  get Condition_Clear_Button(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"con\")]");
  }

  get Export_Selected_Button(): Locator {
    return this.page.locator("//button[text()=\" Export Selected \"]");
  }

  get Second_Bid_Map(): Locator {
    return this.page.locator("//tbody//tr[2]");
  }

  get Total_Bid_Maps(): Locator {
    return this.page.locator("//tbody//tr");
  }

  get Total_Rows_Count(): Locator {
    return this.page.locator("(//tbody//tr)[position() >= 1 and position() <= last()]");
  }

}