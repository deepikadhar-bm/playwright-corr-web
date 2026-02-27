// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { PlaywrightHelpers } from '../../../src/helpers/AddonHelpers';

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

  test('REG_TS21_TC01_Verify the Apply/Clear filter for current day and Verify the list should display the records from current day only', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Closed_List_Tab.click();
    await page.waitForTimeout(10000);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Selecting_Date_from_the_filters_by_fetching_the_first_comm_d(page, vars);
    await applyFiltersButtonPage.Apply_Filters_Button.click();

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

    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
      await commitmentListPage.Comm_Date_column.first().waitFor({ state: 'visible' });
      vars["ActualCommDate"] = await commitmentListPage.Comm_Date_column.first().textContent() || '';
      Methods.trimtestdata(vars["ExpectedCommDate"], "ExpectedCommDate");
      await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.Comm_Date_column, vars["ExpectedCommDate"]);
      const isNextDisabled = nextButtonCount > 0 ? await NextButton.getAttribute('aria-disabled') : 'true';
      if (isNextDisabled === 'false') {
        await correspondentPortalPage.Go_to_Next_Page_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      }
      Methods.MathematicalOperation(vars["count"], '+', 1, "count");
    }

    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
    vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");
    await priceOfferedPage.Remove_Date_FilterCross_Symbol.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    // await priceOfferedPage.SelectAllCheckBox.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
    vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["ExportSelectedCountAfterRemovingFilters"], "ExportSelectedCountAfterRemovingFilters");
    Methods.verifyComparison(vars["ExportSelectedCountAfterRemovingFilters"], '>', vars["ExportSelectedCountAfterApplyingFilters"]);
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.uncheck();
    await stepGroups.stepGroup_Selecting_Date_from_the_filters_by_fetching_the_first_comm_d(page, vars);
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();    // await page.waitForTimeout(3000);
    vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");
    await commitmentListPage.Clear_all_ButtonCommitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    // await priceOfferedPage.SelectAllCheckBox.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
    await page.waitForTimeout(3000);
    vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["ExportSelectedCountAfterRemovingFilters"], "ExportSelectedCountAfterRemovingFilters");
    // expect(String(vars["ExportSelectedCountAfterRemovingFilters"])).toBe(vars["ExportSelectedCountAfterApplyingFilters"]);
    Methods.verifyComparison(vars["ExportSelectedCountAfterRemovingFilters"], '>', vars["ExportSelectedCountAfterApplyingFilters"]);
  });
});