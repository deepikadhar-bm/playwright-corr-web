import { Page, Locator } from '@playwright/test';

/**
 * Page Object: "status": " INACTIVE ",
 * Elements: 71
 */
export class StatusInactivePage {
  constructor(private page: Page) {}

  get Added_On(): Locator {
    return this.page.locator("(//h5[@class=\"modal-title fw-semibold\"]/../../..//td[@data-title=\"Added On\"])[1]");
  }

  get When_Bid_Field(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[4]");
  }

  get _1_Selected_for_Companys(): Locator {
    return this.page.locator("//div[contains(text(),\"Selected (1)\")]");
  }

  get Select_Button(): Locator {
    return this.page.locator("//a[@class=\"text-option border-bottom\"]");
  }

  get _87NDB3C12736(): Locator {
    return this.page.locator("//a[contains(text(),\"87NDB3C12736\")]");
  }

  get AfterActionChaseValue1(): Locator {
    return this.page.locator("(//*[text()=\"Chase Value\"]/..//select)[1]");
  }

  get AfterWhenBidField1(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//div[contains(@class,\"flex-grow-1 text-start\")])[1]");
  }

  get Attached_Type_In_Enumeration(): Locator {
    return this.page.locator("(//div[text()=\"Attachment Type\"]/../..//select[@id=\"id\"])[2]");
  }

