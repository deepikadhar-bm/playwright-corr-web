// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('REG_TS10_TC04.2_Verify the loan details popup view present in the \\\"Locked/Committed\\\" loans - Should be same as present in all loans. Also verify the search / clear search actions', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await priceOfferedPage.BidReqIDPartially_Committed_or_Committed.click();
    await priceOfferedPage.LockedCommitted_Loans.click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Paste_Loans_Button1.waitFor({ state: 'hidden' });
    await correspondentPortalPage.First_Corr_Loan.click();
    vars["ChaseFieldName"] = await priceOfferedPage.First_Chase_Field_Name.textContent() || '';
    vars["ExpectedChaseFieldName"] = String(vars["ChaseFieldName"]).substring(1);
    vars["ChaseValue"] = await correspondentPortalPage.First_Chase_Value.textContent() || '';
    vars["ExpectedChaseValue"] = String(vars["ChaseValue"]).trim();
    await correspondentPortalPage.Search_Fields_Input.click();
    await correspondentPortalPage.Search_Fields_Input.fill(vars["ExpectedChaseFieldName"]);
    vars["ChaseFieldCount"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
    expect(String(vars["ChaseFieldCount"])).toBe("1");
    await expect(priceOfferedPage.Loan_Term_Chase_Field_Name).toContainText(vars["ExpectedChaseFieldName"]);
    await expect(correspondentPortalPage.First_Chase_Value).toContainText(vars["ExpectedChaseValue"]);
    await correspondentPortalPage.Search_Fields_Input.click();
    await correspondentPortalPage.Search_Fields_Input.clear();
    vars["ChaseFieldCount"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
    expect(String(vars["ChaseFieldCount"])).toBe("1");
  });
});
