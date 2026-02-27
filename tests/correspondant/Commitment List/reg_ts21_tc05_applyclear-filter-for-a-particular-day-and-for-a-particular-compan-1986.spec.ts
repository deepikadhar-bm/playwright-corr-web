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

  test('REG_TS21_TC05_Apply/Clear filter for a particular day and for a particular company in open list list and verify that same filter should be applied in closed list', async ({ page }) => {
    vars["CompanyNameInFilters"] = "Fre";

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Current_Date_On_Filters.click();
    Methods.getCurrentTimestamp('d-M-yyyy', 'CurrentDate', 'UTC');
    console.log("CurrentDate:", vars["CurrentDate"]);

    await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
    await correspondentPortalPage.Apply_Button.click();

    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await priceOfferedPage.Search_In_Select_Company.click();
    await priceOfferedPage.Search_In_Select_Company.fill(vars["CompanyNameInFilters"]);
    await priceOfferedPage.Check_Company.first().click();
    vars["SelectedCompanyName"] = await priceOfferedPage.Selected_Company.first().textContent() || '';
    Methods.splitBySpecialChar(vars["SelectedCompanyName"], "(", "0", "SelectedCompanyName");
    Methods.trimtestdata(vars["SelectedCompanyName"], "SelectedCompany");
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });

    Methods.convertDateFormat(vars["CurrentDate"], 'd-M-yyyy', 'yyyy/MM/dd', 'CurrentDateChip');
    Methods.concatenateWithSpace("Date:", vars["CurrentDateChip"], "CurrentDateWithTextDate");
    Methods.concatenateWithSpace("Company:", vars["SelectedCompanyName"], "CompanyWithText");

    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["SelectedCompanyName"]);
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["CurrentDateChip"]);
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["CurrentDateWithTextDate"]);
    await expect(commitmentListPage.Company_Filter_ChipCommitted_Page).toContainText(vars["CompanyWithText"]);

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
      Methods.convertDateFormat(vars["CurrentDate"], 'd-M-yyyy', 'MM/dd/yyyy', 'ExpectedDate');
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
        await commitmentListPage.Committed_Date.first().waitFor({ state: 'visible' });
        await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.Committed_Date, vars["ExpectedDate"]);
        await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Price_Offered_Company_Name_Column_Data, vars["SelectedCompanyName"]);
        const isNextDisabled = nextButtonCount > 0 ? await NextButton.getAttribute('aria-disabled') : 'true';
        if (isNextDisabled === 'false') {
          await correspondentPortalPage.Go_to_Next_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        Methods.MathematicalOperation(vars["count"], '+', 1, "count");
      }
    }

    await commitmentListPage.Closed_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["CurrentDateChip"]);
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["CurrentDateWithTextDate"]);
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["SelectedCompanyName"]);
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["CompanyWithText"]);

    const noResults2 = page.getByText('No result', { exact: true });
    await page.waitForTimeout(2000);

    if (await noResults2.isVisible()) {
      console.log('No results present on current page');
    } else {
      await stepGroups.stepGroup_Data_Verification_After_Applying_FiltersCommitment_List(page, vars);
    }
  });
});