import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';


const TC_ID = 'REG_TS08_TC03';
const TC_TITLE = 'Input a loan number present which is present in this company, but is not in this bid/price offered record';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const crederntials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    
    vars["Username"] = crederntials.username;
    vars["Password"] = crederntials.password;
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Login to CORR portal and navigate to Price Offered');
      try {
        if (profile && profile.data) {
      vars["CompanyName"] = profile.data[0]['Company Name'];
      log.info('Company Name: ' + vars["CompanyName"]);
    }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Login successful and navigated to Price Offered');
      } catch (e) {
        log.stepFail(page, 'Failed to login or navigate to Price Offered');
        throw e;
      }

      log.step('Capturing Bid Request ID, Company Name and Loan Number from first record');
      try {
        await priceOfferedPage.Bid_Request_IDCompany_Name_Partial_or_Price_Offered(vars["CompanyName"]).first().click();
        await priceOfferedPage.Bid_Request_IDprice_offered.first().waitFor({ state: 'visible' });
        vars["Bidreq_ID"] = await priceOfferedPage.Bid_Request_IDprice_offered.textContent() || '';
        vars["BidreqID"]=vars["Bidreq_ID"];
        vars["Companyname"] = (await priceOfferedPage.Company_NamePriceoffered.textContent() || '').trim();
        Methods.trimtestdata(vars["Companyname"],"Companyname");
        vars["BidLoanNumberCompany"] = await priceOfferedPage.Corr_Loan_Number_ID.first().textContent() || '';
        log.stepPass('Captured Bid Request ID: ' + vars["Bidreq_ID"] + ' Company: ' + vars["Companyname"] + ' Loan Number: ' + vars["BidLoanNumberCompany"]);
      } catch (e) {
        log.stepFail(page, 'Failed to capture Bid Request ID, Company Name and Loan Number');
        throw e;
      }

      log.step('Switching to different Bid Request ID and verifying loan not visible');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await priceOfferedPage.Bid_Req_Id_other_than_the_given_id_Company_Name_Price_offered_or_Partial(vars["CompanyName"],vars["BidreqID"]).first().waitFor({ state: 'visible' });
        await spinnerPage.Spinner.first().waitFor({ state: 'hidden' });
        await priceOfferedPage.Bid_Req_Id_other_than_the_given_id_Company_Name_Price_offered_or_Partial(vars["CompanyName"],vars["BidreqID"]).first().click();
        await priceOfferedPage.Company_NamePriceoffered.first().waitFor({ state: 'visible' });
        await expect(page.getByText(vars["BidLoanNumberCompany"])).not.toBeVisible();
        await expect(priceOfferedPage.Company_NamePriceoffered).toContainText(vars["Companyname"]);
        log.stepPass('Switched to different Bid Request and verified loan is not visible');
      } catch (e) {
        log.stepFail(page, 'Failed to switch Bid Request or verify loan visibility');
        throw e;
      }

      log.step('Pasting loan number from different Bid Request and verifying error message');
      try {
        await correspondentPortalPage.Paste_Loans_Button1.click();
        await correspondentPortalPage.Paste_loan_numbers_here1.click();
        await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["BidLoanNumberCompany"]);
        vars["BidLoanNumberPopup"] = (await correspondentPortalPage.Paste_loan_numbers_here1.innerText());
        // expect(String(vars["BidLoanNumberCompany"])).toBe(vars["BidLoanNumberPopup"]);
        expect(Methods.verifyString(vars["BidLoanNumberCompany"],"equals",vars["BidLoanNumberPopup"]));
        await priceOfferedPage.Validate_ButtonPrice_Offered_Page.click();
        await priceOfferedPage.Loan_Number_Text.waitFor({ state: 'visible' });
        await priceOfferedPage.Error_message.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Loan_Number_Text).toHaveCSS('color', "rgb(255, 0, 0)");
        await expect(priceOfferedPage.Error_message).toContainClass("text-danger");
        await expect(priceOfferedPage.Error_message).toHaveCSS('color', 'rgb(220, 53, 69)');
        await expect(priceOfferedPage.Unidentified_Loan_Name).toContainText(vars["BidLoanNumberCompany"]);
        log.stepPass('Error message verified for loan: ' + vars["BidLoanNumberCompany"]);
      } catch (e) {
        log.stepFail(page, 'Failed to verify error message for loan number');
        throw e;
      }

      log.step('Removing errors and closing popup');
      try {
        await correspondentPortalPage.Remove_errors_and_continue_CheckboxPopup.check();
        await expect(correspondentPortalPage.Add_to_Commit).toBeVisible();
        await priceOfferedPage.CloseButtonPopup.click();
        log.stepPass('Errors removed and popup closed successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to remove errors and close popup');
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