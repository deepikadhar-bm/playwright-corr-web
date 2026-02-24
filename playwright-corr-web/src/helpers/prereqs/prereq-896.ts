import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';

export async function runPrereq_896(page: Page, vars: Record<string, string>): Promise<void> {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
  vars["BatchCount"] = String(await correspondentPortalPage.Batches_Count.count());
  vars["BatchNum"] = "1";
  while (parseFloat(String(vars["BatchNum"])) <= parseFloat(String(vars["BatchCount"]))) {
    for (let dataIdx = parseInt(vars["BatchNum"]); dataIdx <= parseInt(vars["BatchNum"]); dataIdx++) {
      vars["BatchTime"] = await statusInactivePage.BatchTime.textContent() || '';
      vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
      vars["BufferedBatchTiming"] = (() => {
        const d = new Date('2000-01-01 ' + String(vars["BatchTime"]));
        d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
      })();
      // Write to test data profile: "batch time" = vars["BufferedBatchTiming"]
      vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
    }
  }
}
