// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2258 } from '../../../src/helpers/prereqs/prereq-2258';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let marketThresholdPage: MarketThresholdPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2258(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS10_TC02_Market Thresholds - Verify the Edit functionality by clicking on Pencil Icon', async ({ page }) => {

    await marketThresholdPage.Required_Edit_Threshold_Button.click();
    await commitmentListPage.Enter_minimum_display_value_in_percentage.waitFor({ state: 'visible' });
    await correspondentPortalPage.Username_Field.fill("FN50");
    vars["ExpectedProductCode"] = "FN50";
    await commitmentListPage.Enter_minimum_display_value_in_percentage.fill("2");
    vars["MinDisplayValue"] = "2";
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill("12");
    vars["MaxDisplayValue"] = "12";
    vars["ExpectedMinBPSValue"] = await correspondentPortalPage.Enter_minimum_value_in_BPS_Input.inputValue() || '';
    vars["MaxBPSValue"] = await correspondentPortalPage.Enter_maximum_value_in_BPS_Input.inputValue() || '';
    await priceOfferedPage.Update_Threshold_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(marketThresholdPage.Required_Min_Display_Value).toContainText("2 %");
    await expect(marketThresholdPage.Required_Max_Display_Value).toContainText("12 %");
    await expect(correspondentPortalPage.Required_Product_Code_Value).toContainText(vars["ExpectedProductCode"]);
    await expect(marketThresholdPage.Required_Min_Value_BPS).toContainText(vars["ExpectedMinBPSValue"]);
    await expect(marketThresholdPage.Last_Max_ValueBPS).toContainText(vars["MaxBPSValue"]);
  });
});
