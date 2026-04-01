import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../log-helper';
import { ENV } from '@config/environments';

export async function runPrereq_896(page: Page, vars: Record<string, string>): Promise<void> {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);

  // ── Load credentials and test data ───────────────────────────────────────
  log.step('Loading credentials and test data');
  try {
    const credentials = ENV.getCredentials('internal');
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;

    // Load test data - profile 2
    const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
    if (profile2 && profile2.data) {
      const TimeInterval = profile2.data[0]['Time Interval'];
      vars["Time Interval"] = TimeInterval;
      log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

      const NoOfBatches = profile2.data[0]['NO of Batches'];
      vars["NO of Batches"] = NoOfBatches;
      log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
    }

    log.stepPass('Credentials and test data loaded successfully');
  } catch (e) {
    await log.stepFail(page, 'Loading credentials and test data failed');
    throw e;
  }

  // ── Login, navigate and modify batch intervals ────────────────────────────
  log.step('Logging in, navigating to Bulk Batch Timing and modifying batch intervals');
  try {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    //await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
    await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);

    log.stepPass('Login, navigation and batch interval modification successful');
  } catch (e) {
    await log.stepFail(page, 'Login, navigation or batch interval modification failed');
    throw e;
  }

  // ── Read each batch time, compute buffered timing and write to TDP ────────
  log.step('Updating batch times, computing buffered timings and writing to TDP');
  try {
    vars["BatchCount"] = String(await correspondentPortalPage.Batches_Count.count());
    log.info(`Total batch count: ${vars["BatchCount"]}`);

    vars["BatchNum"] = "1";

    // The for loop iterates from 1 to BatchCount, covering all batches in a single pass.
    // dataIdx is 1-based — drives both the batch element selection and the TDP row write.
    // vars["BatchNum"] is still incremented each iteration so any downstream code reading it gets the correct final value.
    for (let dataIdx = 1; dataIdx <= parseInt(vars["BatchCount"]); dataIdx++) {
      log.info(`Processing batch ${dataIdx} of ${vars["BatchCount"]}`);

      vars["BatchTime"] = await statusInactivePage.BatchTime(String(dataIdx)).textContent() || '';
      log.info(`BatchNum ${vars["BatchNum"]} -> BatchTime: ${vars["BatchTime"]}`);

      vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
      log.info(`PricingReturnTimeBuffer: ${vars["PricingReturnTimeBuffer"]}`);

      vars["BufferedBatchTiming"] = (() => {
        const d = new Date('2000-01-01 ' + String(vars["BatchTime"]));
        d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
      })();
      log.info(`BufferedBatchTiming: ${vars["BufferedBatchTiming"]}`);

      // Write BufferedBatchTiming into TDP 'bulk batch to bid request', column 'batch time'
      // dataIdx is already 1-based (starts at 1), matching updatePartialProfileDataByDataIndex's rowIndex convention
      // So batch 1 → row 1 → data[0], batch 2 → row 2 → data[1], etc.
      testDataManager.updatePartialProfileDataByDataIndex(
        'bulk batch to bid request',
        { 'batch time': vars["BufferedBatchTiming"] },
        dataIdx
      );
      log.info(`Written to TDP [bulk batch to bid request] row ${dataIdx} -> batch time: ${vars["BufferedBatchTiming"]}`);

      vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
    }

    log.stepPass('All batch times computed and written to TDP successfully');
  } catch (e) {
    await log.stepFail(page, 'Reading batch times or writing to TDP failed');
    throw e;
  }
}