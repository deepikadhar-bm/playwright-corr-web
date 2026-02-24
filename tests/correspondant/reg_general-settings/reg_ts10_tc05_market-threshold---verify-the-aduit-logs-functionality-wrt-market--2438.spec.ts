// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2258 } from '../../../src/helpers/prereqs/prereq-2258';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let marketThresholdPage: MarketThresholdPage;
  let priceOfferedPage: PriceOfferedPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2258(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS10_TC05_Market Threshold - Verify the aduit logs functionality wrt Market threshold', async ({ page }) => {

    await marketThresholdPage.Required_Edit_Threshold_Button.click();
    await commitmentListPage.Enter_minimum_display_value_in_percentage.waitFor({ state: 'visible' });
    // [DISABLED] Enter FN50 in the Enter product code Input field
    // await correspondentPortalPage.Username_Field.fill("FN50");
    // [DISABLED] Store FN50 in ExpectedProductCode
    // vars["ExpectedProductCode"] = "FN50";
    vars["ExpectedPreviousData"] = await commitmentListPage.Enter_minimum_display_value_in_percentage.inputValue() || '';
    // [DISABLED] Enter 2 in the Enter minimum display value in percentage field
    // await commitmentListPage.Enter_minimum_display_value_in_percentage.fill("2");
    await commitmentListPage.Enter_minimum_display_value_in_percentage.fill(String("2"));
    vars["ExpectedNewData"] = "2";
    // [DISABLED] Enter 12 in the Enter maximum display value in percentage Input field
    // await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill("12");
    // [DISABLED] Store 12 in MaxDisplayValue
    // vars["MaxDisplayValue"] = "12";
    // [DISABLED] Store the value displayed in the text box Enter minimum value in BPS Input field into a variable ExpectedMinBPSValue
    // vars["ExpectedMinBPSValue"] = await correspondentPortalPage.Enter_minimum_value_in_BPS_Input.inputValue() || '';
    // [DISABLED] Store the value displayed in the text box Enter maximum value in BPS Input field into a variable MaxBPSValue
    // vars["MaxBPSValue"] = await correspondentPortalPage.Enter_maximum_value_in_BPS_Input.inputValue() || '';
    await priceOfferedPage.Update_Threshold_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(marketThresholdPage.Required_Min_Display_Value).toContainText("2 %");
    // [DISABLED] Verify that the element Required Max Display Value displays text contains 12 % and With Scrollable FALSE
    // await expect(marketThresholdPage.Required_Max_Display_Value).toContainText("12 %");
    // [DISABLED] Verify that the element Required Product Code Value displays text contains ExpectedProductCode and With Scrollable FALSE
    // await expect(correspondentPortalPage.Required_Product_Code_Value).toContainText(vars["ExpectedProductCode"]);
    // [DISABLED] Verify that the element Required Min Value (BPS) displays text contains ExpectedMinBPSValue and With Scrollable FALSE
    // await expect(marketThresholdPage.Required_Min_Value_BPS).toContainText(vars["ExpectedMinBPSValue"]);
    // [DISABLED] Verify that the element Last Max Value(BPS) displays text contains MaxBPSValue and With Scrollable FALSE
    // await expect(marketThresholdPage.Last_Max_ValueBPS).toContainText(vars["MaxBPSValue"]);
    await generalSettingPage.Audit_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verifying_the_Audit_Time_and_Date(page, vars);
    await stepGroups.stepGroup_Verifying_the_Username_and_Config_Type_in_Audit_List_Screen(page, vars);
    await stepGroups.stepGroup_Verifying_the_side_by_side_data_in_see_difference_pop_upAudi(page, vars);
    await expect(seeDifferencePopUpPage.Previous_Data_TextSide_by_Side).toContainText("minValue");
    await expect(seeDifferencePopUpPage.Previous_Data_Change_TextSide_by_Side).toContainText(vars["ExpectedPreviousData"]);
    await expect(correspondentPortalPage.New_Data_TextLine_by_Line).toContainText("minValue");
    await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toContainText(vars["ExpectedNewData"]);
    await stepGroups.stepGroup_Verifying_the_Line_by_line_data_in_see_difference_pop_upAudi(page, vars);
    await expect(seeDifferencePopUpPage.Previous_Data_TextSide_by_Side).toContainText("minValue");
    await expect(seeDifferencePopUpPage.Previous_Data_Change_TextSide_by_Side).toContainText(vars["ExpectedPreviousData"]);
    await expect(correspondentPortalPage.New_Data_TextLine_by_Line).toContainText("minValue");
    await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toContainText(vars["ExpectedNewData"]);
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
  });
});
