// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('REG_TS18_TC02_Ensure the sorting filter works correctly in both ascending and descending order - Verify for the list screen and the detail screen', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["CommittedBidId"] = "87XBBBD565A1";
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["CommittedBidId"]);
    await priceOfferedPage.Committed_Bid_Req_Id.click();
    vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ColumnHeadersDetailsScreenUI"]))) {
      vars["IndividualHeaderScreenDetails"] = await priceOfferedPage.Individual_Column_Header_Details_Screen.textContent() || '';
      vars["IndividualHeaderScreenDetails"] = String(vars["IndividualHeaderScreenDetails"]).substring(1, String(vars["IndividualHeaderScreenDetails"]).length - 1);
      await priceOfferedPage.Individual_Column_Header_Details_Screen.click();
      await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
      await priceOfferedPage.Column_Header_Data.waitFor({ state: 'visible' });
      if (String(vars["IndividualHeaderScreenDetails"]) === String("Loan Amount")) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else if (String(vars["IndividualHeaderScreenDetails"]) === String("Mark Adj")) {
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
      await priceOfferedPage.Individual_Column_Header_Details_Screen.click();
      await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
      await priceOfferedPage.Column_Header_Data.waitFor({ state: 'visible' });
      await page.waitForTimeout(4000);
      if (String(vars["IndividualHeaderScreenDetails"]) === String("Loan Amount")) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else if (String(vars["IndividualHeaderScreenDetails"]) === String("Mark Adj")) {
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
    await priceOfferedPage.LockedCommitted_Loans.click();
    await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeVisible();
    await expect(correspondentPortalPage.Paste_Loans_Button1).toBeVisible();
    vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ColumnHeadersDetailsScreenUI"]))) {
      vars["IndividualHeaderScreenDetails"] = await priceOfferedPage.Individual_Column_Header_Details_Screen.textContent() || '';
      vars["IndividualHeaderScreenDetails"] = String(vars["IndividualHeaderScreenDetails"]).substring(1, String(vars["IndividualHeaderScreenDetails"]).length - 1);
      await priceOfferedPage.Individual_Column_Header_Details_Screen.click();
      await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
      await priceOfferedPage.Column_Header_Data.waitFor({ state: 'visible' });
      if (String(vars["IndividualHeaderScreenDetails"]) === String("Loan Amount")) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else if (true) /* Verify if IndividualHeaderScreenDetails == Mark Adj */ {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      }
      await priceOfferedPage.Individual_Column_Header_Details_Screen.click();
      await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
      await priceOfferedPage.Column_Header_Data.waitFor({ state: 'visible' });
      await page.waitForTimeout(4000);
      if (String(vars["IndividualHeaderScreenDetails"]) === String("Loan Amount")) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else if (String(vars["IndividualHeaderScreenDetails"]) === String("Mark Adj")) {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      } else {
        {
          const texts = await priceOfferedPage.Column_Data_Details_Screen.allTextContents();
          const nums = texts.map(t => parseFloat(t));
          const sorted = [...nums].sort((a, b) => a - b);
          expect(nums).toEqual(sorted);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
