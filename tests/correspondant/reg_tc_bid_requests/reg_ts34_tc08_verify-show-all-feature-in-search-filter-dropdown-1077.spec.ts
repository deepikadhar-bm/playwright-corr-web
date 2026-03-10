// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { FreedomA4187A4187CheckboxPage } from '../../../src/pages/correspondant/freedom-a4187-a4187-checkbox';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = 'REG_TS34_TC08';
const TC_TITLE = 'Verify show all feature In Search Filter Dropdown';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let freedomA4187A4187CheckboxPage: FreedomA4187A4187CheckboxPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    freedomA4187A4187CheckboxPage = new FreedomA4187A4187CheckboxPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials and Test Data ───────────────────────────
      log.step('Loading credentials and test data');
      try {
        const credentials = ENV.getCredentials('internal');
            vars["Username"] = credentials.username;
            vars["Password"] = credentials.password;
            const profileName = 'Bid Requests'; // TDP sheet name
            const profile = testDataManager.getProfileByName(profileName);
            if (profile && profile.data) {
              const selectedCompanyCount = profile.data[0]['Selected Company Count'];
              vars["Selected Company Count"] = selectedCompanyCount;
            }
        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ────────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await page.waitForLoadState('load');
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Navigate to Bid Requests ─────────────────────────────────
      log.step('Navigating to Bid Requests');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Requests successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Requests failed');
        throw e;
      }

      // ── Step 4: Select Companies from Filter Dropdown ─────────────────────
      log.step('Opening filter dropdown and selecting two companies');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        await freedomA4187A4187CheckboxPage.First_Company_Checkbox.check();
        await chaseFieldNamePage.Second_Company_Checkbox.check();
        vars["FirstCompanyName"] = await bidRequestPage.First_Company_Name_Text.textContent() || '';
        vars["SecondCompanyName"] = await correspondentPortalPage.Second_Company_Text.textContent() || '';
        log.stepPass(`Two companies selected - First: ${vars["FirstCompanyName"]}, Second: ${vars["SecondCompanyName"]}`);
      } catch (e) {
        await log.stepFail(page, 'Selecting companies from filter dropdown failed');
        throw e;
      }

      // ── Step 5: Verify Show Selected feature ──────────────────────────────
      log.step('Clicking Show Selected and verifying selected companies and count');
      try {
        await correspondentPortalPage.Show_Selected_Button.first().click();
        await expect(bidRequestPage.First_Company_Name_Text).toContainText(vars["FirstCompanyName"]);
        await expect(correspondentPortalPage.Second_Company_Text).toContainText(vars["SecondCompanyName"]);
        await expect(freedomA4187A4187CheckboxPage.First_Company_Checkbox).toBeChecked();
        await expect(chaseFieldNamePage.Second_Company_Checkbox).toBeChecked();
        vars["AllCompanyNameCount"] = String(await bidRequestPage.All_Company_Name.count());
        expect(String(vars["AllCompanyNameCount"])).toBe(vars["Selected Company Count"]);
        log.stepPass(`Show Selected verified - company count: ${vars["AllCompanyNameCount"]}`);
      } catch (e) {
        await log.stepFail(page, 'Verifying Show Selected feature failed');
        throw e;
      }

      // ── Step 6: Verify Show All feature ───────────────────────────────────
      log.step('Clicking Show All and verifying company count remains the same');
      try {
        await correspondentPortalPage.Show_All_Button.first().click();
        vars["AllCompanyNameCount"] = String(await bidRequestPage.All_Company_Name.count());
        expect(parseInt(vars["AllCompanyNameCount"])).toBeGreaterThan(parseInt(vars["Selected Company Count"]));
        log.stepPass(`Show All verified - company count: ${vars["AllCompanyNameCount"]}`);
      } catch (e) {
        await log.stepFail(page, 'Verifying Show All feature failed');
        throw e;
      }

      // ── Step 7: Apply Selected ─────────────────────────────────────────────
      log.step('Clicking Apply Selected');
      try {
        await correspondentPortalPage.Apply_Selected.first().click();
        // [DISABLED] Click on Select Bid Request Status Dropdown
        // await bidRequestPage.Select_Bid_Request_Status_Dropdown.click();
        // [DISABLED] Check the checkbox First Bid Request Checkbox
        // await correspondentPortalPage.First_Bid_Request_Checkbox.check();
        // [DISABLED] Check the checkbox Second Bid Request Checkbox
        // await bidRequestPage.Second_Bid_Request_Checkbox.check();
        // [DISABLED] Store text from the element First Bid Request Text into a variable FirstBidRequestText
        // vars["FirstBidRequestText"] = await correspondentPortalPage.First_Bid_Request_Text.textContent() || '';
        // [DISABLED] Store text from the element Second Bid Request Text into a variable SecondBidRequestText
        // vars["SecondBidRequestText"] = await correspondentPortalPage.Second_Bid_Request_Text.textContent() || '';
        // [DISABLED] Click on Show Selected
        // await bidRequestPage.Show_Selected.click();
        // [DISABLED] Verify that the element First Bid Request Text displays text FirstBidRequestText and With Scrollable FALSE
        // await expect(correspondentPortalPage.First_Bid_Request_Text).toContainText(vars["FirstBidRequestText"]);
        // [DISABLED] Verify that the element Second Bid Request Text displays text SecondBidRequestText and With Scrollable FALSE
        // await expect(correspondentPortalPage.Second_Bid_Request_Text).toContainText(vars["SecondBidRequestText"]);
        // [DISABLED] Verify that the element First Bid Request Checkbox is checked and With Scrollable FALSE
        // await expect(correspondentPortalPage.First_Bid_Request_Checkbox).toBeVisible();
        // [DISABLED] Verify that the element Second Bid Request Checkbox is checked and With Scrollable FALSE
        // await expect(bidRequestPage.Second_Bid_Request_Checkbox).toBeVisible();
        // [DISABLED] Store the count of elements identified by locator All Bid Request Status into a variable AllBidRequestStatus
        // vars["AllBidRequestStatus"] = String(await bidRequestPage.All_Bid_Request_Status.count());
        // [DISABLED] Click on Show All
        // await correspondentPortalPage.Show_All_Button.click();
        // [DISABLED] Store the count of elements identified by locator All Bid Request Status into a variable AllBidRequestStatus
        // vars["AllBidRequestStatus"] = String(await bidRequestPage.All_Bid_Request_Status.count());
        // [DISABLED] Verify if AllBidRequestStatus > 2
        // expect(String(vars["AllBidRequestStatus"])).toBe("2");
        // [DISABLED] Click on Apply Selected
        // await correspondentPortalPage.Apply_Selected.click();
        log.stepPass('Apply Selected clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Clicking Apply Selected failed');
        throw e;
      }

      // ─── TC End: PASS ────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
});