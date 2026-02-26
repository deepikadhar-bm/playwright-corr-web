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

  test('REG_TS13_TC02_Ensure the sorting filter works correctly in both ascending and descending order - Verify for the detail screen', async ({ page }) => {
    const testData: Record<string, string> = {
  "CommitmentIDfrom8-10": "87JU2DDD",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-1": "876YA587E147",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    vars["CommitmentId"] = testData["CommitmentIDfrom8-10"];
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["CommitmentId"]);
    await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
    await page.waitForLoadState('networkidle');
    vars["IndividualHeadersCommitmentList"] = "Loan Amount and Ref Sec Price and Gross Price and Hedge Ratio and Curr Market Value and Curr Gross and Chase Loan# ";
    vars["HeadersUI1"] = " Comm. Date and Closed Date and  Expiration Date  ";
    await commitmentListPage.First_Commitment_IDCommitment_List.click();
    vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
    vars["HeadersUI1"] = " Comm. Date and Closed Date and  Expiration Date  ";
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
      } else if (String(vars["HeadersUI1"]).includes(String(vars["IndividualHeaderScreenDetails"]))) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => a - b);
          expect(dates).toEqual(sorted);
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
      } else if (String(vars["HeadersUI1"]).includes(String(vars["IndividualHeaderScreenDetails"]))) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => a - b);
          expect(dates).toEqual(sorted);
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
      } else if (String(vars["HeadersUI1"]).includes(String(vars["IndividualHeaderScreenDetails"]))) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => a - b);
          expect(dates).toEqual(sorted);
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
      } else if (String(vars["HeadersUI1"]).includes(String(vars["IndividualHeaderScreenDetails"]))) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => a - b);
          expect(dates).toEqual(sorted);
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
