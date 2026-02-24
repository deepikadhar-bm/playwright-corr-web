// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC02.4_Verify First Seven Companies In Company Ccode Filter In Search Filter Dropdown', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String("7"))) {
      if (true) /* Element Clear all Button is visible */ {
        await correspondentPortalPage.Clear_all_Button.click();
      }
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
      await priceOfferedPage.Filter_Dropdown1.click();
      await page.waitForLoadState('networkidle');
      await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
      vars["ExpectedCompany"] = await bidrequestPage.Individual_Company_Name_In_Dropdown.textContent() || '';
      await bidRequestPage.Individual_Company_Checkbox_Dropdown.check();
      await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await page.waitForLoadState('networkidle');
      await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
      if (true) /* Element No result (Bid requests) is visible */ {
        await expect(page.getByText("No result")).toBeVisible();
      } else {
        vars["ExpectedCompany"] = String(vars["ExpectedCompany"]).substring(0, String(vars["ExpectedCompany"]).length - 8);
        vars["count1"] = "1";
        vars["All Company Count"] = String(await bidRequestPage.Company_Name_Count.count());
        while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["All Company Count"]))) {
          vars["IndividualCompany"] = await bidRequestPage.Company_Names1.textContent() || '';
          expect(String(vars["ExpectedCompany"])).toBe(vars["IndividualCompany"]);
          vars["count1"] = (parseFloat(String(vars["count1"])) + parseFloat(String("1"))).toFixed(0);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
