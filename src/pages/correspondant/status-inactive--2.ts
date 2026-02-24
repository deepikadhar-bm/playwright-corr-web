import { Page, Locator } from '@playwright/test';

/**
 * Page Object: "status": " INACTIVE ",....
 * Elements: 61
 */
export class StatusInactive2Page {
  constructor(private page: Page) {}

  get Below_Dropdown_Fourth_Company(): Locator {
    return this.page.locator("(//td[@data-title=\"Company\"])[5]");
  }

  get BidEnumeratedTapeValue_Block_2(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/../../../../../..//div[contains(@class,\"flex-grow-1 text-start\")])[8]");
  }

  get Chase_Value(): Locator {
    return this.page.locator("//select[contains(@title,'Variable rate')]");
  }

  get Import_Rule_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[6]");
  }

  get Active_Version(): Locator {
    return this.page.locator("(//td[@data-title=\"Version Number\"])[1]");
  }

  get Added_On(): Locator {
    return this.page.locator("(//h5[@class=\"modal-title fw-semibold\"]/../../..//td[@data-title=\"Added On\"])[4]");
  }

  get After_Operator1(): Locator {
    return this.page.locator("//label[text()=\" When Bid Field \"]/../..//select");
  }

  get AfterActionChaseFiedName1(): Locator {
    return this.page.locator("(//*[text()=\"Chase Field Name\"]/..//select)[1]");
  }

  get All_Available_Company_Count(): Locator {
    return this.page.locator("//div[@class=\"dropdown-overflow\"]/label");
  }

  get Apply_Seleted_Count_in_Import_Rule(): Locator {
    return this.page.locator("(//span[@class=\"counter bg-white text-primary mx-2 text-center fw-semibold small\"])[1]");
  }

  get Bid_Map_Name_in_list_Screen(): Locator {
    return this.page.locator("//div[contains(.,'$|Create New Map|')]");
  }

  get Bid_Tape_Value_Field_Added_in_Enumeration_Mapping(): Locator {
    return this.page.locator("//input[@type=\"text\" and contains(@class, 'input-field-edit')]");
  }

  get Bid_Map_In_List_Screen(): Locator {
    return this.page.locator("//button[contains(.,'$|Create New Map|')]");
  }

  get checkbox_in_Enumeration_Mapping(): Locator {
    return this.page.locator("(//input[@class=\"mapping-select mt-1\"])[1]");
  }

  get Cretaed_On(): Locator {
    return this.page.locator("(//td[@data-title=\"Created On\"])[21]");
  }

  get Custom_Header_Section(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout\"][contains(.,\"$|CustomHeader|\")]//select");
  }

  get Delete_Early_Config_Button_CurrentDateList(): Locator {
    return this.page.locator("(//td[@data-title='Date' and contains(text(), '$|CurrentDateList|')]/..//button[2])");
  }

  get Delete_Button_in_Enumeration_Mapping(): Locator {
    return this.page.locator("//div[@class=\"input-field-name text-truncate cursor-pointer\"]/following-sibling::button");
  }

  get Download_Map(): Locator {
    return this.page.locator("//h5[@class=\"modal-title fw-semibold\"]");
  }

  get Download_Map_Button(): Locator {
    return this.page.locator("(//button[@aria-label=\"Download Map\"])[1]");
  }

  get Draft_Rule_in_Draft_Mode(): Locator {
    return this.page.locator("//input[@placeholder=\"Enter a Rule Name\"]");
  }

  get Editing_Select_Header_Mapping(): Locator {
    return this.page.locator("(//select[contains(@aria-label,'Default dropdown selection')])[4]");
  }

  get Enum_Header_Show_All(): Locator {
    return this.page.locator("(//*[text()=\"Show All\"])[3]");
  }

  get Enumeration_Mapping_Fields(): Locator {
    return this.page.locator("//div[@class='my-2'][contains(.,'$|$|EnumField||')]");
  }

  get Error_Message_in_Hedaer_Mapping(): Locator {
    return this.page.locator("//div[@class='p-2'][contains(.,'You have selected to delete \"$|BidSampleFieldName|\" mapping. Do you want to proceed?')]\" mapping. Do you want to proceed?')]");
  }

  get File_Row_Bid_Request(): Locator {
    return this.page.locator("(//th[@aria-label=\"File Row\"]/../../..//div[@class=\"truncate\"])[$|Count|]");
  }

  get Import_Rule_dropdown(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"$|Create New Maps|\"]])[1]");
  }

  get Loan_Term_Dropdown(): Locator {
    return this.page.locator("//div[@class='flex-grow-1 text-start text-truncate'][contains(.,'360')]");
  }

  get Loan_Term_Search_TextField(): Locator {
    return this.page.locator("(//input[contains(@placeholder,'Search')])[2]");
  }

  get No_Data_Found(): Locator {
    return this.page.locator("//div[@class=\"center-wrapper\"]");
  }

  get Pricing_Return_Timing2(): Locator {
    return this.page.locator("((//option[text()=\"Select\"])[3]/..//option)[4]");
  }

  get Pricing_Return_Timing3(): Locator {
    return this.page.locator("((//option[text()=\"Select\"])[3]/..//option)[5]");
  }

  get Pricing_Return_Timing4(): Locator {
    return this.page.locator("((//option[text()=\"Select\"])[3]/..//option)[6]");
  }

  get Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]");
  }

  get Rule_Name_Show_All(): Locator {
    return this.page.locator("(//a[@class='show-all'][contains(.,'Show All')])[4]");
  }

  get Search_Fields(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[3]");
  }

  get Search_Field(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[2]");
  }

  get Search_Field_ImportRule(): Locator {
    return this.page.locator("//input[@id=\"secondary-search\"]");
  }

  get Search_Fields_When_bid_Field(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[6]");
  }

  get Search_Map(): Locator {
    return this.page.locator("//button[@class=\"dropdown-item\"]");
  }

  get Search_Map_EnumerationMapping(): Locator {
    return this.page.locator("//input[@id=\"typeahead-dropdown\"]");
  }

  get SearchFilter_Fields(): Locator {
    return this.page.locator("//input[@placeholder=\"Search/Filter\"]");
  }

  get See_All_Actions(): Locator {
    return this.page.locator("//input[@class=\"custom-control-input\"]");
  }

  get Select_Company_Names(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'@|Company Name.|')]");
  }

  get Select_Dropdown(): Locator {
    return this.page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]/preceding-sibling::div[contains(@class, 'd-flex')]//div[text()[normalize-space() = \"Select\"]]");
  }

  get Select_Required_Company_Name(): Locator {
    return this.page.locator("(//input[@class=\"mr-2 cursor-pointer\"])[2]");
  }

  get Select_Pricing_Batch_Dropdown(): Locator {
    return this.page.locator("//select[@class=\"form-select ng-pristine ng-invalid ng-touched\"] | //select[@class=\"form-select ng-untouched ng-pristine ng-invalid\"]");
  }

  get Selecting_the_more_company_value_in_List_Screen(): Locator {
    return this.page.locator("(//a[@class=\"more-clients custom-bg-primary text-white fs-xs\"])[1]");
  }

  get Selecting_Companies_From_Dropdown(): Locator {
    return this.page.locator("(//div[contains(@class,\"cursor-pointer\")]/../..//span)[2]");
  }

  get Show_All_for_Column_Header(): Locator {
    return this.page.locator("(//*[text()=\"Show All\"])[2]");
  }

  get Show_All(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"BidMap\"]]/following-sibling::a[text()[normalize-space() = \"Show All\"]]");
  }

  get Show_All_ColumnHeader_SearchField(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Column Header\"]]/following-sibling::a[text()[normalize-space() = \"Show All\"]]");
  }

  get showall(): Locator {
    return this.page.locator("//a[@class='show-all'][contains(.,'Show All')]");
  }

  get StandardFlow_OnEdit_Permissions_Popup(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[1]");
  }

  get Today_and_all_future_business_days_Radio_Button(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[2]");
  }

  get When_Bid_Field(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDown\"])[1]");
  }

  get When_Bid_Field_2(): Locator {
    return this.page.locator("//div[text()=\" FICO Score \"]");
  }

  get When_Bid_Field_Enumeration_Mapping(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"])[1]");
  }

  get When_Bid_Field_Rules_and_Actions(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"])[5]");
  }

  get When_BidEnumerated_TapeValue1(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[3]");
  }

  get When_BidField(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[6]");
  }

}