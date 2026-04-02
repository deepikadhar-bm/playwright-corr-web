// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { CoorespondentPage } from '../../../src/pages/correspondant/coorespondent';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { P15Active2Page } from '../../../src/pages/correspondant/p-15-active-2';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { ENV } from '../../../src/config/environments';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = 'REG_TS22_TC09';
const TC_TITLE = 'Reprice bid for #Bid req ID\" popup Delete an existing batch record from the bulk batch config and validate that deleted time should no longer be displayed in the pricing return time dro';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let coorespondentPage: CoorespondentPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let p15Active2Page: P15Active2Page;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    coorespondentPage = new CoorespondentPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    p15Active2Page = new P15Active2Page(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {
    const addonHelpers = new AddonHelpers(page, vars);

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {
      //const testData: Record<string, string> = {
      // "Display_Text1": "Delete Batch Time",
      // "Display_Text2": "Delete Batch",

      // ── Step 1: Load credentials and test data ────────────────────────────────
      log.step('Loading credentials and test data');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        log.info('Fetched credentials for internal user');

        const profileName = 'Bid Requests';
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const CompanyName = profile.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          log.info(`Loaded Company Name: ${vars["CompanyName"]}`);

          const BidMappingID = profile.data[0]['BidMappingID'];
          vars["BidMappingID"] = BidMappingID;
          log.info(`Loaded BidMappingID: ${vars["BidMappingID"]}`);

          const Display_Text1 = profile.data[0]['Display_Text1'];
          vars["Display_Text1"] = Display_Text1;
          log.info(`Loaded Display Text1: ${vars["Display_Text1"]}`);

          const Display_Text2 = profile.data[0]['Display_Text2'];
          vars["Display_Text2"] = Display_Text2;
          log.info(`Loaded Display Text2: ${vars["Display_Text2"]}`);

          // vars["Company Name"] = CompanyName;
          // log.info(`Loaded Company Name: ${vars["Company Name"]}`);
        }

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

      // ── Step 2: Login and Navigation ──────────────────────────────────────────
      log.step('Logging into Correspondent Portal and navigating to Batch Timing');
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      log.info('Login to Correspondent Portal completed');

      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      log.info('Navigated to Bulk Batch Timing');

      await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
      log.info('Modified batch intervals for next business day');

      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('Spinner hidden - batch modification complete');

      // ── Step 3: Extract batch data ───────────────────────────────────────────
      log.step('Extracting batch time and buffer data');
      await expect(coorespondentPage.Last_Batch).toBeVisible();
      vars["LastBatchTime"] = await correspondentPortalPage.Last_Batch_Time.textContent() || '';
      log.info(`Extracted Last Batch Time: ${vars["LastBatchTime"]}`);

      vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
      log.info(`Extracted Buffer Time: ${vars["BufferTime"]}`);

      vars["LastBatchTime(OneMinAdded)"] = (() => {
        const d = new Date('2000-01-01 ' + String(vars["LastBatchTime"]));
        d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
      })();
      log.info(`Calculated Target Batch Time (Buffer Added): ${vars["LastBatchTime(OneMinAdded)"]}`);

      // ── Step 4: Delete batch time ─────────────────────────────────────────────
      log.step('Deleting the existing batch record');
      await correspondentPortalPage.Delete_Batch_Time.hover();
      await expect(page.getByText(vars["Display_Text1"])).toBeVisible();
      log.info(`Verified visibility of display text: ${vars["Display_Text1"]}`);

      await correspondentPortalPage.Delete_Batch_Time.click();
      await expect(page.getByText(vars["Display_Text2"]).first()).toBeVisible();
      log.info(`Verified visibility of display text: ${vars["Display_Text2"]}`);

      await correspondentPortalPage.Delete_batch.click();
      await expect(coorespondentPage.Last_Batch).not.toContainText(vars["LastBatchTime"]);
      log.info(`Successfully deleted batch time: ${vars["LastBatchTime"]}`);

      // ── Step 5: Filter and select Bid Request ────────────────────────────────
      log.step('Navigating to Bid Requests and applying filters');
      await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
      log.info('Clicked Bid Requests sidebar menu');

      await priceOfferedPage.Filter_Dropdown1.click();
      await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
      await bidRequestListPage.Required_Company_Checkbox_filter(vars["CompanyName"]).check();
      log.info(`Filtered for Company: ${vars["CompanyName"]}`);

      await p15Active2Page.Apply_Selected_Button.first().click();
      await correspondentPortalPage.Select_Bid_Request_Status.click();
      await expect(correspondentPortalPage.Expired_Option).toBeVisible();
      await correspondentPortalPage.Expired_Option.check();
      log.info('Filtered for Status: Expired');

      await bidRequestDetailsPage.Apply_Selected_Button_2_filter.click();
      await expect(applyFiltersButtonPage.Apply_Filters_Button).toBeVisible();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      log.info('Clicked Apply Filters button');

      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.First_Bid_Request_ID.first()).toBeVisible();
      await correspondentPortalPage.First_Bid_Request_ID.first().click();
      log.info('Selected first available Bid Request ID');

      // ── Step 6: Validate Pricing Return Time dropdown ─────────────────────────
      log.step('Validating that deleted time is not present in pricing return dropdown');
      await correspondentPortalPage.ReSubmit_For_Pricing.click();
      log.info('Clicked ReSubmit For Pricing');

      await expect(correspondentPortalPage.Bid_Requested_Date).toBeVisible();
      await expect(correspondentPortalPage.Today).toBeEnabled();
      await correspondentPortalPage.Dropdown_selection_2.click();

      await expect(correspondentPortalPage.Dropdown_selection_2.locator(`option[value="${vars["LastBatchTime(OneMinAdded)"]}"]`)).not.toBeAttached();
      log.info(`Verified: ${vars["LastBatchTime(OneMinAdded)"]} is not attached for Today's selection`);

      await bidRequestDetailsPage.Next_Business_Day.check();
      log.info('Selected Next Business Day');

      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await correspondentPortalPage.Dropdown_selection_2.click();

      await expect(correspondentPortalPage.Dropdown_selection_2.locator(`option[value="${vars["LastBatchTime(OneMinAdded)"]}"]`)).not.toBeAttached();
      log.info(`Verified: ${vars["LastBatchTime(OneMinAdded)"]} is not attached for Next Business Day selection`);

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