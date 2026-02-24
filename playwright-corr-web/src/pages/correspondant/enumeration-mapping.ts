import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Enumeration Mapping
 * Elements: 76
 */
export class EnumerationMappingPage {
  constructor(private page: Page) {}

  get Added_Chase_Value_Dropdown(): Locator {
    return this.page.locator("(//div[@class=\"field-block mb-2\"]//input/../../../../..//select)[last()]");
  }

  get Added_Field_In_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[@class=\"input-field-name text-truncate cursor-pointer\"])[2]");
  }

  get Amortization_Dropdown(): Locator {
    return this.page.locator("//*[text()=\"Amortization Type\"]/../..//select");
  }

  get Bid_Enum_names(): Locator {
    return this.page.locator("//div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class='col-2' ]//div[not(@class=\"my-2\")]");
  }

  get Bid_Enumerated_Tape_Values_for_Base_Loan_amount(): Locator {
    return this.page.locator("//span[@title='$|BidEnumerationTapeValue|']");
  }

  get Bid_Sample_Field_Name_on_Enumeration_Mapping(): Locator {
    return this.page.locator("//div[text()='$|customheadername|']");
  }

  get Bid_Sample_Field_Nameenum_mapping(): Locator {
    return this.page.locator("//div[contains(@class,\"mapping-card rounded-3\")]//div[@class=\"col-2\"][1]");
  }

  get Bid_Sample_Field_NamesNew(): Locator {
    return this.page.locator("//div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class='col-2' ]//div[not(@class=\"my-2\")]");
  }

  get Bid_sample_from_file_to_UI(): Locator {
    return this.page.locator("//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]");
  }

  get Bid_Sample_Name_2(): Locator {
    return this.page.locator("(//div[@class=\"col-2\"]//div[text()=\"$|SecondBidSampleName|\"])[1]/../..//input[@type=\"checkbox\"]");
  }

  get Bid_Sample_Name_Field_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[@class=\"my-2\" and text()=\"$|ChaseName|\"]/../..//div)[3]");
  }

  get Bid_Tape_Value_On_Enumeration_Mapping(): Locator {
    return this.page.locator("//div[normalize-space(text())='$|BidTapeValue|']");
  }

  get Bid_Tape_Values_From_Enumeration(): Locator {
    return this.page.locator("//div[@class=\"field-block mb-2\"]//div");
  }

  get BidTapeFieldCountForBidField(): Locator {
    return this.page.locator("//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")]");
  }

  get Chase_Enum_Names(): Locator {
    return this.page.locator("//div[@class=\"my-2\"]");
  }

  get Chase_Enum_Value_Text(): Locator {
    return this.page.locator("(//div[@class=\"mb-2\"]//select)[$|count|]");
  }

  get Chase_Enum_Values(): Locator {
    return this.page.locator("//div[@class=\"mb-2\"]//select");
  }

  get Chase_Field_Name_enum_mapping(): Locator {
    return this.page.locator("//div[@class=\"col-2\"][position() > 1 and position() <= last()]");
  }

  get Chase_Field_Name_Enumeration_Mapping(): Locator {
    return this.page.locator("//div[text()='$|customheadername|']//..//..//select[@title=\"$|clmfieldname|\"]");
  }

  get Chase_Field_Of_BidSample(): Locator {
    return this.page.locator("//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[@class=\"my-2\"]");
  }

  get Chase_Value_Dropdown_Enumeration_Mapping(): Locator {
    return this.page.locator("((//div[@class=\"field-block mb-2\"])/../../../..//select)[4]");
  }

  get Chase_Values_In_Enumeration(): Locator {
    return this.page.locator("//div[@class=\"mb-2\"]");
  }

  get ChaseFieldname_To_be_edited_enum(): Locator {
    return this.page.locator("(//div[@class=\"my-2\"])[3]");
  }

  get ChaseFieldValuesEnumerationMapping(): Locator {
    return this.page.locator("(//div[@class=\"field-pair col-3\"]//select)");
  }

  get chasevaluenlpcheck(): Locator {
    return this.page.locator("(//div[@class=\"field-pair col-3\"]//select)[2]\n");
  }

  get ChaseValues_Corresponding_to_Chase_Field(): Locator {
    return this.page.locator("(//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]");
  }

  get Correspondent_Unidentified_Chase_Value(): Locator {
    return this.page.locator("//div[text()=\"$|IndividualBidSample|\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"field-pair col-3\"]//*[@title=\"\" or @title=\"[object Object]\"]");
  }

  get CorrespondentChaseValueUI(): Locator {
    return this.page.locator("//div[not(@class=\"my-2\") and text()=\"$|ColumnHeader|\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"mb-2\"]//*[@class=\"form-control p-0\" or @class=\"form-select\"]");
  }

  get Customised_Bid_Sample_Field_Name_on_Enumeration_Page(): Locator {
    return this.page.locator("//div[text()='$|SearchHeaderName|']/../..");
  }

  get Default_Bid_Tape_Values_Count(): Locator {
    return this.page.locator("//div[@class=\"field-block mb-2\"]");
  }

  get Delete_Element_Value(): Locator {
    return this.page.locator("(//i[@class=\"fa fas fa-trash trash-icon\"])[5]/../..//div");
  }

  get Deleted_Enumeration_Value(): Locator {
    return this.page.locator("//select[@title=\"$|deletedEnumerationValue|\"]");
  }

  get Deleted_Field_In_Enumeration(): Locator {
    return this.page.locator("(//div[@class=\"field-block mb-2\"])//div[text()=\" $|BidTapeValueforBeforeDeleted| \"]");
  }

  get Disabled_Bid_Tape_Value_Count(): Locator {
    return this.page.locator("//div[contains(@class,\"input-field-name text-truncate cursor-pointer\")]");
  }

  get Disabled_Fields_Page(): Locator {
    return this.page.locator("//fieldset[@disabled]");
  }

  get dropdown(): Locator {
    return this.page.locator("//*[@class=\"rules-conditions\"]//select[@aria-label=\"Default dropdown selection\"]");
  }

  get Edited_Chase_Field_Name(): Locator {
    return this.page.locator("((//div[@class=\"field-block mb-2\"])/../../../..//div[@class=\"my-2\"])[2]");
  }

  get Edited_Chase_Value_After_Save(): Locator {
    return this.page.locator("(//button[text()=\" Add Field \"]/../div[text()=\"$|EditedChaseFieldName|\"]/../..//select)[1]");
  }

  get Enumeration_Mapping(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Enumeration Mapping\"]]");
  }

  get First_Bid_Sample_Name_In_Enumeration(): Locator {
    return this.page.locator("((//fieldset//input[@type=\"checkbox\"])[1]/../..//div[@class=\"col-2\"]//div)[1]");
  }

  get First_Checkbox_Enum(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\" and @class=\"mapping-select mt-1\"])[1]");
  }

  get First_selected_Bid(): Locator {
    return this.page.locator("(//div[@class='col-2']//div)[1]");
  }

  get Individual_Bid_Enum_Value(): Locator {
    return this.page.locator("(//div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class='col-2' ]//div[not(@class=\"my-2\")])[$|Count2|]");
  }

  get Individual_Bid_Sample(): Locator {
    return this.page.locator("((//div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"col-2\"][1])//div)[$|count|]");
  }

  get Individual_Bid_Sample_NameEnum_Page(): Locator {
    return this.page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//div[@class=\"col-2\"]//div[not(contains(@class,\"my-2\"))]");
  }

  get Individual_Bid_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"field-block mb-2\"]//div)[$|count1|]");
  }

  get Individual_Bid_Tape_Value_2(): Locator {
    return this.page.locator("(//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")])[$|count2|]");
  }

  get Individual_Chase_Enum_Name(): Locator {
    return this.page.locator("(//div[@class=\"my-2\"])[$|count1|]");
  }

  get Individual_Chase_Field_Value_Enumeration_mapping(): Locator {
    return this.page.locator("(//div[@class=\"field-pair col-3\"]//select)[$|count1|]");
  }

  get Individual_Chase_Value(): Locator {
    return this.page.locator("(//div[@class=\"mb-2\"])[$|count|]");
  }

  get Individual_ChaseValue_of_ChaseField(): Locator {
    return this.page.locator("((//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")])[$|count2|]");
  }

  get Individual_Checkbox_Enum(): Locator {
    return this.page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//input[@type=\"checkbox\"]");
  }

  get Individual_Select_option(): Locator {
    return this.page.locator("(//div[@class=\"mb-2\"]//*[contains(text(),\"Select\")])[$|count|]");
  }

  get Individual_Unidentified_Field(): Locator {
    return this.page.locator("(//div[contains(@class,\"col-2\")]/../..//select)[$|count|]");
  }

  get Individual_Unidentified_Field_Verification(): Locator {
    return this.page.locator("(//div[@class=\"mb-2\"]//*[contains(@aria-label,\"dropdown\")]//*[text()=\" Select\" or text()=\" [object Object] \"])[$|count|]");
  }

  get IndividualBidTapeValue(): Locator {
    return this.page.locator("(//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")])[$|count1|]");
  }

  get IndividualChaseValueUI(): Locator {
    return this.page.locator("(//div[not(@class=\"my-2\") and text()=\"$|ColumnHeader|\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"mb-2\"]//*[@class=\"form-control p-0\" or @class=\"form-select\"])[$|count1|]");
  }

  get Input_Bid_Tape_Field(): Locator {
    return this.page.locator("//input[@class=\"input-field-edit\"]");
  }

  get Loan_Purpose_Chase_Dropdownenum(): Locator {
    return this.page.locator("//div[@class=\"my-2\" and text()=\"Loan Purpose\"]/../..//select");
  }

  get Loan_Purpose_Dropdwon(): Locator {
    return this.page.locator("(//div[text()='Loan Purpose'])[2]/../..//select[@aria-label=\"Default dropdown selection\"]");
  }

  get Mapped_Bid_Tape_Value(): Locator {
    return this.page.locator("//div[@class=\"col-2\"]//div[text()=\"@|Bid Sample Name\n|\"]/../..//div[contains(@class,\"text-truncate\")]");
  }

  get Mapped_Chase_Value_Without_Select_Tag(): Locator {
    return this.page.locator("//div[@class=\"my-2\" and text()=\"$|ChaseName|\"]/../..//div[@class=\"flex-grow-1 text-start text-truncate\"]");
  }

  get Mapped_Chase_ValueEnumeration(): Locator {
    return this.page.locator("(//div[@class=\"my-2\" and text()=\"$|ChaseName|\"])/../..//select");
  }

  get New_Field_Chase_Dropdown(): Locator {
    return this.page.locator("((//input[@type=\"text\" and contains(@class, 'input-field-edit')])/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//select)[last()]");
  }

  get New_Field_Chase_Dropdown1(): Locator {
    return this.page.locator("(//input[@class=\"input-field-edit\"]/../../../../..//select[@class=\"form-select\"])[1]");
  }

  get Newly_Added_chase_valueDisabled(): Locator {
    return this.page.locator("(//div[@class=\"mb-2\"]//select)[1]");
  }

  get Second_Bid_Sample_Name_In_Enumeration(): Locator {
    return this.page.locator("(((//fieldset//input[@type=\"checkbox\"])[2]/../..//div[@class=\"col-2\"]//div))[1]");
  }

  get Second_Selected_Bid(): Locator {
    return this.page.locator("(//div[@class='col-2']//div)[3]");
  }

  get Status_Filter_DropdownEnumeration(): Locator {
    return this.page.locator("//*[@aria-label=\"Enumeration Status Dropdown\"]//select");
  }

  get To_be_deleted_Chase_Value(): Locator {
    return this.page.locator("(//i[@class=\"fa fas fa-trash trash-icon\"])[6]/../..//div");
  }

  get To_be_edited_Chase_Value_ListEnum(): Locator {
    return this.page.locator("(//div[text()=\"$|ChaseFieldNameTobeEdited|\"]/..//following-sibling::div//div//select)[1]");
  }

  get UnIdentified_Fields(): Locator {
    return this.page.locator("//div[@class=\"mb-2\"]//select[@title=\"\"]");
  }

  get Unidentified_Fields_In_Enumeration(): Locator {
    return this.page.locator("//div[@class=\"mb-2\"]//select[@title=\"\"]");
  }

  get Unmapped_Chase_Value(): Locator {
    return this.page.locator("//div[text()=\"$|ColumnHeader|\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"field-pair col-3\"]//*[@title=\"\" or @title=\"[object Object]\"]");
  }

  get Unmapped_Chase_Value_1(): Locator {
    return this.page.locator("(//div[text()=\"$|ColumnHeader|\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//div[@class=\"field-pair col-3\"]//*[@title=\"\" or @title=\"[object Object]\"])[$|count1|]");
  }

  get YES_PROCEED_BUTTON(): Locator {
    return this.page.locator("//span[contain(text(),\"Yes, Proceed\")]");
  }

}