// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS34_TC03_Verify Company/Ccode and Bid request status In Search Filter', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    vars["Company1"] = await bidRequestPage.First_Company_Name_Text.textContent() || '';
    vars["ExpectedCompany"] = String(vars["Company1"]).substring(0, String(vars["Company1"]).length - 8);
    await correspondentPortalPage.First_Checkbox_Bid_Request.check();
    await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
    await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
    vars["Count"] = "2";
    vars["ExpectedStatus"] = await bidRequestPage.Individual_Status_NameDropdown.textContent() || '';
    await bidRequestPage.Individual_Status_NameDropdown.click();
    await correspondentPortalPage.Apply_Selected2.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await page.waitForLoadState('networkidle');
    // [DISABLED] Store the count of elements identified by locator Status On Home Page into a variable Status Count
    // vars["Status Count"] = String(await bidRequestPage.Status_On_Home_Page.count());
    // [DISABLED] Store toUppercase(string) in ExpectedStatus(FilterTube)
    // vars["ExpectedStatus(FilterTube)"] = String(vars["ExpectedStatus"]).toUpperCase();
    // [DISABLED] Verify that the element Status Filter Tube displays text contains ExpectedStatus(FilterTube) and With Scrollable FALSE
    // await expect(priceOfferedPage.Status_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedStatus(FilterTube)"]);
    // [DISABLED] Store 1 in count
    // vars["count"] = "1";
    // [DISABLED] Store the count of elements identified by locator Company Name Count into a variable CountOfCompanies
    // vars["CountOfCompanies"] = String(await bidRequestPage.Company_Name_Count.count());
    while (true) /* Verify if count <= CountOfCompanies */ {
      // [DISABLED] Store text from the element Company_Names1 into a variable CompanyName
      // vars["CompanyName"] = await bidRequestPage.Company_Names1.textContent() || '';
      // [DISABLED] Verify if CompanyName contains Company1
      // expect(String(vars["CompanyName"])).toBe(vars["Company1"]);
      // [DISABLED] Perform addition on count and 1 and store the result inside a count considering 0 decimal places
      // vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    // [DISABLED] Store text from the element Status On Home Page into a variable Status
    // vars["Status"] = await bidRequestPage.Status_On_Home_Page.textContent() || '';
    await expect(priceOfferedPage.Status_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedCompany"]);
    if (true) /* Element No result (Bid requests) is visible */ {
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      // [DISABLED] Verify that the elements with locator Bid Request Status Column Data displays text ExpectedStatus and With Scrollable FALSE
      // await expect(priceOfferedPage.Price_Offered_Status_Column_Data).toContainText(vars["ExpectedStatus"]);
      for (let i = 0; i < await priceOfferedPage.Price_Offered_Status_Column_Data.count(); i++) {
        await expect(priceOfferedPage.Price_Offered_Status_Column_Data.nth(i)).toHaveText(String(vars["ExpectedStatus"]));
      }
      // [DISABLED] Verify that the elements with locator BidRequest Company Column Data displays text ExpectedCompany and With Scrollable FALSE
      // await expect(priceOfferedPage.Price_Offered_Company_Name_Column_Data).toContainText(vars["ExpectedCompany"]);
      for (let i = 0; i < await priceOfferedPage.Price_Offered_Company_Name_Column_Data.count(); i++) {
        await expect(priceOfferedPage.Price_Offered_Company_Name_Column_Data.nth(i)).toHaveText(String(vars["ExpectedCompany"]));
      }
    }
  });
});
