import { Page, Locator } from '@playwright/test';

/**
 * Page Object: General setting
 * Elements: 26
 */
export class GeneralSettingPage {
  constructor(private page: Page) {}

  get Audit_Menu(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/audit-log\"]");
  }

  get Ccode_columncustomer_permission(): Locator {
    return this.page.locator("//td[@data-title=\"CCode\"]");
  }

  get Chase_Off_RadioGlobal_Restrictions(): Locator {
    return this.page.locator("//input[@id='executionTypeFastPath-select-off']");
  }

  get Chase_On_RadioGlobal_Restriction(): Locator {
    return this.page.locator("//input[@id='executionTypeFastPath-select-on']");
  }

  get Clear_buttonUsername_Search_Bar(): Locator {
    return this.page.locator("//button[contains(@class, 'search-cancel-btn')]");
  }

  get Clear_Search_ButtonConfig_Drpdwn(): Locator {
    return this.page.locator("//button[contains(@aria-label, 'Clear search')]");
  }

  get Commitment_Timer_General_Settings(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/commitment-timer\"]");
  }

  get Company_Check_Box_2customer_permissions(): Locator {
    return this.page.locator("(//td[@data-title=\"Company Name\" and not(contains(text(),\"Home Sweet Mortgage\"))]/preceding-sibling::td//input[@type=\"checkbox\"])[2]");
  }

  get Config_Type_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Config Type\"]");
  }

  get Conventional_DropdownBid_Request_Config(): Locator {
    return this.page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]");
  }

  get Created_Date_Time_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Created\"]");
  }

  get First_Company_Namecustomer_permission(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[1]/td[3]");
  }

  get First_Config_Option_After_SearchDrpdwn(): Locator {
    return this.page.locator("//div[@role=\"listbox\"]/div[2]/button");
  }

  get First_Config_OptionList(): Locator {
    return this.page.locator("//td[@data-title=\"Config Type\"]");
  }

  get First_Option_Config_Dropdown(): Locator {
    return this.page.locator("//div[@role=\"listbox\"]/div[2]/button[2]");
  }

  get First_User_Name_UI(): Locator {
    return this.page.locator("//td[@data-title=\"Username\"]");
  }

  get General_Settings(): Locator {
    return this.page.locator("//a[@aria-label=\"General Settings\"]//span[text()=\"General Settings\"]");
  }

  get Global_Restrictions_menu(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/global-restrictions\"]");
  }

  get Go_to_Previous_Page_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Go to Previous Page\"  ]");
  }

  get Last_Modified_DataRight_Corner_Screen(): Locator {
    return this.page.locator("(//div[contains(text(),\"Last Modified\")])[1]");
  }

  get Options_CountConfig_Drpdwn(): Locator {
    return this.page.locator("//div[@class=\"dropdown-overflow\"]//button");
  }

  get Search_Input_Config_Dropdown(): Locator {
    return this.page.locator("//input[@placeholder=\"Search\"]");
  }

  get Select_Config_Type_Dropdown(): Locator {
    return this.page.locator("//button[@aria-label=\"Toggle dropdown\"]//div[contains(text(),\"Select Config Type\")]");
  }

  get Standard_On_RadioGlobal_Restriction(): Locator {
    return this.page.locator("//input[@id='dynamicPricing-select-on']");
  }

  get Time_Zone_OptionLosAngeles(): Locator {
    return this.page.locator("//div[@role=\"listbox\"]//button[@role=\"option\"]//span[contains(text(),\"America/Los_Angeles\")]");
  }

  get Username_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Username\"]");
  }

}