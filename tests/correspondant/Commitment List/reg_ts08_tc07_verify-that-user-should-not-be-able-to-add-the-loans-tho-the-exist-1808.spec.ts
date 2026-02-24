// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC07_Verify that user should not be able to add the loans tho the existing commitment after the time limit is exceeded', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIdFrom5-1": "876YA587E147",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "CommitmentIDfrom8-10": "87JU2DDD",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    vars["BidReqId"] = testData["RequestIdFrom5-1"];
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await priceOfferedPage.Other_Config.click();
    vars["CommitCorrectionCutOffBefore"] = await commitmentListPage.Correction_Cut_Off.inputValue() || '';
    await commitmentListPage.Correction_Cut_Off.click();
    if (String(vars["CommitCorrectionCutOffBefore"]) === String("1")) {
      await priceOfferedPage.Commit_Creation_Cut_Off.click();
    } else {
      await commitmentListPage.Correction_Cut_Off.clear();
      await commitmentListPage.Correction_Cut_Off.click();
      await commitmentListPage.Correction_Cut_Off.fill("1");
      await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
      await correspondentPortalPage.Save_Changes_Button.click();
    }
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    vars["CommitTime"] = await commitmentListPage.Commit_TimeCommitment_Screen.textContent() || '';
    vars["CommitID"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    vars["CurrentTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "hh:mm a";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["TimeDiff"] = Math.abs(new Date('2000-01-01 ' + String(vars["CommitTime"])).getTime() - new Date('2000-01-01 ' + String(vars["CurrentTime"])).getTime()) / 3600000 + '';
    if (String(vars["TimeDiff"]) > String("1")) {
      await commitmentListPage.Total_LoansCommitment_List.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Required_Loan_Num.check();
      await priceOfferedPage.Commit_Selected_1_Dropdown.click();
      await expect(commitmentListPage.Commitment_OrderCommitment_List_New).toHaveAttribute('aria-label', "disabled");
    }
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await priceOfferedPage.Other_Config.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CommitCorrectionCutOffAfter"] = await commitmentListPage.Correction_Cut_Off.inputValue() || '';
    if (String(vars["CommitCorrectionCutOffBefore"]) !== String(vars["CommitCorrectionCutOffAfter"])) {
      await commitmentListPage.Correction_Cut_Off.clear();
      await commitmentListPage.Correction_Cut_Off.click();
      await commitmentListPage.Correction_Cut_Off.fill(vars["CommitCorrectionCutOffBefore"]);
      await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
      await correspondentPortalPage.Save_Changes_Button.click();
    }
  });
});
