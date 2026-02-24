import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal....................................................
 * Elements: 2
 */
export class CorrespondentPortal12Page {
  constructor(private page: Page) {}

  get CLM_Field_Name(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]");
  }

  get Delete_Button_in_Header_Mapping(): Locator {
    return this.page.locator("(//a[contains(@class, 'fa-trash-alt')])[last()]");
  }

}