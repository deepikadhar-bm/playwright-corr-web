import { Page, Locator } from '@playwright/test';

/**
 * Page Object: early config
 * Elements: 28
 */
export class EarlyConfigPage {
  constructor(private page: Page) {}

  Added_Last_Batch(TimeHourMin: string): Locator {
    return this.page.locator(`//td[@data-title="Last Batch" and contains(text(),"${TimeHourMin}")]`);
  }

  Current_Date(CurrentDateCalender:String): Locator {
    return this.page.locator(`//div[@aria-label=\"${CurrentDateCalender}\"]`);
  }

  get Date_Picker(): Locator {
    return this.page.locator("//button[@aria-label=\"Toggle Date Picker\"]");
  }

  get Day_After_Tomorrow_Date_List(): Locator {
    return this.page.locator("//td[contains(text(),\" $|DayAfterTomorrowDateList|\")]");
  }

  get DayAfterTomorrows_Date_Calender(): Locator {
    return this.page.locator("//div[@aria-label=\"$|DayAfterTomorrowsDateCalender|\"]");
  }

  get Deffered_On_Radio_Button(): Locator {
    return this.page.locator("//input[@id=\"pricingMode-1-on\"]");
  }

  Delete_Button_early_config(TimeHourMin: string): Locator {
    return this.page.locator(`(//td[contains(text(),"${TimeHourMin}")]/..//button)[2]`);
  }

  Delete_Button_Early_ConfigNext_Day(TomorrowsDate: string): Locator {
    return this.page.locator(`(//td[contains(text(),\" ${TomorrowsDate}\")]/..//button)[2]`);
  }

  get Delete_Option_Field(): Locator {
    return this.page.locator("//table//td[@data-title=\"Actions\"]//div/button[@aria-label=\"Delete\"]/span");
  }

  get Early_Close_Config_Rows(): Locator {
    return this.page.locator("(//table//tr[@role=\"row\"])[position() >1 and position() <= last()]");
  }

  get Early_Conf_Del_Button_other_than_today(): Locator {
    return this.page.locator("//td[@data-title=\"Date\" and not(contains(text(),\"$|CurrentDateList|\"))]/..//button[@aria-label=\"Delete\"]");
  }

  Early_Config_For_Current_Date(CurrentDateList:String): Locator {
    return this.page.locator(`//td[contains(text(),\" ${CurrentDateList}\")]`);
  }

  Early_Config_For_Next_business_day(NextBusinessDateList:String): Locator {
    return this.page.locator(`//td[contains(text(),\" ${NextBusinessDateList}\")]`);
  }

  Early_Configtomorrows_Date(TomorrowDateList:String): Locator {
    return this.page.locator(`//td[contains(text(),\"${TomorrowDateList}\")]`);
  }

  Edit_ButtonEarly_Close_Config(TimeHourMin: string): Locator {
    return this.page.locator(`(//td[contains(text(),\"${TimeHourMin}\")]/..//button)[1]`);
  }

  get Last_Batch_Dropdown(): Locator {
    return this.page.locator("(//select[@aria-label=\"Default dropdown selection\"])[1]");
  }

  get Last_Batch_Field(): Locator {
    return this.page.locator("//div//input[@id=\"lastBatchTime\"]");
  }

  get Last_Batch_Time_Input_Box(): Locator {
    return this.page.locator("//input[@id='lastBatchTime']");
  }

  get Last_Batch_Time_Unit_Dropdown(): Locator {
    return this.page.locator("//input[@id='lastBatchTime']/following-sibling::div//select[@aria-label=\"Default dropdown selection\"]");
  }

  get Month_Dropdown(): Locator {
    return this.page.locator("//select[@title=\"Select month\"]");
  }

  Next_Business_Date(NextBusinessDateCalender1:String,NextBusinessDateCalender2:String ): Locator {
    return this.page.locator(`//div[@aria-label=\"${NextBusinessDateCalender1}\" or @aria-label=\"${NextBusinessDateCalender2}\"]`);
  }

  get Real_time_On_Radio_Button(): Locator {
    return this.page.locator("//input[@id=\"pricingMode-0-on\"]");
  }

  get Required_Day_From_Calender(): Locator {
    return this.page.locator("//div[@role=\"gridcell\"]//span[text()=\" $|CurrentDay| \"]");
  }

  get Required_Month(): Locator {
    return this.page.locator("//select[@title=\"Select month\"]/option[@value=\"$|CurrentMonth|\"]");
  }

  get Required_Year(): Locator {
    return this.page.locator("//select[@title=\"Select year\"]//option[text()=\"$|CurrentYear|\"]");
  }

  get Select_Date_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Select Date\"]");
  }

  Tomorrow_date(TomorrowsDateCalender: string): Locator {
    return this.page.locator(`//div[@aria-label="${TomorrowsDateCalender}"]`);
  }

  get Year_Dropdown(): Locator {
    return this.page.locator("//select[@title=\"Select year\"]");
  }

}