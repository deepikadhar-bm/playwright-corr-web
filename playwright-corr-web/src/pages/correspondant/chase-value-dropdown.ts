import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Chase Value Dropdown
 * Elements: 1
 */
export class ChaseValueDropdownPage {
  constructor(private page: Page) {}

  get Chase_Value_Dropdown(): Locator {
    return this.page.locator("//select[@class=\"form-select ng-pristine ng-valid ng-touched\"]");
  }

}