import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { ApplyFiltersButtonPage } from '../../pages/correspondant/apply-filters-button';
import { BatchinbulkbatchtimingPage } from '../../pages/correspondant/batchinbulkbatchtiming';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { P15Active2Page } from '../../pages/correspondant/p-15-active-2';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';

export async function runPrereq_1303(page: Page, vars: Record<string, string>): Promise<void> {
  const applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
  const batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestListPage = new BidRequestListPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const p15Active2Page = new P15Active2Page(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
  vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
  vars["count"] = "1";
  vars["TotalExtractedBatch"] = String(await batchinbulkbatchtimingPage.Extracted_Batch_Timing.count());
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalExtractedBatch"]))) {
    vars["EachBatchTiming"] = await batchinbulkbatchtimingPage.Extracted_Batch_Timing2.textContent() || '';
    vars["EachBatchTiming"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["EachBatchTiming"]));
      d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
    })();
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      // Write to test data profile: "Stored_Text1" = vars["EachBatchTiming"]
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  }
  await page.reload();
  await correspondentPortalPage.Bid_Requestsside_bar_menu.waitFor({ state: 'visible' });
  await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
  await priceOfferedPage.Filter_Dropdown1.click();
  await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
  await bidRequestListPage.Required_Company_Checkbox_filter.check();
  await p15Active2Page.Apply_Selected_Button.click();
  await correspondentPortalPage.Select_Bid_Request_Status.click();
  await expect(bidRequestPage.Upload_Expired).toBeVisible();
  await bidRequestPage.Upload_Expired.check();
  await bidRequestDetailsPage.Apply_Selected_Button_2_filter.click();
  await expect(applyFiltersButtonPage.Apply_Filters_Button).toBeVisible();
  await applyFiltersButtonPage.Apply_Filters_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(correspondentPortalPage.First_Bid_Request_ID).toBeVisible();
  await correspondentPortalPage.First_Bid_Request_ID.click();
  await correspondentPortalPage.ReSubmit_For_Pricing.click();
}
