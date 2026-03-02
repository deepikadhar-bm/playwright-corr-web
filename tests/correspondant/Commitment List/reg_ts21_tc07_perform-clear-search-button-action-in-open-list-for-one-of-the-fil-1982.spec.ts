import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';

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

  test('REG_TS21_TC07_Perform clear search button action in open list for one of the filter applied, and then verify that the filter is cleared in both the closed and open list sections', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.waitFor({ state: 'visible' });
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Last_One_Month_Button.click();
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.waitFor({ state: 'visible' });
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await priceOfferedPage.Check_Company.first().check();
    await correspondentPortalPage.Apply_Selected.waitFor({ state: 'visible' });
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.waitFor({ state: 'visible' });
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();

    const noResultsOpenList = page.getByText('No result', { exact: true });
    await page.waitForTimeout(2000);

    if (await noResultsOpenList.isVisible()) {
      vars["RecordsCountWithFilterOpenList"] = "0";
    } else {
      await priceOfferedPage.Select_all_for_Checkbox.check();
      vars["RecordsCountWithFilterOpenList"] = await commitmentListPage.Export_Selected.textContent() || '';
      Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["RecordsCountWithFilterOpenList"], "RecordsCountWithFilterOpenList");
      Methods.trimtestdata(vars["RecordsCountWithFilterOpenList"], "RecordsCountWithFilterOpenList");
    }

    await commitmentListPage.Closed_List_Tab.click();
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();

    const noResultsClosedList = page.getByText('No result', { exact: true });
    await page.waitForTimeout(2000);

    if (await noResultsClosedList.isVisible()) {
      vars["RecordsCountWithFilterClosedList"] = "0";
    } else {
      await priceOfferedPage.Select_all_for_Checkbox.check();
      vars["RecordsCountWithFilterClosedList"] = await commitmentListPage.Export_Selected.textContent() || '';
      Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["RecordsCountWithFilterClosedList"], "RecordsCountWithFilterClosedList");
      Methods.trimtestdata(vars["RecordsCountWithFilterClosedList"], "RecordsCountWithFilterClosedList");
    }
    await commitmentListPage.Open_List_Tab.click();
    await commitmentListPage.Clear_all_ButtonCommitment_List.waitFor({ state: 'visible' });
    await commitmentListPage.Clear_all_ButtonCommitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).not.toBeVisible();
    await page.waitForTimeout(2000)
    if (!(await priceOfferedPage.Select_all_for_Checkbox.isChecked())) {
        await priceOfferedPage.Select_all_for_Checkbox.check();
      }
    vars["RecordsCountWithoutFilterOpenList"] = await commitmentListPage.Export_Selected.textContent() || '';
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["RecordsCountWithoutFilterOpenList"], "RecordsCountWithoutFilterOpenList");
    Methods.verifyComparison(vars["RecordsCountWithFilterOpenList"], "<", vars["RecordsCountWithoutFilterOpenList"]);

    await commitmentListPage.Closed_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).not.toBeVisible();
    await page.waitForTimeout(2000)
    if (!(await priceOfferedPage.Select_all_for_Checkbox.isChecked())) {
        await priceOfferedPage.Select_all_for_Checkbox.check();
      }
    vars["RecordsCountWithoutFilterClosedList"] = await commitmentListPage.Export_Selected.textContent() || '';
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["RecordsCountWithoutFilterClosedList"], "RecordsCountWithoutFilterClosedList");
    Methods.trimtestdata(vars["RecordsCountWithoutFilterClosedList"], "RecordsCountWithoutFilterClosedList");
    Methods.verifyComparison(vars["RecordsCountWithFilterClosedList"], "<", vars["RecordsCountWithoutFilterClosedList"]);
  });
});

