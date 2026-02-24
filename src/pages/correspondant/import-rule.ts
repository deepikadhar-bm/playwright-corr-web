import { Page, Locator } from '@playwright/test';

/**
 * Page Object: import rule
 * Elements: 27
 */
export class ImportRulePage {
  constructor(private page: Page) {}

  get Bid_Enumerated_Tape_Value_Selected_Option_From_Active_1st_Rule(): Locator {
    return this.page.locator("(//label[text()=' Bid Enumerated Tape Value '])[1]/..//button[@id=\"singleSelectDropDownWithSearch\"]");
  }

  get Bid_Enumerated_Tape_Value_Selected_Option_From_Active_2nd_Rule(): Locator {
    return this.page.locator("(//label[text()=' Bid Enumerated Tape Value '])[2]/..//button[@id=\"singleSelectDropDownWithSearch\"]");
  }

  get Bid_Enumerated_Tape_Value_Selected_Option_From_Draft_Rule(): Locator {
    return this.page.locator("(//label[text()=' Bid Enumerated Tape Value '])[3]/..//button[@id=\"singleSelectDropDownWithSearch\"]");
  }

  get Apply_Selected_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Apply Selected\"]");
  }

  get Apply_Selected_Count(): Locator {
    return this.page.locator("//span[text()='Apply Selected ']/span");
  }

  get Bid_Field_Selected_Option_From_Active_1st_Rule(): Locator {
    return this.page.locator("(//label[text()=' When Bid Field '])[1]/..//button[@id=\"singleSelectDropDownWithSearch\"]");
  }

  get Bid_Field_Selected_Option_From_Active_2nd_Rule(): Locator {
    return this.page.locator("(//label[text()=' When Bid Field '])[2]/..//button[@id=\"singleSelectDropDownWithSearch\"]");
  }

  get Bid_Field_Selected_Option_From_Draft_Rule(): Locator {
    return this.page.locator("(//label[text()=' When Bid Field '])[3]/..//button[@id=\"singleSelectDropDownWithSearch\"]");
  }

  get Chase_Field_Name_Selected_Option_From_Active_1st_Rule(): Locator {
    return this.page.locator("(//label[text()='Chase Field Name'])[1]/..//select[@id=\"id\"]");
  }

  get Chase_Field_Name_Selected_Option_From_Active_2nd_Rule(): Locator {
    return this.page.locator("(//label[text()='Chase Field Name'])[2]/..//select[@id=\"id\"]");
  }

  get Chase_Field_Name_Selected_Option_From_Draft_Rule(): Locator {
    return this.page.locator("(//label[text()='Chase Field Name'])[3]/..//select[@id=\"id\"]");
  }

  get Chase_Value_Selected_Option_From_Active_1st_Rule(): Locator {
    return this.page.locator("(//label[text()='Chase Value'])[1]/..//select[@id=\"id\"]");
  }

  get Chase_Value_Selected_Option_From_Active_2nd_Rule(): Locator {
    return this.page.locator("(//label[text()='Chase Value'])[2]/..//select[@id=\"id\"]");
  }

  get Chase_Value_Selected_Option_From_Draft_Rule(): Locator {
    return this.page.locator("(//label[text()='Chase Value'])[3]/..//select[@id=\"id\"]");
  }

  get Disabled_Apply_Selected_Button(): Locator {
    return this.page.locator("//span[text()='Apply Selected ']/../..//button[@disabled]");
  }

  get Draft_Rule_Multiselected_Value(): Locator {
    return this.page.locator("(//button[@id=\"multiSelectDropDown\"])[3]");
  }

  get Draft_Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[3]");
  }

  get First_Active_Rule_Checkbox(): Locator {
    return this.page.locator("//td[contains(text(),'$|First Active Rule Name|')]/..//input[@type=\"checkbox\"]");
  }

  get First_Active_Rule_Multiselected_Value(): Locator {
    return this.page.locator("(//button[@id=\"multiSelectDropDown\"])[1]");
  }

  get First_Active_Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[1]");
  }

  get Keyword_Related_Maps(): Locator {
    return this.page.locator("//span[@class=\"ngb-highlight\"]");
  }

  get No_Result_Message(): Locator {
    return this.page.locator("//td[text()=' No result ']");
  }

  get Searching(): Locator {
    return this.page.locator("//small[text()='searching...']");
  }

  get Second_Active_Rule_Checkbox(): Locator {
    return this.page.locator("(//td[contains(text(),'$|Second Active Rule Name|')]/..//input[@type=\"checkbox\"])[last()]");
  }

  get Second_Active_Rule_Multiselected_Value(): Locator {
    return this.page.locator("(//button[@id=\"multiSelectDropDown\"])[2]");
  }

  get Second_Active_Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]");
  }

  get Secondary_Search_Field(): Locator {
    return this.page.locator("//input[@id=\"secondary-search\"]");
  }

}