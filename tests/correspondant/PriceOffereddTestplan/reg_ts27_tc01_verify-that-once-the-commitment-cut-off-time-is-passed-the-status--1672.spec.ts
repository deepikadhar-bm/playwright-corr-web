import { test, expect } from '@playwright/test';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS27_TC01';
const TC_TITLE = 'Verify that once the commitment cut off time is passed the status with "Price offered" should get updated to "expired"';


test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS27_TC01testFailed = false;
  const profileName = 'Price Offered';

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered and verify initial status is "Price Offered"');
      try {
        vars['BidReqIdPriceOffered'] = vars['RequestIDDetails'];
        log.info('Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
        log.info('Bid Status (before): ' + vars['BidStatusPriceOffered']);
        Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.PRICEOFFERED_STATUS);
        log.stepPass('Initial status verified as "Price Offered"');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify initial "Price Offered" status');
        throw e;
      }

      log.step('Configure early close cut-off time to current time + 3 minutes');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Early_Close_Config.click();
        await correspondentPortalPage.Add_New_Config_Button.click();
        await correspondentPortalPage.Toggle_Date_Picker_Button.click();
        Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_DMYYYY, 'CurrentDate', appconstants.UTC);
        log.info('Current date: ' + vars['CurrentDate']);
        await correspondentPortalPage.Select_Current_DateAdd_Config(vars['CurrentDate']).click();
        Methods.getCurrentTimestamp(appconstants.TIME_FORMAT_HHMMA, 'CurrentEstTime', appconstants.AMERICA_NEW_YORK);
        Methods.addMinutesToDatetime(vars['CurrentEstTime'], appconstants.TIME_FORMAT_HHMMA, 3, appconstants.TIME_FORMAT_HHMMA, 'CurrentEstTime');
        log.info('Commit cut-off time (EST +3 min): ' + vars['CurrentEstTime']);
        Methods.getLastCharacters(vars['CurrentEstTime'], '2', 'TimeStandard');
        Methods.removeCharactersFromPosition(vars['CurrentEstTime'], '0', '2', 'CurrentEstTime');
        log.info('Time standard: ' + vars['TimeStandard']);
        log.info('Cut-off time value: ' + vars['CurrentEstTime']);
        await chaseFieldNamePage.CommitCutOffTime.type(vars['CurrentEstTime']);
        await correspondentPortalPage.Time_Standard_Dropdown.click();
        await correspondentPortalPage.Time_Standard_Dropdown.selectOption({ label: vars['TimeStandard'] });
        await expect(correspondentPortalPage.Save_Config_Button).toBeEnabled();
        await correspondentPortalPage.Save_Config_Button.click();
        log.stepPass('Early close cut-off time configured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to configure early close cut-off time');
        throw e;
      }

      log.step('Wait for status to update to "Expired"');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        while (!(await priceOfferedPage.Status_Expired(vars['BidReqIdPriceOffered']).isVisible())) {
          await page.reload();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
          await page.keyboard.press('Enter');
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
        log.info('Bid Status (after): ' + vars['BidStatusPriceOffered']);
        Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.EXPIRED_STATUS);
        log.stepPass('Status updated to "Expired" successfully');
      } catch (e) {
        await log.stepFail(page, 'Status did not update to "Expired"');
        throw e;
      }

      log.step('Delete early close config and verify no results remain');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Early_Close_Config.click();
        if (await correspondentPortalPage.Delete_ButtonEarly_Conf.isVisible()) {
          await correspondentPortalPage.Delete_ButtonEarly_Conf.click();
          await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
          await page.reload();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(page.getByText('No result')).toBeVisible();
        }
        testDataManager.updateProfileData(profileName, { 'RequestIDfrom27-1': vars['BidReqIdPriceOffered'] });
        log.stepPass('Early close config deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete early close config');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS27_TC01testFailed = true;
      throw e;
    }
    });
    //After steps
    test.afterEach(async ({ page }) => {
      log.afterTestSteps(TC_ID, REG_TS27_TC01testFailed);
      try {
        log.step('Executing after-test steps: Navigate back to Other Config and delete Early Close Config to restore original state');
        if (REG_TS27_TC01testFailed) {
          await correspondentPortalPage.Administration_Menu.click();
          await correspondentPortalPage.GeneralSettings_Menu.click();
          await correspondentPortalPage.Early_Close_Config.click();
          if (await correspondentPortalPage.Delete_ButtonEarly_Conf.isVisible()) {
            await correspondentPortalPage.Delete_ButtonEarly_Conf.click();
            await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
            await page.reload();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            await expect(page.getByText("No result")).toBeVisible();
          }
        }
        
        log.stepPass('After-test steps executed successfully. Early Close Config deleted and original state restored');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete Early Close Config and restore original state');
        throw e;
      }
    });
  });