import { Page, Locator } from '@playwright/test';

/**
 * Page Object: 'Chase Field Name
 * Elements: 83
 */
export class ChaseFieldNamePage {
  constructor(private page: Page) {}

  get Added_On(): Locator {
    return this.page.locator("(//h5[@class=\"modal-title fw-semibold\"]/../../..//td[@data-title=\"Added On\"])[2]");
  }

  get Bid_Mapping_ID_Dropdown(): Locator {
    return this.page.locator("//button//div[text()=' @|BidMappingID| ']");
  }

  get Company_Names_In_DropdownBidRequest(): Locator {
    return this.page.locator("//div[contains(@class,\"cursor-pointer py\")]/../../..//span");
  }

  get _872E288C12E7(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqID|\")]");
  }

  get ActionChaseValueNameNew1(): Locator {
    return this.page.locator("(//label[text()=\"Chase Value\"]/.././/select/..//option)[3]");
  }

  get Add_to_Commit_Buttonpaste_loan_popup(): Locator {
    return this.page.locator("//button[@aria-label=\"Add loans to commit\"]");
  }

  get Added_On_2(): Locator {
    return this.page.locator("(//h5[@class=\"modal-title fw-semibold\"]/../../..//td[@data-title=\"Added On\"])[3]");
  }

  get After_entering_Company_name_is_displayed(): Locator {
    return this.page.locator("//span[contains(text(),\"$|Companyname|\")]");
  }

  get All_Companies_DropdownDash_Board(): Locator {
    return this.page.locator("//button[@id='multiSelectDropDown']");
  }

  get All_Delete_button_for_Bid_Mapping(): Locator {
    return this.page.locator("//button[@aria-label=\"Delete Map\"]");
  }

  get All_the_option_for_Pricing_Return_Time(): Locator {
    return this.page.locator("//*[text()=\"Pricing Return Time \"]/..//option[@value and @aria-disabled]");
  }

  get Apply_Selected_Button_for_Category(): Locator {
    return this.page.locator("//*[contains(text(),\" Apply Selected\")]");
  }

  get Attachment_Type_In_EnumerationMapping(): Locator {
    return this.page.locator("(//div[text()=\"Attachment Type\"]/../..//select[@id=\"id\"])[1]");
  }

  get BeforeOperator1(): Locator {
    return this.page.locator("//label[text()=\" When Bid Field \"]/../..//select");
  }

  get Bid_Enumerated_Tape_Value_for_Three_Row(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/../../../../../..//div[contains(@class,\"flex-grow-1 text-start\")])[6]");
  }

  get Bid_EnumeratedTapeField_Block_2(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/../../../../../..//div[contains(@class,\"flex-grow-1 text-start\")])[8]");
  }

  get Bid_Mapping_IdSearch_Input_box_New(): Locator {
    return this.page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]");
  }

  get Bid_Sample_Field_Name_Connected_with_Chase_Value(): Locator {
    return this.page.locator("(//div[@class=\"col-2\"]/../../..//select)[$|count|]");
  }

  get Bid_Map_Name(): Locator {
    return this.page.locator("//span[contains(.,' $|Create New Maps|')]");
  }

  get Bid_Mapping_ID_Dropdown_1(): Locator {
    return this.page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]");
  }

  get Bid_Tape_Value(): Locator {
    return this.page.locator("(//div[contains(@class,\"input-field-name text\")])[1]");
  }

  get BidEnumeratedTapeValueField_1(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//div[contains(@class,\"flex-grow-1 text-start\")])[1]");
  }

  get Chase_Field_Name_common_one_Field(): Locator {
    return this.page.locator("(//div[@class=\"my-2\"])[$|count1|]");
  }

  get Chase_Field_Name_for_Add_action(): Locator {
    return this.page.locator("((//*[text()=\"Chase Field Name\"]/..//select)[1]/../..//option)[17]");
  }

  get Chase_field_Name_New_one(): Locator {
    return this.page.locator("(//label[text()=\"Chase Field Name\"]/.././/select/..//option)[5]");
  }

  get Chase_Field_NameMapping_Creation(): Locator {
    return this.page.locator("//div[text()=\"Select\"]/following-sibling::div[text()=\"Bid Sample Field Name\"]/following-sibling::div[1]");
  }

  get chase_value_search_field(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[3]");
  }

  get ChaseValues_In_AddActions(): Locator {
    return this.page.locator("(//*[text()=\" Add Action \"]/..//select)[8]");
  }

  get Check_the_Loan_Num_1(): Locator {
    return this.page.locator("(//td[@role=\"cell\"]/..//input[@type=\"checkbox\"])[1]");
  }

  get Checking_Checkbox_In_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[text()=\"Select\"]/../../descendant::input[@type=\"checkbox\"])[2]");
  }

  get Checking_Checkbox_In_EnumerationMapping(): Locator {
    return this.page.locator("(//div[text()=\"Select\"]/../../descendant::input[@type=\"checkbox\"])[1]");
  }

  get CommitCutOffTime(): Locator {
    return this.page.locator("//input[@id='commitCreationCutOffTime']");
  }

  get Company_name_for_Select_Companys(): Locator {
    return this.page.locator("//span[contains(text(),\"$|Companyname|\")]/../..//input[@type=\"checkbox\"]");
  }

  get Cross_Button_in_Select_companys(): Locator {
    return this.page.locator("(//i[contains(@class , 'fas fa-times-circle text-primary')])[2]/..");
  }

  get Delete_In_EnumerationMapping(): Locator {
    return this.page.locator("(//div[contains(@class,\"input-field-name text\")]/..//button[@type=\"button\"])[1]");
  }

  get Duplicate_Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[last()]");
  }

  get EnabledPricing_Return_Timing(): Locator {
    return this.page.locator("//*[@aria-disabled=\"false\"]");
  }

  get Enabling_Pricing_Return_Time(): Locator {
    return this.page.locator("(//option[contains(text(),\"$|BulkBatchTiming|\")])[last()]");
  }

  get Export_Selected(): Locator {
    return this.page.locator("//button[@type=\"button\" and text()=\" Export Selected \"]");
  }

  get Export_List(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Export List\"]]");
  }

  get Failed_To_CreateBatchTiming(): Locator {
    return this.page.locator("//div[@class=\"p-2\"]");
  }

  get File_Row(): Locator {
    return this.page.locator("//div[@class=\"truncate\"]");
  }

  get First_Time_HomeBuyer_EnumerationMapping(): Locator {
    return this.page.locator("(//div[text()=\"First Time Home Buyer\"]/../..//select[@id=\"id\"])[1]");
  }

  get Header_2(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//div[@class=\"flex-grow-1\" and text()=\"$|SecondHeaderName|\"])[1]/..//input");
  }

  get Individual_Company_in_Customer_permission(): Locator {
    return this.page.locator("(//div[@class='d-flex align-items-end'][contains(.,'Company Name')]/../../../..//td[@data-title=\"Company Name\"])[$|count|]");
  }

  get Ineligible_Category(): Locator {
    return this.page.locator("(//span[text()=\"Ineligible\"]/../..//input[@type=\"checkbox\"])[1]");
  }

  get Last_batch_Timebulk_batch_screen(): Locator {
    return this.page.locator("(//h5[@class=\"mb-0\"])[last()]");
  }

  get Mapped_Bid_Tape_Value2(): Locator {
    return this.page.locator("//div[@class=\"col-2\"]//div[text()=\"$|BidName|\"]/../..//div[contains(@class,\"text-truncate\")]");
  }

  get Mapped_Chase_Value_2(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\" and text()=\"@|Bid Sample Field Name|\"]/..//select");
  }

  get New_Chase_value(): Locator {
    return this.page.locator("(//div[contains(@class,'border-bottom') and contains(.,'AmortizationTerm')])[1]/following-sibling::div[1]\n");
  }

  get Not_Committed_Loans_Count(): Locator {
    return this.page.locator("//*[contains(@aria-label,\"Select loan\")]");
  }

  get Ok_Button_Bid_Request(): Locator {
    return this.page.locator("//button[@class=\"btn bg-transparent border-0 m-0\"]");
  }

  get Operation_Dropdowns(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]");
  }

  get Operator_3(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/../../../..//select)[3]");
  }

  get Option_in_PricingReturn_Dropdown(): Locator {
    return this.page.locator("//option[contains(text(),\"$|BatchTime|\")]");
  }

  get Product_Category(): Locator {
    return this.page.locator("(//span[text()=\"Products\"]/../..//input[@type=\"checkbox\"])");
  }

  get Propertry_Type(): Locator {
    return this.page.locator("//option[@value=\"UnitDwelling_2_4\"]/..");
  }

  get Rule_Name_ImportRule_SearchMap(): Locator {
    return this.page.locator("(//td[@data-title=\"Rule Name\"])[1]");
  }

  get Save_Draft(): Locator {
    return this.page.locator("//span[text()=\"Save Draft\"]");
  }

  get Search_Input_under_When_Bid_Field_for_Add_or_block(): Locator {
    return this.page.locator("(//input[@aria-label=\"Search options\"])[7]");
  }

  get Search_Input_under_When_Bid_Field_for_four_row(): Locator {
    return this.page.locator("(//input[@aria-label=\"Search options\"])[5]");
  }

  get Search_Tape_Field(): Locator {
    return this.page.locator("(//input[@placeholder=\"Search\"])[3]");
  }

  get Second_Company_Checkbox(): Locator {
    return this.page.locator("(//input[contains(@class,\"mr-2 cursor\") and @type=\"checkbox\"])[3]");
  }

  get Select_all_for_Checkbox(): Locator {
    return this.page.locator("//input[@aria-label=\"Select all for \"]");
  }

  get Select_Companys_Dropdown(): Locator {
    return this.page.locator("//button[@id=\"multiSelectDropDown\"]");
  }

  get Selecting_first_company_in_the_Dropdown(): Locator {
    return this.page.locator("(//div[contains(@class,\"cursor-pointer\")]/../..//span)[1]");
  }

  get Stored_Chase_Field_Name(): Locator {
    return this.page.locator("//label[normalize-space(text())='Chase Field Name']//..//select[@title=\"$|ChaseFiledNameonAddActions|\"]");
  }

  get This_Quarter_Dates(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Requested Date:\")])[$|count_2|]");
  }

  get Updated_SelectCategory(): Locator {
    return this.page.locator("//div[contains(text(),\"Selected (2)\")]");
  }

  get UpdatedBidEnumeartedTapeValue_1(): Locator {
    return this.page.locator("((//label[text()=\" Bid Enumerated Tape Value \"]/..//div[contains(@class,\"flex-grow-1 text-start\")])/../../../..//span)[2]");
  }

  get UpdatedWhenBidField_1(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//div[contains(@class,\"flex-grow-1 text-start\")]/../../../..//span)[6]");
  }

  get UpdatingActionChaseFieldName_1(): Locator {
    return this.page.locator("(//*[text()=\"Chase Field Name\"]/..//select)[1]");
  }

  get UpdatingActionChaseValue_1(): Locator {
    return this.page.locator("(//*[text()=\"Chase Value\"]/..//select)[1]");
  }

  get UpdatingBid_EnumeratedTapeValue_1(): Locator {
    return this.page.locator("//span[@title=\"SAIKAT_18_FEB_002\"]");
  }

  get UpdatingWhenBidField_1(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//div[contains(@class,\"flex-grow-1 text-start\")])[1]");
  }

  get UploadFile_BidRequest(): Locator {
    return this.page.locator("(//input[@type=\"file\"])[1]");
  }

  get When_Bid_field_for_add_or_block_in_field2(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/../../../..//select)[4]");
  }

  get When_Bid_Field_Selecting_Random_data(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//span[contains(@class,\"pl\")])[$|BidFieldNumber|]");
  }

  get When_Bid_Field(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[5]");
  }

  get When_Bid_FieldValue_In_AddActions(): Locator {
    return this.page.locator("//button[@title=\"Income (Monthly)\"]");
  }

  get When_BidField2(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[4]");
  }

  get WhenBidField_3(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/../../../..//div[contains(@class,\"flex-grow-1 text-start\")])[5]");
  }

  get WhenBidFieldName_Block2(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//div[contains(@class,\"flex-grow-1 text-start\")])[2]");
  }

}