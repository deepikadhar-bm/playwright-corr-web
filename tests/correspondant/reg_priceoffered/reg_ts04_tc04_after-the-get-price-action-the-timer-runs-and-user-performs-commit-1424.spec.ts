// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1423 } from '../../../src/helpers/prereqs/prereq-1423';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1423(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS04_TC04_After the \\\"Get Price\\\" action, the timer runs and user performs commit, the screen should reset normal and commit selected button should be disabled. At this point, user should not be a', async ({ page }) => {

    await expect(correspondentPortalPage.Commitments_Side_Menu).toBeVisible();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.First_bid_id.click();
    await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
    await correspondentPortalPage.Get_Price_Button.click();
    await priceOfferedPage.Remaining_Timeprice_offered.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    await priceOfferedPage.First_Check_Boxprice_offered_screen.check();
    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();
    await priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered.click();
    await priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen).toContainText("Commit Selected Loans");
    await expect(page.getByText("Selecting “Yes, Commit” is confirmation of entering a Mandatory Commitment along with the pair-off risks associated with not meeting the conditions of the commitment.")).toBeVisible();
    await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.click();
    await priceOfferedPage.Commit_Selected_Loans2popup_price_offered_screen.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
    await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await priceOfferedPage.Second_Check_Boxprice_offered_screen.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Second_Check_Boxprice_offered_screen).toBeVisible();
    await priceOfferedPage.Second_Check_Boxprice_offered_screen.check();
    await expect(priceOfferedPage.Second_Check_Boxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_Button_Disabledprice_offered).toBeVisible();
  });
});
