// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS13_TC01_Verify that user should not be allowed to perform commit action, if the market adjustor value doesnot satisfy Max threshold condition - An error message should be shown which should bloc', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    vars["BidReqIdPriceOffered"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Get_Price_Button.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    vars["FirstMarkAdjValue"] = await correspondentPortalPage.First_Market_adjustment_Value.textContent() || '';
    vars["MarkAdjOnScreen"] = String(vars["FirstMarkAdjValue"]).substring(0, String(vars["FirstMarkAdjValue"]).length - 3);
    vars["count"] = "0";
    vars["FirstMarkAdjValue"] = String(vars["FirstMarkAdjValue"]).replace(/\-/g, '');
    vars["FirstMarkAdjValue"] = (parseFloat(String(vars["count"])) + parseFloat(String(vars["FirstMarkAdjValue"]))).toFixed(0);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
    await correspondentPortalPage.Market_Thresholds.click();
    await priceOfferedPage.Edit_Map_Button.click();
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.click();
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.clear();
    vars["Number"] = String(Math.floor(Math.random() * (8 - 1 + 1)) + 1);
    vars["NumLowerThanMarkAdj"] = (parseFloat(String(vars["FirstMarkAdjValue"])) - parseFloat(String(vars["Number"]))).toFixed(0);
    vars["NumLowerThanMarkAdjPopup"] = (parseFloat(String("0")) + parseFloat(String(vars["NumLowerThanMarkAdj"]))).toFixed(1);
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill(vars["NumLowerThanMarkAdj"]);
    await priceOfferedPage.Update_Threshold_Button.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    vars["CorrLoan"] = await correspondentPortalPage.First_Corr_loan_Value_Unchecked.textContent() || '';
    vars["space"] = "key_blank";
    vars["ExpectedPopUpError1"] = "Loan" + vars["space"] + vars["CorrLoan"] + vars["space"] + "can not be committed. Market adjuster value" + vars["space"];
    vars["ExpectedPopUpError2"] = "is greater than market threshold value" + vars["space"] + vars["NumLowerThanMarkAdjPopup"];
    await correspondentPortalPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Loans_failed_to_be_added_to_commitment).toBeVisible();
    vars["ActualErrorPopup"] = await correspondentPortalPage.Loan_Greater_Text.textContent() || '';
    await expect(page.getByText(vars["ExpectedPopUpError1"])).toBeVisible();
    expect(String(vars["ActualErrorPopup"])).toBe(vars["ExpectedPopUpError2"]);
    await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
    await correspondentPortalPage.Market_Thresholds.click();
    await stepGroups.stepGroup_Market_Threshold(page, vars);
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill("120");
    await priceOfferedPage.Update_Threshold_Button.click();
    // Write to test data profile: "RequestIDfrom13-1" = vars["RequestIDDetails"]
  });
});
