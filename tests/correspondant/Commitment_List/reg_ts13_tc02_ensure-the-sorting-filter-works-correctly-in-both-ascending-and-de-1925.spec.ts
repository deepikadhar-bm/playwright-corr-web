import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments'


const TC_ID = "REG_TS13_TC02";
const TC_TITLE = "_Ensure the sorting filter works correctly in both ascending and descending order - Verify for the detail screen";

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'CommitmentList';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    if (profile && profile.data) {
      const commitmentId = profile.data[0]['CommitmentIDfrom8-10'];
      console.log("Commitment ID from TDP:", commitmentId);
      vars["CommitmentId"] = commitmentId;
    }

    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
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
      log.step('Search the commitment id and click on respective commitment id in open list');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await page.waitForLoadState('networkidle');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars["CommitmentId"]);
        await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('networkidle');
        await commitmentListPage.First_Commitment_IDCommitment_List.first().waitFor({ state: 'visible' });
        await page.waitForTimeout(6000);
        await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('networkidle');
        await expect(commitmentListPage.Total_LoansCommitment_List).toBeVisible();
        log.stepPass("successful");
      }
      catch (e) {
        log.stepFail(page, 'Fail to Search the commitment id and click on respective commitment id in open list');
        throw e;
      }
      log.step('Verification of Total committed loans sorting order both ascending and descending');
      try {
        vars["IndividualHeadersCommitmentList"] = appconstants.IndividualHeadersCommitmentList;
        vars["HeadersUI1"] = appconstants.HeadersUI1;
        vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
        vars["count"] = "1";
        while (parseFloat(vars["count"]) <= parseFloat(vars["ColumnHeadersDetailsScreenUI"])) {
          vars["IndividualHeaderScreenDetails"] = await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualHeaderScreenDetails"], "IndividualHeaderScreenDetails");

          log.info('verifying ascending order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
            log.info("Ascending order -" + "if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
          } else if (vars["HeadersUI1"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Ascending order -" + "else if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyDateOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderScreenDetails"]), 'ascending', 'MM/dd/yyyy');
          } else {
            log.info("Ascending order -" + "else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_DetainsScreen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          }

          log.info('verifying Descending order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Ascending order -" + "if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          } else if (vars["HeadersUI1"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Ascending order -" + "else if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyDateOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderScreenDetails"]), 'descending', 'MM/dd/yyyy');
          } else {
            log.info("Ascending order -" + "else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_DetainsScreen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          }

          Methods.MathematicalOperation(vars["count"], "+", "1", "count");
        }
        log.stepPass("successful Verification of Total committed loans sorting order both ascending and descending");
      }
      catch (e) {
        log.stepFail(page, 'Fail to Verify Total committed loans sorting order both ascending and descending');
        throw e;
      }

      log.step('Verification of Total loans sorting order both ascending and descending');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('networkidle');
        await expect(priceOfferedPage.Open_Auth_Limit).toBeVisible();
        vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
        vars["count"] = "1";
        while (parseFloat(vars["count"]) <= parseFloat(vars["ColumnHeadersDetailsScreenUI"])) {
          vars["IndividualHeaderScreenDetails"] = await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualHeaderScreenDetails"], "IndividualHeaderScreenDetails");

          log.info('verifying Ascending order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await page.waitForLoadState('networkidle');
          await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
          await page.waitForTimeout(1000);
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Ascending order -" + "if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          } else if (vars["HeadersUI1"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Ascending order -" + "else if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyDateOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderScreenDetails"]), 'ascending', 'MM/dd/yyyy');
          } else {
            log.info("Ascending order -" + "else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_DetainsScreen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          }

          log.info('verifying Descending order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Ascending order -" + "if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          } else if (vars["HeadersUI1"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Ascending order -" + "else if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyDateOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderScreenDetails"]), 'descending', 'MM/dd/yyyy');
          } else {
            log.info("Ascending order -" + "else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_DetainsScreen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          }

          Methods.MathematicalOperation(vars["count"], "+", "1", "count");
        }
        log.stepPass("successful to Verify Total loans sorting order both ascending and descending");
      }
      catch (e) {
        log.stepFail(page, 'Verify Total loans sorting order both ascending and descending');
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