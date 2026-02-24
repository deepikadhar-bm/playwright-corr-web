import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../step-groups';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_2021(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);


  // Set up download handler
  page.on('download', async (download) => {
    const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
    await download.saveAs(filePath);
    vars['_lastDownloadPath'] = filePath;
  });

  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await commitmentListPage.Committed_List_Dropdown.click();
  await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
  await commitmentListPage.Closed_List_Tab.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["BidReqId"] = await commitmentListPage.Second_Bid_Request_IdCommitment_List.textContent() || '';
  vars["BidReqId"] = String(vars["BidReqId"]).trim();
  vars["CommitmentID"] = await commitmentListPage.Second_Commitment_IDCommitment_List.textContent() || '';
  vars["CommitmentID"] = String(vars["CommitmentID"]).trim();
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
  await priceOfferedPage.Reference_Month.waitFor({ state: 'visible' });
  vars["ReferenceMonth"] = await priceOfferedPage.Reference_Month.textContent() || '';
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await commitmentListPage.Committed_List_Dropdown.click();
  await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
  await commitmentListPage.Closed_List_Tab.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.Search_Dropdown.click();
  await priceOfferedPage.Search_Dropdown.fill(vars["CommitmentID"]);
  await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["CCodeUI"] = await priceOfferedPage.CCode_In_Commitment_List.textContent() || '';
  vars["CommitmentIdUI"] = await priceOfferedPage.Commitment_IDCommitment_List.textContent() || '';
  vars["CommitmentIdUI"] = String(vars["CommitmentIdUI"]).trim();
  vars["CompanyNameUI"] = await priceOfferedPage.Company_In_Commitment_List.textContent() || '';
  vars["CompanyNameUI"] = String(vars["CompanyNameUI"]).trim();
  vars["CompanyNameUI"] = String(vars["CompanyNameUI"]).replace(/\-/g, '');
  vars["CommitmentLoanAmountUI"] = await priceOfferedPage.Comm_AmountCommitment_List.textContent() || '';
  vars["CommittedLoansUI"] = await priceOfferedPage.CommLoans_Commitment_List.textContent() || '';
  vars["CommittedDateUI"] = await priceOfferedPage.Committed_DateCommitment_List.textContent() || '';
  vars["ExpiredDateUI"] = await priceOfferedPage.Expiration_DateCommitment_List.textContent() || '';
  vars["ExecutionTypeUI"] = await priceOfferedPage.Execution_TypeCommitment_List.textContent() || '';
  await priceOfferedPage.Commitment_IDCommitment_List_Page_New.click();
  await priceOfferedPage.Product_NameDetails.waitFor({ state: 'visible' });
  vars["ProductNameUI"] = await priceOfferedPage.Product_NameDetails.textContent() || '';
  vars["RefSecCouponUI"] = await priceOfferedPage.Ref_Sec_CouponDetails.textContent() || '';
  vars["CurrentMarketValueUI"] = await commitmentListPage.Current_Market_ValueCommitment_List.textContent() || '';
  vars["AllCoverLetterDetailsUI"] = String(vars["CommitmentIdUI"]) + ";" + String(vars["CommittedDateUI"]);
  vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["ProductNameUI"]);
  vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["CommitmentLoanAmountUI"]);
  vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["ExpiredDateUI"]);
  vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["RefSecCouponUI"]);
  vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["CommittedLoansUI"]);
  vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["BidReqId"]);
  vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["ReferenceMonth"]);
  vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["ExecutionTypeUI"]);
  vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["CurrentMarketValueUI"]);
  vars["count"] = "1";
  for (let dataIdx = parseInt(vars["count"]); dataIdx <= 11; dataIdx++) {
    vars["IndividualCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]).split(";")[parseInt(String(vars["count"]))] || '';
    vars["IndividualCoverLetterDetailsUI"] = String(vars["IndividualCoverLetterDetailsUI"]).trim();
    // Write to test data profile: "ChaseInfo" = vars["IndividualCoverLetterDetailsUI"]
    vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
  }
  await priceOfferedPage.Back_To_Commitment_List.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await commitmentListPage.Commitment_Letter.click();
  await commitmentListPage.File_NamePopup.waitFor({ state: 'visible' });
  vars["FileNamePopup"] = await commitmentListPage.File_NamePopup.textContent() || '';
  vars["FileNamePopup"] = String(vars["FileNamePopup"]).trim();
  vars["CreationDatePopup"] = await commitmentListPage.Creation_DatePopup.textContent() || '';
  expect(String(vars["CommittedDateUI"])).toBe(vars["CreationDatePopup"]);
  await commitmentListPage.Download_Commitment_Letter1.waitFor({ state: 'visible' });
  await commitmentListPage.Download_Commitment_Letter1.hover();
  await commitmentListPage.Download_Commitment_Letter1.evaluate(el => (el as HTMLElement).click());
  await page.waitForTimeout(3000); // Wait for download to complete
  vars["FilePath"] = vars['_lastDownloadPath'] || '';
  vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
  expect(String(vars["DownloadedFileName"])).toBe(vars["FileNamePopup"]);
  vars["CompanyNameWithCCodeUI"] = vars["CompanyNameUI"] + "-" + "(" + vars["CCodeUI"] + ")";
  vars["CompanyNameWithCCodeUI"] = String(vars["CompanyNameWithCCodeUI"]).trim();
}
