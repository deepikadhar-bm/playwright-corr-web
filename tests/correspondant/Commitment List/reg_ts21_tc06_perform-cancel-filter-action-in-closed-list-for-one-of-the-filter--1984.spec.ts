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

  test('REG_TS21_TC06_Perform cancel filter action in closed list for one of the filter applied, and then verify that the filter is cleared in both the closed and open list sections', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Closed_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.waitFor({ state: 'visible' });
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Last_One_Month_Button.click();
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.waitFor({ state: 'visible' });
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await priceOfferedPage.Check_Company.first().check();
    await correspondentPortalPage.Apply_Selected.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Apply_Selected).toBeEnabled
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.waitFor({ state: 'visible' });
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();

    const noResultsClosedList = page.getByText('No result', { exact: true });
    await page.waitForTimeout(2000);

    if (await noResultsClosedList.isVisible()) {
      vars["RecordsCountWithFilterClosedList"] = "0";
    } else {
      await priceOfferedPage.Select_all_for_Checkbox.check();
      await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
      vars["RecordsCountWithFilterClosedList"] = await commitmentListPage.Export_Selected.textContent() || '';
      Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["RecordsCountWithFilterClosedList"], "RecordsCountWithFilterClosedList");
      console.log("RecordsCountWithFilterClosedList:", vars["RecordsCountWithFilterClosedList"]);
    }

    await commitmentListPage.Open_List_Tab.click();
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();

    const noResultsOpenList = page.getByText('No result', { exact: true });
    await page.waitForTimeout(2000);

    if (await noResultsOpenList.isVisible()) {
      vars["RecordsCountWithFilterOpenList"] = "0";
    } else {
      if (!(await priceOfferedPage.Select_all_for_Checkbox.isChecked())) {
        await priceOfferedPage.Select_all_for_Checkbox.check();
      }
      await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
      vars["RecordsCountWithFilterOpenList"] = await commitmentListPage.Export_Selected.textContent() || '';
      Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["RecordsCountWithFilterOpenList"], "RecordsCountWithFilterOpenList");
      console.log("RecordsCountWithFilterOpenList:", vars["RecordsCountWithFilterOpenList"]);
    }

    await commitmentListPage.Closed_List_Tab.click();
    await priceOfferedPage.Remove_Date_FilterCross_Symbol.waitFor({ state: 'visible' });
    await priceOfferedPage.Remove_Date_FilterCross_Symbol.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    // await priceOfferedPage.Select_all_for_Checkbox.check();
    if (!(await priceOfferedPage.Select_all_for_Checkbox.isChecked())) {
      await priceOfferedPage.Select_all_for_Checkbox.check();
    }
    await page.waitForTimeout(10000);
    await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
    vars["RecordsCountWithoutFilterClosedList"] = await commitmentListPage.Export_Selected.textContent() || '';
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["RecordsCountWithoutFilterClosedList"], "RecordsCountWithoutFilterClosedList");
    console.log("RecordsCountWithoutFilterClosedList:", vars["RecordsCountWithoutFilterClosedList"]);
    Methods.verifyComparison(vars["RecordsCountWithFilterClosedList"], "<", vars["RecordsCountWithoutFilterClosedList"]);
    console.log("verification done in closed list");

    await commitmentListPage.Open_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    // await priceOfferedPage.Select_all_for_Checkbox.check();
    if (!(await priceOfferedPage.Select_all_for_Checkbox.isChecked())) {
      await priceOfferedPage.Select_all_for_Checkbox.check();
    }
    await page.waitForTimeout(10000);
    await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
    vars["RecordsCountWithoutFilterOpenList"] = await commitmentListPage.Export_Selected.textContent() || '';
    console.log("RecordsCountWithoutFilterOpenList:", vars["RecordsCountWithoutFilterOpenList"]);
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["RecordsCountWithoutFilterOpenList"], "RecordsCountWithoutFilterOpenList");
    Methods.verifyComparison(vars["RecordsCountWithFilterOpenList"], "<", vars["RecordsCountWithoutFilterOpenList"]);
  });
});