// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { runPrereq_1085 } from '../../../src/helpers/prereqs/prereq-1085';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1085(page, vars);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('REG_TS34_TC09_Verify Clear All Feature In Search Filter Dropdown', async ({ page }) => {

    await priceOfferedPage.Filter_Dropdown1.click();
    await bidRequestPage.Clear_All.click();
    await page.waitForLoadState('networkidle');
    vars["count"] = "1";
    vars["Count of Uploaded Date"] = String(await bidRequestsPage.Uploaded_Date_Count.count());
    vars["UnFilteredDatesCount"] = String(await bidRequestsPage.Unfiltered_Dates.count());
    expect(String(vars["UnFilteredDatesCount"])).toBe("1");
    vars["TotalRowCountInCompanyColumn"] = String(await priceOfferedPage.Company_NamePrice_Offered.count());
    vars["TotalRowOfFilteredCompanyColumn"] = String(await bidRequestsPage.Total_Row_with_Required_Company.count());
    if (String(vars["TotalRowCountInCompanyColumn"]) === String(vars["TotalRowOfFilteredCompanyColumn"])) {
    } else {
      vars["CountOfCompaniesAfterClearAll"] = String(await bidRequestPage.Count_Of_Companies_After_Clear_All.count());
      expect(String(vars["CountOfCompaniesAfterClearAll"])).toBe("1");
    }
  });
});
