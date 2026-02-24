// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let marketThresholdPage: MarketThresholdPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS10_TC01_Market Thresholds - Verify the Add New Threshold Functionality', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Market_Thresholds.click();
    await correspondentPortalPage.Add_New_Thresholds_Button.click();
    await commitmentListPage.Enter_minimum_display_value_in_percentage.waitFor({ state: 'visible' });
    await correspondentPortalPage.Username_Field.fill("FN40");
    vars["ExpectedProductCode"] = "FN40";
    await commitmentListPage.Enter_minimum_display_value_in_percentage.fill("1");
    vars["MinDisplayValue"] = "1";
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill("120");
    vars["MaxDisplayValue"] = "120";
    vars["ExpectedMinBPSValue"] = await correspondentPortalPage.Enter_minimum_value_in_BPS_Input.inputValue() || '';
    vars["MaxBPSValue"] = await correspondentPortalPage.Enter_maximum_value_in_BPS_Input.inputValue() || '';
    await correspondentPortalPage.Add_Threshold_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(marketThresholdPage.Required_Min_Display_Value).toContainText("1 %");
    await expect(marketThresholdPage.Required_Max_Display_Value).toContainText("120 %");
    await expect(correspondentPortalPage.Required_Product_Code_Value).toContainText(vars["ExpectedProductCode"]);
    await expect(marketThresholdPage.Required_Min_Value_BPS).toContainText(vars["ExpectedMinBPSValue"]);
    await expect(marketThresholdPage.Last_Max_ValueBPS).toContainText(vars["MaxBPSValue"]);
  });
});
