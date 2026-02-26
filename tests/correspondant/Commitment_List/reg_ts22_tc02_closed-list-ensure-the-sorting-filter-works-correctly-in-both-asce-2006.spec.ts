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

  test('REG_TS22_TC02_Closed List : Ensure the sorting filter works correctly in both ascending and descending order - Verify for the detail screen', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.click();
    await page.waitForLoadState('networkidle');
    vars["IndividualHeadersCommitmentList"] = "Loan Amount and Ref Sec Price and Gross Price and Hedge Ratio and Curr Market Value and Curr Gross and Chase Loan# and Mark Adj";
    await commitmentListPage.Commitment_IDMore_Than_one_Commited_Loan.click();
    vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ColumnHeadersDetailsScreenUI"]))) {
      vars["IndividualHeaderScreenDetails"] = await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List.textContent() || '';
      vars["IndividualHeaderScreenDetails"] = String(vars["IndividualHeaderScreenDetails"]).trim();
      await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List.click();
      await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
      await priceOfferedPage.Column_Header_Data.waitFor({ state: 'visible' });
      if (String(vars["IndividualHeadersCommitmentList"]).includes(String(vars["IndividualHeaderScreenDetails"]))) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
      }
      await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List.click();
      await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
      await priceOfferedPage.Column_Header_Data.waitFor({ state: 'visible' });
      await page.waitForTimeout(4000);
      if (String(vars["IndividualHeadersCommitmentList"]).includes(String(vars["IndividualHeaderScreenDetails"]))) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["count"] = "1";
    await commitmentListPage.Total_LoansCommitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ColumnHeadersDetailsScreenUI"]))) {
      vars["IndividualHeaderScreenDetails"] = await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List.textContent() || '';
      vars["IndividualHeaderScreenDetails"] = String(vars["IndividualHeaderScreenDetails"]).trim();
      await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List.click();
      await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
      await priceOfferedPage.Column_Header_Data.waitFor({ state: 'visible' });
      if (String(vars["IndividualHeadersCommitmentList"]).includes(String(vars["IndividualHeaderScreenDetails"]))) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
      }
      await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List.click();
      await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
      await priceOfferedPage.Column_Header_Data.waitFor({ state: 'visible' });
      await page.waitForTimeout(4000);
      if (String(vars["IndividualHeadersCommitmentList"]).includes(String(vars["IndividualHeaderScreenDetails"]))) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
