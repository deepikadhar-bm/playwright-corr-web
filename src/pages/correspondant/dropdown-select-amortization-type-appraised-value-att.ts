import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Dropdown: Select Amortization Type Appraised Value Att
 * Elements: 2
 */
export class DropdownSelectAmortizationTypeAppraisedValueAttPage {
  constructor(private page: Page) {}

  get Chase_Field_Name_Dropdown(): Locator {
    return this.page.locator("//option[@value=\"search.criteria.loanType\"]/..");
  }

  get Dropdown_Select_Amortization_Type_Appraised_Value_Att(): Locator {
    return this.page.locator("(//select[contains(@class, 'form-select')])[2]");
  }

}