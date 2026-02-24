import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { runPrereq_1774 } from './prereq-1774';

export async function runPrereq_1776(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1774(page, vars);

  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);



  await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
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
  await expect(page.getByText(vars["CommitmentIDBeforeUncommit"])).not.toBeVisible();
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
  vars["LastCommittedBidLoanAmountAfterUncommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
  vars["LastCommittedBidLoanAmountAfterUncommit"] = String(vars["LastCommittedBidLoanAmountAfterUncommit"]).substring(3);
  vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeUncommit"])) + parseFloat(String(vars["UncommittedLoanAmount"]))).toFixed(0);
  vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitBeforeUncommit"]))).toFixed(4);
  vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthPercentage"])) * parseFloat(String("100"))).toFixed(2);
  expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterUncommit"]);
  expect(String(vars["ExpectedOpenAuthPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterUncommit"]);
  expect(String(vars["AuthLimitBeforeUncommit"])).toBe(vars["AuthLimitAfterUncommit"]);
  expect(String(vars["LastCommittedBidBeforeUncommit"])).toBe(vars["LastCommittedBidAfterUncommit"]);
  expect(String(vars["LatestCommittedBidLoanAmountBeforeUncommit"])).toBe(vars["LastCommittedBidLoanAmountAfterUncommit"]);
}
