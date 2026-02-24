// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS34_TC04_Verify With All Filters In Date Range Filter', async ({ page }) => {
    const testData: Record<string, string> = {
  "Last One Month": "Last One Month",
  "This Calendar Month": "This Calendar Month",
  "This Quarter": "This Quarter",
  "This Year": "This Year"
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
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    if (true) /* Element No result (Bid requests) is visible */ {
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      await stepGroups.stepGroup_Getting_Last_Month_From_Current_Month(page, vars);
      vars["count"] = "1";
      vars["All Uploaded Date Count"] = String(await bidRequestPage.Uploaded_Date_Count.count());
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["All Uploaded Date Count"]))) {
        vars["IndividualDate"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
        expect(new Date(String('')).getMonth()).toBe(new Date(String('')).getMonth());
        vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
      }
    }
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
    await bidRequestPage.This_Calendar_Month_Option.click();
    vars["This Calendar Month"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
    await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(testData["This Calendar Month"]);
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await page.waitForLoadState('networkidle');
    if (true) /* Element No result (Bid requests) is visible */ {
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      vars["count"] = "1";
      vars["DateCount"] = String(await bidRequestPage.Uploaded_Date_Count.count());
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DateCount"]))) {
        vars["IndividualDate"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
        expect(new Date(String('')).getMonth()).toBe(new Date(String('')).getMonth());
        vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
      }
    }
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
    await correspondentPortalPage.This_Quarter_Button.click();
    vars["This Quarter Button"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
    await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(testData["This Quarter"]);
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    if (true) /* Verify if Last Month == 01 */ {
      // [DISABLED] Store 12 in Month Before Last Month
      // vars["Month Before Last Month"] = "12";
    } else {
      // [DISABLED] Perform subtraction on Last Month and 1 and store the result inside a Month Before Last Month considering 0 decimal places
      // vars["Month Before Last Month"] = (parseFloat(String(vars["Last Month"])) - parseFloat(String("1"))).toFixed(0);
    }
    if (true) /* Verify if 1,2,3,4,5,6,7,8,9 contains Month Before Last Month */ {
      // [DISABLED] concate 0 and Month Before Last Month and store the new string into a Month Before Last Month
      // vars["Month Before Last Month"] = String('') + String('');
    }
    // [DISABLED] Concate Current Month and Last Month with SpecialCharacter , and store into a variable Current And Last Month
    // vars["Current And Last Month"] = String(vars["Current Month"]) + "," + String(vars["Last Month"]);
    // [DISABLED] Concate Current And Last Month and Month Before Last Month with SpecialCharacter , and store into a variable QuarterMonths
    // vars["QuarterMonths"] = String(vars["Current And Last Month"]) + "," + String(vars["Month Before Last Month"]);
    await page.waitForLoadState('networkidle');
    if (true) /* Element No result (Bid requests) is visible */ {
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      vars["Quarter1"] = "01,02,03";
      vars["Quarter2"] = "04,05,06";
      vars["Quarter3"] = "07,08,09";
      vars["Quarter4"] = "10,11,12";
      vars["count"] = "1";
      vars["DatesCount"] = String(await bidRequestPage.Uploaded_Date_Count.count());
      if (String(vars["Quarter1"]).includes(String(vars["Current Month"]))) {
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DatesCount"]))) {
          vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
          vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9);
          expect(String(vars["Quarter1"])).toBe(vars["IndividualQuarterDate"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        }
      } else if (String(vars["Quarter2"]).includes(String(vars["Current Month"]))) {
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DatesCount"]))) {
          vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
          vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9);
          expect(String(vars["Quarter2"])).toBe(vars["IndividualQuarterDate"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        }
      } else if (String(vars["Quarter3"]).includes(String(vars["Current Month"]))) {
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DatesCount"]))) {
          vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
          vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9);
          expect(String(vars["Quarter3"])).toBe(vars["IndividualQuarterDate"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        }
      } else {
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DatesCount"]))) {
          vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
          vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9);
          expect(String(vars["Quarter4"])).toBe(vars["IndividualQuarterDate"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        }
      }
    }
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
    await correspondentPortalPage.This_Year_Button.click();
    vars["This Year Button"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
    await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(testData["This Year"]);
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await page.waitForLoadState('networkidle');
    vars["Current Year"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
      const fmt = "yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["count"] = "1";
    vars["Date Count"] = String(await bidRequestPage.Uploaded_Date_Count.count());
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Date Count"]))) {
      vars["DateInList"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
    }
  });
});
