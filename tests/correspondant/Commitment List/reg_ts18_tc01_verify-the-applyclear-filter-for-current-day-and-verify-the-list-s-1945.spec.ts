import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers} from '../../../src/helpers/AddonHelpers';
import { waitForSpinnerToDisappear } from '@helpers/wait-helpers';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test('REG_TS18_TC01_Verify the Apply/Clear filter for current day and verify the list should display the records from current day only', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Current_Date_On_Filters.click();
    Methods.getCurrentTimestamp('d-M-yyyy', 'CurrentDate', 'America/New_York');
    console.log("CurrentDate:", vars["CurrentDate"]);

    await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
    await correspondentPortalPage.Apply_Button.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });

    Methods.convertDateFormat(vars["CurrentDate"], 'd-M-yyyy', 'yyyy/MM/dd', 'ExpectedDateChip');
    console.log("ExpectedDateChip:", vars["ExpectedDateChip"]);
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedDateChip"]);

    const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
    const isDisabled = await NextButton.getAttribute('aria-disabled');
    console.log("isDisabled:", isDisabled);

    const noResults = page.getByText('No result', { exact: true });
    await page.waitForTimeout(2000);

    if (await noResults.isVisible()) {
      console.log('No results present on current page');
    } else {
      if (isDisabled === 'false') {
        vars['CountofPages'] = '2';
      } else {
        vars['CountofPages'] = '1';
      }

      console.log("CountofPages:", vars["CountofPages"]);
      vars["count"] = "1";

      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
        Methods.convertDateFormat(vars["CurrentDate"], 'd-M-yyyy', 'MM/dd/yyyy', 'ExpectedDate');
        console.log("ExpectedDate:", vars["ExpectedDate"]);
        await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.CommitedDateVerification, vars['ExpectedDate']);
        const isDisabled = await NextButton.getAttribute('aria-disabled');
        if (isDisabled === 'false') {
          await correspondentPortalPage.Go_to_Next_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        Methods.MathematicalOperation(vars["count"], '+', 1, "count");
      }
    }

    console.log("cross symbel verification done");
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");

    await priceOfferedPage.Remove_Date_FilterCross_Symbol.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();

    await page.reload();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Export_Selected_Count.waitFor({ state: 'visible' });
    vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["ExportSelectedCountAfterRemovingFilters"], "ExportSelectedCountAfterRemovingFilters");
    Methods.verifyComparison(vars["ExportSelectedCountAfterRemovingFilters"], '>', vars["ExportSelectedCountAfterApplyingFilters"]);

    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.waitForTimeout(6000);

    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Current_Date_On_Filters.click();
    await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
    await correspondentPortalPage.Apply_Button.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await page.waitForTimeout(10000);

    Methods.convertDateFormat(vars["CurrentDate"], 'd-M-yyyy', 'yyyy/MM/dd', 'CurrentDateChip');
    Methods.concatenateWithSpace("Date:", vars["CurrentDateChip"], "CurrentDateWithTextDate");
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["CurrentDateWithTextDate"]);

    const noResults1 = page.getByText('No result', { exact: true });
    await page.waitForTimeout(2000);

    if (await noResults1.isVisible()) {
      console.log('No results present on current page');
    } else {
      const isDisabled2 = await NextButton.getAttribute('aria-disabled');
      if (isDisabled2 === 'false') {
        vars["CountofPages"] = "2";
      } else {
        vars["CountofPages"] = "1";
      }

      vars["count"] = "1";

      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
        await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.CommitedDateVerification, vars['ExpectedDate']);
        const isDisabled2 = await NextButton.getAttribute('aria-disabled');
        if (isDisabled2 === 'false') {
          await correspondentPortalPage.Go_to_Next_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        Methods.MathematicalOperation(vars["count"], '+', 1, "count");
      }

      
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
      await priceOfferedPage.Export_Selected_Count.waitFor({ state: 'visible' });

      vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
      Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");

      await commitmentListPage.Clear_all_ButtonCommitment_List.click();
      await page.reload();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();

      await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();

      vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
      Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["ExportSelectedCountAfterRemovingFilters"], "ExportSelectedCountAfterRemovingFilters");

      // expect(String(vars["ExportSelectedCountAfterRemovingFilters"])).toBe(vars["ExportSelectedCountAfterApplyingFilters"]);
      Methods.verifyComparison(vars["ExportSelectedCountAfterRemovingFilters"], '>' ,vars["ExportSelectedCountAfterApplyingFilters"]);
    }
  });
});