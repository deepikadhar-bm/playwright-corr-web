// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeletebatchbuttonPage } from '../../../src/pages/correspondant/deletebatchbutton';
import { DeleteBatchTimePage } from '../../../src/pages/correspondant/delete-batch-time';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidrequestCreationPage: BidrequestCreationPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deletebatchbuttonPage: DeletebatchbuttonPage;
  let deleteBatchTimePage: DeleteBatchTimePage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidrequestCreationPage = new BidrequestCreationPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deletebatchbuttonPage = new DeletebatchbuttonPage(page);
    deleteBatchTimePage = new DeleteBatchTimePage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS01_TC12_Delete batch time value from the general settings module and verify that batch time value should be updated here under today\\\'s pricing return time value.', async ({ page }) => {
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
  });
});
