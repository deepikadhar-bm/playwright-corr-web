// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC05_Combination of valid and duplicate loans', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIdFrom5-1": "876YA587E147",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "CommitmentIDfrom8-10": "87JU2DDD",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    vars["BidReqId"] = testData["RequestIdFrom5-1"];
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDStandard.click();
    await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
    await commitmentListPage.Total_LoansCommitment_List.click();
    await commitmentListPage.Committed_Loan_NumStandard_Commitment_List.waitFor({ state: 'visible' });
    vars["CommittedLoanNumStandard"] = await commitmentListPage.Committed_Loan_NumStandard_Commitment_List.textContent() || '';
    vars["FreshLoanNumStandard1"] = await commitmentListPage.Fresh_Loan_Num1Standard_Commitment_List.textContent() || '';
    vars["FreshLoanNumStandard2"] = await commitmentListPage.Fresh_Loan_Num2Standard.textContent() || '';
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDChase_Direct.click();
    await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
    vars["NoOfLoansBeforeCommit"] = await commitmentListPage.No_ofLoansCommitment_List_Details.textContent() || '';
    vars["CommitID"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    vars["OpenAuthLimitBeforeCommit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitBeforeCommit"] = String('').split("(")["0"] || '';
    vars["AuthLimitBeforeCommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    vars["LastCommitBidTime"] = await commitmentListPage.Commitment_Time_List_Details_ScreenLatest.textContent() || '';
    vars["LastCommitBidDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "M/d/yy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars[""] = String(vars["LastCommitBidDate"]) + ' ' + String(vars["LastCommitBidTime"]);
    vars["LastCommittedBidLoanAmounBeforeCommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanAmounBeforeCommit"] = String(vars["LastCommittedBidLoanAmounBeforeCommit"]).substring(3);
    await commitmentListPage.Total_LoansCommitment_List.click();
    await commitmentListPage.Committed_Loan_NumberChase_Direct.waitFor({ state: 'visible' });
    vars["CommittedLoanNumChaseDirect"] = await commitmentListPage.Committed_Loan_NumberChase_Direct.textContent() || '';
    if (String(vars["CommittedLoanNumChaseDirect"]) !== String(vars["FreshLoanNumStandard1"])) {
      vars["CommittedCorrLoan"] = vars["FreshLoanNumStandard1"];
    } else if (String(vars["CommittedLoanNumChaseDirect"]) !== String(vars["FreshLoanNumStandard2"])) {
      vars["CommittedCorrLoan"] = vars["FreshLoanNumStandard2"];
    }
    await commitmentListPage.Check_Duplicate_Loan_Num.check();
    await priceOfferedPage.Check_Duplicate_Loan_NumChase_Direct.check();
    await stepGroups.stepGroup_Storing_Required_Loan_Number_Details(page, vars);
    vars["ExpectedCommittedLoanAmount"] = String(vars["CommittedLoanAmountTotalLoans"]).trim();
    vars["SelectedLoanScreen"] = String(await priceOfferedPage.Checked_Row.count());
    vars["LoanAmount2"] = await priceOfferedPage.Loan_AmountDuplicate_Loan_Num.textContent() || '';
    vars["SelectedLoanAmountScreen"] = (parseFloat(String(vars["CommittedLoanAmountTotalLoans"])) + parseFloat(String(vars["LoanAmount2"]))).toFixed(0);
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    vars["CommitmentOrder"] = await correspondentPortalPage.Commitment_OrderCommitment_List.textContent() || '';
    vars["CommitmentOrder"] = String(vars["CommitmentOrder"]).slice(-1);
    await correspondentPortalPage.Commitment_OrderCommitment_List.click();
    vars["BidRequestIDPopup"] = await priceOfferedPage.BidRequestIDPopupDetails.textContent() || '';
    vars["LoanValuePopup"] = await priceOfferedPage.Loan_ValuePopup.textContent() || '';
    vars["LoanValuePopup"] = String(vars["LoanValuePopup"]).replace(/\$\,/g, '');
    vars["SelectedLoansPopup"] = await priceOfferedPage.Selected_LoansPopup.textContent() || '';
    expect(String(vars["BidReqId"])).toBe(vars["BidRequestIDPopup"]);
    expect(String(vars["SelectedLoanAmountScreen"])).toBe(vars["LoanValuePopup"]);
    expect(String(vars["SelectedLoanScreen"])).toBe(vars["SelectedLoansPopup"]);
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    vars["space"] = "key_blank";
    vars["CommitmentUpdateText"] = "Commitment" + vars["space"] + vars["CommitID"] + vars["space"] + "is" + vars["space"] + "updated.";
    await expect(commitmentListPage.Commitment_UpdatePopup).toContainText(vars["CommitmentUpdateText"]);
    await expect(priceOfferedPage.Loans_added_successfullyPopup).toContainText("Loans added successfully -");
    await expect(priceOfferedPage.Commit_Loan_TextPopup).toContainText(vars["CommittedCorrLoan"]);
    await expect(priceOfferedPage.Loans_failedPopup).toContainText("Loans failed to be added to commitment");
    vars["DuplicateLoanText"] = "Loan" + vars["space"] + vars["CommittedLoanNumStandard"] + vars["space"] + "is a Duplicate loan. It is already committed";
    await expect(priceOfferedPage.Loans_Failed_TextPopup).toContainText(vars["DuplicateLoanText"]);
    await priceOfferedPage.Okay_ButtonPopup.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Committed_CorrLoan).toBeVisible();
    await expect(priceOfferedPage.Duplicate_Loan_NumStandard).toBeVisible();
    vars["NoOfLoansAfterCommit"] = await commitmentListPage.No_ofLoansCommitment_List_Details.textContent() || '';
    expect(String(vars["NoOfLoansBeforeCommit"])).toBe(vars["NoOfLoansAfterCommit"]);
    await expect(priceOfferedPage.Commitment_OrderPrice_Offred).toContainText(vars["CommitmentOrder"]);
    await stepGroups.stepGroup_Verifying_Loan_Details(page, vars);
    await correspondentPortalPage.Open_Auth_Limit_Total_Loan.scrollIntoViewIfNeeded();
    vars["OpenAuthLimit"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["OpenAuthLimitAfterCommit"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitAfterCommit"] = String(vars["OpenAuthLimitAfterCommit"]).replace(/\$\,/g, '');
    vars["OpenAuthLimitAfterCommit"] = String(vars["OpenAuthLimitAfterCommit"]).trim();
    vars["OpenAuthLimitPercentageAfterCommit"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageAfterCommit"] = String(vars["OpenAuthLimitPercentageAfterCommit"]).replace(/\)%/g, '');
    vars["AuthLimitAfterCommit"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
    vars["LastCommittedBidDateAndTimeAfterCommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidDateAndTimeAfterCommit"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidDateAndTimeAfterCommit"] = String(vars["LastCommittedBidDateAndTimeAfterCommit"]).trim();
    vars["LastCommittedBidLoanAmountAfterCommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanAmountAfterCommit"] = String(vars["LastCommittedBidLoanAmountAfterCommit"]).substring(3);
    vars["LastCommittedBidLoanAmountAfterCommit"] = String(vars["LastCommittedBidLoanAmountAfterCommit"]).replace(/\$\,/g, '');
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeCommit"])) - parseFloat(String(vars["ExpectedCommittedLoanAmount"]))).toFixed(0);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitBeforeCommit"]))).toFixed(4);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimitPercentage"])) * parseFloat(String("100"))).toFixed(2);
    vars["ExpectedLastCommittedLoanAmount"] = (parseFloat(String(vars["LastCommittedBidLoanAmounBeforeCommit"])) + parseFloat(String(vars["ExpectedCommittedLoanAmount"]))).toFixed(2);
    expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterCommit"]);
    expect(String(vars["ExpectedOpenAuthLimitPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterCommit"]);
    expect(String(vars["AuthLimitBeforeCommit"])).toBe(vars["AuthLimitAfterCommit"]);
    expect(String(vars["ExpectedLastCommittedBidDateAndTime"])).toBe(vars["LastCommittedBidDateAndTimeAfterCommit"]);
    expect(String(vars["ExpectedLastCommittedLoanAmount"])).toBe(vars["LastCommittedBidLoanAmountAfterCommit"]);
  });
});
