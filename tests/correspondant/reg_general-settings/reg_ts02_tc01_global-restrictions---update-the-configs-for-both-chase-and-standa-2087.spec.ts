// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EditPermissionsPage } from '../../../src/pages/correspondant/edit-permissions';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';

const TC_ID = 'REG_TS02_TC01';
const TC_TITLE = 'Global Restrictions - Update the configs for both chase and standard';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let editPermissionsPage: EditPermissionsPage;
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    editPermissionsPage = new EditPermissionsPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC01_Global Restrictions - Update the configs for both chase and standard', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and initial navigation ──────────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Navigate to Global Restrictions ───────────────────────────────────
      log.step('Navigating to Administration > General Settings > Global Restrictions');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        log.info('Clicked Administration Menu');
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - General Settings page loaded');
        await generalSettingPage.Global_Restrictions_menu.click();
        log.info('Clicked Global Restrictions menu');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - Global Restrictions page loaded');
        log.stepPass('Successfully navigated to Global Restrictions page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Global Restrictions');
        throw e;
      }

      // ── Update Standard Radio Button Configuration ────────────────────────
      log.step('Updating Standard Radio Button configuration');
      try {
        if (await editPermissionsPage.Standard_Off_Radio_button.isChecked) /* Radio button Standard Off Radio button is selected */ {
          log.info('Standard Off Radio button is currently selected - changing to Standard On');
          await generalSettingPage.Standard_On_RadioGlobal_Restriction.check();
          vars["StandardPreviousDataExp"] = "false";
          vars["StandardNewDataExp"] = "true";
          log.info(`Standard configuration: Previous=${vars["StandardPreviousDataExp"]}, New=${vars["StandardNewDataExp"]}`);
        } else if (await generalSettingPage.Standard_On_RadioGlobal_Restriction.isChecked()) /* Radio button Standard On Radio(Global Restriction) is select */ {
          log.info('Standard On Radio button is currently selected - changing to Standard Off');
          await editPermissionsPage.Standard_Off_Radio_button.check();
          vars["StandardPreviousDataExp"] = "true";
          vars["StandardNewDataExp"] = "false";
          log.info(`Standard configuration: Previous=${vars["StandardPreviousDataExp"]}, New=${vars["StandardNewDataExp"]}`);
        }
        log.stepPass('Standard Radio Button configuration updated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to update Standard Radio Button configuration');
        throw e;
      }

      // ── Update Chase Radio Button Configuration ──────────────────────────
      log.step('Updating Chase Radio Button configuration');
      try {
        if (await generalSettingPage.Chase_On_RadioGlobal_Restriction.isChecked()) /* Radio button Chase On Radio(Global Restriction) is selected */ {
          log.info('Chase On Radio button is currently selected - changing to Chase Off');
          await generalSettingPage.Chase_Off_RadioGlobal_Restrictions.check();
          vars["ChasePreviousDataExp"] = "true";
          vars["ChaseNewDataExp"] = "false";
          log.info(`Chase configuration: Previous=${vars["ChasePreviousDataExp"]}, New=${vars["ChaseNewDataExp"]}`);
        } else if (await generalSettingPage.Chase_Off_RadioGlobal_Restrictions.isChecked()) /* Radio button Chase Off Radio(Global Restrictions) is selected */ {
          log.info('Chase Off Radio button is currently selected - changing to Chase On');
          await generalSettingPage.Chase_On_RadioGlobal_Restriction.check();
          vars["ChasePreviousDataExp"] = "false";
          vars["ChaseNewDataExp"] = "true";
          log.info(`Chase configuration: Previous=${vars["ChasePreviousDataExp"]}, New=${vars["ChaseNewDataExp"]}`);
        }
        log.stepPass('Chase Radio Button configuration updated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to update Chase Radio Button configuration');
        throw e;
      }

      // ── Save Changes and Verify ───────────────────────────────────────────
      log.step('Saving Global Restrictions configuration changes');
      try {
        await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
        log.info('Save Changes button is visible');
        await correspondentPortalPage.Save_Changes_Button.click();
        log.info('Clicked Save Changes button');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - changes saved');
        log.stepPass('Configuration changes saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save configuration changes');
        throw e;
      }

      // ── Verify Last Modified Data ────────────────────────────────────────
      log.step('Verifying Last Modified Data in the Right corner screen');
      try {
        // vars["CurrentLocalTime"] = (() => {
        //   const d = new Date();
        //   const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
        //   const fmt = "M/d/yyyy : h:mm a";
        //   // Map Java date format to Intl parts
        //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
        //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
        //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
        // })();
        // expect((await generalSettingPage.Last_Modified_DataRight_Corner_Screen.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
        // await expect(generalSettingPage.Last_Modified_DataRight_Corner_Screen).toContainText("test sigma");
        // vars["ExpectedTimeAudit"] = (() => {
        //   const d = new Date(String(vars["CurrentLocalTime"]));
        //   const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
        //   return "MM/d/yyyy hh:mm a".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
        // })();
        log.info('Executing Last Modified Data verification step group');
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Last Modified Data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Last Modified Data');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});