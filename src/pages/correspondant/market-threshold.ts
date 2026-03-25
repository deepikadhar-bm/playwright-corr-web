import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Market threshold
 * Elements: 12
 */
export class MarketThresholdPage {
  constructor(private page: Page) {}

  get Delete_Unwanted_Record_Button(): Locator {
    return this.page.locator("//td[@data-title=\"Security Product\"]//div[not(contains(text(),\"FN30\"))]/../..//button[2]");
  }

  get Enter_product_code_Input(): Locator {
    return this.page.locator("//input[@type=\"text\"]");
  }

  Last_Max_ValueBPS(ExpectedProductCode:string): Locator {
    return this.page.locator(`//td[@data-title=\"Security Product\"]//div[contains(text(),\"${ExpectedProductCode}\")]/../..//td[@data-title=\"Max Value (BPS)\"]`);
  }

  get Min_Display_Valuemarket_thresholds(): Locator {
    return this.page.locator("//div[text()=\" FN30 \"]/../..//td[@data-title=\"Min Display Value\"]//div");
  }

  get Remove_selected_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Remove selected\"]]");
  }

  Required_Edit_Threshold_Button(ExpectedProductCode:string): Locator {
    return this.page.locator(`//td[@data-title=\"Security Product\"]//div[contains(text(),\"${ExpectedProductCode}\")]/../..//button[@aria-label=\"Edit Map\"]`);
  }

  Required_Market_Threshold_Checkbox(ExpectedProductCode:string): Locator {
    return this.page.locator(`//td[@data-title=\"Security Product\"]//div[contains(text(),\"${ExpectedProductCode}\")]/../..//input[@type=\"checkbox\"]`);
  }

  Required_Max_Display_Value(ExpectedProductCode:string): Locator {
    return this.page.locator(`//td[@data-title=\"Security Product\"]//div[contains(text(),\"${ExpectedProductCode}\")]/../..//td[@data-title=\"Max Display Value\"]`);
  }

  Required_Min_Display_Value(ExpectedProductCode:string): Locator {
    return this.page.locator(`//td[@data-title=\"Security Product\"]//div[contains(text(),\"${ExpectedProductCode}\")]/../..//td[@data-title=\"Min Display Value\"]`);
  }

  Required_Min_Value_BPS(ExpectedProductCode:string): Locator {
    return this.page.locator(`//td[@data-title=\"Security Product\"]//div[contains(text(),\"${ExpectedProductCode}\")]/../..//td[@data-title=\"Min Value (BPS)\"]`);
  }

  Required_Threshold_Delete_Button(ExpectedProductCode:string): Locator {
    return this.page.locator(`//td[@data-title=\"Security Product\"]//div[contains(text(),\"${ExpectedProductCode}\")]/../..//button[@aria-label=\"Delete Map\"]`);
  }

  get Unwanted_Market_Threshold_Record(): Locator {
    return this.page.locator("//td[@data-title=\"Security Product\"]//div[not(contains(text(),\"FN30\"))]");
  }

}