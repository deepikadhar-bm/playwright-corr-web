import { Page, Locator } from '@playwright/test';

/**
 * Page Object: action_Rule_Header
 * Elements: 34
 */
export class ActionruleheaderPage {
  constructor(private page: Page) {}

  get Action_Chase_Field_Name_1(): Locator {
    return this.page.locator("(//div[@class=\"row rules-actions\"]//div[@class=\"col-4\"]//select)[1]");
  }

  get Action_Chasename_1(): Locator {
    return this.page.locator("//div[@class=\"row rules-actions\"]//select");
  }

  get action_Rule_Header(): Locator {
    return this.page.locator("//i[text()[normalize-space() = \"act:\"]]");
  }

  get Add_Condition_Blocks(): Locator {
    return this.page.locator("//div[@class=\"block\"]");
  }

  get Bid_enum_search_field(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//input[@type=\"search\"])[1]");
  }

  get BidEnumTapeValue(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//button)[1]");
  }

  get BidFieldDropdown(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//button)[1]");
  }

  get BidFieldOption(): Locator {
    return this.page.locator("//*[@role=\"option\"]//*[contains(text(),\"$|BidFieldOption|\")]");
  }

  get Chase_Field_Name_1(): Locator {
    return this.page.locator("(//label[text()=\"Chase Field Name\"]/..//select)[1]");
  }

  get Chase_Value_Search_field(): Locator {
    return this.page.locator("(//label[text()=\"Chase Value\"]/..//input[@type=\"search\"])[1]");
  }

  get ChaseValueDropdown(): Locator {
    return this.page.locator("(//label[text()=\"Chase Value\"]/..//button)[1]//div");
  }

  get Duplicated_Bidfield_Search_Field(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//input[@type=\"search\"])[2]");
  }

  get Duplicated_BidField_Value(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//button//div[contains(@class,\"text-truncate\")])[2]");
  }

  get Duplicated_chase_value(): Locator {
    return this.page.locator("((//label[text()=\"Chase Value\"]/..//button)//div[contains(@class,\"text-truncate\")])[2]");
  }

  get Duplicated_enum_search_field(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//input[@type=\"search\"])[2]");
  }

  get Duplicated_Rule_Enum_Value(): Locator {
    return this.page.locator("((//label[text()=\" Bid Enumerated Tape Value \"]/..//button)//div)[4]");
  }

  get New_Bid_Sample_Field_Name_contains(): Locator {
    return this.page.locator("//div[contains(text(),\"$|CustomHeader|\")]/../..//select");
  }

  get Option_DTI(): Locator {
    return this.page.locator("(//option[text()=\" DTI \"])[1]");
  }

  get Rule_Actions(): Locator {
    return this.page.locator("//div[not(contains(@class,\"border-right\"))]//*[text()=\"Add Actions\"]/..//div[@class=\"row rules-actions\"]");
  }

  get Rule_Name_Field(): Locator {
    return this.page.locator("//input[@placeholder=\"Enter a Rule Name\"]");
  }

  get Rule_Name_Input_Field(): Locator {
    return this.page.locator("//input[@placeholder=\"Enter a Rule Name\"][1]");
  }

  get Rule_Name_Input_FieldDuplicated(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]");
  }

  get Rules_and_Actions_Heading(): Locator {
    return this.page.locator("//h1[text()=\" Rules and Actions / \"]");
  }

  get Second_Header_Checkbox(): Locator {
    return this.page.locator("(//fieldset//input[@type=\"checkbox\"])[2]");
  }

  get Select_Option(): Locator {
    return this.page.locator("(//button[@role=\"option\"]//*[@title=\"Select\"])[5]");
  }

  get Select_text(): Locator {
    return this.page.locator("//a[text()=\"Select\"]");
  }

  get Select_text_Bid_enum(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//a[text()=\"Select\"])[1]");
  }

  get Select_text_bid_field(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//a[text()=\"Select\"])[1]");
  }

  get Select_text_Chase_Value(): Locator {
    return this.page.locator("(//label[text()=\"Chase Value\"]/..//a[text()=\"Select\"])[1]");
  }

  get Select_text_Duplicated_Bid_field(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//a[text()=\"Select\"])");
  }

  get Select_text_Duplicated_Enum(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//a[text()=\"Select\"])");
  }

  get Selected_Bid_Enum_Value(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//button)[1]//div");
  }

  get SelectedBidFieldOption(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//button)[1]//div");
  }

  get When_Bid_Field_Search_field(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//input[@type=\"search\"])[1]");
  }

}