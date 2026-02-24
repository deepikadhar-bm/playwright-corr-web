import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Rules and Actions
 * Elements: 41
 */
export class RulesAndActionsPage {
  constructor(private page: Page) {}

  get Bid_Enumerated_Tape_Value_Dropdown(): Locator {
    return this.page.locator("//label[text()=' Bid Enumerated Tape Value ']/..//button[@id=\"singleSelectDropDownWithSearch\"]");
  }

  get Action_Chase_Field_Name_2(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[2]");
  }

  get Action_Chase_Value_2(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[2]");
  }

  get Add_Actions_Chase_Value_Not_a_list(): Locator {
    return this.page.locator("//label[normalize-space(text())='Chase Value']/..//*[@class=\"form-control p-0\"]");
  }

  get Bid_Enumerated_Tape_Value_Dropdown_Red_Color(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"]/parent::div[@class=\"form-control p-0 danger\"])[2]");
  }

  get Category_In_Dropdown(): Locator {
    return this.page.locator("//input[contains(@aria-label,\"$|CategoryName|\")]");
  }

  get Chase_Field_Name_Dropdown_Red_Color(): Locator {
    return this.page.locator("//select[@id=\"id\" and @class=\"form-select danger\"]");
  }

  get Chase_Field_Name_Dropdwon(): Locator {
    return this.page.locator("//label[text()='Chase Field Name']/..//select[@aria-label=\"Default dropdown selection\"]");
  }

  get Chase_Value_Rules_Actions(): Locator {
    return this.page.locator("//label[text()=\"Chase Value\"]/..//div[@class=\"d-flex\"]//button//div");
  }

  get Chase_Value_Dropdown_Rules_Actions(): Locator {
    return this.page.locator("//label[text()=\"Chase Value\"]/..//div[@class=\"form-control p-0\"]");
  }

  get Chase_Value_Dropdown_Red_Color(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"]/parent::div[contains(@class,\"form-control p-0 danger\")])[last()]");
  }

  get Common_Action_Chase_Field_Name(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[$|count|]");
  }

  get Common_Action_Chase_Value(): Locator {
    return this.page.locator("(//div[@class=\"row rules-actions\"]//label[text()=\"Chase Value\"]/..//select)[$|count|]");
  }

  get Common_Bid_Field_Rule(): Locator {
    return this.page.locator("(//div[@class=\"rules-conditions\"]//label[text()=\" When Bid Field \"]/..//div[@class=\"flex-grow-1 text-start text-truncate\"])[$|count|]");
  }

  get Common_Bid_Tape_Rule(): Locator {
    return this.page.locator("(//div[@class=\"rules-conditions\"]//label[text()=\" Bid Enumerated Tape Value \"]/..//div[@class=\"flex-grow-1 text-start text-truncate\"])[$|count|]");
  }

  get Common_Rule_Name_Field(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[$|count|]");
  }

  get Common_Select_Category_Dropdown(): Locator {
    return this.page.locator("(//div[text()=\" Select Category \"])[$|count|]");
  }

  get Delete_Rule_Button_1(): Locator {
    return this.page.locator("(//*[text()[normalize-space() = \"Delete Rule\"]]/..)[1]");
  }

  get Disable_Count_On_Rules_and_Actions(): Locator {
    return this.page.locator("//div[@class=\"form-control p-0\"]/..");
  }

  get Disabled_Dropdown_Value(): Locator {
    return this.page.locator("(//div[@class=\"form-control p-0\"]/..)[$|count|]");
  }

  get Duplicated_Block(): Locator {
    return this.page.locator("(//div[@class=\"block\"])[2]");
  }

  get Edited_Category_rules_and_actions(): Locator {
    return this.page.locator("(//input[contains(@aria-label,\"$|EditedCategory|\")])");
  }

  get Edited_Category_In_Dropdown(): Locator {
    return this.page.locator("(//input[contains(@aria-label,\"$|EditedCategory|\")])[$|count1|]");
  }

  get First_Operation_Dropdown(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select = != > < >= <= contains\")])[1]");
  }

  get First_Rule_Name_Field(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[1]");
  }

  get First_Select_Category_box_text(): Locator {
    return this.page.locator("(//button[@id=\"multiSelectDropDown\"]//div)[1]");
  }

  get Income_Option(): Locator {
    return this.page.locator("//span[@title=\"Income (Monthly)\"]");
  }

  get income_Value_From_UI(): Locator {
    return this.page.locator("//label[text()=' Bid Enumerated Tape Value ']/..//button[@id=\"singleSelectDropDownWithSearch\"]/../../..//span[@class=\"pl-2\" and not(@title=\"Select\")]");
  }

  get Last_Delete_Rule_Button(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"Delete Rule\"]])[last()]");
  }

  get Operation_Dropdown(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]");
  }

  get Operations_Dropdown_Duplicated(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select = != > < >= <= contains\")])[2]");
  }

  get Rule_Input_Box(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[1]");
  }

  get Rule_name_input_field_3(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[3]");
  }

  get Search_Input_under_When_Bid_Field(): Locator {
    return this.page.locator("//input[@aria-label=\"Search options\"]");
  }

  get Second_Category_Checkbox(): Locator {
    return this.page.locator("((//div[@class=\"cursor-pointer py-3 text-wrap\"])/..//input)[3]");
  }

  get Second_Category_In_Dropdown(): Locator {
    return this.page.locator("(//div[@class=\"cursor-pointer py-3 text-wrap\"])[3]");
  }

  get Select_Category_DropdownDuplicated(): Locator {
    return this.page.locator("(//button[@id=\"multiSelectDropDown\"])[2]");
  }

  get Select_Category_DropdownNew(): Locator {
    return this.page.locator("(//button[@id=\"multiSelectDropDown\"])[$|count|]");
  }

  get Select_tagRules_and_Actions(): Locator {
    return this.page.locator("//a[text()=\"Select\"]");
  }

  get Value_For_ChaseActions(): Locator {
    return this.page.locator("//*[contains(text(),\"True\")]");
  }

  get When_Bid_Field_Search_Input(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[1]");
  }

}