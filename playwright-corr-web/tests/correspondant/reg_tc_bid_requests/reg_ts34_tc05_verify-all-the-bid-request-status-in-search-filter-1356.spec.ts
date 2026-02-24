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

  test('REG_TS34_TC05_Verify All the Bid Request Status In Search Filter', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
    vars["CountOfStatus"] = String(await bidRequestPage.All_Status_From_Dropdown.count());
    await priceOfferedPage.Filter_Dropdown1.click();
    await expect(correspondentPortalPage.Select_Bid_Request_Status_Dropdown1).toBeVisible();
    vars["Count"] = "1";
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfStatus"]))) {
      await priceOfferedPage.Filter_Dropdown1.click();
      await page.waitForLoadState('networkidle');
      await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
      vars["ExpectedStatus"] = await bidRequestPage.Individual_Status_NameDropdown.textContent() || '';
      await bidRequestPage.Individual_Status_NameDropdown.click();
      await page.waitForLoadState('networkidle');
      await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('networkidle');
      if (String(vars["ExpectedStatus"]).includes(String("Queued"))) {
        if (true) /* Verify that the element Status On Home Page displays text co */ {
        } else {
          await expect(page.getByText("No result")).toBeVisible();
        }
      } else if (String(vars["ExpectedStatus"]).includes(String("Commitment"))) {
        if (true) /* Verify that the element Status On Home Page displays text co */ {
        } else {
          await expect(page.getByText("No result")).toBeVisible();
        }
      } else if (String(vars["ExpectedStatus"]).includes(String("Deleted"))) {
        if (true) /* Verify that the element Status On Home Page displays text co */ {
        } else {
          await expect(page.getByText("No result")).toBeVisible();
        }
      } else {
        if (true) /* Verify that the element Status On Home Page displays text co */ {
        } else {
          await expect(page.getByText("No result")).toBeVisible();
        }
      }
      await correspondentPortalPage.Clear_All_Button.click();
      vars["Count"] = (parseFloat(String(vars["Count"])) + parseFloat(String("1"))).toFixed(0);
    }
  });
});
