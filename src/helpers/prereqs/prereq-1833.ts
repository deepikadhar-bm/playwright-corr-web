import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1795 } from './prereq-1795';

export async function runPrereq_1833(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1795(page, vars);

  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  await commitmentListPage.Commitment_IDLatest.waitFor({ state: 'visible' });
  vars["CommitID"] = await commitmentListPage.Commitment_IDLatest.textContent() || '';
  vars["LatestCommitmentOrderScreen"] = await commitmentListPage.Commit_OrderLatest.textContent() || '';
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
  vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
  vars["OpenAuthLimitBeforeCommit"] = String('').split("(")["0"] || '';
  vars["AuthLimitBeforeCommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
  vars["LastCommittedBidLoanAmountBeforeCommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
  vars["LastCommittedBidLoanAmountBeforeCommit"] = String(vars["LastCommittedBidLoanAmountBeforeCommit"]).substring(3);
  await commitmentListPage.Total_LoansCommitment_List.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.Required_Loan_Num.check();
  vars["CommittedCorrLoan"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
  vars["CommittedLastNameTotalLoans"] = await commitmentListPage.Last_NameCommitment_List.textContent() || '';
  vars["CommittedLoanAmountTotalLoans"] = await priceOfferedPage.Committed_Loan_AmountPrice_Offered.textContent() || '';
  vars["CommittedLoanAmountTotalLoans"] = String(vars["CommittedLoanAmountTotalLoans"]).trim();
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
  expect(String(vars["LatestCommitmentOrderScreen"])).toBe(vars["LatestCommittedCommitmentOrder"]);
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
  await priceOfferedPage.Open_Auth_Limit.scrollIntoViewIfNeeded();
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
  vars["LastCommittedBidLoanAmountAfterCommit"] = String(vars["LastCommittedBidLoanAmountAfterCommit"]).replace(/\$\,/g, '');
  vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeCommit"])) - parseFloat(String(vars["CommittedLoanAmountTotalLoans"]))).toFixed(0);
  vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitBeforeCommit"]))).toFixed(4);
  vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimitPercentage"])) * parseFloat(String("100"))).toFixed(2);
  vars["ExpectedLastCommittedLoanAmount"] = (parseFloat(String(vars["LastCommittedBidLoanAmountBeforeCommit"])) + parseFloat(String(vars["CommittedLoanAmountTotalLoans"]))).toFixed(0);
  expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterCommit"]);
  expect(String(vars["ExpectedOpenAuthLimitPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterCommit"]);
  expect(String(vars["AuthLimitBeforeCommit"])).toBe(vars["AuthLimitAfterCommit"]);
  expect(String(vars["ExpectedLastCommittedBidDateAndTime"])).toBe(vars["LastCommittedBidAfterCommit"]);
  expect(String(vars["ExpectedLastCommittedLoanAmount"])).toBe(vars["LastCommittedBidLoanAmountAfterCommit"]);
}
