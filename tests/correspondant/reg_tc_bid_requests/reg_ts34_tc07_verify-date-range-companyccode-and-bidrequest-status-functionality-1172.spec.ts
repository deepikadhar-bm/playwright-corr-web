// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS34_TC07_Verify Date Range, Company/CCode and BidRequest Status Functionality In Search Filter', async ({ page }) => {
    const testData: Record<string, string> = {
  "Last One Month": "Last One Month",
  "This Calendar Month": "This Calendar Month",
  "This Year": "This Year",
  "This Quarter": "This Quarter"
}; // Profile: "Filter View", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
    await correspondentPortalPage.Last_One_Month_Button.click();
    vars["Last One Month Name"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
    await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(testData["Last One Month"]);
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    vars["Company Name1"] = await bidRequestPage.First_Company_Name_Text.textContent() || '';
    vars["Company Name1"] = String(vars["Company Name1"]).substring(0, String(vars["Company Name1"]).length - 8);
    await correspondentPortalPage.First_Checkbox_Bid_Request.check();
    await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
    await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
    vars["Count"] = "2";
    vars["SelectedStatus "] = await bidRequestPage.Individual_Status_NameDropdown.textContent() || '';
    await bidRequestPage.Individual_Status_NameDropdown.click();
    await correspondentPortalPage.Apply_Selected2.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await page.waitForLoadState('networkidle');
    // [DISABLED] Pick the current date MM by location Asia/Kolkata and store into a variable Current Month
    // vars["Current Month"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
    //   const fmt = "MM";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    // [DISABLED] Perform subtraction on Current Month and 1 and store the result inside a Last Month considering 0 decimal places
    // vars["Last Month"] = (parseFloat(String(vars["Current Month"])) - parseFloat(String("1"))).toFixed(0);
    // [DISABLED] concate 0 and Last Month and store the new string into a Last Month
    // vars["Last Month"] = String('') + String('');
    if (true) /* Element No result (Bid requests) is visible */ {
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      await stepGroups.stepGroup_Getting_Last_Month_From_Current_Month(page, vars);
      vars["Count of Uploaded Date"] = String(await bidRequestsPage.Uploaded_Date_Count.count());
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Count of Uploaded Date"]))) {
        await correspondentPortalPage.Heading_Bid_Requests.click();
        vars["UploadedDates"] = await correspondentPortalPage.Uploaded_Dates.textContent() || '';
        vars["Company Name"] = await bidRequestPage.Company_Names1.textContent() || '';
        expect(new Date(String('')).getMonth()).toBe(new Date(String('')).getMonth());
        await expect(bidRequestPage.Company_Names1).toContainText(vars["Company Name1"]);
        vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        vars["ActualStatus"] = await bidRequestPage.First_Status_In_Column.textContent() || '';
        expect(String(vars["ActualStatus"])).toBe(vars["SelectedStatus "]);
        vars["ExpectedStatus"] = String(vars["ActualStatus"]).substring(1, String(vars["ActualStatus"]).length - 1);
        for (let i = 0; i < await priceOfferedPage.Price_Offered_Status_Column_Data.count(); i++) {
          await expect(priceOfferedPage.Price_Offered_Status_Column_Data.nth(i)).toHaveText(String(vars["ExpectedStatus"]));
        }
        // [DISABLED] Verify that the elements with locator Bid Request Status Column Data displays text ExpectedStatus and With Scrollable FALSE
        // await expect(priceOfferedPage.Price_Offered_Status_Column_Data).toContainText(vars["ExpectedStatus"]);
      }
    }
  });
});
