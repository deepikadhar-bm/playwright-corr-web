// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS22_TC01_Closed List : Ensure the sorting filter works correctly in both ascending and descending order - Verify for the list screen', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.click();
    vars["CountOfColumnHeaders"] = String(await priceOfferedPage.Columns_Headers.count());
    vars["HeadersUI"] = " Comm. Loans and Comm. Amount and Amt. Delivered ";
    vars["HeadersUI1"] = " Comm. Date and Closed Date and  Expiration Date  ";
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String("11"))) {
      vars["IndividualHeaderUI"] = await priceOfferedPage.Individual_Column_Header_UI.textContent() || '';
      vars["IndividualHeaderUI"] = String(vars["IndividualHeaderUI"]).substring(1, String(vars["IndividualHeaderUI"]).length - 1);
      // [DISABLED] Trim white space from IndividualHeaderUI and store it in a runtime IndividualHeaderUI
      // vars["IndividualHeaderUI"] = String(vars["IndividualHeaderUI"]).trim();
      if (String(vars["HeadersUI"]).includes(String(vars["IndividualHeaderUI"]))) {
        await page.waitForLoadState('networkidle');
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        {
          const texts = await priceOfferedPage.Column_Data_UI.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        {
          const texts = await priceOfferedPage.Column_Data_UI.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else if (String(vars["HeadersUI1"]).includes(String(vars["IndividualHeaderUI"]))) {
        await page.waitForLoadState('networkidle');
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        {
          const texts = await priceOfferedPage.Column_Data_UI.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => a - b);
          expect(dates).toEqual(sorted);
        }
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        {
          const texts = await priceOfferedPage.Column_Data_UI.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => a - b);
          expect(dates).toEqual(sorted);
        }
      } else {
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        {
          const texts = await priceOfferedPage.Column_Data_UI.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        {
          const texts = await priceOfferedPage.Column_Data_UI.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
