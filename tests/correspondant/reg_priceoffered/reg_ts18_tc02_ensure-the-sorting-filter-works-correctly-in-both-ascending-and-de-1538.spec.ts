// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments'

const TC_ID = "REG_TS18_TC02";
const TC_TITLE = "Ensure the sorting filter works correctly in both ascending and descending order - Verify for the list screen and the detail screen";

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

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
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    if (profile && profile.data) {
      const committedBidId = profile.data[0]['CommittedBidId'];
      log.info("Committed Bid ID from TDP:" + committedBidId);
      vars["CommittedBidId"] = committedBidId;
    }
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Login to corr application');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to corr appication successful');
      }
      catch (e) {
        log.stepFail(page, 'Fail to Login corr appication Failed');
        throw e;
      }
      log.step('search the bid requiest id in priceoffered search field and click it');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.type(vars["CommittedBidId"]);
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.press('Enter');
        await spinnerPage.Spinner.first().waitFor({ state: 'hidden' });
        expect(await spinnerPage.Spinner.first()).not.toBeVisible();
        await page.waitForTimeout(2000);
        await priceOfferedPage.Committed_Bid_Req_Id.first().click();
        await priceOfferedPage.LockedCommitted_Loans.waitFor({ state: 'visible' });
        expect(await priceOfferedPage.LockedCommitted_Loans).toBeVisible();
        await priceOfferedPage.Column_Headers_Details_ScreenUI.first().waitFor({ state: 'visible' });
        log.stepPass('search the bid requiest id in priceoffered search field and click it successful');
      }
      catch (e) {
        log.stepFail(page, 'Fail to search the bid requiest id in priceoffered search field and click it');
        throw e;
      }
      log.step('Verification of All loans sorting order both ascending and descending');
      try {
        vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
        vars["count"] = "1";
        while (parseFloat(vars["count"]) <= parseFloat(vars["ColumnHeadersDetailsScreenUI"])) {
          vars["IndividualHeaderScreenDetails"] = await priceOfferedPage.Individual_Column_Header_Details_Screen(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualHeaderScreenDetails"], "IndividualHeaderScreenDetails");

          // Ascending sort
          log.info('verifying Ascending order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await priceOfferedPage.Individual_Column_Header_Details_Screen(vars["count"]).click();
          await page.waitForTimeout(3000);
          await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeaderScreenDetails"] === appconstants.LoanAmount) {
            log.info("Ascending order -" + "if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          } else if (vars["IndividualHeaderScreenDetails"] === appconstants.MarkAdj) {
            log.info("Ascending order -" + "else if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          } else {
            log.info("Ascending order -" + "else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen1(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          }

          // Descending sort
          log.info('verifying Descending order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await priceOfferedPage.Individual_Column_Header_Details_Screen(vars["count"]).click();
          await page.waitForTimeout(3000);
          await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });
          if (vars["IndividualHeaderScreenDetails"] === appconstants.LoanAmount) {
            log.info("Descending order -" + "if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          } else if (vars["IndividualHeaderScreenDetails"] === appconstants.MarkAdj) {
            log.info("Descending order -" + "else if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          } else {
            log.info("Descending order -" + "else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen1(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          }

          Methods.MathematicalOperation(vars["count"], "+", "1", "count");
        }
        log.stepPass("successful to Verify All loans sorting order both ascending and descending");
      }
      catch (e) {
        log.stepFail(page, 'Verify All loans sorting order both ascending and descending');
        throw e;
      }
      log.step('Verification of Locked loans sorting order both ascending and descending');
      try {

        await priceOfferedPage.LockedCommitted_Loans.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).not.toBeVisible();
        await expect(correspondentPortalPage.Paste_Loans_Button1).not.toBeVisible();
        await priceOfferedPage.Column_Headers_Details_ScreenUI.first().waitFor({ state: 'visible' });

        vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
        vars["count"] = "1";
        while (parseFloat(vars["count"]) <= parseFloat(vars["ColumnHeadersDetailsScreenUI"])) {
          vars["IndividualHeaderScreenDetails"] = await priceOfferedPage.Individual_Column_Header_Details_Screen(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualHeaderScreenDetails"], "IndividualHeaderScreenDetails");

          // Ascending sort
          log.info('verifying Ascending order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await priceOfferedPage.Individual_Column_Header_Details_Screen(vars["count"]).click();
          await page.waitForTimeout(3000);
          await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeaderScreenDetails"] === appconstants.LoanAmount) {
            log.info("Ascending order -" + "if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          } else if (vars["IndividualHeaderScreenDetails"] === appconstants.MarkAdj) {
            log.info("Ascending order -" + "else if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          } else {
            log.info("Ascending order -" + "else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen1(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          }

          // Descending sort
          await priceOfferedPage.Individual_Column_Header_Details_Screen(vars["count"]).click();
          await page.waitForTimeout(3000);
          await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeaderScreenDetails"] === appconstants.LoanAmount) {
            log.info("Descending order -" + "if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          } else if (vars["IndividualHeaderScreenDetails"] === appconstants.MarkAdj) {
            log.info("Descending order -" + "else if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          } else {
            log.info("Descending order -" + "else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen1(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          }

          Methods.MathematicalOperation(vars["count"], "+", "1", "count");
        }
        log.stepPass("successful to Verify Locked loans sorting order both ascending and descending");
      }
      catch (e) {
        log.stepFail(page, 'Verify Locked loans sorting order both ascending and descending');
        throw e;
      }
    }
    catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});