import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bid maps
 * Elements: 7
 */
export class BidMapsPage {
  constructor(private page: Page) {}

  get Advanced_Search_Bid_maps_Delete_Button_1(): Locator {
    return this.page.locator("//tbody//td[@data-title=\"Map Name\"]//*[contains(text(),\"TS_AdvanceSearch\")]/../..//button[@aria-label=\"Delete Map\"]");
  }

  get BidMap_Search_and_Filter_MapName_Text(): Locator {
    return this.page.locator("(//*[@aria-label=\"Bid Map Search and Filter\"]//*[text()=\"BidMap\"]/../following-sibling::div//a)[1]");
  }

  get Column_Header_Textsearch_popup(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Column Header\"]]");
  }

  get Edited_Chase_Value_After_Save_new(): Locator {
    return this.page.locator("(//button[text()=\" Add Field \"]/../div[text()=\"$|EditedChaseFieldName|\"]/../..//select)[2]");
  }

  get Enum_SearchFIlter_Text(): Locator {
    return this.page.locator("(//*[@aria-label=\"Bid Map Search and Filter\"]//*[text()=\"Enum\"]/../following-sibling::div//a)[1]");
  }

  get Rules_and_Conditions_In_Search_field(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Rule Conditions\"]]");
  }

  get Show_All_RuleCodition_SearchField(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Rule Conditions\"]]/following-sibling::a[text()[normalize-space() = \"Show All\"]]");
  }

}