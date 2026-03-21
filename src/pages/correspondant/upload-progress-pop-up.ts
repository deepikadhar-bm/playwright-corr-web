import { Page, Locator } from '@playwright/test';

/**
 * Page Object: upload progress pop up
 * Elements: 3
 */
export class UploadProgressPopUpPage {
  constructor(private page: Page) {}

  get All_Status_On_the_Upload_Progress_Pop_up(): Locator {
    return this.page.locator("//td[@data-title=\"Status\"]//span");
  }

  get Geo_Coding_Status_On_Pop_up(): Locator {
    return this.page.locator("//div[text()=\" Geo Coding \"]/../..//span");
  }

  Individual_Status_On_Popup(count: String): Locator {
  return this.page.locator(`(//td[@data-title='Status']//span)[${count}]`);
}
  

}