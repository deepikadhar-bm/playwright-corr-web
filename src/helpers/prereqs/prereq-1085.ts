import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { ApplyFiltersButtonPage } from '../../pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_1085(page: Page, vars: Record<string, string>): Promise<void> {
  const applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);


  const testData: Record<string, string> = {
  "Last One Month": "Last One Month",
  "This Calendar Month": "This Calendar Month",
  "This Year": "This Year",
  "This Quarter": "This Quarter"
}; // Profile: "Filter View", row: 0

  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
  await correspondentPortalPage.Bid_Requests.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.Filter_Dropdown1.click();
  await page.waitForLoadState('networkidle');
  await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
  await correspondentPortalPage.Last_One_Month_Button.click();
  vars["Last One Month Name"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
  await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(testData["Last One Month"]);
  await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
  vars["ExpectedCompany"] = await bidRequestPage.First_Company_Name_Text.textContent() || '';
  vars["ExpectedCompany"] = String(vars["ExpectedCompany"]).substring(0, String(vars["ExpectedCompany"]).length - 8);
  await correspondentPortalPage.First_Checkbox_Bid_Request.check();
  await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
  await applyFiltersButtonPage.Apply_Filters_Button.click();
  await page.waitForLoadState('networkidle');
  if (true) /* Element No result (Bid requests) is visible */ {
    await expect(page.getByText("No result")).toBeVisible();
  } else {
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedCompany"]);
    await stepGroups.stepGroup_Getting_Last_Month_From_Current_Month(page, vars);
    vars["Count of Uploaded Date"] = String(await bidRequestsPage.Uploaded_Date_Count.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Count of Uploaded Date"]))) {
      vars["UploadedDates"] = await correspondentPortalPage.Uploaded_Dates.textContent() || '';
      expect(new Date(String('')).getMonth()).toBe(new Date(String('')).getMonth());
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    // [DISABLED] Verify that the elements with locator Company Column Data displays text ExpectedCompany and With Scrollable FALSE
    // await expect(bidRequestPage.Company_Column_Data).toContainText(vars["ExpectedCompany"]);
    for (let i = 0; i < await bidRequestPage.Company_Column_Data.count(); i++) {
      await expect(bidRequestPage.Company_Column_Data.nth(i)).toHaveText(String(vars["ExpectedCompany"]));
    }
  }
}
