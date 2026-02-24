// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2284 } from '../../../src/helpers/prereqs/prereq-2284';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2284(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC02_Audit Log - Verify the difference button in the details section  (Side by side) & (Line by Line).', async ({ page }) => {

    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await generalSettingPage.Audit_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Pick the current date MM/dd/yyyy by location UTC and store into a variable ExpectedDateAudit
    // vars["ExpectedDateAudit"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    //   const fmt = "MM/dd/yyyy";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    // [DISABLED] Pick the current date hh:mm a by location UTC and store into a variable ExpectedTimeAudit
    // vars["ExpectedTimeAudit"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    //   const fmt = "hh:mm a";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    vars["ExpectedDateandTimeAudit"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "MM/dd/yyyy hh:mm a";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    // [DISABLED] Store key_blank in Space
    // vars["Space"] = "key_blank";
    // [DISABLED] Concate ExpectedDateAudit and String2 with Space and store into a variable testdata
    // vars[""] = String(vars["ExpectedDateAudit"]) + ' ' + String("String2");
    // [DISABLED] Store key_blank in Space
    // vars["Space"] = "key_blank";
    await expect(generalSettingPage.Created_Date_Time_Column_Data).toContainText(vars["ExpectedDateandTimeAudit"]);
    await expect(generalSettingPage.First_User_Name_UI).toContainText("testsigma_internal\t\r");
    await expect(generalSettingPage.Config_Type_Column_Data).toContainText("Bid Map Config");
    await correspondentPortalPage.See_the_difference_Button.click();
    await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Side_by_side_Button).toBeVisible();
    await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
    await expect(seeDifferencePopUpPage.Side_by_Side_Tables).toBeVisible();
    vars["SidebySideTablesCount"] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
    expect(String(vars["SidebySideTablesCount"])).toBe("2");
    await expect(seeDifferencePopUpPage.Smart_Map_Previous_Data_Audit).toContainText("enableSmartMapper");
    await expect(seeDifferencePopUpPage.Smart_Map_Previous_Data_Audit).toContainText(vars["ExpectedPreviousData"]);
    await expect(seeDifferencePopUpPage.Smart_Mapper_New_DataAudit).toContainText("enableSmartMapper");
    await expect(seeDifferencePopUpPage.Smart_Mapper_New_DataAudit).toContainText(vars["ExpectedNewData"]);
    await correspondentPortalPage.Line_by_line_Button.click();
    await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
    await seeDifferencePopUpPage.Line_by_line_Table.waitFor({ state: 'visible' });
    vars["LineByLineTableCount"] = String(await seeDifferencePopUpPage.Line_by_line_Table.count());
    expect(String(vars["LineByLineTableCount"])).toBe("1");
    await expect(seeDifferencePopUpPage.Smart_Map_Previous_Data_Audit).toContainText("enableSmartMapper");
    await expect(seeDifferencePopUpPage.Smart_Map_Previous_Data_Audit).toContainText(vars["ExpectedPreviousData"]);
    await expect(seeDifferencePopUpPage.Smart_Mapper_New_DataAudit).toContainText("enableSmartMapper");
    await expect(seeDifferencePopUpPage.Smart_Mapper_New_DataAudit).toContainText(vars["ExpectedNewData"]);
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
  });
});
