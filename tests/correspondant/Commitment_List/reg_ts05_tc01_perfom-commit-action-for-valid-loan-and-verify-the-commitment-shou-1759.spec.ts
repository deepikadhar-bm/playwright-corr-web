// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOffered2Page } from '../../../src/pages/correspondant/price-offered-2';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1389 } from '../../../src/helpers/prereqs/prereq-1389';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOffered2Page: PriceOffered2Page;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1389(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOffered2Page = new PriceOffered2Page(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS05_TC01_Perfom commit action for valid loan and verify the commitment should be created and. auth limit value should be updated', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqId"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidReqId_Standard.click();
    vars["ExecutionType"] = await priceOfferedPage.Executiontype.textContent() || '';
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await stepGroups.stepGroup_Storing_Open_Auth_Limit_and_AuthLimit_Price_Offered(page, vars);
    await priceOfferedPage.Required_Loan_Num.check();
    vars["ExpectedCommittedLoanAmount"] = await priceOfferedPage.Checked_Loan_Amount.textContent() || '';
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    vars["ExpectedBidCommittedDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "M/d/yy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["ExpectedBidCommittedTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "h:mm a";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars[""] = String(vars["ExpectedBidCommittedDate"]) + ' ' + String(vars["ExpectedBidCommittedTime"]);
    vars["ExpectedLastCommittedBidDateAndTimeplus1"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["ExpectedBidCommittedTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String("1")));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: h:mm a
    })();
    vars[""] = (() => {
      const d = new Date('2000-01-01 ' + String(''));
      d.setMinutes(d.getMinutes() - parseInt(String('')));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    vars[""] = String(vars["ExpectedBidCommittedDate"]) + ' ' + String(vars["ExpectedLastCommittedBidDateAndTimeplus1"]);
    vars[""] = String(vars["ExpectedBidCommittedDate"]) + ' ' + String(vars["ExpectedLastCommittedBidDateAndTimeminus1"]);
    vars["CommitmentID"] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
    await priceOfferedPage.Okay_ButtonPopup.click();
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await priceOfferedPage.Committed_Loan.waitFor({ state: 'visible' });
    vars["CommittedLoanNumStandard"] = await priceOfferedPage.Committed_Loan.textContent() || '';
    await expect(priceOffered2Page.Commited_Loan_Locked_Icon).toBeVisible();
    vars["CommitmentOrderPriceOffered"] = await priceOfferedPage.CommitedOrderStandard.textContent() || '';
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
    await expect(page.getByText(vars["CommitmentID"])).toBeVisible();
    vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitAfterCommit"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitAfterCommit"] = String(vars["OpenAuthLimitAfterCommit"]).replace(/\$\,/g, '');
    vars["OpenAuthLimitAfterCommit"] = String(vars["OpenAuthLimitAfterCommit"]).trim();
    vars["OpenAuthLimitPercentageAfterCommit"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageAfterCommit"] = String(vars["OpenAuthLimitPercentageAfterCommit"]).replace(/\)%/g, '');
    vars["AuthLimitAfterCommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    vars["LastCommittedBidAfterCommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidAfterCommit"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidAfterCommit"] = String(vars["LastCommittedBidAfterCommit"]).trim();
    vars["LastCommittedBidLoanAmountAfterCommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanAmountAfterCommit"] = String(vars["LastCommittedBidLoanAmountAfterCommit"]).substring(3);
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeCommit"])) - parseFloat(String(vars["ExpectedCommittedLoanAmount"]))).toFixed(0);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitBeforeCommit"]))).toFixed(4);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimitPercentage"])) * parseFloat(String("100"))).toFixed(2);
    expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterCommit"]);
    expect(String(vars["ExpectedOpenAuthLimitPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterCommit"]);
    expect(String(vars["AuthLimitBeforeCommit"])).toBe(vars["AuthLimitAfterCommit"]);
    if (String(vars["ExpectedBidCommittedDateAndTime"]) === String(vars["LastCommittedBidAfterCommit"])) {
    } else if (String(vars["ExpectedLastCommittedBidDateAndTimeplus1"]) === String(vars["LastCommittedBidAfterCommit"])) {
    } else {
      expect(String(vars["ExpectedLastCommittedBidDateAndTimeminus1"])).toBe(vars["LastCommittedBidAfterCommit"]);
    }
    expect(String(vars["ExpectedCommittedLoanAmount"])).toBe(vars["LastCommittedBidLoanAmountAfterCommit"]);
    // Write to test data profile: "RequestIdFrom5-1" = vars["BidReqId"]
    await commitmentListPage.Total_LoansCommitment_List.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await expect(commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown).toBeVisible();
    vars["CommitmentOrderCommitmentList"] = await commitmentListPage.Commitment_OrderAdd_To_Commit_Dropdown.textContent() || '';
    vars["CommitmentOrderCommitmentList"] = String(vars["CommitmentOrderCommitmentList"]).slice(-1);
    expect(String(vars["CommitmentOrderPriceOffered"])).toBe(vars["CommitmentOrderCommitmentList"]);
    // Write to test data profile: "RequestIdFrom5-1" = vars["BidReqId"]
  });
});
