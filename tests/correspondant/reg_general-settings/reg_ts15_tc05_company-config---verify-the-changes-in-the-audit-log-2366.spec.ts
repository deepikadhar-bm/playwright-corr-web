import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AuditLogPage } from '../../../src/pages/correspondant/audit-log';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2342 } from '../../../src/helpers/prereqs/prereq-2342';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS15_TC05';
const TC_TITLE = 'Company Config - Verify the Changes in the Audit Log';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let auditLogPage: AuditLogPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2342(page, vars);
    vars['Element_Name1'] = 'Name_Previous_DataPop_Up';
    vars['Element_Name2'] = 'Internal_User_Name_Previous_Data';
    vars['Element_Name3'] = 'Company_Name_Previous_Data';
    vars['Element_Name4'] = 'Internal_User_Name_Previous_Data';
    vars['Element_Name5'] = 'Name_New_DataPop_up';
    vars['Element_Name6'] = 'Internal_User_Name_New_Data';
    vars['Element_Name7'] = 'Company_Name_New_Data';
    vars['Element_Name8'] = 'Internal_User_Name_New_Data';

    vars["testdata1"] = vars['CompanyPreviousDataExp'];
    vars["testdata2"] = vars['InternalUserPreviousDataExp'];
    vars["testdata3"] = vars['CompanyNewDataExp'];
    vars["testdata4"] = vars['InternalUserNewDataExp'];
    auditLogPage = new AuditLogPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Prepare expected audit time from screen time value');
      try {
        vars['ExpectedTimeAudit'] = vars['TimeOnScreen'];
        Methods.removeCharactersFromPosition(vars['ExpectedTimeAudit'], '17', '13', 'ExpectedTimeAudit');
        Methods.convertDateFormat(vars['ExpectedTimeAudit'], appconstants.DATEWITHTIME_FORMAT_MDDYYYYHMMA, appconstants.DATEWITHTIME_FORMAT_MMDDYYYYHHMMA, 'ExpectedTimeAudit');
        log.info('Expected Time Audit: ' + vars['ExpectedTimeAudit']);
        log.stepPass('Expected audit time prepared successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to prepare expected audit time');
        throw e;
      }

      log.step('Navigate to Audit Log and verify created date time column data');
      try {
        await generalSettingPage.Audit_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await Methods.verifyElementContainsTextIgnoreCase(generalSettingPage.Created_Date_Time_Column_Data.first(), vars['ExpectedTimeAudit']);
        log.stepPass('Navigated to Audit Log and date time column data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Audit Log or verify date time column data');
        throw e;
      }

      log.step('Verify audit log user name and config type column data');
      try {
        await expect(generalSettingPage.First_User_Name_UI.first()).toContainText(appconstants.TESTSIGMA_INTERNAL);
        await expect(generalSettingPage.Config_Type_Column_Data.first()).toContainText(appconstants.COMPANY_CONFIG_TEXT);
        log.stepPass('Audit log user name and config type verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify audit log user name or config type');
        throw e;
      }

      log.step('Open See the Difference popup and verify Side by Side view');
      try {
        await correspondentPortalPage.See_the_difference_Button.click();
        await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Side_by_side_Button).toBeDisabled();
        await expect(correspondentPortalPage.Line_by_line_Button).toBeEnabled();
        await expect(seeDifferencePopUpPage.Side_by_Side_Tables.first()).toBeVisible();
        vars['SidebySideTablesCount'] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
        log.info('Side by Side Tables Count: ' + vars['SidebySideTablesCount']);
        expect(Methods.verifyString(vars['SidebySideTablesCount'], 'equals', appconstants.TWO));
        log.stepPass('See the Difference popup opened and Side by Side view verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open See the Difference popup or verify Side by Side view');
        throw e;
      }

      log.step('Verify previous data values and CSS background-colors in Side by Side view');
      try {
        await expect(seeDifferencePopUpPage.Name_Previous_DataPop_Up).toContainText(vars['CompanyPreviousDataExp']);
        await expect(seeDifferencePopUpPage.Internal_User_Name_Previous_Datapop_up).toContainText(vars['InternalUserPreviousDataExp']);
        await expect(auditLogPage.Company_Name_Previous_Data).toHaveCSS('background-color', 'rgb(255, 182, 186)');
        await expect(auditLogPage.Internal_User_Name_Previous_Data).toHaveCSS('background-color', 'rgb(255, 182, 186)');
        log.stepPass('Previous data values and CSS background-colors verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify previous data values or CSS background-colors');
        throw e;
      }

      log.step('Verify new data values and CSS background-colors in Side by Side view');
      try {
        await expect(seeDifferencePopUpPage.Name_New_DataPop_up).toContainText(vars['CompanyNewDataExp']);
        await expect(seeDifferencePopUpPage.Inernal_User_New_Datapop_up).toContainText(vars['InternalUserNewDataExp']);
        await expect(seeDifferencePopUpPage.Company_Name_New_Data).toHaveCSS('background-color', 'rgb(151, 242, 149)');
        await expect(seeDifferencePopUpPage.Internal_User_Name_New_Data).toHaveCSS('background-color', 'rgb(151, 242, 149)');
        log.stepPass('New data values and CSS background-colors verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify new data values or CSS background-colors');
        throw e;
      }

      log.step('Switch to Line by Line view and verify table count');
      try {
        await correspondentPortalPage.Line_by_line_Button.click();
        await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
        await seeDifferencePopUpPage.Line_by_line_Table.waitFor({ state: 'visible' });
        vars['LineByLineTableCount'] = String(await seeDifferencePopUpPage.Line_by_line_Table.count());
        log.info('Line By Line Table Count: ' + vars['LineByLineTableCount']);
        expect(Methods.verifyString(vars['LineByLineTableCount'], 'equals', appconstants.ONE));
        log.stepPass('Switched to Line by Line view and table count verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to switch to Line by Line view or verify table count');
        throw e;
      }

      log.step('Verify see difference popup data and close popup');
      try {
        await stepGroups.stepGroup_Verification_of_see_difference_pop_up_data(page, vars);
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.stepPass('See difference popup data verified and popup closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify see difference popup data or close popup');
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