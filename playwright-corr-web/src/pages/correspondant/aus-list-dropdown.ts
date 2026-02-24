import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Aus List Dropdown
 * Elements: 4
 */
export class AusListDropdownPage {
  constructor(private page: Page) {}

  get Aus_List_Dropdown(): Locator {
    return this.page.locator("//select[@title=\"Aus List\"]");
  }

  get Chase_Field_Names(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]");
  }

  get Disabled_Select_Dropdown(): Locator {
    return this.page.locator("(//select[@id='id'])[$|Indexcount|]");
  }

  get Execution_Type_Dropdown(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

}