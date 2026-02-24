// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1671 } from '../../../src/helpers/prereqs/prereq-1671';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1671(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS25_TC03_Verify that expire action should not be displayed for the committed status -> Verify for the fresh record that is created recevtly]', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqIdPriceOffered"] = vars["RequiredBidID"];
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Bid_Req_IdPrice_Offered_Page.click();
    await priceOfferedPage.Select_All_Loan_Num.waitFor({ state: 'visible' });
    await priceOfferedPage.Select_All_Loan_Num.check();
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await page.reload();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.waitFor({ state: 'visible' });
    vars["BidStatusPriceOfferedPage"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
    vars["BidStatusPriceOfferedPage"] = String(vars["BidStatusPriceOfferedPage"]).trim();
    expect(String(vars["BidStatusPriceOfferedPage"])).toBe("Committed");
    await expect(priceOfferedPage.Expire_Pricing_ButtonPrice_Offered).toBeVisible();
    await stepGroups.stepGroup_Add_Early_Config_With_Current_Est_Time(page, vars);
    await page.waitForTimeout(120000);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String("5"))) {
      await priceOfferedPage.Price_Offered_Text.click();
      await page.waitForTimeout(60000);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["BidStatusPriceOfferedPage"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
    vars["BidStatusPriceOfferedPage"] = String(vars["BidStatusPriceOfferedPage"]).trim();
    expect(String(vars["BidStatusPriceOfferedPage"])).toBe("Committed");
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
  });
});
