// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
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

  test('REG_TS08_TC01_ Add loans to commitment for the commitment which is not latest one and verify auth limit values', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIdFrom6-4": "87MWF9C278BC",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-1": "876YA587E147",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "CommitmentIDfrom8-10": "87JU2DDD",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqId"] = testData["RequestIdFrom6-4"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.waitFor({ state: 'hidden' });
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDCommitment_List_Page(vars[BidReqId]).click();
    await priceOfferedPage.Commit_IDCommitment_List.waitFor({ state: 'visible' });
    vars["CommitID"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    vars["CommitOrderScreen"] = await priceOfferedPage.Commit_OrderCommitment_List.textContent() || '';
    vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitBeforeCommit"] = String('').split("(")["0"] || '';
    vars["AuthLimitBeforeCommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    vars["LastCommittedBidTime"] = await commitmentListPage.Commitment_Time_List_Details_ScreenLatest.textContent() || '';
    vars["LastCommittedBidDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "M/d/yy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars[""] = String(vars["LastCommittedBidDate"]) + ' ' + String(vars["LastCommittedBidTime"]);
    vars["LastCommittedBidLoanAmountBeforeCommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanAmountBeforeCommit"] = String(vars["LastCommittedBidLoanAmountBeforeCommit"]).substring(3);
    await commitmentListPage.Total_LoansCommitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Required_Loan_Num.check();
    vars["CommittedCorrLoan"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
    vars["CommittedLastNameTotalLoans"] = await commitmentListPage.Last_NameCommitment_List.textContent() || '';
    vars["CommittedLoanAmountTotalLoans"] = await priceOfferedPage.Committed_Loan_AmountPrice_Offered.textContent() || '';
    vars["CommittedIntRateTotalLoans"] = await priceOfferedPage.Committed_Interest_RatePrice_Offered.textContent() || '';
    vars["CommittedRefSecProdTotalLoans"] = await priceOfferedPage.Committed_Reference_SecurityPrice_Offered.textContent() || '';
    vars["CommittedRefSecPriceTotalLoans"] = await priceOfferedPage.Committed_Reference_Security_PricePrice_Offered.textContent() || '';
    vars["CommittedGrossPriceTotalLoans"] = await priceOfferedPage.Committed_Gross_PricePrice_Offered.textContent() || '';
    vars["CommittedHedgeRatioTotalLoans"] = await priceOfferedPage.Committed_Hedge_RatioPrice_Offered.textContent() || '';
    vars["CommittedCurrMarketValueTotalLoans"] = await commitmentListPage.Curr_Market_ValueCommitment_List.textContent() || '';
    vars["CommittedMarkAdjTotalLoans"] = await priceOfferedPage.Committed_Mar_AdjPrice_Offered.textContent() || '';
    vars["CommittedCurrGrossTotalLoans"] = await correspondentPortalPage.Curr_GrossCommitment_List.textContent() || '';
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await correspondentPortalPage.Commitment_OrderCommitment_List.click();
    await correspondentPortalPage.Yes_Commit_Button.click();
    await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
    await correspondentPortalPage.Okay_Button1.click();
    await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(commitmentListPage.Committed_Loan_NumCommitment_List).toBeVisible();
    vars["LatestCommittedCommitmentOrder"] = await priceOfferedPage.Commitment_OrderPrice_Offred.textContent() || '';
    expect(String(vars["CommitOrderScreen"])).toBe(vars["LatestCommittedCommitmentOrder"]);
    await expect(commitmentListPage.Last_NameCommitment_List).toContainText(vars["CommittedLastNameTotalLoans"]);
    await expect(priceOfferedPage.Committed_Loan_AmountPrice_Offered).toContainText(vars["CommittedLoanAmountTotalLoans"]);
    await expect(priceOfferedPage.Committed_Interest_RatePrice_Offered).toContainText(vars["CommittedIntRateTotalLoans"]);
    await expect(priceOfferedPage.Committed_Reference_SecurityPrice_Offered).toContainText(vars["CommittedRefSecProdTotalLoans"]);
    await expect(priceOfferedPage.Committed_Reference_Security_PricePrice_Offered).toContainText(vars["CommittedRefSecPriceTotalLoans"]);
    await expect(priceOfferedPage.Committed_Gross_PricePrice_Offered).toContainText(vars["CommittedGrossPriceTotalLoans"]);
    await expect(priceOfferedPage.Committed_Hedge_RatioPrice_Offered).toContainText(vars["CommittedHedgeRatioTotalLoans"]);
    await expect(commitmentListPage.Curr_Market_ValueCommitment_List).toContainText(vars["CommittedCurrMarketValueTotalLoans"]);
    await expect(priceOfferedPage.Committed_Mar_AdjPrice_Offered).toContainText(vars["CommittedMarkAdjTotalLoans"]);
    await expect(correspondentPortalPage.Curr_GrossCommitment_List).toContainText(vars["CommittedCurrGrossTotalLoans"]);
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
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeCommit"])) - parseFloat(String(vars["CommittedLoanAmountTotalLoans"]))).toFixed(0);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitBeforeCommit"]))).toFixed(4);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimitPercentage"])) * parseFloat(String("100"))).toFixed(2);
    expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterCommit"]);
    expect(String(vars["ExpectedOpenAuthLimitPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterCommit"]);
    expect(String(vars["AuthLimitBeforeCommit"])).toBe(vars["AuthLimitAfterCommit"]);
    // [DISABLED] Verify if ExpectedLastCommittedBidDateAndTime == LastCommittedBidAfterCommit
    // expect(String(vars["ExpectedLastCommittedBidDateAndTime"])).toBe(vars["LastCommittedBidAfterCommit"]);
    // [DISABLED] Remove the no of ( 8,0 ) positions of given string ExpectedLastCommittedBidDateAndTime and store into runtime variable ExpectedLastCommittedBidTime
    // vars["ExpectedLastCommittedBidTime"] = String(vars["ExpectedLastCommittedBidDateAndTime"]).substring(8);
    // [DISABLED] Remove the no of ( 8,0 ) positions of given string ExpectedLastCommittedBidDateAndTime and store into runtime variable LastCommittedBidAfterCommit
    // vars["LastCommittedBidAfterCommit"] = String(vars["ExpectedLastCommittedBidDateAndTime"]).substring(8);
    vars["LastCommittedBidTimeHM"] = String('').split("")["1"] || '';
    vars["LastCommittedBidTimeStandard"] = String('').split("")["2"] || '';
    vars[""] = String(vars["LastCommittedBidTimeHM"]) + ' ' + String(vars["LastCommittedBidTimeStandard"]);
    vars["LastCommittedBidAfterCommit"] = vars["ExpectedLastCommittedBidTime"];
    await stepGroups.stepGroup_Adjust_Time_by_adding_and_subtracting_one_min_from_Last_Comm(page, vars);
    expect(String(vars["LastCommittedBidLoanAmountBeforeCommit"])).toBe(vars["LastCommittedBidLoanAmountAfterCommit"]);
  });
});
