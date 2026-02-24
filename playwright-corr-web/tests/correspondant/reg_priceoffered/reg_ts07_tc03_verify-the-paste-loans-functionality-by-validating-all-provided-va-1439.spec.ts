// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1438 } from '../../../src/helpers/prereqs/prereq-1438';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1438(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS07_TC03_Verify the \\\"Paste Loans\\\" functionality by validating all provided valid loans, and ensure that the functionality is handled correctly for both same-company and different-company scenar', async ({ page }) => {

    await stepGroups.stepGroup_Uploading_bid_for_American_Pacific_Company(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.First_bid_id.click();
    await page.waitForLoadState('networkidle');
    await stepGroups.stepGroup_Unique_Loan_Number_Check_In_Price_Offered_Screen(page, vars);
    await correspondentPortalPage.Get_Price_Button.click();
    await correspondentPortalPage.Remaining_Time_Price_Offered.waitFor({ state: 'visible' });
    await priceOfferedPage.Required_Loan_Number_Check_box.check();
    await expect(priceOfferedPage.Required_Loan_Number_Check_box).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();
    // [DISABLED] Click on Commit Selected Footer Button(price offered)
    // await priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered.click();
    await correspondentPortalPage.Paste_Loans_Button1.click();
    await correspondentPortalPage.Paste_loan_numbers_here1.waitFor({ state: 'visible' });
    await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["LoanNumFreedom"]);
    await priceOfferedPage.Validate_Button_Paste_loan_popup.click();
    await expect(priceOfferedPage.Errors_Found_Loan_error).toBeVisible();
    await chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup.waitFor({ state: 'visible' });
  });
});
