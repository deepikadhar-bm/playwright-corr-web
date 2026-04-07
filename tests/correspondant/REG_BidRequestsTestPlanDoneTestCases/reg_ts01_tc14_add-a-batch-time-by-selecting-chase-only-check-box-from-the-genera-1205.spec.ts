// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { runPrereq_903 } from '../../../src/helpers/prereqs/BidRequests/prereq-903';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS01_TC14';
const TC_TITLE = 'Add a batch time by selecting Chase only check box from the general settings module and verify that batch time value should be updated here under today\'s pricing return time value.';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidrequestCreationPage: BidrequestCreationPage;
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_903(page, vars);
    bidrequestCreationPage = new BidrequestCreationPage(page);
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Navigate to Bulk Batch Timing ─────────────────────────────────────
      log.step('Navigating to Bulk Batch Timing');
      try {
        // [DISABLED] Login to CORR Portal
        // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bulk Batch Timing").nth(1)).toBeVisible();
        // [DISABLED] Store text from the element Last batch Time(bulk batch screen) into a variable LastBatchTime
        // vars["LastBatchTime"] = await chaseFieldNamePage.Last_batch_Timebulk_batch_screen.textContent() || '';
        // [DISABLED] Add 5 minutes to the LastBatchTime with HH:mm a , convert to HH:mm a format, and store it in a runtime variable BatchTime(FewMinAdded)
        // vars["BatchTime(FewMinAdded)"] = (() => {
        //   const d = new Date('2000-01-01 ' + String(vars["LastBatchTime"]));
        //   d.setMinutes(d.getMinutes() + parseInt(String("5")));
        //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: HH:mm a
        // })();
        log.stepPass('Bulk Batch Timing page loaded');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bulk Batch Timing failed');
        throw e;
      }

      // ── Parse deleted batch time into hour / minute / unit parts ──────────
      log.step('Parsing deleted batch time into Time_Hour, Time_Min, Time_Unit');
      try {
        vars["MinWithStandard"] = String(vars["DeletedBatchTime2"]).split(":")["1"] || '';
        vars["Time_Hour"] = String(vars["DeletedBatchTime2"]).substring(0, String(vars["DeletedBatchTime2"]).length - 6);
        vars["Time_Min"] = String(vars["MinWithStandard"]).substring(0, String(vars["MinWithStandard"]).length - 3);
        vars["Time_Unit"] = String(vars["MinWithStandard"]).substring(3);
        log.info(`Time_Hour: "${vars["Time_Hour"]}", Time_Min: "${vars["Time_Min"]}", Time_Unit: "${vars["Time_Unit"]}"`);
        log.stepPass('Batch time parts parsed successfully');
      } catch (e) {
        await log.stepFail(page, 'Parsing deleted batch time parts failed');
        throw e;
      }

      // ── Open Add a Batch dialog, check Chase only, fill in time ──────────
      log.step('Opening Add a Batch dialog, selecting Chase only checkbox and filling in batch time');
      try {
        await correspondentPortalPage.Add_A_Batch_Button.click();
        await expect(page.getByText("Add a Batch").nth(1)).toBeVisible();
        await p24UnitDropdownPage.Select_Rules_Checkbox.check();
        await expect(p24UnitDropdownPage.Select_Rules_Checkbox).toBeChecked();
        // [DISABLED] Pick the current date hh by location UTC-04:00 and store into a variable Time_Hour
        // vars["Time_Hour"] = (() => {
        //   const d = new Date();
        //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
        //   const fmt = "hh";
        //   // Map Java date format to Intl parts
        //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
        //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
        //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
        // })();
        await correspondentPortalPage.StartTime_In_Hour.pressSequentially(vars["Time_Hour"]);
        // [DISABLED] Pick the current date hh:mm by location UTC-04:00 and store into a variable Time_Min
        // vars["Time_Min"] = (() => {
        //   const d = new Date();
        //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
        //   const fmt = "hh:mm";
        //   // Map Java date format to Intl parts
        //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
        //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
        //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
        // })();
        // [DISABLED] Split the Time_Min with the : and store the value from the 2 in the BulkBatchTiming
        // vars["BulkBatchTiming"] = String(vars["Time_Min"]).split(":")["2"] || '';
        vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        await correspondentPortalPage.StartTime_In_Minutes.pressSequentially(vars["Time_Min"]);
        vars["AddStartTimeInMin"] = await correspondentPortalPage.StartTime_In_Minutes.inputValue() || '';
        await stepGroups.stepGroup_selecting_time_unit_bulk_batch(page, vars);
        log.stepPass('Chase only checkbox selected and batch time fields filled successfully');
      } catch (e) {
        await log.stepFail(page, 'Opening Add a Batch dialog or filling in batch time failed');
        throw e;
      }

      // ── Submit batch and verify success message ───────────────────────────
      log.step('Submitting batch and verifying creation success message');
      try {
        await correspondentPortalPage.Add_Batch_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // [DISABLED] Wait until the current page is loaded completely
        // await page.waitForLoadState('load');
        await expect(page.getByText("Create Batch Timing")).toBeVisible();
        await expect(correspondentPortalPage.Batch_timing_has_been_created_successfully_Success_Message).toBeVisible();
        await okButtonPage.Ok_Button.click();
        log.stepPass('Batch created successfully');
      } catch (e) {
        await log.stepFail(page, 'Submitting batch or verifying success message failed');
        throw e;
      }

      // ── Compute expected pricing return time from added batch ─────────────
      log.step('Computing AddedBatchTime with PricingReturnTimeBuffer offset');
      try {
        vars["AddedBatchTime"] = await bidRequestPage.Added_Batch_2(vars["DeletedBatchTime2"]).textContent() || '';
        vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        vars["AddedBatchTime"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["AddedBatchTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
        })();
        // [DISABLED] Store the count of elements identified by locator Batches_Count into a variable BatchCount
        // vars["BatchCount"] = String(await correspondentPortalPage.Batches_Count.count());
        log.info(`Computed AddedBatchTime: "${vars["AddedBatchTime"]}"`);
        log.stepPass('AddedBatchTime computed successfully');
      } catch (e) {
        await log.stepFail(page, 'Computing AddedBatchTime failed');
        throw e;
      }

      // ── Navigate to Bid Requests and open Upload New Bid Request ──────────
      log.step('Navigating to Bid Requests and opening Upload New Bid Request');
      try {
        await page.waitForLoadState('load');
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await expect(page.getByText("Bid Request Details")).toBeVisible();
        log.stepPass('Upload New Bid Request page loaded');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Requests or opening Upload New Bid Request failed');
        throw e;
      }

      // ── Verify added batch time appears in pricing return time dropdown ────
      log.step('Verifying added batch time is visible in Pricing Return Time dropdown');
      try {
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.hover();
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click({ force: true });
        await page.waitForTimeout(3000);
        await expect(bidrequestCreationPage.Pricing_ReturnTime_Dropdown.locator(`option[value="${vars["AddedBatchTime"]}"]`)).toBeAttached();
        log.stepPass(`Batch time "${vars["AddedBatchTime"]}" is attached in Pricing Return Time dropdown`);
      } catch (e) {
        await log.stepFail(page, 'Verifying added batch time in Pricing Return Time dropdown failed');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
});