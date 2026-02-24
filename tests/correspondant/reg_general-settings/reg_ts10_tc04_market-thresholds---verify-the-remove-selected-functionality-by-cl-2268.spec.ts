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

  test('REG_TS10_TC04_Market Thresholds - Verify the Remove selected Functionality by clicking on the Delete Icon', async ({ page }) => {
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
    // [DISABLED] Verify that the element Last Min Display Value displays text contains 1 % and With Scrollable FALSE
    // await expect(marketThresholdPage.Required_Min_Display_Value).toContainText("1 %");
    // [DISABLED] Verify that the element Last Max Display Value(market thresholds) displays text contains 120 % and With Scrollable FALSE
    // await expect(marketThresholdPage.Required_Max_Display_Value).toContainText("120 %");
    // [DISABLED] Verify that the element Last Product Code Value displays text contains ExpectedProductCode and With Scrollable FALSE
    // await expect(correspondentPortalPage.Required_Product_Code_Value).toContainText(vars["ExpectedProductCode"]);
    // [DISABLED] Verify that the element Last Min Value (BPS) displays text contains ExpectedMinBPSValue and With Scrollable FALSE
    // await expect(marketThresholdPage.Required_Min_Value_BPS).toContainText(vars["ExpectedMinBPSValue"]);
    // [DISABLED] Verify that the element Last Max Value(BPS) displays text contains MaxBPSValue and With Scrollable FALSE
    // await expect(marketThresholdPage.Last_Max_ValueBPS).toContainText(vars["MaxBPSValue"]);
    await marketThresholdPage.Required_Market_Threshold_Checkbox.check();
    await expect(marketThresholdPage.Required_Market_Threshold_Checkbox).toBeVisible();
    await expect(marketThresholdPage.Remove_selected_Button).toBeVisible();
    await marketThresholdPage.Remove_selected_Button.click();
    await correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List.waitFor({ state: 'visible' });
    await correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Required_Product_Code_Value).toBeVisible();
  });
});
