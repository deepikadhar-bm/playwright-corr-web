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

  test('REG_TS05_TC02_Perform commit action for combination of duplicate loan and valid loan verify that commitment should be created and no loans should be displayed and that commitment record should be disp', async ({ page }) => {
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
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqId"] = testData["RequestIdFrom5-1"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidReqId_Standard.click();
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await priceOfferedPage.Committed_Loan_NumStandard.waitFor({ state: 'visible' });
    vars["CommittedLoanNumStandard"] = await priceOfferedPage.Committed_Loan_NumStandard.textContent() || '';
    vars["UncommittedLoanNumStandard"] = await priceOfferedPage.Uncommitted_Loan_NumStandard.textContent() || '';
    vars["OpenAuthLimitBeforeCommit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitBeforeCommit"] = String('').split("(")["0"] || '';
    vars["AuthLimitBeforeCommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidReqId_Chase_Direct.click();
    await priceOfferedPage.Check_Fresh_Loan_NumChase_Direct.check();
    await priceOfferedPage.Check_Duplicate_Loan_NumChase_Direct.check();
    await priceOfferedPage.Get_Price_Button.click();
    vars["LoanAmountFreshLoan"] = await priceOfferedPage.Loan_AmountFresh_Loan_Num.textContent() || '';
    vars["ExpectedCommittedLoanAmount"] = String(vars["LoanAmountFreshLoan"]).trim();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    vars["space"] = "key_blank";
    vars["DateAndTimeFormat"] = "M/d/yy" + vars["space"] + "h:mm a";
    vars["ExpectedBidCommittedDateAndTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "DateAndTimeFormat";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    vars["CommitmentID"] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
    await priceOfferedPage.Okay_ButtonPopup.click();
    await priceOfferedPage.All_Loans_PriceofferedPage.waitFor({ state: 'visible' });
    await priceOfferedPage.All_Loans_PriceofferedPage.click();
    await expect(priceOfferedPage.Committed_Loan_Locked_Icon).toBeVisible();
    vars["CommitmentOrderPriceOffered"] = await priceOfferedPage.Commitment_OrderChase_Direct.textContent() || '';
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["CommitmentID"]);
    await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Commitment_IdCommitment_List_Screen).toBeVisible();
    await expect(page.getByText(vars["BidReqId"])).toBeVisible();
    await priceOfferedPage.Commitment_IdCommitment_List_Screen.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["CommitmentID"])).toBeVisible();
    await expect(priceOfferedPage.Committed_Loan_NumChase).toBeVisible();
    await expect(priceOfferedPage.Duplicate_Loan_NumStandard).toBeVisible();
    await commitmentListPage.Total_LoansCommitment_List.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await expect(commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown).toBeVisible();
    vars["CommitmentOrderCommitmentList"] = await commitmentListPage.Commitment_OrderAdd_To_Commit_Dropdown.textContent() || '';
    vars["CommitmentOrderCommitmentList"] = String(vars["CommitmentOrderCommitmentList"]).slice(-1);
    expect(String(vars["CommitmentOrderPriceOffered"])).toBe(vars["CommitmentOrderCommitmentList"]);
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
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeCommit"])) - parseFloat(String(vars["ExpectedCommittedLoanAmount"]))).toFixed(0);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitBeforeCommit"]))).toFixed(4);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimitPercentage"])) * parseFloat(String("100"))).toFixed(2);
    expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterCommit"]);
    expect(String(vars["ExpectedOpenAuthLimitPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterCommit"]);
    expect(String(vars["AuthLimitBeforeCommit"])).toBe(vars["AuthLimitAfterCommit"]);
    expect(String(vars["ExpectedBidCommittedDateAndTime"])).toBe(vars["LastCommittedBidDateAndTimeAfterCommit"]);
    expect(String(vars["ExpectedCommittedLoanAmount"])).toBe(vars["LastCommittedBidLoanAmountAfterCommit"]);
  });
});
