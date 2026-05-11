import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EditPermissionsPage } from '../../pages/correspondant/edit-permissions';
import { GeneralSettingPage } from '../../pages/correspondant/general-setting';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers, AddonHelpers as Methods } from '../../../src/helpers/AddonHelpers';

export async function runPrereq_2087(page: Page, vars: Record<string, string>): Promise<void> {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const editPermissionsPage = new EditPermissionsPage(page);
  const generalSettingPage = new GeneralSettingPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page);

const TC_ID = 'PREQ_2087';
const TC_TITLE = 'PRE-REQ for REG_TS02_TC02 - Global Restrictions - Update the configs for both chase and standard';
  try {
      log.tcStart(TC_ID, TC_TITLE);
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
         if (await editPermissionsPage.Standard_Off_Radio_button.isChecked()) {
           log.info('Standard Off Radio button is currently selected - changing to Standard On');
           await generalSettingPage.Standard_On_RadioGlobal_Restriction.check();
           await page.waitForTimeout(2000); // Wait for the radio button state to update
           await expect(generalSettingPage.Standard_On_RadioGlobal_Restriction).toBeChecked();
           vars["StandardPreviousDataExp"] = "false";
           vars["StandardNewDataExp"] = "true";
           log.info(`Standard configuration: Previous=${vars["StandardPreviousDataExp"]}, New=${vars["StandardNewDataExp"]}`);
         } else if (await generalSettingPage.Standard_On_RadioGlobal_Restriction.isChecked()) {
           log.info('Standard On Radio button is currently selected - changing to Standard Off');
           await editPermissionsPage.Standard_Off_Radio_button.check();
           await page.waitForTimeout(2000); // Wait for the radio button state to update
           await expect(editPermissionsPage.Standard_Off_Radio_button).toBeChecked();
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
           page.waitForTimeout(2000); // Wait for the radio button state to update
            await expect(generalSettingPage.Chase_Off_RadioGlobal_Restrictions).toBeChecked();
           vars["ChasePreviousDataExp"] = "true";
           vars["ChaseNewDataExp"] = "false";
           log.info(`Chase configuration: Previous=${vars["ChasePreviousDataExp"]}, New=${vars["ChaseNewDataExp"]}`);
         } else if (await generalSettingPage.Chase_Off_RadioGlobal_Restrictions.isChecked()) /* Radio button Chase Off Radio(Global Restrictions) is selected */ {
           log.info('Chase Off Radio button is currently selected - changing to Chase On');
           await generalSettingPage.Chase_On_RadioGlobal_Restriction.check();
           page.waitForTimeout(2000); // Wait for the radio button state to update
            await expect(generalSettingPage.Chase_On_RadioGlobal_Restriction).toBeChecked();
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
         page.waitForTimeout(2000); // Wait for the save operation to initiate
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
              //  Methods.getCurrentTimestamp("MM/dd/yyyy hh:mm a", "ExpectedTimeAudit", "UTC");
              vars["ExpectedTimeAudit"] = new Date()
    .toLocaleString('en-US', {
        timeZone: 'UTC',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
    .replace(',', '');

log.info(`Expected timestamp for audit verification: ${vars["ExpectedTimeAudit"]}`);
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
}
