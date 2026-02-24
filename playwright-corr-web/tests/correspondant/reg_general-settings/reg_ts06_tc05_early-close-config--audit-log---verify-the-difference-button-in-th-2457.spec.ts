// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let marketThresholdPage: MarketThresholdPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS06_TC05_Early Close Config -Audit Log - Verify the difference button in the details section  (Side by side) & (Line by Line).', async ({ page }) => {
    // [DISABLED] Enter FN50 in the Enter product code Input field
    // await correspondentPortalPage.Username_Field.fill("FN50");
    // [DISABLED] Store FN50 in ExpectedProductCode
    // vars["ExpectedProductCode"] = "FN50";
    // [DISABLED] Enter 2 in the Enter minimum display value in percentage field
    // await commitmentListPage.Enter_minimum_display_value_in_percentage.fill("2");
    // [DISABLED] Enter 12 in the Enter maximum display value in percentage Input field
    // await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill("12");
    // [DISABLED] Store 12 in MaxDisplayValue
    // vars["MaxDisplayValue"] = "12";
    // [DISABLED] Store the value displayed in the text box Enter minimum value in BPS Input field into a variable ExpectedMinBPSValue
    // vars["ExpectedMinBPSValue"] = await correspondentPortalPage.Enter_minimum_value_in_BPS_Input.inputValue() || '';
    // [DISABLED] Store the value displayed in the text box Enter maximum value in BPS Input field into a variable MaxBPSValue
    // vars["MaxBPSValue"] = await correspondentPortalPage.Enter_maximum_value_in_BPS_Input.inputValue() || '';
    // [DISABLED] Verify that the element Required Max Display Value displays text contains 12 % and With Scrollable FALSE
    // await expect(marketThresholdPage.Required_Max_Display_Value).toContainText("12 %");
    // [DISABLED] Verify that the element Required Product Code Value displays text contains ExpectedProductCode and With Scrollable FALSE
    // await expect(correspondentPortalPage.Required_Product_Code_Value).toContainText(vars["ExpectedProductCode"]);
    // [DISABLED] Verify that the element Required Min Value (BPS) displays text contains ExpectedMinBPSValue and With Scrollable FALSE
    // await expect(marketThresholdPage.Required_Min_Value_BPS).toContainText(vars["ExpectedMinBPSValue"]);
    // [DISABLED] Verify that the element Last Max Value(BPS) displays text contains MaxBPSValue and With Scrollable FALSE
    // await expect(marketThresholdPage.Last_Max_ValueBPS).toContainText(vars["MaxBPSValue"]);
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.waitFor({ state: 'visible' });
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await stepGroups.stepGroup_Creating_an_Early_Config_Record(page, vars);
    vars["TimeHour"] = String('').split(":")["0"] || '';
    vars["TimeHour"] = (() => {
      const d = new Date(String(vars["TimeHour"]));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "h".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    vars["TimeMin"] = String('').split(":")["1"] || '';
    await stepGroups.stepGroup_Deleting_Early_Config_Recordsother_than_today(page, vars);
    await generalSettingPage.Audit_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verifying_the_Audit_Time_and_Date(page, vars);
    await stepGroups.stepGroup_Verifying_the_Username_and_Config_Type_in_Audit_List_Screen(page, vars);
    await stepGroups.stepGroup_Verifying_the_side_by_side_data_in_see_difference_pop_upAudi(page, vars);
    vars["ExpectedCreationDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "yyyy-MM-dd";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    // [DISABLED] Concate "date": " and TomorrowsDateInput with Space and store into a variable ExpectedDate
    // vars[""] = String("\"date\": \"") + ' ' + String(vars["TomorrowsDateInput"]);
    vars["TomorrowsDateInput"] = String('') + String('');
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedDate"]);
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("\"commitCreationCutOffTime\": null,");
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("\"lastBatchTime\": {");
    // [DISABLED] Store key_blank in Space
    // vars["Space"] = "key_blank";
    // [DISABLED] Store StringFunctions :: Concat in ExpectedTimeHour
    // vars["ExpectedTimeHour"] = "\"hours\":" + vars["Space"] + vars["TimeHour"] + ",";
    vars[""] = String("\"hours\":") + ' ' + String(vars["TimeHour"]);
    vars[","] = String('') + String('');
    vars[""] = String("\"minutes\":") + ' ' + String(vars["TimeMin"]);
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedTimeHour"]);
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedTimeMin"]);
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("\"createdBy\": \"testsigma_internal\",");
    vars["ExpectedCreationDate"] = String('') + String('');
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedCreationDate"]);
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("\"modifiedBy\": \"testsigma_internal\",");
    vars["ExpectedModifiedTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "yyyy-MM-dd";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["ExpectedModifiedTime"] = String('') + String('');
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedModifiedTime"]);
    // [DISABLED] Verify that the element Previous Data Text(Side by Side) displays text contains "enabled": and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Previous_Data_TextSide_by_Side).toContainText("\"enabled\":");
    // [DISABLED] Verify that the element Previous Data Change Text(Side by Side) displays text contains true and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Previous_Data_Change_TextSide_by_Side).toContainText("true");
    // [DISABLED] Verify that the element Side by Side Previous Data (Early Config) displays rgba(255, 182, 186, 1) for css property name background-color and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Side_by_Side_Previous_Data_Early_Config).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    await expect(seeDifferencePopUpPage.Side_by_Side_Previous_Data_Early_Config).toHaveCSS('border', "rgba(254, 232, 233, 1)");
    // [DISABLED] Verify that the text pricingModeType": "REALTIME is present in the table element Side by side (Previous data table) and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("pricingModeType\": \"REALTIME");
    await expect(correspondentPortalPage.New_Data_TextLine_by_Line).toContainText("{}");
    // [DISABLED] Verify that the element New Data Change Text (Side by Side) displays text contains false and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toContainText("false");
    await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toHaveCSS('border', "rgba(151, 242, 149, 1)");
    await stepGroups.stepGroup_Verifying_the_Line_by_line_data_in_see_difference_pop_upAudi(page, vars);
    // [DISABLED] Verify that the text pricingModeType": "REALTIME is present in the table element Line by line Table and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Line_by_line_Table).toContainText("pricingModeType\": \"REALTIME");
    // [DISABLED] Verify that the element Previous Data Text(Side by Side) displays text contains "enabled": and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Previous_Data_TextSide_by_Side).toContainText("\"enabled\":");
    // [DISABLED] Verify that the element Previous Data Change Text(Side by Side) displays text contains true and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Previous_Data_Change_TextSide_by_Side).toContainText("true");
    await expect(seeDifferencePopUpPage.Previous_Data_Change_TextSide_by_Side).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    await expect(correspondentPortalPage.New_Data_TextLine_by_Line).toContainText("{}");
    // [DISABLED] Verify that the element New Data Change Text (Side by Side) displays text contains false and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toContainText("false");
    await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toHaveCSS('border', "rgba(151, 242, 149, 1)");
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await stepGroups.stepGroup_Navigating_To_Early_Close_Config(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Recordsother_than_today(page, vars);
  });
});
