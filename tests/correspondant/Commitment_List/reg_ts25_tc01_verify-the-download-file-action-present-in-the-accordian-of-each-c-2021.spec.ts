import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments'
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = "REG_TS25_TC01";
const TC_TITLE = "Verify the download file action present in the accordian of each commitment, It should display the proper committed loan details";

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    bidRequestsPage = new BidRequestsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Login to corr application');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to corr appication successful');
      } catch (e) {
        log.stepFail(page, 'Fail to Login corr appication Failed');
        throw e;
      }

      log.step('Navigating to commitment closed list tab');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
         await commitmentListPage.Closed_List_Tab.evaluate((el: HTMLElement) => {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          el.click();
        });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Closed_Date).toBeVisible();
        log.stepPass('Successsfully Navigate to closed list tab');
      } catch (e) {
        log.stepFail(page, 'Fail to navigate closed list tab');
        throw e;
      }

      log.step('Storing BidReqId and CommitmentID from commitment list');
      try {
        vars["BidReqId"] = await commitmentListPage.Second_Bid_Request_IdCommitment_List.textContent() || '';
        Methods.trimtestdata(vars["BidReqId"], "BidReqId");
        // vars["BidReqId"] ="87SC341DE28A";
        vars["CommitmentID"] = await commitmentListPage.Second_Commitment_IDCommitment_List.textContent() || '';
        Methods.trimtestdata(vars["CommitmentID"], "CommitmentID");
        // vars["CommitmentID"] ="870Y937B";
        log.stepPass(`Successfully stored BidReqId: ${vars["BidReqId"]} and CommitmentID: ${vars["CommitmentID"]}`);
      } catch (e) {
        log.stepFail(page, 'Failed to store BidReqId and CommitmentID');
        throw e;
      }

      log.step('Navigating to Price Offered and storing Reference Month');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Price_Offered_Text.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Price_Offered_Text).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars["BidReqId"]);
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars["BidReqId"]).click();
        await priceOfferedPage.Reference_Month.waitFor({ state: 'visible' });
        vars["ReferenceMonth"] = await priceOfferedPage.Reference_Month.textContent() || '';
        log.stepPass(`Successfully stored ReferenceMonth: ${vars["ReferenceMonth"]}`);
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Price Offered or store Reference Month');
        throw e;
      }

      log.step('Navigating back to closed list and filtering by CommitmentID');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars["CommitmentID"]);
        await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForTimeout(4000);
        log.stepPass(`Successfully filtered commitment list by CommitmentID: ${vars["CommitmentID"]}`);
      } catch (e) {
        log.stepFail(page, 'Failed to navigate back to closed list or filter by CommitmentID');
        throw e;
      }

      log.step('Storing all required commitment details from the list');
      try {
        vars["CCodeUI"] = await priceOfferedPage.CCode_In_Commitment_List(vars["BidReqId"]).textContent() || '';
        vars["CommitmentIdUI"] = await priceOfferedPage.Commitment_IDCommitment_List(vars["BidReqId"]).textContent() || '';
        Methods.trimtestdata(vars["CommitmentIdUI"], "CommitmentIdUI");
        vars["CompanyNameUI"] = await priceOfferedPage.Company_In_Commitment_List(vars["BidReqId"]).textContent() || '';
        Methods.trimtestdata(vars["CompanyNameUI"], "CompanyNameUI");
        Methods.removeSpecialChar("-", vars["CompanyNameUI"], "CompanyNameUI")
        vars["CommitmentLoanAmountUI"] = await priceOfferedPage.Comm_AmountCommitment_List(vars["BidReqId"]).textContent() || '';
        vars["CommittedLoansUI"] = await priceOfferedPage.CommLoans_Commitment_List(vars["BidReqId"]).textContent() || '';
        vars["CommittedDateUI"] = await priceOfferedPage.Committed_DateCommitment_List(vars["BidReqId"]).textContent() || '';
        vars["ExpiredDateUI"] = await priceOfferedPage.Expiration_DateCommitment_List(vars["BidReqId"]).textContent() || '';
        vars["ExecutionTypeUI"] = await priceOfferedPage.Execution_TypeCommitment_List(vars["BidReqId"]).textContent() || '';
        log.stepPass('Successfully stored all commitment list details');
      } catch (e) {
        log.stepFail(page, 'Failed to store commitment list details');
        throw e;
      }

      log.step('Navigating to commitment details and storing Product Name, Ref Sec Coupon and Current Market Value');
      try {
        await priceOfferedPage.Commitment_IDCommitment_List_Page_New(vars["BidReqId"]).click();
        await priceOfferedPage.Product_NameDetails.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Product_NameDetails).toBeVisible();
        vars["ProductNameUI"] = await priceOfferedPage.Product_NameDetails.textContent() || '';
        vars["RefSecCouponUI"] = await priceOfferedPage.Ref_Sec_CouponDetails.textContent() || '';
        vars["CurrentMarketValueUI"] = await commitmentListPage.Current_Market_ValueCommitment_List.first().textContent() || '';
        log.stepPass(`Successfully stored ProductName: ${vars["ProductNameUI"]}, RefSecCoupon: ${vars["RefSecCouponUI"]}, CurrentMarketValue: ${vars["CurrentMarketValueUI"]}`);
      } catch (e) {
        log.stepFail(page, 'Failed to store Product Name, Ref Sec Coupon or Current Market Value');
        throw e;
      }

      log.step('Concatenating all cover letter details into AllCoverLetterDetailsUI');
      try {
        Methods.concatenateWithSpecialChar(vars["CommitmentIdUI"], vars["CommittedDateUI"], ";", "AllCoverLetterDetailsUI");
        Methods.concatenateWithSpecialChar(vars["AllCoverLetterDetailsUI"], vars["ProductNameUI"], ";", "AllCoverLetterDetailsUI");
        Methods.concatenateWithSpecialChar(vars["AllCoverLetterDetailsUI"], vars["CommitmentLoanAmountUI"], ";", "AllCoverLetterDetailsUI");
        Methods.concatenateWithSpecialChar(vars["AllCoverLetterDetailsUI"], vars["ExpiredDateUI"], ";", "AllCoverLetterDetailsUI");
        Methods.concatenateWithSpecialChar(vars["AllCoverLetterDetailsUI"], vars["RefSecCouponUI"], ";", "AllCoverLetterDetailsUI");
        Methods.concatenateWithSpecialChar(vars["AllCoverLetterDetailsUI"], vars["CommittedLoansUI"], ";", "AllCoverLetterDetailsUI");
        Methods.concatenateWithSpecialChar(vars["AllCoverLetterDetailsUI"], vars["BidReqId"], ";", "AllCoverLetterDetailsUI");
        Methods.concatenateWithSpecialChar(vars["AllCoverLetterDetailsUI"], vars["ReferenceMonth"], ";", "AllCoverLetterDetailsUI");
        Methods.concatenateWithSpecialChar(vars["AllCoverLetterDetailsUI"], vars["ExecutionTypeUI"], ";", "AllCoverLetterDetailsUI");
        Methods.concatenateWithSpecialChar(vars["AllCoverLetterDetailsUI"], vars["CurrentMarketValueUI"], ";", "AllCoverLetterDetailsUI");
        log.stepPass('Successfully concatenated all cover letter details');
      } catch (e) {
        log.stepFail(page, 'Failed to concatenate cover letter details');
        throw e;
      }

      log.step('Splitting and storing all cover letter details into TestDataProfile');
      try {
        const profileName = 'Cover Letter Details Closed List';
        vars["SplitCount"] = appconstants.ONE;
        for (let count = 0; count < 11; count++) {
          Methods.splitStringByRegConditionWithPosition(vars["AllCoverLetterDetailsUI"], ";", vars["SplitCount"], "IndividualCoverLetterDetailsUI");
          Methods.trimtestdata(vars["IndividualCoverLetterDetailsUI"], "IndividualCoverLetterDetailsUI");
          testDataManager.updateProfileData1(profileName, { ChaseInfo: vars["IndividualCoverLetterDetailsUI"] }, count);
          Methods.MathematicalOperation(vars["SplitCount"], "+", "1", "SplitCount");
        }
        log.stepPass('Successfully stored all cover letter details into TestDataProfile');
      } catch (e) {
        log.stepFail(page, 'Failed to store cover letter details into TestDataProfile');
        throw e;
      }

      log.step('Navigating back and downloading the commitment letter');
      try {
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_Letter.click();
        await commitmentListPage.File_NamePopup.first().waitFor({ state: 'visible' });
        vars["FileNamePopup"] = await commitmentListPage.File_NamePopup.first().textContent() || '';
        Methods.trimtestdata(vars["FileNamePopup"], "FileNamePopup");
        vars["CreationDatePopup"] = await commitmentListPage.Creation_DatePopup.first().textContent() || '';
        expect(Methods.verifyString(vars["CommittedDateUI"], "equals", vars["CreationDatePopup"]));
        await commitmentListPage.Download_Commitment_Letter1(vars["FileNamePopup"]).waitFor({ state: 'visible' });
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        await commitmentListPage.Download_Commitment_Letter1(vars["FileNamePopup"]).first().hover();
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          commitmentListPage.Download_Commitment_Letter1(vars["FileNamePopup"]).first().evaluate(el => (el as HTMLElement).click())
        ]);
        log.info("Commitment Letter File downloaded successfully");
        vars['DownloadedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['DownloadedCommitmentLetterPath'] = path.join(vars['DownloadDir'], vars['DownloadedFileName']);
        await download.saveAs(vars['DownloadedCommitmentLetterPath']);
        expect(Methods.verifyString(vars["DownloadedFileName"], "contains", vars["FileNamePopup"]));
        vars["CompanyNameWithCCodeUI"] = vars["CompanyNameUI"] + "-" + "(" + vars["CCodeUI"] + ")";
        Methods.trimWhitespace(vars["CompanyNameWithCCodeUI"], "CompanyNameWithCCodeUI");
        log.stepPass('Successfully downloaded commitment letter and verified file name');
      } catch (e) {
        log.stepFail(page, 'Failed to download commitment letter or verify file name');
        throw e;
      }
      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});