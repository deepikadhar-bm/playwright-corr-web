import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { MarketThresholdPage } from '../../pages/correspondant/market-threshold';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_2258 } from './prereq-2258';

export async function runPrereq_2262(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_2258(page, vars);

  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const marketThresholdPage = new MarketThresholdPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



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
}
