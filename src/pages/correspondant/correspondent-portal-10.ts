import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal......
 * Elements: 4
 */
export class CorrespondentPortal10Page {
  constructor(private page: Page) {}

  get Chase_Values_for_the_Rules(): Locator {
    return this.page.locator("//label[text()=\"If Bid Field\"]/../../../..//input");
  }

  get Checkbox_in_the_Header_Mapping(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[3]");
  }

  get MapName_Title(): Locator {
    return this.page.locator("(//button[@class=\"text-primary pointer border-0 bg-transparent\"])[1]");
  }

  get Select_Date_Range_Dropdown(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Select Date Range\"]]");
  }

}