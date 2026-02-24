// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
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

  test('Storing The PopUp Details', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    // [DISABLED] Click on Commitments Side Menu
    // await correspondentPortalPage.Commitments_Side_Menu.click();
    // [DISABLED] Click on Price Offered List Dropdown
    // await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.First_bid_id.click();
    await priceOfferedPage.First_Loan_Num_Price_offered.waitFor({ state: 'visible' });
    await priceOfferedPage.First_Loan_Num_Price_offered.click();
    await stepGroups.stepGroup_Demo_Storing_Popup_details(page, vars);
  });
});
