// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { PlaywrightHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: PlaywrightHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new PlaywrightHelpers(page, vars);
  });
  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);
  test('REG_TS21_TC04_Apply/Clear filter for a particular day and for a particular company in closed list list and verify that same filter should be applied in open list)', async ({ page }) => {
    if (profile && profile.data) {
      const companyName = profile.data[0]['CompanyNameInFilters'];
      console.log("company name from tdp:", companyName);
      vars["CompanyNameInFilters"] = companyName;
    }

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Selecting_Date_from_the_filters_by_fetching_the_first_comm_d(page, vars);
    Methods.convertDateFormat(vars["ExpectedCommDate"], 'MM/dd/yyyy', 'd-M-yyyy', 'ExpectedChipDate');

    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await priceOfferedPage.Search_In_Select_Company.click();
    await priceOfferedPage.Search_In_Select_Company.fill(vars["CompanyNameInFilters"]);
    await priceOfferedPage.Check_Company.first().click();
    vars["SelectedCompanyName"] = await priceOfferedPage.Selected_Company.textContent() || '';
    Methods.splitBySpecialChar(vars["SelectedCompanyName"], "(", "0", "SelectedCompanyName");
    Methods.trimtestdata(vars["SelectedCompanyName"], "SelectedCompany");
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

    const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
    const nextButtonCount = await NextButton.count();
    vars["count"] = "1";
    vars["CountofPages"] = "1";

    if (nextButtonCount > 0) {
      const isDisabled = await NextButton.getAttribute('aria-disabled');
      console.log("isDisabled:", isDisabled);
      if (isDisabled === 'false') {
        vars["CountofPages"] = "2";
      }
    }

    const noResults = page.getByText('No result', { exact: true });
    await page.waitForTimeout(2000);

    if (await noResults.isVisible()) {
      console.log('No results present on current page');
    } else {
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
        await commitmentListPage.Committed_Date.waitFor({ state: 'visible' });
        await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.Committed_Date, vars["ExpectedCommDate"]);
        await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Price_Offered_Company_Name_Column_Data, vars["SelectedCompanyName"]);
        const isNextDisabled = nextButtonCount > 0 ? await NextButton.getAttribute('aria-disabled') : 'true';
        if (isNextDisabled === 'false') {
          await correspondentPortalPage.Go_to_Next_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        Methods.MathematicalOperation(vars["count"], '+', 1, "count");
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

    const nextButtonCount2 = await NextButton.count();
    vars["count"] = "1";
    vars["CountofPages"] = "1";

    if (nextButtonCount2 > 0) {
      const isDisabled2 = await NextButton.getAttribute('aria-disabled');
      console.log("isDisabled2:", isDisabled2);
      if (isDisabled2 === 'false') {
        vars["CountofPages"] = "2";
      }
    }

    const noResults2 = page.getByText('No result', { exact: true });
    await page.waitForTimeout(2000);

    if (await noResults2.isVisible()) {
      console.log('No results present on current page');
    } else {
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
        await commitmentListPage.Committed_Date.waitFor({ state: 'visible' });
        // for (let i = 0; i < await commitmentListPage.Committed_Date.count(); i++) {
        //   await expect(commitmentListPage.Committed_Date.nth(i)).toHaveText(String(vars["ExpectedCommDate"]));
        // }
        await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.Committed_Date, vars["ExpectedCommDate"]);
        // for (let i = 0; i < await priceOfferedPage.Price_Offered_Company_Name_Column_Data.count(); i++) {
        //   await expect(priceOfferedPage.Price_Offered_Company_Name_Column_Data.nth(i)).toHaveText(String(vars["SelectedCompanyName"]));
        // }
        await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Price_Offered_Company_Name_Column_Data, vars["SelectedCompanyName"]);
        const isNextDisabled2 = nextButtonCount2 > 0 ? await NextButton.getAttribute('aria-disabled') : 'true';
        if (isNextDisabled2 === 'false') {
          await correspondentPortalPage.Go_to_Next_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        Methods.MathematicalOperation(vars["count"], '+', 1, "count");
      }
    }
  });
});