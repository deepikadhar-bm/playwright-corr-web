// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS33_TC01_Verify Sorting Action [Ascending Order and Descending Order]', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ColumnHeadersCount"] = String(await priceOfferedPage.Columns_Headers.count());
    vars["HeadersWithoutSorting"] = " Execution Type and  #Loans / #Errors and Bid Value ";
    // [DISABLED] Click on Go to Next Page Button
    // await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
    // [DISABLED] Click on Go to Next Page Button
    // await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String("7"))) {
      vars["IndividualHeaderName"] = await bidRequestPage.Individual_Column_Header.textContent() || '';
      vars["IndividualHeaderName"] = String(vars["IndividualHeaderName"]).substring(1, String(vars["IndividualHeaderName"]).length - 1);
      if (String(vars["HeadersWithoutSorting"]).includes(String(vars["IndividualHeaderName"]))) {
        await page.waitForLoadState('networkidle');
      } else {
        await bidRequestPage.Individual_Column_Header.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await bidrequestPage.First_Column_Data.waitFor({ state: 'visible' });
        {
          const texts = await bidRequestPage.ColumnData.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
        await bidRequestPage.Individual_Column_Header.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await bidrequestPage.First_Column_Data.waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        {
          const texts = await bidRequestPage.ColumnData.allTextContents();
          const sorted = [...texts].sort((a, b) => a.localeCompare(b));
          expect(texts).toEqual(sorted);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["RequestedDateHeaderName"] = await bidRequestsPage.Requested_Date_Header.textContent() || '';
    await bidRequestsPage.Requested_Date_Header.click();
    await page.waitForLoadState('networkidle');
    await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
    await bidRequestPage.First_Requested_Date.waitFor({ state: 'visible' });
    {
      const texts = await bidRequestsPage.Requested_Date_Column_Data.allTextContents();
      const dates = texts.map(t => new Date(t).getTime());
      const sorted = [...dates].sort((a, b) => a - b);
      expect(dates).toEqual(sorted);
    }
    await bidRequestsPage.Requested_Date_Header.click();
    await page.waitForLoadState('networkidle');
    await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
    await bidRequestPage.First_Requested_Date.waitFor({ state: 'visible' });
    {
      const texts = await bidRequestsPage.Requested_Date_Column_Data.allTextContents();
      const dates = texts.map(t => new Date(t).getTime());
      const sorted = [...dates].sort((a, b) => a - b);
      expect(dates).toEqual(sorted);
    }
    await bidrequestPage.Uploaded_Date_Header.click();
    await bidRequestPage.First_Uploaded_Date.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
    {
      const texts = await bidRequestsPage.Uploaded_Date_Count.allTextContents();
      const dates = texts.map(t => new Date(t).getTime());
      const sorted = [...dates].sort((a, b) => a - b);
      expect(dates).toEqual(sorted);
    }
    await bidrequestPage.Uploaded_Date_Header.click();
    await bidRequestPage.First_Uploaded_Date.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
    {
      const texts = await bidRequestsPage.Uploaded_Date_Count.allTextContents();
      const dates = texts.map(t => new Date(t).getTime());
      const sorted = [...dates].sort((a, b) => a - b);
      expect(dates).toEqual(sorted);
    }
  });
});
