import { Page, Locator } from '@playwright/test';

/**
 * Page Object: You have unidentified fields do you want to proceed
 * Elements: 1
 */
export class YouHaveUnidentifiedFieldsDoYouWantToProceedPage {
  constructor(private page: Page) {}

  get You_have_unidentified_fields_do_you_want_to_proceed(): Locator {
    return this.page.locator("//p[text()[normalize-space() = \"You have unidentified fields do you want to proceed further.\"]]");
  }

}