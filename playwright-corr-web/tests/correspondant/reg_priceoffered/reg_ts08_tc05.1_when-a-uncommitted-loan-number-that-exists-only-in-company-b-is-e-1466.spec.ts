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

  test('REG_TS08_TC05.1_When a uncommitted loan number that exists only in Company B is entered in Company A\\\'s pase loan popup, an error message should be displayed', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqIdCompanyFreedom"] = await priceOfferedPage.Bid_Req_Id_Company_Freedom.textContent() || '';
    vars["BidReqIdCompanyFreedom"] = String(vars["BidReqIdCompanyFreedom"]).trim();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdCompanyFreedom"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.First_Bid_Req_Id.click();
    vars["UnLockedLoanNumber"] = await priceOfferedPage.UnLocked_Loan_Number.textContent() || '';
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Cross_In_Search_Field.click();
    vars["BidReqIdCompanyNotFreedom"] = await priceOfferedPage.Bid_Req_Id_Not_a_Freedom.textContent() || '';
    vars["BidReqIdCompanyNotFreedom"] = String(vars["BidReqIdCompanyNotFreedom"]).trim();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdCompanyNotFreedom"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.First_Bid_Req_Id.click();
    await correspondentPortalPage.Paste_Loans_Button1.click();
    await correspondentPortalPage.Paste_loan_numbers_here1.click();
    await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["UnLockedLoanNumber"]);
    await priceOfferedPage.Validate_ButtonPrice_Offered_Page.click();
    await expect(correspondentPortalPage.Errors_Found).toBeVisible();
    vars["UnidentifiedLoanNumber"] = await priceOfferedPage.Unidentified_Loan_Number.textContent() || '';
    expect(String(vars["UnidentifiedLoanNumber"])).toBe(vars["UnLockedLoanNumber"]);
  });
});
