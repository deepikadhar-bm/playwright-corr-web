import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentDetailsPage: CommitmentDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;


  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentDetailsPage = new CommitmentDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test('REG_TS20_TC02_Verify the search action, Search by commitment ID, Bid request ID, Chase loan number and the Correspondent loan number for 3digit input)', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Closed_List_Tab.click();
    // await page.waitForTimeout(6000);
    await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 15000 });
    await commitmentListPage.First_Commitment_IDCommitment_List.first().waitFor({ state: 'visible' });
    await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
    await priceOfferedPage.Commit_IDCommitment_List.first().waitFor({ state: 'visible' });
    vars["CommitmentID"] = await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
    Methods.splitRangeOfCharacters(vars["CommitmentID"], 0, 3, "CommitmentID");
    vars["BidRequestId"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    Methods.splitRangeOfCharacters(vars["BidRequestId"], 0, 3, "BidRequestId");
    vars["ChaseLoanNumber"] = await commitmentDetailsPage.Chase_Loan_NumberCommitments_Details.first().textContent() || '';
    Methods.splitRangeOfCharacters(vars["ChaseLoanNumber"], 0, 3, "ChaseLoanNumber");
    vars["CorrespondentLoanNumber"] = await commitmentListPage.Corr_Loan_NumCommitments_Details.first().textContent() || '';
    Methods.splitRangeOfCharacters(vars["CorrespondentLoanNumber"], 0, 3, "CorrespondentLoanNumber");
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars["CommitmentID"]);
    await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.waitForTimeout(6000);
    await commitmentListPage.Commit_IDCommitment_List_Screen.first().waitFor({ state: 'visible' });
    await Methods.verifyMultipleElementsHavePartialText(commitmentListPage.Commit_IDCommitment_List_Screen, vars["CommitmentID"]);
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars["BidRequestId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await page.waitForTimeout(6000);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.First_Bid_Req_IDCommitment_List.first().waitFor({ state: 'visible' });
    await Methods.verifyMultipleElementsHavePartialText(commitmentListPage.First_Bid_Req_IDCommitment_List, vars["BidRequestId"]);
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars["ChaseLoanNumber"]);
    await commitmentListPage.Chase_Loan_Number_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ChaseLoanNumbersCount"] = String(await commitmentListPage.First_Bid_Req_IDCommitment_List.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseLoanNumbersCount"]))) {
      vars["CommitID"] = await commitmentListPage.Individual_Commitment_IDList_Screen(vars["count"]).textContent() || '';
      // vars["CommitID"] = String(vars["CommitID"]).trim();
      Methods.trimtestdata(vars["CommitID"], "CommitID");
      await commitmentListPage.Individual_Commitment_IDList_Screen(vars["count"]).click();
      await commitmentListPage.Required_Chase_Loan_Num(vars["CommitID"], vars["ChaseLoanNumber"]).first().scrollIntoViewIfNeeded();
      await expect(commitmentListPage.Required_Chase_Loan_Num(vars["CommitID"], vars["ChaseLoanNumber"]).first()).toContainText(vars["ChaseLoanNumber"]);
      await priceOfferedPage.Back_To_Commitment_List.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars["CorrespondentLoanNumber"]);
    await commitmentListPage.Correspondent_Loan_Num_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.waitForTimeout(6000);
    vars["CorrespondentLoanNumberCount"] = String(await commitmentListPage.First_Bid_Req_IDCommitment_List.count());
    console.log("CorrespondentLoanNumberCount:",vars["CorrespondentLoanNumberCount"]);
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CorrespondentLoanNumberCount"]))) {
      await commitmentListPage.Individual_Commitment_IDList_Screen(vars["count"]).scrollIntoViewIfNeeded();
      vars["CommitID"] = await commitmentListPage.Individual_Commitment_IDList_Screen(vars["count"]).textContent() || '';
      // vars["CommitID"] = String(vars["CommitID"]).trim();
      Methods.trimtestdata(vars["CommitID"], "CommitID");
      await commitmentListPage.Individual_Commitment_IDList_Screen(vars["count"]).click();
      await page.waitForLoadState('networkidle');
      await bidRequestDetailsPage.Loan_Amount_Sort_Button.first().waitFor({ state: 'visible' });
      const ReqCorrLoanNum = commitmentListPage.Req_CarrLoan_Num(vars["CommitID"], vars["CorrespondentLoanNumber"]);
      if (await ReqCorrLoanNum.isVisible())/* Element Req CarrLoan Num is visible */ {
        console.log("ReqCorrLoanNum is visible");
      } else {
        // expect((await commitmentListPage.Corr_Loan_NumCommitments_Details.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
        await Methods.verifyElementContainsTextIgnoreCase(commitmentDetailsPage.First_Corr_Loan_Numbercommitments.first(), vars["CorrespondentLoanNumber"])

      }
      await priceOfferedPage.Back_To_Commitment_List.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
  });
});
