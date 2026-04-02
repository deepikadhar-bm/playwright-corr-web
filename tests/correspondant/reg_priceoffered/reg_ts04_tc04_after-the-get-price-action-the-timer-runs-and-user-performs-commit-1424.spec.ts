import { test, expect } from '@playwright/test';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1423 } from '../../../src/helpers/prereqs/prereq-1423';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS04_TC04';
const TC_TITLE = 'After the "Get Price" action, the timer runs and user performs commit, the screen should reset normal and commit selected button should be disabled. At this point, user should not be able to commit again';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1423(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigate to Price Offered and search by Bid Request ID');
      try {
        await expect(correspondentPortalPage.Commitments_Side_Menu).toBeVisible();
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.First_bid_id.click();
        await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
        log.stepPass('Navigated to Price Offered and Bid Request ID found successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Price Offered or search by Bid Request ID');
        throw e;
      }

      log.step('Trigger Get Price action and verify Remaining Time and first loan checkbox are visible');
      try {
        await correspondentPortalPage.Get_Price_Button.click();
        await priceOfferedPage.Remaining_Timeprice_offered.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen.first()).toBeVisible();
        log.stepPass('Get Price action triggered — Remaining Time visible and first loan checkbox is available');
      } catch (e) {
        log.stepFail(page, 'Failed to trigger Get Price action or Remaining Time is not visible');
        throw e;
      }

      log.step('Select first loan and click Commit Selected');
      try {
        await priceOfferedPage.First_Check_Boxprice_offered_screen.first().check();
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen.first()).toBeChecked();
        await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeEnabled();
        await priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered.click();
        await priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen).toContainText(appconstants.COMMIT_SELECTED_LOANS_TEXT_POPUP);
        await expect(page.getByText(appconstants.UPDATED_SUCCESSFULLY_TEXT_POPUP)).toBeVisible();
        log.stepPass('First loan selected and Commit Selected popup displayed successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to select first loan or open Commit Selected popup');
        throw e;
      }

      log.step('Confirm commit action and verify success message');
      try {
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Commit_Selected_Loans2popup_price_offered_screen.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
        log.stepPass('Commit confirmed and success message verified successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to confirm commit action or success message not displayed');
        throw e;
      }

      log.step('Verify Remaining Time is not visible after commit and navigate to All Loans tab');
      try {
        await expect(priceOfferedPage.Remaining_Timeprice_offered).not.toBeVisible();
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        await priceOfferedPage.Second_Check_Boxprice_offered_screen.first().waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Second_Check_Boxprice_offered_screen.first()).not.toBeChecked();
        log.stepPass('Remaining Time not visible after commit and All Loans tab loaded successfully');
      } catch (e) {
        log.stepFail(page, 'Remaining Time still visible after commit or All Loans tab failed to load');
        throw e;
      }

      log.step('Select second loan and verify Commit Selected button is disabled');
      try {
        await priceOfferedPage.Second_Check_Boxprice_offered_screen.first().check();
        await expect(priceOfferedPage.Second_Check_Boxprice_offered_screen.first()).toBeChecked();
        await expect(priceOfferedPage.Commit_Selected_Button_Disabledprice_offered).toBeDisabled();
        log.stepPass('Second loan selected — Commit Selected button is correctly disabled after timer expiry');
      } catch (e) {
        log.stepFail(page, 'Commit Selected button is not disabled — user can incorrectly commit after timer expiry');
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});