// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS13_TC02_Verify that market adjuster value should be displayed as \\\"-\\\" if itdoesnot satisfy min threshold condition, but should be able to perform commit action.', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIDfrom13-1": "87RS88D43BB6",
  "CompanyNameInFilters": "Fre",
  "RequestIdfor22-2.1": "87BQ7DB5C69B",
  "RequestIDCreated3rdScenario": "87YK9A2E0311",
  "BidMappingID": "Deepika Aug1",
  "RequestIdfor22-2.2": "87TS8C74F49F",
  "RequestIDfrom13-2": "578FE9EDEC6C",
  "RequestIDfrom22-1.2": "874KBED58307",
  "RequestIDfrom10-2": "872V960789CD",
  "RequestIDfrom11-1": "87ZB36778D61",
  "EditedChaseUsersTime": "3",
  "RequestIDCreated1stScenario": "87P80EB790BD",
  "RequestIDfrom10-3": "874WDCCDC3CE",
  "RequestIDfrom22-3.1": "877V3BF90360",
  "Expected Product(price offered)": "FN30",
  "RequestIDfrom22-1.1": "877V3BF90360",
  "RequestIDCreated2ndScenario": "87462B751677",
  "Expected Coupon(price offered)": "3.5",
  "Static Last Name(Pop Up Verfication)": "LN_Deepika_JULY_16_13",
  "RequestIDfrom24-1": "87E42DCFAFE8",
  "Company Name": "Freedom - A4187",
  "RequestIDfrom29-1": "57EFC2170915",
  "RequestIDfrom28-1": "87E15439E568",
  "NO of Batches": "5",
  "RequestIDfrom27-1": "87DEF1EBA5BD",
  "RequestIDFrom28-2": "878S25D7D52F",
  "StatusInFilters": "Price",
  "RequestIDCreated4rthScenario": "87145580866E"
}; // Profile: "Price Offered", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["Bid ID Price Offered"] = testData["RequestIDfrom13-1"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["Bid ID Price Offered"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Click on Bid ID
    // await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await priceOfferedPage.Bid_Request_Idprice_offered.click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Get_Price_Button.click();
    await priceOfferedPage.Remaining_Timeprice_offered.waitFor({ state: 'visible' });
    await priceOfferedPage.Required_Loan_Num.click();
    await correspondentPortalPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Commit_Selected_Loans_Successful_Popup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
    await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.waitFor({ state: 'hidden' });
    vars["MarkAdjustmentValue"] = await priceOfferedPage.Locked_MarkAdjCommitment_List.textContent() || '';
    await page.waitForTimeout(3000);
    vars["InitialMarkAdjValue"] = vars["MarkAdjustmentValue"];
    vars["MarkAdjValue"] = String(vars["MarkAdjustmentValue"]).replace(/\-/g, '');
    vars["Count"] = "0";
    vars["MarkAdjValue"] = (parseFloat(String(vars["Count"])) + parseFloat(String(vars["MarkAdjValue"]))).toFixed(0);
    await correspondentPortalPage.Administration_Menu.click();
    await generalSettingPage.General_Settings.click();
    await correspondentPortalPage.Market_Thresholds.click();
    await priceOfferedPage.Edit_Map_Button.click();
    vars["MinimumDisplayValue"] = await priceOfferedPage.Minimum_Display_value.textContent() || '';
    vars["MaximumDisplayValue"] = await priceOfferedPage.Maximum_Display_Value.textContent() || '';
    await priceOfferedPage.Minimum_Display_value.clear();
    vars["Number"] = String(Math.floor(Math.random() * (5 - 1 + 1)) + 1);
    vars["MinDisplayValue"] = (parseFloat(String(vars["Number"])) + parseFloat(String(vars["MarkAdjValue"]))).toFixed(0);
    await priceOfferedPage.Minimum_Display_value.fill(vars["MinDisplayValue"]);
    await priceOfferedPage.Maximum_Display_Value.clear();
    vars["Number1"] = String(Math.floor(Math.random() * (10 - 5 + 1)) + 5);
    vars["MaxDisplayvalue"] = (parseFloat(String(vars["MarkAdjValue"])) + parseFloat(String(vars["Number1"]))).toFixed(0);
    await priceOfferedPage.Maximum_Display_Value.fill(vars["MaxDisplayvalue"]);
    await priceOfferedPage.Update_Threshold_Button.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["Bid ID Price Offered"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Bid_Request_Idprice_offered.click();
    await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Get_Price_Button.click();
    vars["CountofMarkAdjEnabledLoans"] = String(await priceOfferedPage.Mark_Adjustment_Value_Enabled_Loans.count());
    vars["GrossPriceValueCount"] = String(await priceOfferedPage.Gross_Price_Values_Count.count());
    vars["CommittedLoansCount"] = String(await priceOfferedPage.LockedCommitted_Loans_Count.count());
    vars["UncommittedLoansCount"] = String(await chaseFieldNamePage.Not_Committed_Loans_Count.count());
    vars["count"] = "1";
    vars["Count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["UncommittedLoansCount"]))) {
      vars["IndividualMarkAdjValue"] = await priceOfferedDetailsPage.Individual_Mark_Adjust_ValueFresh_Loans.textContent() || '';
      vars["IndividualMarkAdjValue"] = String(vars["IndividualMarkAdjValue"]).trim();
      expect(String(vars["IndividualMarkAdjValue"])).toBe("-");
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CommittedLoansCount"]))) {
      await expect(priceOfferedPage.Individual_Mark_Adj_Value_Commited_Loans).toContainText(vars["InitialMarkAdjValue"]);
      vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
    }
    vars["CurrentMarketDiffValue"] = await priceOfferedPage.Current_Market_Difference.textContent() || '';
    vars["HedgeRatioValue"] = await priceOfferedPage.Hedge_Ratio_Value.textContent() || '';
    vars["MarketAdjustorValueAfterCommitting"] = (parseFloat(String(vars["CurrentMarketDiffValue"])) * parseFloat(String(vars["HedgeRatioValue"]))).toFixed(3);
    vars["MarketAdjustorValueAfterCommitting"] = String(vars["MarketAdjustorValueAfterCommitting"]).replace(/\-/g, '');
    vars["MarketAdjustorValueAfterCommitting"] = String(vars["MarketAdjustorValueAfterCommitting"]).substring(0, String(vars["MarketAdjustorValueAfterCommitting"]).length - 2);
    vars["count1"] = "0";
    // [DISABLED] Perform addition on count1 and MarketAdjustorValueAfterCommitting and store the result inside a MarketAdjustorValueAfterCommitting considering 0 decimal places
    // vars["MarketAdjustorValueAfterCommitting"] = (parseFloat(String(vars["count1"])) + parseFloat(String(vars["MarketAdjustorValueAfterCommitting"]))).toFixed(0);
    vars["TotalLoansCount"] = String(await priceOfferedPage.Total_LoansDetails_Screen.count());
    vars["Count1"] = "1";
    while (parseFloat(String(vars["Count1"])) <= parseFloat(String(vars["TotalLoansCount"]))) {
      vars["GrossPriceValues"] = await priceOfferedPage.Gross_price_Values.textContent() || '';
      // [DISABLED] Store text from the element Mark Adj Values into a variable MarkAdjValues
      // vars["MarkAdjValues"] = await correspondentPortalPage.Mark_Adj_Values.textContent() || '';
      vars["IndividualNewMarkAdj"] = await priceOfferedPage.individual_new_mark_adj.textContent() || '';
      vars["ActualCurrGrossValues"] = await priceOfferedPage.Curr_Gross_Values.textContent() || '';
      if (String(vars["IndividualNewMarkAdj"]) === String("-")) {
        expect(String(vars["GrossPriceValues"])).toBe(vars["ActualCurrGrossValues"]);
      } else {
        vars["GrossPriceAndMarkAdjExpected"] = (parseFloat(String(vars["GrossPriceValues"])) + parseFloat(String(vars["IndividualNewMarkAdj"]))).toFixed(3);
        expect(String(vars["ActualCurrGrossValues"])).toBe(vars["GrossPriceAndMarkAdjExpected"]);
        expect(String(vars["IndividualNewMarkAdj"])).toBe(vars["MarketAdjustorValueAfterCommitting"]);
      }
      vars["Count1"] = (parseFloat(String(vars["Count1"])) + parseFloat(String("1"))).toFixed(0);
    }
    await priceOfferedPage.Required_Loan_Num.click();
    await correspondentPortalPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Commit_Selected_Loans_Successful_Popup.waitFor({ state: 'visible' });
    vars["ActualSuccesfullyCreatedPopup"] = await priceOfferedPage.Commit_Selected_Loans_Successful_Popup.textContent() || '';
    vars["ActualSuccesfullyCreatedPopup_1"] = String('').split("")["0"] || '';
    vars["ActualSuccesfullyCreatedPopup_2"] = String('').split("")["2"] || '';
    vars["ActualSuccesfullyCreatedPopup_3"] = String('').split("")["3"] || '';
    vars["ActualSuccesfullyCreatedPopup_4"] = String('').split("")["4"] || '';
    vars["CommitmentIDPopup"] = await priceOfferedPage.Commitment_ID.textContent() || '';
    vars[""] = String(vars["ActualSuccesfullyCreatedPopup_1"]) + ' ' + String(vars["CommitmentIDPopup"]);
    vars[""] = String(vars["ExpectedCreatedPopup_1"]) + ' ' + String(vars["ActualSuccesfullyCreatedPopup_2"]);
    vars[""] = String(vars["ExpectedCreatedPopup_2"]) + ' ' + String(vars["ActualSuccesfullyCreatedPopup_3"]);
    vars[""] = String(vars["ExpectedCreatedPopup_3"]) + ' ' + String(vars["ActualSuccesfullyCreatedPopup_4"]);
    expect(String(vars["ActualSuccesfullyCreatedPopup"])).toBe(vars["ExpectedCreatedPopup_4"]);
    await priceOfferedPage.Okay_ButtonPopup.click();
    await correspondentPortalPage.Administration_Menu.click();
    await generalSettingPage.General_Settings.click();
    await correspondentPortalPage.Market_Thresholds.click();
    await priceOfferedPage.Edit_Map_Button.click();
    await priceOfferedPage.Maximum_Display_Value.clear();
    await priceOfferedPage.Minimum_Display_value.clear();
    await priceOfferedPage.Minimum_Display_value.fill("1");
    await priceOfferedPage.Maximum_Display_Value.fill("120");
    await priceOfferedPage.Update_Threshold_Button.click();
  });
});
