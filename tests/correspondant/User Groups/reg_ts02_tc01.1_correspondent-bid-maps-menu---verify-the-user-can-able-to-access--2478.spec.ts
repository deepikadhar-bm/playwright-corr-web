// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { FilterEnumerationsDropdownPage } from '../../../src/pages/correspondant/filter-enumerations-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let filterEnumerationsDropdownPage: FilterEnumerationsDropdownPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    filterEnumerationsDropdownPage = new FilterEnumerationsDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC01.1_Correspondent Bid Maps Menu - Verify the User can able to access all the Features in the Dashboard Module.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Heading_Dashboard).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Heading_Bid_Requests).toBeVisible();
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.waitFor({ state: 'visible' });
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Heading_Mappings).toBeVisible();
    await correspondentPortalPage.Dashboard_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["Count"] = "1";
    for (let dataIdx = parseInt(vars["Count"]); dataIdx <= 4; dataIdx++) {
      await correspondentPortalPage.Select_Date_Range_Dropdown1.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.Category_Name).toBeVisible();
      await correspondentPortalPage.Category_Name.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.Category_Name).toBeVisible();
      vars["TotalCommitments"] = await correspondentPortalPage.Total_Commitments.textContent() || '';
      vars["Count"] = (parseFloat(String(vars["Count"])) + parseFloat(String("1"))).toFixed(0);
    }
    await correspondentPortalPage.Select_Date_Range_Dropdown1.click();
    await correspondentPortalPage.Datepicker_Button.waitFor({ state: 'visible' });
    vars["CurrentDateFromDropdown"] = await correspondentPortalPage.Current_Date_On_Filters.inputValue() || '';
    expect(String(vars["CurrentDateFromDropdown"])).toBe(new Date().toLocaleDateString('en-US') /* format: yyyy-MM-dd */);
    await correspondentPortalPage.Datepicker_Button.click();
    await correspondentPortalPage.Current_Date_From_Calendar.dblclick();
    vars["CurrentDate"] = new Date().toLocaleDateString('en-US') /* format: d-M-yyyy */;
    vars["FutureDate"] = (() => { const d = new Date(String(vars["CurrentDate"])); d.setDate(d.getDate() + parseInt(String("2"))); return d.toLocaleDateString('en-US'); /* format: d-M-yyyy */ })();
    await correspondentPortalPage.Future_Date_In_Colander.click();
    await correspondentPortalPage.Apply_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Apply_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ActualSelectedDateRange"] = await correspondentPortalPage.Selected_Date_Range.textContent() || '';
    vars["ActualSelectedDateRange"] = String(vars["ActualSelectedDateRange"]).trim();
    vars["SelectedFutureDateRange"] = (() => {
      const d = new Date(String(vars["FutureDate"]));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "yyyy/MM/dd".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    vars["CurrentDate"] = new Date().toLocaleDateString('en-US') /* format: yyyy/MM/dd */;
    vars["ExpectedSelectedDateRange"] = String(vars["CurrentDate"]) + "-" + String(vars["SelectedFutureDateRange"]);
    expect(String(vars["ExpectedSelectedDateRange"])).toBe(vars["ActualSelectedDateRange"]);
    await correspondentPortalPage.All_Companies_Dropdown.click();
    await correspondentPortalPage.Search_Field_For_Company.waitFor({ state: 'visible' });
    vars["CompanyName"] = await bidRequestPage.First_Company_Name_Text.textContent() || '';
    await correspondentPortalPage.Company_Check_Box.check();
    await correspondentPortalPage.Apply_Selected_Button1.waitFor({ state: 'visible' });
    await filterEnumerationsDropdownPage.Show_Selected_Filter.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["TotalSelectedCompiniesCount"] = String(await correspondentPortalPage.Selected_CompaniesBid_Req_Filters.count());
    vars["TotalShowedCompiniesCount"] = String(await correspondentPortalPage.Total_Dropdown_Companies.count());
    expect(String(vars["TotalSelectedCompiniesCount"])).toBe(vars["TotalShowedCompiniesCount"]);
    await correspondentPortalPage.Show_All_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["TotalCompiniesCount"] = String(await correspondentPortalPage.Total_Dropdown_Companies.count());
    expect(String(vars["TotalCompiniesCount"])).toBe(vars["TotalSelectedCompiniesCount"]);
    await correspondentPortalPage.Apply_Selected_Button1.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.All_Companies_Dropdown.click();
    if (true) /* Checkbox Company Check Box is checked */ {
      await correspondentPortalPage.Company_Check_Box.uncheck();
    }
    await correspondentPortalPage.Search_Field_For_Company.waitFor({ state: 'visible' });
    await correspondentPortalPage.Search_Field_For_Company.fill(vars["CompanyName"]);
    await expect(correspondentPortalPage.Searched_Company).toBeVisible();
    await correspondentPortalPage.Clear_Search_Button.click();
    await correspondentPortalPage.Select_All_Companies_Check_Box.waitFor({ state: 'visible' });
    vars["TotalCompiniesCount"] = String(await correspondentPortalPage.Total_Dropdown_Companies.count());
    await correspondentPortalPage.Select_All_Companies_Check_Box.check();
    await correspondentPortalPage.Apply_Selected_Button1.waitFor({ state: 'visible' });
    vars["TotalSelectedCompiniesCount"] = await correspondentPortalPage.Selected_Companies_Count.textContent() || '';
    vars["TotalSelectedCompiniesCount"] = String(vars["TotalSelectedCompiniesCount"]).trim();
    expect(String(vars["TotalCompiniesCount"])).toBe(vars["TotalSelectedCompiniesCount"]);
    await correspondentPortalPage.Apply_Selected_Button1.click();
  });
});
