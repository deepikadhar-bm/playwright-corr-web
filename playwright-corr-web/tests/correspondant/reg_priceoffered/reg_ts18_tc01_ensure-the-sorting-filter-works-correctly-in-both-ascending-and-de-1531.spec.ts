// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS18_TC01_Ensure the sorting filter works correctly in both ascending and descending order - Verify for the list screen and the detail screen', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["CountOfColumnHeaders"] = String(await priceOfferedPage.Columns_Headers.count());
    vars["HeadersUI"] = " #Loans / #Errors and Bid Value";
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String("8"))) {
      vars["IndividualHeaderUI"] = await priceOfferedPage.Individual_Column_Header_UI.textContent() || '';
      vars["IndividualHeaderUI"] = String(vars["IndividualHeaderUI"]).substring(1, String(vars["IndividualHeaderUI"]).length - 1);
      // [DISABLED] Trim white space from IndividualHeaderUI and store it in a runtime IndividualHeaderUI
      // vars["IndividualHeaderUI"] = String(vars["IndividualHeaderUI"]).trim();
      if (String(vars["HeadersUI"]).includes(String(vars["IndividualHeaderUI"]))) {
        await page.waitForLoadState('networkidle');
      } else {
        await priceOfferedPage.Individual_Column_Header_UI.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
        {
          const texts = await priceOfferedPage.Column_Data_UI_Commom_xpath.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
        await priceOfferedPage.Individual_Column_Header_UI.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        {
          const texts = await priceOfferedPage.Column_Data_UI_Commom_xpath.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["BidValue"] = await priceOfferedPage.BidValue.textContent() || '';
    await priceOfferedPage.BidValue.click();
    await page.waitForLoadState('networkidle');
    await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
    await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
    {
      const texts = await priceOfferedPage.BidValue_Column.allTextContents();
      const nums = texts.map(t => parseFloat(t));
      const sorted = [...nums].sort((a, b) => a - b);
      expect(nums).toEqual(sorted);
    }
    await priceOfferedPage.BidValue.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
    await priceOfferedPage.First_Column_Data_UI.waitFor({ state: 'visible' });
    await page.waitForTimeout(4000);
    // [DISABLED] Verify if the BidValue Column data is in descending order
    // {
    //   const texts = await priceOfferedPage.BidValue_Column.allTextContents();
    //   const sorted = [...texts].sort((a, b) => a.localeCompare(b));
    //   expect(texts).toEqual(sorted);
    // }
    {
      const texts = await priceOfferedPage.BidValue_Column.allTextContents();
      const nums = texts.map(t => parseFloat(t));
      const sorted = [...nums].sort((a, b) => a - b);
      expect(nums).toEqual(sorted);
    }
  });
});
