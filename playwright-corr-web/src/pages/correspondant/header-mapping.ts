import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Header Mapping
 * Elements: 50
 */
export class HeaderMappingPage {
  constructor(private page: Page) {}

  get All_Fields_in_header_map(): Locator {
    return this.page.locator("//div[contains(@class,\"gap-2 header-grid-layout\")]//select");
  }

  get BidEnumValues(): Locator {
    return this.page.locator("//div[@class=\"field-block mb-2\"]//div");
  }

  get BidFieldSampleValues(): Locator {
    return this.page.locator("//div[contains(@class,\"gap-2 header-grid-layout\")]//select");
  }

  get BidMapFieldSet(): Locator {
    return this.page.locator("//fieldset//div[@class=\"flex-grow-1\"]");
  }

  get Chase_Field_Checkbox(): Locator {
    return this.page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//input[@type=\"checkbox\"]");
  }

  get Chase_Field_Name_in_Rule(): Locator {
    return this.page.locator("(//select[@id=\"id\"])[5]");
  }

  get Chase_Field_Name_Text_Field(): Locator {
    return this.page.locator("//select[@title=\"Fico\"]");
  }

  get ChaseFieldName(): Locator {
    return this.page.locator("//fieldset//select[@class=\"form-select\"]");
  }

  get Checked_header_1(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\" and text()=\"$|FirstCheckedBidName|\"]");
  }

  get Checked_header_2(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\" and text()=\"$|SecondCheckedBidName|\"]");
  }

  get Correspondent_Bid_sample_name(): Locator {
    return this.page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//div[@class=\"flex-grow-1\"]");
  }

  get Custom_Header(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout custom-header\"]//div[@class=\"flex-grow-1\"]");
  }

  get Custom_Header_Chase_Value(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout custom-header\"]//select");
  }

  get Custom_Header_On_Pop_Up(): Locator {
    return this.page.locator("//div[text()=\"Custom Header\"]/../..//input");
  }

  get Deleted_Chase_Value(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1\"])[6]");
  }

  get Deleted_Header_In_HeaderMaping(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout\"]//div[text()=\"$|DeletedHeader[HeaderMapping]|\"]");
  }

  get Deleting_Header(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//div[@class=\"flex-grow-1\"])[5]");
  }

  get Disabled_Field_on_Header_Mapping(): Locator {
    return this.page.locator("//select[@aria-label=\"Default dropdown selection\"]//..//..//..//..//div[@class=\"gap-2 header-grid-layout\"]");
  }

  get DTI_Bid_Sample_Field(): Locator {
    return this.page.locator("(//table/tr/td)[2]");
  }

  get FICO_Bid_Sample_Field_value(): Locator {
    return this.page.locator("(//table/tr/td)[4]");
  }

  get FICO_Chase_Field(): Locator {
    return this.page.locator("(//table/tr/td)[3]");
  }

  get File_Input(): Locator {
    return this.page.locator("//input[@type=\"file\"]");
  }

  get First_Checked_Bid(): Locator {
    return this.page.locator("(//*[@class=\"dropdown-item d-flex checked\"]//input)[1]");
  }

  get First_Header_Bid_Sample_Name(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//div[@class=\"flex-grow-1\"])[1]");
  }

  get First_Header_Checkbox(): Locator {
    return this.page.locator("(//fieldset//input[@type=\"checkbox\"])[1]");
  }

  get General_Settings(): Locator {
    return this.page.locator("//*[text()[normalize-space() = \"General Settings\"]]");
  }

  get Header_1(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//div[@class=\"flex-grow-1\" and text()=\"$|FirstHeaderName|\"])[1]/..//input");
  }

  get Header_Mapping(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Header Mapping\"]]");
  }

  get Header_Value_In_Mapping(): Locator {
    return this.page.locator("//div[text()=\"@|Custom Header|\"]/..//select[@id=\"id\"]");
  }

  get Headers_In_HeadersMapping(): Locator {
    return this.page.locator("//fieldset");
  }

  get Individual_BidSample_Name(): Locator {
    return this.page.locator("(//fieldset//div[@class=\"flex-grow-1\"])[$|count|]");
  }

  get Individual_BidSample_Name1(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//div[@class=\"flex-grow-1\"])[$|count|]");
  }

  get Individual_Chase_Name(): Locator {
    return this.page.locator("(//fieldset//select[@class=\"form-select\"])[$|count|]");
  }

  get Individual_ChaseValue_OF_Bid(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//select)[$|count|]");
  }

  get Individual_Mapped_Chase_Name(): Locator {
    return this.page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]");
  }

  get Loan_Purpose_chase_dropdown(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\" and text()=\"Loan Purpose\"]/..//select");
  }

  get Mapped_Chase_Value(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\" and text()=\"$|BidSampleName|\"]/..//select");
  }

  get MappedChaseFieldName(): Locator {
    return this.page.locator("//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select");
  }

  get Rename_Field(): Locator {
    return this.page.locator("//input[@type=\"text\"]");
  }

  get Required_Bid_Field(): Locator {
    return this.page.locator("//fieldset//div[text()=\"$|BidFieldName|\"]/../..//select");
  }

  get Required_Edit_Header_Button_Not_an_Enum(): Locator {
    return this.page.locator("//select[@title=\"City\" or @title=\"Street\" or @title=\"State\"]/ancestor::div[@class=\"gap-2 header-grid-layout\"]//button[@aria-label=\"Edit Header\"]");
  }

  get Second_Checked_Bid(): Locator {
    return this.page.locator("(//*[@class=\"dropdown-item d-flex checked\"]//input)[2]");
  }

  get Second_Header_Bid_Sample_Name(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//div[@class=\"flex-grow-1\"])[2]");
  }

  get Second_Checkbox_Header_Mapping(): Locator {
    return this.page.locator("(//select[contains(@class, 'form-select')])[3]");
  }

  get Start_task_Button(): Locator {
    return this.page.locator("(//button[@class=\"el-button el-button--primary\"])[2]");
  }

  get Unchecked_Headers(): Locator {
    return this.page.locator("(//fieldset)[position() > 2 and position() <= last()]");
  }

  get Unidentified_Headers(): Locator {
    return this.page.locator("//div[contains(@class,\"unidentified-header\")]//select");
  }

  get Update_Header_Button_Bid_maps_popup(): Locator {
    return this.page.locator("//span[text()=\"Update Header\"]/../..//button");
  }

  get Updated_BidSample_Name(): Locator {
    return this.page.locator("//div[text()=\"$|UpdatedBidSampleNameHeaderMapping|\"]/ancestor::div[@class=\"gap-2 header-grid-layout\"]//*[@class=\"flex-grow-1\"]");
  }

  get Updated_Element_In_Header_Mapping(): Locator {
    return this.page.locator("//div[text()=\"$|UpdatedBidSampleNameHeaderMapping|\"]/ancestor::div[@class=\"gap-2 header-grid-layout\"]//select");
  }

}