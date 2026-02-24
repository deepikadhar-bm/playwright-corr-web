// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidUploadDatePage } from '../../../src/pages/correspondant/bid-upload-date';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeletebatchbuttonPage } from '../../../src/pages/correspondant/deletebatchbutton';
import { DeleteBatchTimePage } from '../../../src/pages/correspondant/delete-batch-time';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidUploadDatePage: BidUploadDatePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deletebatchbuttonPage: DeletebatchbuttonPage;
  let deleteBatchTimePage: DeleteBatchTimePage;
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidUploadDatePage = new BidUploadDatePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deletebatchbuttonPage = new DeletebatchbuttonPage(page);
    deleteBatchTimePage = new DeleteBatchTimePage(page);
    generalSettingPage = new GeneralSettingPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS04_TC04_Bulk Batch Timing No Time Interval Present in the Bulk batch timing.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bulk Batch Timing")).toBeVisible();
    await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
    vars["BatchesCount"] = String(await correspondentPortalPage.Batches_Count.count());
    vars["Count"] = "1";
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["BatchesCount"]))) {
      await deleteBatchTimePage.Delete_Batch_Time.hover();
      await expect(page.getByText("Delete Batch Time")).toBeVisible();
      await deleteBatchTimePage.Delete_Batch_Time.click();
      await page.getByText("Delete Batch").waitFor({ state: 'visible' });
      await deletebatchbuttonPage.Delete_batch_Button.click();
      await page.waitForLoadState('networkidle');
      vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
    }
    // [DISABLED] Delete Last Batch Time
    // await stepGroups.stepGroup_Delete_Last_Batch_Time(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await correspondentPortalPage.Pricing_Return_Time.click();
    await expect(bidUploadDatePage.Pricing_Return_Time_Dtopdown).toBeVisible();
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
    // [DISABLED] Wait until the current page is loaded completely
    // await page.waitForLoadState('networkidle');
    // [DISABLED] Pick the current date MM/d/yyyy : h:mm a by location UTC and store into a variable ExpectedTime
    // vars["ExpectedTime"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    //   const fmt = "MM/d/yyyy : h:mm a";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    // [DISABLED] Verify that the element Last Modified Data(Right Corner Screen) displayed text contains the ExpectedTime , ignoring case
    // expect((await generalSettingPage.Last_Modified_DataRight_Corner_Screen.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
    // [DISABLED] Verify that the element Last Modified Data(Right Corner Screen) displayed text contains the test sigma , ignoring case
    // expect((await generalSettingPage.Last_Modified_DataRight_Corner_Screen.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
  });
});
