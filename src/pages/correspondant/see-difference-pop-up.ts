import { Page, Locator } from '@playwright/test';

/**
 * Page Object: see difference pop up
 * Elements: 27
 */
export class SeeDifferencePopUpPage {
  constructor(private page: Page) {}

  get Chase_New_Datapop_up_sub_text(): Locator {
    return this.page.locator("//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]//ins");
  }

  get Chase_Previous_Datapop_up_sub_text(): Locator {
    return this.page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]//del");
  }

  get Company_Name_New_Data(): Locator {
    return this.page.locator("((//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"name\" )])//ins)[1]");
  }

  get Email_New_Data_Line_by_line(): Locator {
    return this.page.locator("(//td[@class=\"d2h-ins d2h-change\"]/../following-sibling::tr//td//span)[2]");
  }

  get Expected_New_Data_Standard_Execution(): Locator {
    return this.page.locator("//*[text()=\"+\"]/following-sibling::span[contains(text(),\"executionTypes\")]/../../../following-sibling::tr//span[contains(text(),\"STANDARD\")]/../..");
  }

  get Expected_New_DataChase_Execution(): Locator {
    return this.page.locator("//*[text()=\"+\"]/following-sibling::span[contains(text(),\"executionTypes\")]/../../../following-sibling::tr//span[contains(text(),\"CHASE_DIRECT\")]/../..");
  }

  get Expected_Previous_DataCustomer_Permission_Config(): Locator {
    return this.page.locator("//span[@class=\"d2h-code-line-ctn\" and contains(text(),\"executionTypes\")]//del[text()=\"]\"]");
  }

  get Inernal_User_New_Datapop_up(): Locator {
    return this.page.locator("(//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"internalUser\" )])[1]");
  }

  get Internal_User_Name_New_Data(): Locator {
    return this.page.locator("(//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"internalUser\" )])//ins");
  }

  get Internal_User_Name_Previous_Datapop_up(): Locator {
    return this.page.locator("(//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"internalUser\" )])[1]");
  }

  get Line_by_line_Table(): Locator {
    return this.page.locator("//div[@class=\"d2h-file-diff\"]//table");
  }

  get Name_New_DataPop_up(): Locator {
    return this.page.locator("(//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"name\" )])[1]");
  }

  get Name_Previous_DataPop_Up(): Locator {
    return this.page.locator("(//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"name\" )])[1]");
  }

  get New_Data_Change_Text_Side_by_Side(): Locator {
    return this.page.locator("(//td[@class=\"d2h-ins d2h-change\"]//span[@class=\"d2h-code-line-ctn\"])[1]//ins");
  }

  get New_Data_Empty_Fields(): Locator {
    return this.page.locator("//td[contains(@class,\"emptyplaceholder\")][2]");
  }

  get New_Data_TextSide_by_Side(): Locator {
    return this.page.locator("(//td[@class=\"d2h-ins d2h-change\"]//span[@class=\"d2h-code-line-ctn\"])[1]");
  }

  get Previous_Data_Change_TextSide_by_Side(): Locator {
    return this.page.locator("(//td[@class=\"d2h-del d2h-change\"]//span[@class=\"d2h-code-line-ctn\"])[1]//del");
  }

  get Previous_data_empty_email_field(): Locator {
    return this.page.locator("(//td[@class=\"d2h-del d2h-change\"]/../following-sibling::tr//td[contains(@class,\"emptyplaceholder\")])[2]");
  }

  get Previous_Data_TextSide_by_Side(): Locator {
    return this.page.locator("(//td[@class=\"d2h-del d2h-change\"]//span[@class=\"d2h-code-line-ctn\"])[1]");
  }

  get Side_by_side_Previous_data_table(): Locator {
    return this.page.locator("(//div[@class=\"d2h-file-side-diff\"]//table)[1]");
  }

  get Side_by_Side_New_Data_TableSee_Difference(): Locator {
    return this.page.locator("(//div[@class=\"d2h-file-side-diff\"]//table)[2]");
  }

  get Side_by_Side_Previous_Data_Early_Config(): Locator {
    return this.page.locator("(//td[@class=\"d2h-del d2h-change\"]//span[@class=\"d2h-code-line-ctn\"])/../..");
  }

  get Side_by_Side_Tables(): Locator {
    return this.page.locator("//div[@class=\"d2h-file-side-diff\"]//table");
  }

  get Smart_Map_Previous_Data_Audit(): Locator {
    return this.page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(@class,\"d2h-code-line-ctn\" )]");
  }

  get Smart_Mapper_New_DataAudit(): Locator {
    return this.page.locator("//td[@class=\"d2h-ins d2h-change\"]//span[contains(@class,\"d2h-code-line-ctn\" )]");
  }

  get Standard_New_Datapop_up_sub_text(): Locator {
    return this.page.locator("//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]//ins");
  }

  get Standard_previous_datapop_up_sub_text(): Locator {
    return this.page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]//del");
  }

}