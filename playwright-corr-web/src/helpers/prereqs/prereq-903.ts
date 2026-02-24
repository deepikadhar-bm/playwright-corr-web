import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidrequestCreationPage } from '../../pages/correspondant/bidrequest-creation';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { DeletebatchbuttonPage } from '../../pages/correspondant/deletebatchbutton';
import { DeleteBatchTimePage } from '../../pages/correspondant/delete-batch-time';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../pages/correspondant/upload-new-bid-request-button';

export async function runPrereq_903(page: Page, vars: Record<string, string>): Promise<void> {
  const bidrequestCreationPage = new BidrequestCreationPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const deletebatchbuttonPage = new DeletebatchbuttonPage(page);
  const deleteBatchTimePage = new DeleteBatchTimePage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);
  const uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText("Bulk Batch Timing")).toBeVisible();
  await stepGroups.stepGroup_Modifying_The_Batch_Intervals(page, vars);
  vars["LastBatchTime(withspace)"] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
  vars["DeletedBatchTime1"] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
  vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
  vars["BufferedDeletedBatchTime1"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["LastBatchTime(withspace)"]));
    d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  await page.reload();
  await page.waitForLoadState('networkidle');
  await statusInactivePage.BulkBatch_Timing.hover();
  await deleteBatchTimePage.Delete_Batch_Time.hover();
  await expect(page.getByText("Delete Batch Time")).toBeVisible();
  await deleteBatchTimePage.Delete_Batch_Time.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(deletebatchbuttonPage.Delete_batch_Button).toContainText("Delete batch");
  await deletebatchbuttonPage.Delete_batch_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await page.waitForTimeout(3000);
  await expect(page.getByText(vars["DeletedBatchTime1"])).not.toBeVisible();
  await page.reload();
  await page.waitForLoadState('networkidle');
  await stepGroups.stepGroup_Delete_Last_Batch_Time(page, vars);
  await page.waitForTimeout(3000);
  await expect(page.getByText(vars["LastBatchTime(withspace)"])).not.toBeVisible();
  vars["DeletedBatchTime2"] = vars["LastBatchTime(withspace)"];
  await correspondentPortalPage.Bid_Requests.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText("Bid Requests")).toBeVisible();
  await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText("Bid Request Details\r")).toBeVisible();
  await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
  await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedDeletedBatchTime1"] })).not.toBeVisible();
  await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BufferedDeletedBatchTime2"] })).not.toBeVisible();
}
