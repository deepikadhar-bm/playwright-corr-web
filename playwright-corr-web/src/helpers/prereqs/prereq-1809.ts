import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1833 } from './prereq-1833';

export async function runPrereq_1809(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1833(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  await priceOfferedPage.Back_To_Commitment_List.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  if (true) /* Element Search Cancel Button is visible */ {
    await commitmentListPage.Search_Cancel_Button.click();
  }
  await priceOfferedPage.Search_Dropdown.click();
  await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
  await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await commitmentListPage.Commitment_IDCommitment_List_Page.click();
  await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
  await commitmentListPage.Total_LoansCommitment_List.click();
  await priceOfferedPage.Committed_CorrLoan.click();
  await priceOfferedPage.BidReqIdLoan_Details_Popup.waitFor({ state: 'visible' });
  vars["BidReqIDTotalLoansPopup"] = await priceOfferedPage.BidReqIdLoan_Details_Popup.textContent() || '';
  vars["BidLoanNumTotalLoansPopup"] = await priceOfferedPage.Bid_Loan_NumLoan_Details_Popup.textContent() || '';
  vars["ErorsCheckTotalLoansPopup"] = await priceOfferedPage.Errors_CheckLoan_Details_Popup.textContent() || '';
  vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
  vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
    await commitmentListPage.Loan_Details_Text_Popup.click();
    await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup.scrollIntoViewIfNeeded();
    vars["ChaseFieldNamePopupTotalLoans"] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup.textContent() || '';
    await commitmentListPage.Individual_Chase_Value_Total_LoansPopup.scrollIntoViewIfNeeded();
    vars["ChaseValuePopupTotalLoans"] = await commitmentListPage.Individual_Chase_Value_Total_LoansPopup.textContent() || '';
    if (String(vars["ChaseValuePopupTotalLoans"]) === String("Key_blank")) {
      vars["ChaseValuePopupTotalLoans"] = "Null";
    }
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      // Write to test data profile: "Chase Field Name" = vars["ChaseFieldNamePopupTotalLoans"]
      // Write to test data profile: "Chase Field Value" = vars["ChaseValuePopupTotalLoans"]
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
  await correspondentPortalPage.Close_Buttonemail_config.click();
}
