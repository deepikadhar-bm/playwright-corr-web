// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS21_TC04_Apply/Clear filter for a particular day and for a particular company in closed list list and verify that same filter should be applied in open list)', async ({ page }) => {
    const testData: Record<string, string> = {
  "CompanyNameInFilters": "Fre",
  "RequestIdfor22-2.1": "87BQ7DB5C69B",
  "RequestIDCreated3rdScenario": "87YK9A2E0311",
  "BidMappingID": "Deepika Aug1",
  "RequestIdfor22-2.2": "87TS8C74F49F",
  "RequestIDfrom13-1": "87RS88D43BB6",
  "RequestIDfrom13-2": "578FE9EDEC6C",
  "RequestIDfrom22-1.2": "874KBED58307",
  "RequestIDfrom10-2": "872V960789CD",
  "RequestIDfrom11-1": "87ZB36778D61",
  "EditedChaseUsersTime": "3",
  "RequestIDCreated1stScenario": "87P80EB790BD",
  "RequestIDfrom10-3": "874WDCCDC3CE",
  "RequestIDfrom22-3.1": "877V3BF90360",
  "Expected Product(price offered)": "FN30",
  "RequestIDfrom22-1.1": "877V3BF90360",
  "RequestIDCreated2ndScenario": "87462B751677",
  "Expected Coupon(price offered)": "3.5",
  "Static Last Name(Pop Up Verfication)": "LN_Deepika_JULY_16_13",
  "RequestIDfrom24-1": "87E42DCFAFE8",
  "Company Name": "Freedom - A4187",
  "RequestIDfrom29-1": "57EFC2170915",
  "RequestIDfrom28-1": "87E15439E568",
  "NO of Batches": "5",
  "RequestIDfrom27-1": "87DEF1EBA5BD",
  "RequestIDFrom28-2": "878S25D7D52F",
  "StatusInFilters": "Price",
  "RequestIDCreated4rthScenario": "87145580866E"
}; // Profile: "Price Offered", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Selecting_Date_from_the_filters_by_fetching_the_first_comm_d(page, vars);
    vars["ExpectedChipDate"] = (() => {
      const d = new Date(String(vars["ExpectedCommDate"]));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "yyyy/MM/dd".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await priceOfferedPage.Search_In_Select_Company.click();
    await priceOfferedPage.Search_In_Select_Company.fill(testData["CompanyNameInFilters"]);
    await priceOfferedPage.Check_Company.click();
    vars["SelectedCompanyName"] = await priceOfferedPage.Selected_Company.textContent() || '';
    vars["SelectedCompanyName"] = String('').split("(")["0"] || '';
    vars["SelectedCompanyName"] = String(vars["SelectedCompanyName"]).trim();
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["SelectedCompanyName"]);
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedChipDate"]);
    vars["Space"] = "key_blank";
    vars["DateWithTextDate"] = "Date:" + vars["Space"] + vars["ExpectedChipDate"];
    vars["CompanyNamewithText"] = "Company:" + vars["Space"] + vars["SelectedCompanyName"];
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["DateWithTextDate"]);
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["CompanyNamewithText"]);
    if (true) /* Element Go to Next Page Button is enabled */ {
      vars["CountofPages"] = "2";
    } else {
      vars["CountofPages"] = "1";
    }
    vars["count"] = "1";
    if (true) /* Verify that the current page displays text No result */ {
    } else {
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
        await commitmentListPage.Committed_Date.waitFor({ state: 'visible' });
        for (let i = 0; i < await commitmentListPage.Committed_Date.count(); i++) {
          await expect(commitmentListPage.Committed_Date.nth(i)).toHaveText(String(vars["ExpectedCommDate"]));
        }
        for (let i = 0; i < await priceOfferedPage.Price_Offered_Company_Name_Column_Data.count(); i++) {
          await expect(priceOfferedPage.Price_Offered_Company_Name_Column_Data.nth(i)).toHaveText(String(vars["SelectedCompanyName"]));
        }
        if (true) /* Element Go to Next Page Button is enabled */ {
          await correspondentPortalPage.Go_to_Next_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }
    }
    await commitmentListPage.Open_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedChipDate"]);
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["DateWithTextDate"]);
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["SelectedCompanyName"]);
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["CompanyNamewithText"]);
    if (true) /* Verify that the current page displays text No result */ {
    } else {
      if (true) /* Element Go to Next Page Button is enabled */ {
        vars["CountofPages"] = "2";
      } else {
        vars["CountofPages"] = "1";
      }
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
        await commitmentListPage.Committed_Date.waitFor({ state: 'visible' });
        for (let i = 0; i < await commitmentListPage.Committed_Date.count(); i++) {
          await expect(commitmentListPage.Committed_Date.nth(i)).toHaveText(String(vars["ExpectedCommDate"]));
        }
        for (let i = 0; i < await priceOfferedPage.Price_Offered_Company_Name_Column_Data.count(); i++) {
          await expect(priceOfferedPage.Price_Offered_Company_Name_Column_Data.nth(i)).toHaveText(String(vars["SelectedCompanyName"]));
        }
        if (true) /* Element Go to Next Page Button is enabled */ {
          await correspondentPortalPage.Go_to_Next_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }
    }
  });
});
