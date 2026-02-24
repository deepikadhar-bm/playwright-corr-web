import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Customer Permission
 * Elements: 28
 */
export class CustomerPermissionPage {
  constructor(private page: Page) {}

  get Bulk_Change_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Bulk Change\"]]");
  }

  get Chase_StateFirst_Record(): Locator {
    return this.page.locator("(//td[@data-title=\"Chase Direct\"]//div)[1]");
  }

  get Chasedirect_Execution_PermissionAllowed(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and text()=\" @|CompanyName(CustomerPermissions)| \"]/ancestor::tr//td[@data-title=\"Chase Direct\"]//div[@class=\"text-success\"]");
  }

  get Chasedirect_Execution_PermissionDisabled(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and text()=\" @|CompanyName(CustomerPermissions)| \"]/ancestor::tr//td[@data-title=\"Chase Direct\"]//div[@class=\"text-danger\"]");
  }

  get Company_1_Chase_State(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and contains(text(),\"$|ExpectedCompanyName1|\")]/following-sibling::td[@data-title=\"Chase Direct\"]//div");
  }

  get Company_1_Standard_State(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and contains(text(),\"$|ExpectedCompanyName1|\")]/following-sibling::td[@data-title=\"Standard\"]//div");
  }

  get Company_2_Chase_State(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and contains(text(),\"$|ExpectedCompanyName2|\")]/following-sibling::td[@data-title=\"Chase Direct\"]//div");
  }

  get Company_2_Standard_State(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and contains(text(),\"$|ExpectedCompanyName2|\")]/following-sibling::td[@data-title=\"Standard\"]//div");
  }

  get Company_Name1other_than_HomeSweet(): Locator {
    return this.page.locator("(//td[@data-title=\"Company Name\" and not(contains(text(),\"Home Sweet Mortgage\"))])[1]");
  }

  get Company_Name2Other_than_Home_Sweet(): Locator {
    return this.page.locator("(//td[@data-title=\"Company Name\" and not(contains(text(),\"Home Sweet Mortgage\"))])[2]");
  }

  get CustomerPermission_Menu(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/customer-restrictions\"]");
  }

  get Edit_Permission_Button_For_Freedomcompany(): Locator {
    return this.page.locator("//td[contains(text(),\"@|Company Name|\")]/following-sibling::td[@data-title=\"Actions\"]//button[@aria-label=\"Edit Permission\"]//span[contains(@class, 'fa-pencil-alt')]");
  }

  get Edit_Permission_ButtonCompany_2(): Locator {
    return this.page.locator("(//td[@data-title=\"Company Name\" and contains(text(),\"$|ExpectedCompanyName2|\")]/following-sibling::td[@data-title=\"Actions\"]//button)");
  }

  get Edit_Permission_Buttonfirst_record(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[1]/td[8]/div[1]/button[1]/span[1]");
  }

  get Edit_Permissions_ButtonCompany_1(): Locator {
    return this.page.locator("(//td[@data-title=\"Company Name\" and contains(text(),\n\"$|ExpectedCompanyName1|\")]/following-sibling::td[@data-title=\"Actions\"]//button)");
  }

  get First_Companybulk_change_pop_up(): Locator {
    return this.page.locator("//span[@class=\"more-clients\"][1]");
  }

  get Fourth_Check_box(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[4]/td[1]/input[1]");
  }

  get Freedom_Company_Standard_Type(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and text()=\" Freedom A4187 \"]/..//td[@data-title=\"Standard\"]//div");
  }

  get Individual_Column_Header_Data(): Locator {
    return this.page.locator("((//thead//th)[position() >1 and position() <= 7])[$|Count1|]");
  }

  get IndividualCellDataUI(): Locator {
    return this.page.locator("(//tbody//tr[$|RowIndexUI|]//td[position() > 1 and position() <= 7])[$|Count|]");
  }

  get Last_Modified_Data_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Last Modified\"])[1]");
  }

  get Modified_by_DataList(): Locator {
    return this.page.locator("(//td[@data-title=\"Modified By\"])[1]");
  }

  get Search_Filter_Input(): Locator {
    return this.page.locator("//div[@class=\"custom-input\"]//input");
  }

  get Second_Companybulk_change_popup(): Locator {
    return this.page.locator("//span[@class=\"more-clients\"][2]");
  }

  get Standard_Execution_PermissionAllowed(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and text()=\" @|CompanyName(CustomerPermissions)| \"]/ancestor::tr//td[@data-title=\"Standard\"]//div[@class=\"text-success\"]");
  }

  get Standard_Execution_PermissionDisabled(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and text()=\" @|CompanyName(CustomerPermissions)| \"]/ancestor::tr//td[@data-title=\"Standard\"]//div[@class=\"text-danger\"]");
  }

  get Standard_State_First_Record(): Locator {
    return this.page.locator("(//td[@data-title=\"Standard\"]//div)[1]");
  }

  get Third_Checkbox(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[3]/td[1]/input[1]");
  }

}