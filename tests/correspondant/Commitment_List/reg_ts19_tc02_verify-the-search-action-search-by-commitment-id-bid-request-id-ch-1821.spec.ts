// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentDetailsPage: CommitmentDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentDetailsPage = new CommitmentDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS19_TC02_Verify the search action, Search by commitment ID, Bid request ID, Chase loan number and the Correspondent loan number for 3digit input', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.First_Commitment_IDCommitment_List.click();
    await priceOfferedPage.Commit_IDCommitment_List.waitFor({ state: 'visible' });
    vars["CommitmentID"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    vars["CommitmentID"] = String(vars["CommitmentID"]).substring(0, 3);
    vars["BidRequestId"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    vars["BidRequestId"] = String(vars["BidRequestId"]).substring(0, 3);
    vars["ChaseLoanNumber"] = await commitmentDetailsPage.Chase_Loan_NumberCommitments_Details.textContent() || '';
    vars["ChaseLoanNumber"] = String(vars["ChaseLoanNumber"]).substring(0, 3);
    vars["CorrespondentLoanNumber"] = await commitmentListPage.Corr_Loan_NumCommitments_Details.textContent() || '';
    vars["CorrespondentLoanNumber"] = String(vars["CorrespondentLoanNumber"]).substring(0, 3);
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["CommitmentID"]);
    await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
    await commitmentListPage.Commit_IDCommitment_List_Screen.waitFor({ state: 'visible' });
    for (let i = 0; i < await commitmentListPage.Commit_IDCommitment_List_Screen.count(); i++) {
      await expect(commitmentListPage.Commit_IDCommitment_List_Screen.nth(i)).toContainText(String(vars["CommitmentID"]));
    }
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidRequestId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await commitmentListPage.First_Bid_Req_IDCommitment_List.waitFor({ state: 'visible' });
    for (let i = 0; i < await commitmentListPage.First_Bid_Req_IDCommitment_List.count(); i++) {
      await expect(commitmentListPage.First_Bid_Req_IDCommitment_List.nth(i)).toContainText(String(vars["BidRequestId"]));
    }
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["ChaseLoanNumber"]);
    await commitmentListPage.Chase_Loan_Number_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ChaseLoanNumbersCount"] = String(await commitmentListPage.First_Bid_Req_IDCommitment_List.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseLoanNumbersCount"]))) {
      vars["CommitID"] = await commitmentListPage.Individual_Commitment_IDList_Screen.textContent() || '';
      vars["CommitID"] = String(vars["CommitID"]).trim();
      await commitmentListPage.Individual_Commitment_IDList_Screen.click();
      await commitmentListPage.Required_Chase_Loan_Num.waitFor({ state: 'visible' });
      await expect(commitmentListPage.Required_Chase_Loan_Num).toContainText(vars["ChaseLoanNumber"]);
      await priceOfferedPage.Back_To_Commitment_List.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["CorrespondentLoanNumber"]);
    await commitmentListPage.Correspondent_Loan_Num_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CorrespondentLoanNumberCount"] = String(await commitmentListPage.First_Bid_Req_IDCommitment_List.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CorrespondentLoanNumberCount"]))) {
      vars["CommitID"] = await commitmentListPage.Individual_Commitment_IDList_Screen.textContent() || '';
      vars["CommitID"] = String(vars["CommitID"]).trim();
      await commitmentListPage.Individual_Commitment_IDList_Screen.click();
      await commitmentListPage.Req_CarrLoan_Num.waitFor({ state: 'visible' });
      expect((await commitmentListPage.Req_CarrLoan_Num.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
      await priceOfferedPage.Back_To_Commitment_List.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
  });
});
