import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../pages/correspondant/general-setting';
import { MarketThresholdPage } from '../../pages/correspondant/market-threshold';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1404 } from './prereq-1404';

export async function runPrereq_1380(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1404(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const generalSettingPage = new GeneralSettingPage(page);
  const marketThresholdPage = new MarketThresholdPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  const testData: Record<string, string> = {
  "Expected Product(price offered)": "FN30",
  "Expected Coupon(price offered)": "3.5",
  "CompanyNameInFilters": "Fre",
  "RequestIdfor22-2.1": "87BQ7DB5C69B",
  "RequestIDCreated3rdScenario": "87YK9A2E0311",
  "BidMappingID": "Deepika Aug1",
  "RequestIdfor22-2.2": "87TS8C74F49F",
  "RequestIDfrom13-1": "87RS88D43BB6",
  "RequestIDfrom13-2": "578FE9EDEC6C",
  "RequestIDfrom22-1.2": "874KBED58307",
  "RequestIDfrom10-2": "872V960789CD",
  "RequestIDfrom11-1": "87ZB36778D61",
  "EditedChaseUsersTime": "3",
  "RequestIDCreated1stScenario": "87P80EB790BD",
  "RequestIDfrom10-3": "874WDCCDC3CE",
  "RequestIDfrom22-3.1": "877V3BF90360",
  "RequestIDfrom22-1.1": "877V3BF90360",
  "RequestIDCreated2ndScenario": "87462B751677",
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

  vars["count"] = "1";
  vars["TotalRowCount(price offered screen1)"] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
  vars["ExpectedProductCode"] = "FN30";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowCount(price offered screen1)"]))) {
    vars["ExecutionType1(price offered screen)"] = await priceOfferedPage.All_Execution_Typeprice_offered_screen1.textContent() || '';
    if (String(vars["ExecutionType1(price offered screen)"]).includes(String("CHASE_DIRECT"))) {
      await priceOfferedPage.All_Bid_Request_ID2price_offered_screen1.click();
      await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
      await expect(priceOfferedPage.Bid_Request_IDprice_offered).toContainText(vars["RequestID(bid request details)"]);
      await expect(priceOfferedPage.CCodeprice_offered).toContainText(vars["CCode(bid request details)"]);
      await expect(priceOfferedPage.Execution_type_Price_Offered).toContainText("CHASE_DIRECT");
      await expect(priceOfferedPage.Companyprice_offered).toContainText(vars["Company(bid request details)"]);
      await expect(priceOfferedPage.Productprice_offered).toContainText(testData["Expected Product(price offered)"]);
      await expect(priceOfferedPage.Couponprice_offered).toContainText(testData["Expected Coupon(price offered)"]);
      await stepGroups.stepGroup_Getting_Next_Month_From_Current_Month(page, vars);
      vars[""] = new Date(2000, parseInt(String("FullNextMonthName")) - 1, 1).toLocaleString('en-US', { month: 'long' });
      vars["Position"] = String(vars["FullNextMonthName"]).substring(0, parseInt("3"));
      vars["HalfNextMonthName"] = String(vars["SplittedNextMonthName"]).split(",")["1"] || '';
      await expect(priceOfferedPage.Sec_Monthprice_offered).toContainText(vars["HalfNextMonthName"]);
      await expect(priceOfferedPage.Current_Marketprice_offered).toContainText("-");
      await expect(priceOfferedPage.Current_Market_Diffprice_offered).toContainText("-");
      await expect(correspondentPortalPage.Administration_Menu).toBeVisible();
      await correspondentPortalPage.Administration_Menu.click();
      await generalSettingPage.General_Settings.click();
      await correspondentPortalPage.Market_Thresholds.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["MinDisplayValue"] = await marketThresholdPage.Min_Display_Valuemarket_thresholds.textContent() || '';
      vars["MinDisplayValue"] = String(vars["MinDisplayValue"]).split("%")["1"] || '';
      vars["MaxDisplayValue"] = await marketThresholdPage.Required_Max_Display_Value.textContent() || '';
      vars["MaxDisplayValue"] = String(vars["MaxDisplayValue"]).split("%")["1"] || '';
      vars["MinMaxThreshold(expected)"] = vars["MinDisplayValue"] + "/" + vars["MaxDisplayValue"];
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
      await correspondentPortalPage.First_Bid_Request_ID.click();
      await priceOfferedPage.MinMax_Thresholdprice_offered.waitFor({ state: 'visible' });
      await expect(priceOfferedPage.MinMax_Thresholdprice_offered).toContainText(vars["MinMaxThreshold(expected)"]);
      await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    } else if (String(vars["ExecutionType1(price offered screen)"]).includes(String("STANDARD"))) {
      await priceOfferedPage.All_Bid_Request_ID2price_offered_screen1.click();
      await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
      await expect(priceOfferedPage.Bid_Request_IDprice_offered).toContainText(vars["RequestID(bid request details)"]);
      await expect(priceOfferedPage.Execution_type_Price_Offered).toContainText("STANDARD");
      await expect(priceOfferedPage.CCodeprice_offered).toContainText(vars["CCode(bid request details)"]);
      await expect(priceOfferedPage.Companyprice_offered).toContainText(vars["Company(bid request details)"]);
      await expect(priceOfferedPage.Productprice_offered).toContainText(testData["Expected Product(price offered)"]);
      expect((await priceOfferedPage.Couponprice_offered.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
      await stepGroups.stepGroup_Getting_Next_Month_From_Current_Month(page, vars);
      vars[""] = new Date(2000, parseInt(String("FullNextMonthName")) - 1, 1).toLocaleString('en-US', { month: 'long' });
      vars["Position"] = String(vars["FullNextMonthName"]).substring(0, parseInt("3"));
      vars["HalfNextMonthName"] = String(vars["SplittedNextMonthName"]).split(",")["1"] || '';
      await expect(priceOfferedPage.Sec_Monthprice_offered).toContainText(vars["HalfNextMonthName"]);
      await expect(priceOfferedPage.Current_Marketprice_offered).toContainText("-");
      await expect(priceOfferedPage.Current_Market_Diffprice_offered).toContainText("-");
      await expect(correspondentPortalPage.Administration_Menu).toBeVisible();
      await correspondentPortalPage.Administration_Menu.click();
      await generalSettingPage.General_Settings.click();
      await correspondentPortalPage.Market_Thresholds.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["MinDisplayValue"] = await marketThresholdPage.Min_Display_Valuemarket_thresholds.textContent() || '';
      vars["MinDisplayValue"] = String(vars["MinDisplayValue"]).split("%")["1"] || '';
      vars["MaxDisplayValue"] = await marketThresholdPage.Required_Max_Display_Value.textContent() || '';
      vars["MaxDisplayValue"] = String(vars["MaxDisplayValue"]).split("%")["1"] || '';
      vars["MinMaxThreshold(expected)"] = vars["MinDisplayValue"] + "/" + vars["MaxDisplayValue"];
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
      await priceOfferedPage.Second_Bid_Request_ID.click();
      await priceOfferedPage.MinMax_Thresholdprice_offered.waitFor({ state: 'visible' });
      await expect(priceOfferedPage.MinMax_Thresholdprice_offered).toContainText(vars["MinMaxThreshold(expected)"]);
      await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}
