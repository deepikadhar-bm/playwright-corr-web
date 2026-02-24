// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('Copy of (REG_TS07_TC01_Verify the \\\"Paste Loans\\\" functionality by validating all provided valid loans, and ensure that the functionality is handled correctly for both same-company and different-compa', async ({ page }) => {
    // [DISABLED] Remove Special char , from 123,543 and store it in runtime zx
    // vars["zx"] = String("123,543").replace(/\,/g, '');
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    // [DISABLED] Notifications: set notifications Allow mode for the current site
    // // Notification permissions are handled via Playwright browser context
    // [DISABLED] Set chrome permission to URL: CORR_QA_URL , Permission Name: Popup , Permission Type: Allow
    // // Chrome permissions are handled via Playwright browser context
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill("87LO5003095E");
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.First_bid_id.click();
    await correspondentPortalPage.Paste_Loans_Button1.waitFor({ state: 'visible' });
    // [DISABLED] Double click on Execution Type(Details)
    // await priceOfferedPage.Execution_TypeDetails.dblclick();
    // [DISABLED] Press Control(Command) + c Keys
    // await page.keyboard.press('Control(Command)+c');
    await correspondentPortalPage.Paste_Loans_Button1.click();
    vars[""] = await priceOfferedPage.First_Loan_Num_Price_offered.textContent() || '';
    vars[""] = await priceOfferedPage.First_Loan_Num_Price_offered.getAttribute("value") || '';
    vars[""] = await priceOfferedPage.First_Loan_Num_Price_offered.textContent() || '';
    // [DISABLED] Notifications: set notifications Allow mode for the current site
    // // Notification permissions are handled via Playwright browser context
    // [DISABLED] Wait until the text Allow is present on the current page
    // await page.getByText("Allow").waitFor({ state: 'visible' });
    // [DISABLED] Set chrome permission to URL: CurrentPageUrl , Permission Name: Popup , Permission Type: Allow
    // // Chrome permissions are handled via Playwright browser context
    await priceOfferedPage.Paste_Clipboard_Button.click();
    // [DISABLED] Wait until the text Allow is present on the current page
    // await page.getByText("Allow").waitFor({ state: 'visible' });
    // [DISABLED] Store the url of the current page into a variable CurrentPageUrl
    // vars["CurrentPageUrl"] = page.url();
    // [DISABLED] Set chrome permission to URL: CurrentPageUrl , Permission Name: AutomaticDownload , Permission Type: Allow
    // // Chrome permissions are handled via Playwright browser context
    // [DISABLED] Set chrome permission to URL: CurrentPageUrl , Permission Name: Popup , Permission Type: Allow
    // // Chrome permissions are handled via Playwright browser context
    await page.waitForTimeout(10000);
  });
});
