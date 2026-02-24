import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1787 } from './prereq-1787';

export async function runPrereq_1774(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1787(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  vars["BidReqId"] = vars["RequestIDDetails"];
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
  await priceOfferedPage.Required_Loan_Num.waitFor({ state: 'visible' });
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String("3"))) {
    if (String(vars["count"]) === String("1")) {
      await priceOfferedPage.Select_Loan_Num1.check();
      await commitmentListPage.Select_Loan_Num2.check();
    } else {
      await priceOfferedPage.Required_Loan_Num.check();
    }
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.waitFor({ state: 'visible' });
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await page.waitForLoadState('networkidle');
    vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
  }
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await commitmentListPage.Committed_List_Dropdown.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.Search_Dropdown.click();
  await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
  await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await commitmentListPage.Commitment_IDCommitment_List_Page.click();
  await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
  vars["OpenAuthLimit"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
  vars["OpenAuthLimitBeforeUncommit"] = String('').split("(")["0"] || '';
  vars["AuthLimitBeforeUncommit"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
  vars["LastCommittedBidBeforeUncommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
  vars["LastCommittedBidBeforeUncommit"] = String('').split("|")["0"] || '';
  vars["LatestCommittedBidLoanAmountBeforeUncommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
  vars["LatestCommittedBidLoanAmountBeforeUncommit"] = String(vars["LatestCommittedBidLoanAmountBeforeUncommit"]).substring(3);
  await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
  vars["UncommittedLoanNum"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
  vars["UncommittedLoanAmount"] = await priceOfferedPage.Checked_Loan_Amount.textContent() || '';
  await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
  await priceOfferedPage.Commit_Selected_1_Dropdown.click();
  await priceOfferedPage.Yes_Uncommit_Button.click();
  await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
  await correspondentPortalPage.Okay_Button1.click();
  await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
  await commitmentListPage.Total_Committed_Loans_Tab.click();
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
