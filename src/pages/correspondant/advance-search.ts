import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Advance search
 * Elements: 12
 */
export class AdvanceSearchPage {
  constructor(private page: Page) {}

  get Below_Dropdown_Second_Company(): Locator {
    return this.page.locator("(//div[@role=\"listitem\"])[3]");
  }

  get New_Field_Chase_Dropdown(): Locator {
    return this.page.locator("((//input[@class=\"form-control rounded-0 border-0 border-bottom p-3 bg-light ng-untouched ng-pristine ng-valid\"]/../../../../../../../../../..//div[@class=\"mb-2\"])//select)[1]");
  }

  get BidMap2_Advance_Search(): Locator {
    return this.page.locator("(//td//button[text()=\" $|BidMapName2| \"])");
  }

  get BidMap3_Advance_Search(): Locator {
    return this.page.locator("(//td//button[text()=\" $|BidMapName3| \"])");
  }

  get Chase_Field_Input_box(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"actionsGroup\"]//label[text()=\"Chase value\"]/../..//*[@aria-label=\"LP Field Value\"]//input");
  }

  get Chase_Field_Select_list(): Locator {
    return this.page.locator("//label[text()=\"Chase value\"]/../..//*[@aria-label=\"LP Field Value\"]//select");
  }

  get Chase_Value_Input_box(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"rulesGroup\"]/following-sibling::div//*[@aria-label=\"LP Field Value\"]//input");
  }

  get Chase_Values_Select(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"rulesGroup\"]/following-sibling::div//*[@aria-label=\"LP Field Value\"]//select");
  }

  get Close_Advance_Search_Pop_up_Button(): Locator {
    return this.page.locator("//h2[text()=\"Advanced Search/Filter\"]/..//button");
  }

  get IF_Chase_Field(): Locator {
    return this.page.locator("//label[text()=\"Chase value\"]/../..//*[@aria-label=\"LP Field Type\"]//select");
  }

  get No_result_Text(): Locator {
    return this.page.locator("//tbody//td[text()=\" No result \"]");
  }

  get You_have_unidentified_fields_This_action_will_save_the_changes_abd_move_to_next_page(): Locator {
    return this.page.locator("//p[contains(normalize-space(),\"You have unidentified fields. This action will save the changes and Move to Next Page.\")]");
  }

}