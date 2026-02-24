// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS28_TC01_ Verify the loan behaviour when we perform uncommit action / Add to commit action for a loan', async ({ page }) => {

    // [DISABLED] Login to CORR Portal
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqIdPriceOffered"] = vars["RequestIDDetails"];
    // [DISABLED] Store 57818B1FBE79 in BidReqIdPriceOffered
    // vars["BidReqIdPriceOffered"] = "57818B1FBE79";
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.waitFor({ state: 'hidden' });
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    await priceOfferedPage.Open_Auth_Limit.waitFor({ state: 'visible' });
    vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitBeforeCommit"] = String('').split("(")["0"] || '';
    vars["AuthLimitBeforeCommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    vars["CommittedLoansCountBeforeCommit"] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqIdPriceOffered"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Commitment_ID_2.click();
    vars["CommitID"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    vars["CommitOrderInCommitmentList"] = await priceOfferedPage.Commit_OrderCommitment_List.textContent() || '';
    await commitmentListPage.Total_LoansCommitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Required_Loan_Num.check();
    vars["CommittedCorrLoan"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
    // [DISABLED] Store text from the element element into a variable test data
    // vars["test data"] = await page.locator('//*').textContent() || '';
    // [DISABLED] Trim the data CommittedCorrLoan and store into a runtime variable CommittedCorrLoan
    // vars["CommittedCorrLoan"] = String(vars["CommittedCorrLoan"]).trim();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    // [DISABLED] Store text from the element Commitment Order(Commitment List) into a variable CommitOrderInCommitmentList
    // vars["CommitOrderInCommitmentList"] = await correspondentPortalPage.Commitment_OrderCommitment_List.textContent() || '';
    await correspondentPortalPage.Commitment_OrderCommitment_List.click();
    await correspondentPortalPage.Yes_Commit_Button.click();
    // [DISABLED] Store key_blank in space
    // vars["space"] = "key_blank";
    // [DISABLED] Store StringFunctions :: Concat in DateAndTimeFormat
    // vars["DateAndTimeFormat"] = "M/d/yy" + vars["space"] + "h:mm a";
    vars["ExpectedBidCommittedDateAndTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "DateAndTimeFormat";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
    await correspondentPortalPage.Okay_Button1.click();
    await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(commitmentListPage.Committed_Loan_NumCommitment_List).toBeVisible();
    await expect(page.getByText(vars["CommittedCorrLoan"])).toBeVisible();
    vars["CommittedLastName"] = await commitmentListPage.Last_NameCommitment_List.textContent() || '';
    vars["CommittedLoanAmount"] = await priceOfferedPage.Committed_Loan_AmountPrice_Offered.textContent() || '';
    vars["CommittedIntRate"] = await priceOfferedPage.Committed_Interest_RatePrice_Offered.textContent() || '';
    vars["CommittedRefSecProd"] = await priceOfferedPage.Committed_Reference_SecurityPrice_Offered.textContent() || '';
    vars["CommittedRefSecPrice"] = await priceOfferedPage.Committed_Reference_Security_PricePrice_Offered.textContent() || '';
    vars["CommittedGrossPrice"] = await priceOfferedPage.Committed_Gross_PricePrice_Offered.textContent() || '';
    vars["CommittedHedgeRatio"] = await priceOfferedPage.Committed_Hedge_RatioPrice_Offered.textContent() || '';
    // [DISABLED] Store text from the element Curr Market Value(Commitment List) into a variable CommittedMarketValue
    // vars["CommittedMarketValue"] = await commitmentListPage.Curr_Market_ValueCommitment_List.textContent() || '';
    vars["CommittedMarkAdj"] = await priceOfferedPage.Committed_Mar_AdjPrice_Offered.textContent() || '';
    vars["CommittedCurrGross"] = await correspondentPortalPage.Curr_GrossCommitment_List.textContent() || '';
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
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
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeCommit"])) - parseFloat(String(vars["CommittedLoanAmount"]))).toFixed(0);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitBeforeCommit"]))).toFixed(4);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimitPercentage"])) * parseFloat(String("100"))).toFixed(2);
    expect(String(vars["OpenAuthLimitAfterCommit"])).toBe(vars["ExpectedOpenAuthLimit"]);
    expect(String(vars["OpenAuthLimitPercentageAfterCommit"])).toBe(vars["ExpectedOpenAuthLimitPercentage"]);
    expect(String(vars["AuthLimitBeforeCommit"])).toBe(vars["AuthLimitAfterCommit"]);
    expect(String(vars["LastCommittedBidAfterCommit"])).toBe(vars["ExpectedBidCommittedDateAndTime"]);
    expect(String(vars["CommittedLoanAmount"])).toBe(vars["LastCommittedBidLoanAmountAfterCommit"]);
    vars["CommittedLoanCountAfterCommit"] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
    expect(String(vars["CommittedLoanCountAfterCommit"])).toBe(vars["CommittedLoansCountBeforeCommit"]);
    await expect(priceOfferedPage.Committed_Corr_LoanLocked_Icon).toBeVisible();
    vars["CommitmentOrderInPriceOffered"] = await priceOfferedPage.Commitment_OrderPrice_Offred.textContent() || '';
    expect(String(vars["CommitOrderInCommitmentList"])).toBe(vars["CommitmentOrderInPriceOffered"]);
    // [DISABLED] Verify that the element Committed Corr Loan(Price Offered) displays text CommittedCorrLoan and With Scrollable FALSE
    // await expect(priceOfferedPage.Committed_Corr_LoanPrice_Offered).toContainText(vars["CommittedCorrLoan"]);
    await expect(priceOfferedPage.Committed_CorrLoan).toBeVisible();
    await expect(priceOfferedPage.Committed_Last_NamePrice_Offered).toContainText(vars["CommittedLastName"]);
    await expect(priceOfferedPage.Committed_Loan_AmountPrice_Offered).toContainText(vars["CommittedLoanAmount"]);
    await expect(priceOfferedPage.Committed_Interest_RatePrice_Offered).toContainText(vars["CommittedIntRate"]);
    await expect(priceOfferedPage.Committed_Reference_SecurityPrice_Offered).toContainText(vars["CommittedRefSecProd"]);
    await expect(priceOfferedPage.Committed_Reference_Security_PricePrice_Offered).toContainText(vars["CommittedRefSecPrice"]);
    await expect(priceOfferedPage.Committed_Gross_PricePrice_Offered).toContainText(vars["CommittedGrossPrice"]);
    await expect(priceOfferedPage.Committed_Hedge_RatioPrice_Offered).toContainText(vars["CommittedHedgeRatio"]);
    await expect(priceOfferedPage.Committed_Mar_AdjPrice_Offered).toContainText(vars["CommittedMarkAdj"]);
    await expect(correspondentPortalPage.Curr_GrossCommitment_List).toContainText(vars["CommittedCurrGross"]);
    // Write to test data profile: "RequestIDfrom28-1" = vars["BidReqIdPriceOffered"]
    // [DISABLED] Click on Locked/Committed Loans
    // await priceOfferedPage.LockedCommitted_Loans.click();
    // [DISABLED] Wait until the element Paste Loans Button(Price Offered Page) is not visible
    // await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.waitFor({ state: 'hidden' });
    // [DISABLED] Verify that the element Commit Selected Button is not present and With Scrollable FALSE
    // await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeVisible();
    // [DISABLED] Verify that the element Paste Loans Button(Price Offered Page) is not present and With Scrollable FALSE
    // await expect(priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page).toBeVisible();
  });
});
