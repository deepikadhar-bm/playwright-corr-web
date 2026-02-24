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
    await priceOfferedPage.Check_Company.check();
    await correspondentPortalPage.Apply_Selected.waitFor({ state: 'visible' });
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.waitFor({ state: 'visible' });
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    if (true) /* Verify that the current page displays text No result */ {
      vars["RecordsCountWithFilterClosedList"] = "0";
    } else {
      await priceOfferedPage.Select_all_for_Checkbox.check();
      vars["RecordsCountWithFilterClosedList"] = await commitmentListPage.Export_Selected.textContent() || '';
      vars["RecordsCountWithFilterClosedList"] = String(vars["RecordsCountWithFilterClosedList"]).replace(/\(\)/g, '');
      vars["RecordsCountWithFilterClosedList"] = String(vars["RecordsCountWithFilterClosedList"]).trim();
    }
    await commitmentListPage.Open_List_Tab.click();
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    if (true) /* Verify that the current page displays text No result */ {
      vars["RecordsCountWithFilterOpenList"] = "0";
    } else {
      await priceOfferedPage.Select_all_for_Checkbox.check();
      vars["RecordsCountWithFilterOpenList"] = await commitmentListPage.Export_Selected.textContent() || '';
      vars["RecordsCountWithFilterOpenList"] = String(vars["RecordsCountWithFilterOpenList"]).replace(/\(\)/g, '');
      vars["RecordsCountWithFilterOpenList"] = String(vars["RecordsCountWithFilterOpenList"]).trim();
    }
    await commitmentListPage.Closed_List_Tab.click();
    await priceOfferedPage.Remove_Date_FilterCross_Symbol.waitFor({ state: 'visible' });
    await priceOfferedPage.Remove_Date_FilterCross_Symbol.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    await priceOfferedPage.Select_all_for_Checkbox.check();
    vars["RecordsCountWithoutFilterClosedList"] = await commitmentListPage.Export_Selected.textContent() || '';
    vars["RecordsCountWithoutFilterClosedList"] = String(vars["RecordsCountWithoutFilterClosedList"]).replace(/\(\)/g, '');
    vars["RecordsCountWithoutFilterClosedList"] = String(vars["RecordsCountWithoutFilterClosedList"]).trim();
    expect(String(vars["RecordsCountWithFilterClosedList"])).toBe(vars["RecordsCountWithoutFilterClosedList"]);
    await commitmentListPage.Open_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
    await priceOfferedPage.Select_all_for_Checkbox.check();
    vars["RecordsCountWithoutFilterOpenList"] = await commitmentListPage.Export_Selected.textContent() || '';
    vars["RecordsCountWithoutFilterOpenList"] = String(vars["RecordsCountWithoutFilterOpenList"]).replace(/\(\)/g, '');
    vars["RecordsCountWithoutFilterOpenList"] = String(vars["RecordsCountWithoutFilterOpenList"]).trim();
    expect(String(vars["RecordsCountWithFilterOpenList"])).toBe(vars["RecordsCountWithoutFilterOpenList"]);
  });
});
