// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
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

  test('REG_TS19_TC07_Apply all three filters and verify the list and export action[count]', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    vars["RandomNumber"] = String(Math.floor(Math.random() * (5 - 1 + 1)) + 1);
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    if (String(vars["RandomNumber"]) === String("5")) {
      await correspondentPortalPage.Current_Date_On_Filters.click();
      vars["CurrentDate"] = new Date().toLocaleDateString('en-US') /* format: d-M-yyyy */;
      await correspondentPortalPage.Select_Current_DateAdd_Config.click();
      await correspondentPortalPage.Apply_Button.click();
      vars["SelectedDateRange"] = "Custom Date Range";
    } else {
      vars["SelectedDateRange"] = await priceOfferedPage.Select_Date_RangePopup.textContent() || '';
      await priceOfferedPage.Select_Date_RangePopup.click();
    }
    vars["space"] = "key_blank";
    if (String(vars["SelectedDateRange"]) === String("Custom Date Range")) {
      vars["CurrentDate"] = new Date().toLocaleDateString('en-US') /* format: yyyy/MM/dd */;
      vars["SelectedDateRangeText"] = "Date:" + vars["space"] + vars["CurrentDate"];
    } else {
      vars["SelectedDateRangeText"] = "Date:" + vars["space"] + vars["SelectedDateRange"];
    }
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    vars["RandomNumberCompany"] = String(Math.floor(Math.random() * (2 - 1 + 1)) + 1);
    await priceOfferedPage.Select_Company_Search_Field.click();
    if (String(vars["RandomNumberCompany"]) === String("1")) {
      await priceOfferedPage.Select_Company_Search_Field.fill("Freedom");
      await priceOfferedPage.Freedom_Checkbox.check();
    } else if (String(vars["RandomNumberCompany"]) === String("2")) {
      await priceOfferedPage.Select_Company_Search_Field.fill("American Pacific");
      await priceOfferedPage.American_Pacific_Checkbox.check();
    }
    vars["SelectedCompanyName"] = await priceOfferedPage.Selected_CompanyPrice_Offered.textContent() || '';
    vars["FilteredCompanyName"] = String(vars["SelectedCompanyName"]).substring(0, String(vars["SelectedCompanyName"]).length - 8);
    await correspondentPortalPage.Apply_Selected.click();
    vars["SelectedCompanyNameText"] = "Company:" + vars["space"] + vars["SelectedCompanyName"];
    await correspondentPortalPage.Select_Commitments_Status_Dropdown.click();
    await priceOfferedPage.Check_Commitments_Status.check();
    vars["SelectedCommitmentsStatus"] = await priceOfferedPage.Selected_Commitments_Status.textContent() || '';
    vars[""] = String("SelectedCommitmentsStatusText").replace("", "");
    vars["SelectedCommitmentsStatusText"] = String(vars["SelectedCommitmentsStatusText"]).toUpperCase();
    vars["SelectedCommitmentsStatusText"] = "Status:" + vars["space"] + vars["SelectedCommitmentsStatusText"];
    await correspondentPortalPage.Apply_Selected2.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["TotalChipsCount"] = String(await priceOfferedPage.Total_Chips_Count.count());
    expect(String(vars["TotalChipsCount"])).toBe("3");
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["SelectedDateRangeText"]);
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["SelectedCompanyNameText"]);
    await expect(priceOfferedPage.Status_Filter_ChipPrice_Offered_Page).toContainText(vars["SelectedCommitmentsStatusText"]);
    if (true) /* Element Data Table No Results(Price Offered) is visible */ {
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      vars["CurrentMonth"] = (() => {
        const d = new Date();
        const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
        const fmt = "MM";
        // Map Java date format to Intl parts
        const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
        const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
        return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
      })();
      if (String(vars["SelectedDateRange"]) === String("Last One Month")) {
        if (String(vars["CurrentMonth"]) === String("01")) {
          vars["LastMonth"] = "12";
        } else {
          vars["LastMonth"] = (parseFloat(String(vars["CurrentMonth"])) - parseFloat(String("1"))).toFixed(0);
        }
        if (String("1,2,3,4,5,6,7,8,9").includes(String(vars["LastMonth"]))) {
          vars["LastMonth"] = String('') + String('');
        }
        vars["count"] = "1";
        vars["RequestedDateCount"] = String(await priceOfferedPage.Date_VErification.count());
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RequestedDateCount"]))) {
          vars["LastOneMonth"] = await bidRequestPage.Individual_Requested_Date.textContent() || '';
          expect(new Date(String('')).getMonth()).toBe(new Date(String('')).getMonth());
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
      } else if (String(vars["SelectedDateRange"]) === String("This Calendar Month")) {
        vars["count"] = "1";
        vars["RequestedDateCount"] = String(await priceOfferedPage.Date_VErification.count());
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RequestedDateCount"]))) {
          vars["ThisCalenderMonth"] = await bidRequestPage.Individual_Requested_Date.textContent() || '';
          expect(new Date(String('')).getMonth()).toBe(new Date(String('')).getMonth());
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
      } else if (String(vars["SelectedDateRange"]) === String("This Quarter")) {
        vars["Quarter1"] = "01,02,03";
        vars["Quarter2"] = "04,05,06";
        vars["Quarter3"] = "07,08,09";
        vars["Quarter4"] = "10,11,12";
        vars["CurrentMonth"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
          const fmt = "MM";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
        })();
        vars["count"] = "1";
        vars["RequestedDateCount"] = String(await priceOfferedPage.Date_VErification.count());
        if (String(vars["Quarter1"]).includes(String(vars["CurrentMonth"]))) {
          while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RequestedDateCount"]))) {
            vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Requested_Date.textContent() || '';
            vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9);
            expect(String(vars["Quarter1"])).toBe(vars["IndividualQuarterDate"]);
            vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
          }
        } else if (String(vars["Quarter2"]).includes(String(vars["CurrentMonth"]))) {
          while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RequestedDateCount"]))) {
            vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Requested_Date.textContent() || '';
            vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9);
            expect(String(vars["Quarter2"])).toBe(vars["IndividualQuarterDate"]);
            vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
          }
        } else if (String(vars["Quarter3"]).includes(String(vars["CurrentMonth"]))) {
          while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RequestedDateCount"]))) {
            vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Requested_Date.textContent() || '';
            vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9);
            expect(String(vars["Quarter3"])).toBe(vars["IndividualQuarterDate"]);
            vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
          }
        } else if (String(vars["Quarter4"]).includes(String(vars["CurrentMonth"]))) {
        }
      }
    }
  });
});
