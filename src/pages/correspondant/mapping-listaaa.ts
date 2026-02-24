import { Page, Locator } from '@playwright/test';

/**
 * Page Object: mapping listaaa
 * Elements: 1
 */
export class MappingListaaaPage {
  constructor(private page: Page) {}

  get Action_Clear_button(): Locator {
    return this.page.locator("(//i[contains(@class, 'fa-times-circle')])[1]");
  }

}