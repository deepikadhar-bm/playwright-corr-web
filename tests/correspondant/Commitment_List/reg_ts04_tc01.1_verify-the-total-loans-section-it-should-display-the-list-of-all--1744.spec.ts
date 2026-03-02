// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1739 } from '../../../src/helpers/prereqs/prereq-1739';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1739(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS04_TC01.1_Verify the Total loans section, It should display the list of all the loans present in Price offered module', async ({ page }) => {

    const testData: Record<string, string> = {
  "Locked Loan": "",
  "Commitment Order": "",
  "Corr Loan Num": "",
  "Last Name": " LN_Deepika_JULY_16_11 ",
  "Loan Amount": " $150,023 ",
  "Interest Rate": "",
  "Ref Sec Prod": " FN30 ",
  "Ref Sec Price": " 117.000 ",
  "Gross Price": " 125.250 ",
  "Hedge Ratio": " 1.550 ",
  "Mark Adj": " -36.619 ",
  "Current Gross Price": "",
  "CommitOrder": "1",
  "Curr Gross": " 88.631 ",
  "Corr Loan": "TestSigma_19-02-2026_SC1_dz_818",
  "Int Rate": " 6.500% "
} // Profile: "All Loans Tab - Committed Loans Tab(Price offered)", row 0;

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
    await commitmentListPage.Total_LoansCommitment_List.click();
    await bidRequestDetailsPage.Last_Name_Sort_Button.waitFor({ state: 'visible' });
    await bidRequestDetailsPage.Last_Name_Sort_Button.click();
    await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
    vars["TotalLoans"] = String(await priceOfferedPage.Total_LoansDetails_Screen.count());
    vars["count"] = "1";
    for (let dataIdx = -1; dataIdx <= parseInt(vars["TotalLoans"]); dataIdx++) {
      if (String(testData["Locked Loan"]) === String("Yes")) {
        await expect(commitmentListPage.Committed_Loan_Locked_iconCommitment_List).toBeVisible();
        await expect(commitmentListPage.Commitment_OrderCommitment_List_Details).toContainText(testData["Commitment Order"]);
      }
      await expect(priceOfferedPage.Corr_Loan_NumDetails_Screen).toContainText(testData["Corr Loan Num"]);
      await expect(priceOfferedPage.Last_NameDetails_Screen).toContainText(testData["Last Name"]);
      await expect(priceOfferedPage.Loan_AmountDetails_Screen).toContainText(testData["Loan Amount"]);
      await expect(priceOfferedPage.Interest_rateDetails_Screen).toContainText(testData["Interest Rate"]);
      await expect(priceOfferedPage.Reference_SecurityDetails_Screen).toContainText(testData["Ref Sec Prod"]);
      await expect(priceOfferedPage.Reference_security_priceDetails_Screen).toContainText(testData["Ref Sec Price"]);
      await expect(priceOfferedPage.Gross_PriceDetails_Screen).toContainText(testData["Gross Price"]);
      await expect(priceOfferedPage.Hedge_RatioDetails_Screen).toContainText(testData["Hedge Ratio"]);
      await expect(priceOfferedPage.Market_AdjustmentDetails_Screen).toContainText(testData["Mark Adj"]);
      await expect(priceOfferedPage.Current_Gross_PriceDetails_Screen).toContainText(testData["Current Gross Price"]);
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
  });
});
