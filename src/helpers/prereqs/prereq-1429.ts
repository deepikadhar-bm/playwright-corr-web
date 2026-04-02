import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1424 } from './prereq-1424';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'PREREQ_1429(REG_TS04_TC05)';
const TC_TITLE = 'After performing the "Get Price" action, the timer starts. When the user navigates away from the screen and then returns, verify that the timer is no longer displayed';


export async function runPrereq_1429(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1424(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);

  log.tcStart(TC_ID, TC_TITLE);
  try {

    log.step('Navigate to Price Offered and search by Bid Request ID');
    try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
      await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
      await page.keyboard.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.First_bid_id.click();
      log.stepPass('Navigated to Price Offered and Bid Request ID found successfully');
    } catch (e) {
      log.stepFail(page, 'Failed to navigate to Price Offered or search by Bid Request ID');
      throw e;
    }

    log.step('Trigger Get Price action and verify Remaining Time is visible');
    try {
      await expect(priceOfferedPage.Remaining_Timeprice_offered).not.toBeVisible();
      await correspondentPortalPage.Get_Price_Button.click();
      await page.waitForTimeout(2000);
      await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
      log.stepPass('Get Price action triggered and Remaining Time is visible');
    } catch (e) {
      log.stepFail(page, 'Failed to trigger Get Price action or Remaining Time is not visible');
      throw e;
    }

    log.step('Navigate away from Price Offered screen using back arrow');
    try {
      await expect(priceOfferedPage.Price_Offered_Back_Arrowprice_offered).toBeVisible();
      await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Navigated away from Price Offered screen successfully');
    } catch (e) {
      log.stepFail(page, 'Failed to navigate away from Price Offered screen');
      throw e;
    }

    log.step('Search for the same Bid Request ID and navigate back into the screen');
    try {
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.First_bid_id.click();
      await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
      log.stepPass('Re-navigated into Price Offered screen for the same Bid Request ID successfully');
    } catch (e) {
      log.stepFail(page, 'Failed to re-navigate into Price Offered screen');
      throw e;
    }

    log.step('Verify Remaining Time is no longer displayed after returning to the screen');
    try {
      await expect(priceOfferedPage.Remaining_Timeprice_offered).not.toBeVisible();
      log.stepPass('Remaining Time is correctly not displayed after navigating away and returning');
    } catch (e) {
      log.stepFail(page, 'Remaining Time is still displayed after navigating away and returning — timer should have reset');
      throw e;
    }

    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}