  get Attachment_Type_In_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[text()=\"Attachment Type\"]/../..//select[@id=\"id\"])[3]");
  }

  get Back_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Back\"]]");
  }

  get BatchTime(): Locator {
    return this.page.locator("(//h6[@class=\"card-subtitle text-body-secondary flex-grow-1 mb-0\"]/../..//h5)[$|BatchNum|]");
  }

  get Below_Dropdown_First_company(): Locator {
    return this.page.locator("(//div[@role=\"listitem\"])[2]");
  }

  get Bid_Enumeration_TapeValue(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[6]");
  }

  get Bid_Flow_Status(): Locator {
    return this.page.locator("//span[text()=\" Success \"]/../../..//td[@data-title=\"File Row\"]");
  }

  get BidMap_list_Screen(): Locator {
    return this.page.locator("(//button[@class=\"text-primary pointer border-0 bg-transparent\"])[1]");
  }

  get BulkBatch_Timing(): Locator {
    return this.page.locator("(//div[@class=\"card-body\"])[last()]");
  }

  get Chase_value_2026(): Locator {
    return this.page.locator("//div[contains(@class,'border-bottom p-2') and contains(normalize-space(.),'$|ChaseFieldNameBeforeSubmit|')]/following-sibling::div[1]");
  }

  get Chase_Field_Name(): Locator {
    return this.page.locator("(//*[text()=\"Chase Field Name\"]/..//select)[last()]");
  }

  get Chase_Field_Name_2(): Locator {
    return this.page.locator("(//select[@class=\"form-select\"])[5]");
  }

  get Chase_Field_Name_in_AddActions(): Locator {
    return this.page.locator("//select[@title=\"Ineligible\"]");
  }

  get Chase_Value_Field_EnumerationMapping(): Locator {
    return this.page.locator("//select[@aria-label=\"Default dropdown selection\"]");
  }

  get Checkbox_for_Header_Mapping_Dropdowns(): Locator {
    return this.page.locator("(//input[contains(@type,'checkbox')])[4]");
  }

  get Checking_both_chase_field_to_bid_sample_field_is_mapping(): Locator {
    return this.page.locator("//div[contains(text(),\"@|Chase value name|\")]/../..//div[contains(text(),\"@|Bid Sample Field|\")]");
  }

  get Checking_Enum_Values_In_Enumeration_Mapping(): Locator {
    return this.page.locator("//input[contains(@aria-label,'Enable or disable field Amortization Type')]");
  }

  get Column_Header_In_SeachField(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Column Header\"]]");
  }

  get Company_Names(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\"]");
  }

  get Company1(): Locator {
    return this.page.locator("(//td[@data-title='Company'][contains(.,'@|Company Name|')])[18]");
  }

  get Delete_Message(): Locator {
    return this.page.locator("//div[text()[normalize-space() = 'You have selected to delete \"$|DeleteHeaderMapping|\" mapping. Do you want to proceed?']]");
  }

  get Delete_Button_Header_Mapping(): Locator {
    return this.page.locator("(//button[@aria-label=\"Delete Header\"])[1]");
  }

  get disabled_Options(): Locator {
    return this.page.locator("//option[@aria-disabled=\"true\"]");
  }

  get DisabledTimings_In_Pricing_Reurn_Time(): Locator {
    return this.page.locator("((//select[@aria-label=\"Dropdown selection\"])[3]/..//option[@aria-disabled=\"true\"])[$|Count|]");
  }

  get DraftTS(): Locator {
    return this.page.locator("//body[contains(@class, 'disabled')]\n");
  }

  get draftts2(): Locator {
    return this.page.locator("//div[contains(@class, 'disabled')]\n");
  }

  get draftts3(): Locator {
    return this.page.locator("//div[@class='container px-4']//fieldset[1]\n");
  }

  get draftts4(): Locator {
    return this.page.locator("//div[contains(@class,'container') and contains(@class,'px-4')]//fieldset[1]\n");
  }

  get Edit_Chase_Field_Name(): Locator {
    return this.page.locator("(//select[@id=\"id\"])[2]");
  }

  get Enter_Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[3]");
  }

  get Enum_value_from_HedaerMappping(): Locator {
    return this.page.locator("//div[text()=\"TS_SEARCH2\"]/../..//div[text()=\"Mortgage Limit\"]");
  }

  get Enumeration_Mapping_Name(): Locator {
    return this.page.locator("//div[@class='my-2'][contains(.,'$|Count|')]");
  }

  get FIle_Row_is_Mapping_to_success_status(): Locator {
    return this.page.locator("//th[@aria-label=\"File Row\"]/../../..//div[contains(text(),\"$|FileRow|\")]/../..//span[contains(text(),\"Success\")]");
  }

  get First_Time_Home_Buyer(): Locator {
    return this.page.locator("(//select[@title=\"False\"])[2]");
  }

  get First_Company_Name(): Locator {
    return this.page.locator("(//div[@class='d-flex align-items-end'][contains(.,'Company Name')]/../../../..//td[@data-title=\"Company Name\"])");
  }

  get Headers_Mapping_Field(): Locator {
    return this.page.locator("//div[@class='flex-grow-1'][contains(.,'@|\nEnum Type|')]");
  }

  get input_tag_23(): Locator {
    return this.page.locator("//input[@type=\"number\"][$|count|]");
  }

  get Price_Return_Timing1(): Locator {
    return this.page.locator("((//option[text()=\"Select\"])[3]/..//option)[3]");
  }

  get Pricing_Batch_Timings(): Locator {
    return this.page.locator("(//select[@class=\"form-select ng-pristine ng-invalid ng-touched\"]/option[not(contains(text(),'Select'))])[$|Batch|]");
  }

  get Pricing_Return_Time_Buffer(): Locator {
    return this.page.locator("//input[@id=\"pricingReturnTimeBuffer\"]");
  }

  get Pricing_Return_Times(): Locator {
    return this.page.locator("//select/../..//option[@aria-disabled=\"true\" and @value]");
  }

  get Pricing_Return_Timing5(): Locator {
    return this.page.locator("((//option[text()=\"Select\"])[3]/..//option)[7]");
  }

  get Pricing_Return_Timing6(): Locator {
    return this.page.locator("((//option[text()=\"Select\"])[3]/..//option)[8]");
  }

  get Pricing_Return_Timing7(): Locator {
    return this.page.locator("((//option[text()=\"Select\"])[3]/..//option)[last()]");
  }

  get Property_Valuation_Type_In_EnumerationMapping(): Locator {
    return this.page.locator("(//div[text()=\"Property Valuation Type\"]/../..//select[@id=\"id\"])[1]");
  }

  get Required_Company_In_List(): Locator {
    return this.page.locator("//button[@class='dropdown-item d-flex'][contains(.,'@|Company name 1|')]");
  }

  get Second_Add_Conditions_Last_Field_Delete_Button(): Locator {
    return this.page.locator("(//button[text()=\" Add Condition \"])[2]/../preceding-sibling::div//*[text()=\" Select \"]/ancestor::div[@class=\"d-flex\"]//button[contains(@class,\"text-danger\")]");
  }

  get Second_Selected_Company_Checkbox(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]");
  }

  get Select_Companys_BidMap(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]/../../..//label[@class=\"custom-checkbox dropdown-item bg-gray-100 d-flex\"]");
  }

  get Select_Company_Name(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'@|Company name 2|')]");
  }

  get Select_Companys_In_BidMaps(): Locator {
    return this.page.locator("//label[@class=\"dropdown-item d-flex\"]");
  }

  get Selected1_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Selected (1)\"]]");
  }

  get Standard_Execution_TypeCustomerPermission(): Locator {
    return this.page.locator("(//div[@class='text-success'][contains(.,'Allowed')])[1]");
  }

  get status(): Locator {
    return this.page.locator("//span[contains(normalize-space(),'\"status\": \"INACTIVE\",')]");
  }

  get TodayOnly_Radio_Button(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[1]");
  }

  get TS_element(): Locator {
    return this.page.locator("//option[@disabled aria-disabled=\"true\"]");
  }

  get Updated_Bid_Sample_Field_Name(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1\" and text()=\"Appraisal Waiver\"]/..//select)[1]");
  }

  get Updating_Chase_Field_Name(): Locator {
    return this.page.locator("(//option[@value=\"search.property.attachmentType\"]/../..//select)[3]");
  }

  get When_Bid_Field_2(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[8]");
  }

  get When_Bid_Field_Enumeration_Mapping(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"])[2]");
  }

  get When_Bid_Field_in_AddConditions(): Locator {
    return this.page.locator("//button[@title=\"Base Loan Amount\"]");
  }

  get When_BidEnumerated_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[7]");
  }

  get You_have_unidentified_fields_This_action_will_save_the_changes_and_Move_to_Next_Page(): Locator {
    return this.page.locator("//p[contains(normalize-space(),\"You have unidentified fields. This action will save the changes and Move to Next Page.\")]");
  }

  get You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page(): Locator {
    return this.page.locator("//*[contains(text(),\"You have unidentified fields.\")]/../..//*[text()=\" This action will save the changes and Move to Next Page. \"]");
  }

}