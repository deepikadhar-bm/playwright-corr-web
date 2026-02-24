import { Page, Locator } from '@playwright/test';

/**
 * Page Object: 2-4 Unit Dropdown
 * Elements: 21
 */
export class P24UnitDropdownPage {
  constructor(private page: Page) {}

  get Chase_Value(): Locator {
    return this.page.locator("(//select[@class=\"form-select\" and @id=\"id\"])[last()]");
  }

  get Mapping_Creation_Wizard(): Locator {
    return this.page.locator("//div[@class='border-bottom p-3 pl-0 sticky-component-header'][contains(.,'Mapping Creation Wizard  - $|Create New Map| New Map  Header Mapping  Enumeration Mapping  Rules and Actions  Add Notes')]");
  }

  get Rule_Name(): Locator {
    return this.page.locator("//input[@placeholder=\"Enter a Rule Name\"]");
  }

  get When_Bid_Field(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[2]");
  }

  get _24_Unit_Dropdown(): Locator {
    return this.page.locator("(//div[text()=\"Property Type\"]/../..//select)[1]");
  }

  get Add_Actions(): Locator {
    return this.page.locator("//button[@type='button'][contains(.,'Add Action')]");
  }

  get Bid_Enumerated_Tape_Value(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"])[2]");
  }

  get Bid_Map_Name(): Locator {
    return this.page.locator("//div[contains(text(),\"$|Create New Map|\")]");
  }

  get Bid_Sample_Field_Name_in_Header_Mapping(): Locator {
    return this.page.locator("//i[@class=\"fas fa-pencil-alt\"]");
  }

  get ChaseValue(): Locator {
    return this.page.locator("(//*[text()=\"Chase Value\"]/..//select)[last()]");
  }

  get ChaseValues(): Locator {
    return this.page.locator("(//label[text()=\"If Bid Field\"]/../../..//select[@class=\"form-select ng-untouched ng-pristine ng-valid\"])[1]");
  }

  get Company_Count(): Locator {
    return this.page.locator("(//*[@class=\"more-clients custom-bg-primary text-white fs-xs border-0\"])[1]");
  }

  get Company_names(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"+55 more\"]]");
  }

  get First_Company_Name(): Locator {
    return this.page.locator("(//td[@data-title=\"Company\"])[21]");
  }

  get Header_Mapping_for_UnMapped(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout unidentified-header\"]");
  }

  get Header_Mapping(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout unidentified-header\"]/../..[$|DeleteHeaderMapping|]");
  }

  get Search_Fields_When_Bid_Field(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[5]");
  }

  get Second_Company_Name(): Locator {
    return this.page.locator("(//td[@data-title=\"Company\"])[22]");
  }

  get Select_Rules_Checkbox(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]");
  }

  get Value_for_chase(): Locator {
    return this.page.locator("//*[contains(text(),\"False\")]");
  }

  get When_Bid_Field_Name(): Locator {
    return this.page.locator("//span[@title=\"CLTV\"]");
  }

}