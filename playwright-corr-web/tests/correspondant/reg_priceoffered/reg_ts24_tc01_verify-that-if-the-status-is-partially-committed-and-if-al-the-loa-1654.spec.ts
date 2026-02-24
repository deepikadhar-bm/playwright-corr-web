// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS24_TC01_Verify that if the status is partially committed and if al the loan from the list is uncommitted, then the status should be updated back as price offered', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqIdPriceOffered"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(String(vars["BidReqIdPriceOffered"]));
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await priceOfferedPage.Last_Committed_Bid.waitFor({ state: 'visible' });
    vars["LastCommittedBidBeforeUncommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidBeforeUncommit"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidBeforeUncommit"] = String(vars["LastCommittedBidBeforeUncommit"]).trim();
    vars["LastCommittedLoanAmountBeforeUncommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedLoanAmountBeforeUncommit"] = String(vars["LastCommittedLoanAmountBeforeUncommit"]).substring(3);
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.click();
    await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    await priceOfferedPage.LockedCommitted_Loans_2.click();
    await correspondentPortalPage.Paste_Loans_Button1.waitFor({ state: 'hidden' });
    vars["TotalCountLoanAmounts"] = String(await priceOfferedPage.Locked_Loan_AmountCommitment_List.count());
    vars["TotalCommittedLoanAmount"] = "0";
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalCountLoanAmounts"]))) {
      vars["IndividualCommittedLoanAmount"] = await bidRequestDetailsPage.Individual_Loan_Amount.textContent() || '';
      vars["TotalCommittedLoanAmount"] = (parseFloat(String(vars["TotalCommittedLoanAmount"])) + parseFloat(String(vars["IndividualCommittedLoanAmount"]))).toFixed(0);
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    vars["UncommittedLoanAmount"] = vars["TotalCommittedLoanAmount"];
    vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitBeforeUncommit"] = String('').split("(")["0"] || '';
    vars["AuthLimitBeforeUncommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(String(vars["BidReqIdPriceOffered"]));
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Bid_Status_Price_OfferedExe_Type1).toContainText("Partially Committed");
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_In_Committed_Page.click();
    await priceOfferedPage.Search_In_Committed_Page.fill(String(vars["BidReqIdPriceOffered"]));
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await priceOfferedPage.CommitmentID.waitFor({ state: 'visible' });
    await priceOfferedPage.CommitmentID.click();
    vars["CommittedLoansCountBeforeUnommit"] = await priceOfferedPage.Total_Committed_LoansCommitment_List.textContent() || '';
    while (await priceOfferedPage.Select_all_for_Checkbox.isVisible()) {
      await priceOfferedPage.Select_all_for_Checkbox.check();
      await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
      await priceOfferedPage.Commit_Selected_1_Dropdown.click();
      await priceOfferedPage.Yes_Uncommit_Button.click();
      await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
      await correspondentPortalPage.Okay_Button1.click();
      await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
      await commitmentListPage.Total_Committed_Loans_Tab.click();
    }
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(String(vars["BidReqIdPriceOffered"]));
    await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.waitFor({ state: 'visible' });
    vars["BidStatusPriceOfferedPage"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
    vars["BidStatusPriceOfferedPage"] = String(vars["BidStatusPriceOfferedPage"]).trim();
    expect(String(vars["BidStatusPriceOfferedPage"])).toBe("Price Offered");
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
    vars["OpenAuthLimit"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["OpenAuthLimitAfterUncommit"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitAfterUncommit"] = String(vars["OpenAuthLimitAfterUncommit"]).replace(/\$\,/g, '');
    vars["OpenAuthLimitAfterUncommit"] = String(vars["OpenAuthLimitAfterUncommit"]).trim();
    vars["OpenAuthLimitPercentageAfterUncommit"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageAfterUncommit"] = String(vars["OpenAuthLimitPercentageAfterUncommit"]).replace(/\)%/g, '');
    vars["AuthLimitAfterUncommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    vars["LastCommittedBidAfterUnommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidAfterUnommit"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidAfterUnommit"] = String(vars["LastCommittedBidAfterUnommit"]).trim();
    vars["LastCommittedLoanAmountAfterUncommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedLoanAmountAfterUncommit"] = String(vars["LastCommittedLoanAmountAfterUncommit"]).substring(3);
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeUncommit"])) + parseFloat(String(vars["UncommittedLoanAmount"]))).toFixed(0);
    vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitAfterUncommit"]))).toFixed(4);
    vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthPercentage"])) * parseFloat(String("100"))).toFixed(2);
    expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterUncommit"]);
    expect(String(vars["ExpectedOpenAuthPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterUncommit"]);
    expect(String(vars["AuthLimitBeforeUncommit"])).toBe(vars["AuthLimitAfterUncommit"]);
    expect(String(vars["LastCommittedBidBeforeUncommit"])).toBe(vars["LastCommittedBidAfterUnommit"]);
    expect(String(vars["LastCommittedLoanAmountBeforeUncommit"])).toBe(vars["LastCommittedLoanAmountAfterUncommit"]);
    await expect(priceOfferedPage.LockedCommitted_Loans_Count).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(String(vars["BidReqIdPriceOffered"]));
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidStatusBidReqPage"] = await bidRequestPage.Bid_Status_BidRequestsPage.textContent() || '';
    vars["BidStatusBidReqPage"] = String(vars["BidStatusBidReqPage"]).trim();
    expect(String(vars["BidStatusBidReqPage"])).toBe("Price Offered");
    await bidRequestPage.Required_Bid_Req_IDBid_Req_Page.click();
    await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
    vars["StatusBidReqDetails"] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
    expect(String(vars["StatusBidReqDetails"])).toBe("Price Offered");
    // Write to test data profile: "RequestIDfrom24-1" = vars["BidReqIdPriceOffered"]
  });
});
