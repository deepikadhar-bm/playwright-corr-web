// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { runPrereq_1776 } from '../../../src/helpers/prereqs/prereq-1776';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1776(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('REG_TS06_TC04_Uncommit all loans from the latest commitment and verify the open auth limit values + last commit values', async ({ page }) => {

    await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
    vars["BidCommitTimeFirstLoan"] = await commitmentListPage.Commit_TimeCommitment_Screen.textContent() || '';
    vars["LastCommitLoanAmount"] = await priceOfferedPage.Locked_Loan_AmountCommitment_List.textContent() || '';
    vars["LastCommitLoanAmountFirstLoan"] = String(vars["LastCommitLoanAmount"]).trim();
    vars["OpenAuthLimit"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["OpenAuthLimitBeforeUncommit"] = String('').split("(")["0"] || '';
    vars["AuthLimitBeforeUncommit"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
    vars["LastCommittedBidBeforeUncommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidBeforeUncommit"] = String('').split("|")["0"] || '';
    vars["LatestCommittedBidLoanAmountBeforeUncommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LatestCommittedBidLoanAmountBeforeUncommit"] = String(vars["LatestCommittedBidLoanAmountBeforeUncommit"]).substring(3);
    vars["CommitmentIDBeforeUncommit"] = await commitmentListPage.Commitment_ID2_Screen.textContent() || '';
    await commitmentListPage.Select_All_Loans.check();
    vars["UncommittedLoanNum"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
    vars["UncommittedLoanAmount"] = await priceOfferedPage.Checked_Loan_Amount.textContent() || '';
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Uncommit_Button.click();
    await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
    await correspondentPortalPage.Okay_Button1.click();
    await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    await expect(page.getByText("CommitmentIDBeforeUncommit")).not.toBeVisible();
    await expect(priceOfferedPage.Committed_Loan_NumLatest).toBeVisible();
    vars["OpenAuthLimit"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["OpenAuthLimitAfterUncommit"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitAfterUncommit"] = String(vars["OpenAuthLimitAfterUncommit"]).replace(/\$\,/g, '');
    vars["OpenAuthLimitAfterUncommit"] = String(vars["OpenAuthLimitAfterUncommit"]).trim();
    vars["OpenAuthLimitPercentageAfterUncommit"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageAfterUncommit"] = String(vars["OpenAuthLimitPercentageAfterUncommit"]).replace(/\)%/g, '');
    vars["AuthLimitAfterUncommit"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
    vars["LastCommittedBidAfterUncommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidAfterUncommit"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidAfterUncommit"] = String(vars["LastCommittedBidAfterUncommit"]).trim();
    vars["BidCommitTime"] = String('').split("")["1"] || '';
    vars["BidCommitTimeStamp"] = String('').split("")["2"] || '';
    vars[""] = String(vars["BidCommitTime"]) + ' ' + String(vars["BidCommitTimeStamp"]);
    vars["LastCommittedBidLoanAmountAfterUncommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanAmountAfterUncommit"] = String(vars["LastCommittedBidLoanAmountAfterUncommit"]).substring(3);
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeUncommit"])) + parseFloat(String(vars["UncommittedLoanAmount"]))).toFixed(0);
    vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitBeforeUncommit"]))).toFixed(4);
    vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthPercentage"])) * parseFloat(String("100"))).toFixed(2);
    expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterUncommit"]);
    expect(String(vars["ExpectedOpenAuthPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterUncommit"]);
    expect(String(vars["AuthLimitBeforeUncommit"])).toBe(vars["AuthLimitAfterUncommit"]);
    vars["LastBidCommitTimeAfterUnCommitPlus1"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["LastBidCommitTimeAfterUncommit"]));
      d.setMinutes(d.getMinutes() + parseInt(String("1")));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: h:mm a
    })();
    vars[""] = (() => {
      const d = new Date('2000-01-01 ' + String(''));
      d.setMinutes(d.getMinutes() - parseInt(String('')));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    if (String(vars["BidCommitTimeFirstLoan"]) === String(vars["LastBidCommitTimeAfterUncommit"])) {
    } else if (String(vars["BidCommitTimeFirstLoan"]) === String(vars["LastBidCommitTimeAfterUnCommitPlus1"])) {
    } else {
      expect(String(vars["BidCommitTimeFirstLoan"])).toBe(vars["LastBidCommitTimeAfterUnCommitMinus1"]);
    }
    // [DISABLED] Verify if BidCommitTimeFirstLoan == LastBidCommitTimeAfterUncommit
    // expect(String(vars["BidCommitTimeFirstLoan"])).toBe(vars["LastBidCommitTimeAfterUncommit"]);
    expect(String(vars["LastCommitLoanAmountFirstLoan"])).toBe(vars["LastCommittedBidLoanAmountAfterUncommit"]);
    // Write to test data profile: "RequestIdFrom6-4" = vars["BidReqId"]
  });
});
