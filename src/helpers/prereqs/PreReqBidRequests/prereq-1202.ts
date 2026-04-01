import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../log-helper';
import { ENV } from '@config/environments';

const TC_ID = 'PREREQ_1202';
const TC_TITLE = 'Prerequisite for REG_TS01_TC11.1 - Update batch intervals to Next Business Day with On option and compute buffered batch timings to write to TDP';

export async function runPrereq_1202(page: Page, vars: Record<string, string>): Promise<void> {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);

  // ─── Prereq Start ─────────────────────────────────────────────────────────
  log.tcStart(TC_ID, TC_TITLE);

  try {

    // ── Load credentials ────────────────────────────────────────────────────
    log.step('Loading credentials');
    try {
      const credentials = ENV.getCredentials('internal');
      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;
      const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
      if (profile2 && profile2.data) {
        const TimeInterval = profile2.data[0]['Time Interval'];
        vars["Time Interval"] = TimeInterval;
        log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

        const NoOfBatches = profile2.data[0]['NO of Batches'];
        vars["NO of Batches"] = NoOfBatches;
        log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
      }
      log.stepPass('Credentials loaded successfully');
    } catch (e) {
      await log.stepFail(page, 'Loading credentials failed');
      throw e;
    }

    // ── Login, navigate and modify batch intervals ──────────────────────────
    log.step('Logging in, navigating to Bulk Batch Timing and modifying batch intervals');
    try {
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);

      log.stepPass('Login, navigation and batch interval modification successful');
    } catch (e) {
      await log.stepFail(page, 'Login, navigation or batch interval modification failed');
      throw e;
    }

    // ── Read each batch time, compute buffered timing and write to TDP ──────
    log.step('Reading batch times, computing buffered timings and writing to TDP');
    try {
      vars["BatchCount"] = String(await correspondentPortalPage.Batches_Count.count());
      log.info(`Total batch count: ${vars["BatchCount"]}`);

      vars["BatchNum"] = "1";

      //while (parseFloat(String(vars["BatchNum"])) <= parseFloat(String(vars["BatchCount"]))) {
      for (let dataIdx = parseInt(vars["BatchNum"]); dataIdx <= parseInt(vars["BatchCount"]); dataIdx++) {
        log.info(`Processing batch ${dataIdx} of ${vars["BatchCount"]}`);

        vars["BatchTime"] = await statusInactivePage.BatchTime(vars["BatchNum"]).textContent() || '';
        log.info(`BatchNum ${vars["BatchNum"]} -> BatchTime: ${vars["BatchTime"]}`);

        vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        log.info(`PricingReturnTimeBuffer: ${vars["PricingReturnTimeBuffer"]}`);

        vars["BufferedBatchTiming"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["BatchTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
        })();
        log.info(`BufferedBatchTiming: ${vars["BufferedBatchTiming"]}`);

        testDataManager.updatePartialProfileDataByDataIndex(
          'bulk batch to bid request',
          { 'batch time': vars["BufferedBatchTiming"] },
          dataIdx
        );
        log.info(`Written to TDP [bulk batch to bid request] row ${dataIdx} -> batch time: ${vars["BufferedBatchTiming"]}`);
        // Write to test data profile: "batch time" = vars["BufferedBatchTiming"]
        vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
        log.info(`BatchNum incremented to: ${vars["BatchNum"]}`);
      }
      //}

      log.stepPass('All batch times computed and written to TDP successfully');
    } catch (e) {
      await log.stepFail(page, 'Reading batch times or writing to TDP failed');
      throw e;
    }

    // ─── Prereq End: PASS ────────────────────────────────────────────────────
    log.tcEnd('PASS');

  } catch (e) {
    // ─── Prereq End: FAIL ────────────────────────────────────────────────────
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}