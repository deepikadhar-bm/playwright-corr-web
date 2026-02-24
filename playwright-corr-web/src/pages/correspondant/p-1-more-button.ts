import { Page, Locator } from '@playwright/test';

/**
 * Page Object: +1 more Button
 * Elements: 31
 */
export class P1MoreButtonPage {
  constructor(private page: Page) {}

  get Bid_Enumeration_Tape_Value_in_Rule(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[3]");
  }

  get Required_Companys_Name_Value(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'@|Company name 1|')]");
  }

  get _1_more_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"+1 more\"]]");
  }

  get AfterBidEnumeratedTapeValue1(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//div[contains(@class,\"flex-grow-1 text-start\")])[1]");
  }

  get Attachment_Type_field_have_selected_Count(): Locator {
    return this.page.locator("//div[text()='Attachment Type']/../..//select[@title=\"\"]");
  }

  get Attachment_Type_for_Unidentified(): Locator {
    return this.page.locator("(//div[text()='Attachment Type']/../..//select[@id=\"id\"])[$|count|]");
  }

  get Bid_Sample_Field_Name_in_Header_Mapping(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1\"])[7][$|DeleteHeaderMapping|]");
  }

  get Bid_Enumerated_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[9]");
  }

  get Chase_Value(): Locator {
    return this.page.locator("(//select[@class=\"form-select\"])[6]");
  }

  get Chase_Field(): Locator {
    return this.page.locator("(//div[@class=\"col-2\"])[4]");
  }

  get Chase_Value_in_Enumeration_Mapping(): Locator {
    return this.page.locator("((//select[@class=\"form-select\" and @id=\"id\"])[position()>1])[$|Bid Sample Field|]");
  }

  get ChaseField(): Locator {
    return this.page.locator("//select[@id=\"ppePath\"]");
  }

  get Checking_Enum_In_Enumeration_Mapping(): Locator {
    return this.page.locator("//input[contains(@aria-label,'Enable or disable field Amortization Type')]");
  }

  get Delete_icon_Header_Mapping(): Locator {
    return this.page.locator("(//i[@class=\"fas fa-trash-alt text-danger\"])[3]");
  }

  get Deleted_Rule_Name(): Locator {
    return this.page.locator("(//div[@class=\"d-flex py-4\"])[2]");
  }

  get Enter_Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]");
  }

  get Export_Selected_Dropdown(): Locator {
    return this.page.locator("//button[@id='exportdropdownMenuButton']");
  }

  get Filter_Enumerations_in_Enumeration_Mapping(): Locator {
    return this.page.locator("//div[@class=\"dropdown-overflow\"]/label");
  }

  get Header_Mapping_Fields_Chase_Values(): Locator {
    return this.page.locator("((//select[@class=\"form-select\" and @id=\"id\"])[position()>1])[$|Count|]");
  }

  get Next_Business_Day_Radio(): Locator {
    return this.page.locator("(//input[@name=\"bidRequestDate\"])[2]");
  }

  get Product_Name_in_Enumeration_Mapping(): Locator {
    return this.page.locator("//div[@class='flex-grow-1 text-start text-truncate'][contains(.,'Hii')]");
  }

  get Search_Fields(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[7]");
  }

  get Search_Map_Dropdown(): Locator {
    return this.page.locator("(//span[@class='ngb-highlight'][contains(.,'Deepika Aug1')])[1]");
  }

  get SelectCompany_Names(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'@|Company Name|')]");
  }

  get Status_In_BidMap_Listcreen(): Locator {
    return this.page.locator("//td[@data-title=\"Map Name\"]//button[text()=\" $|Create New Maps| \"]/../..//td[@data-title=\"Status\"]//*[text()=\"ACTIVE\"]/..//*[text()=\"DRAFT\"]");
  }

  get Third_Company_Name(): Locator {
    return this.page.locator("(//td[@data-title=\"Company\"])[23]");
  }

  get Unidentified_Headers_in_Header_Mapping(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout unidentified-header\"]");
  }

  get Uploaded_FileName(): Locator {
    return this.page.locator("//span[@aria-live=\"polite\"]");
  }

  get Version_BidMap_ListScreen(): Locator {
    return this.page.locator("//td[@data-title=\"Version\"]");
  }

  get WhenBidField_Block_2(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//div[contains(@class,\"flex-grow-1 text-start\")])[2]");
  }

  get Yes_Proceed_Button_Header_Mapping(): Locator {
    return this.page.locator("//button[@class=\"btn fw-bold m-0 btn-primary\"]");
  }

}