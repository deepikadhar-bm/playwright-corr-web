// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AmortizationTermPage } from '../../../src/pages/correspondant/amortization-term';
import { AppraisedValuePage } from '../../../src/pages/correspondant/appraised-value';
import { ContinueEditingButtonPage } from '../../../src/pages/correspondant/continue-editing-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MultipleClientHeadersAreMappedToTheSameChasePage } from '../../../src/pages/correspondant/multiple-client-headers-are-mapped-to-the-same-chase';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID    = 'REG_TS06_TC01';
const TC_TITLE = 'Verify the save actions should not allow the duplicate selections for the chase field name values.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let amortizationTermPage: AmortizationTermPage;
  let appraisedValuePage: AppraisedValuePage;
  let continueEditingButtonPage: ContinueEditingButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let multipleClientHeadersAreMappedToTheSameChasePage: MultipleClientHeadersAreMappedToTheSameChasePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    amortizationTermPage = new AmortizationTermPage(page);
    appraisedValuePage = new AppraisedValuePage(page);
    continueEditingButtonPage = new ContinueEditingButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    multipleClientHeadersAreMappedToTheSameChasePage = new MultipleClientHeadersAreMappedToTheSameChasePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials and Test Data ───────────────────────────
      log.step('Loading credentials and test data');
      try {
        const crederntials = ENV.getCredentials('internal');
        vars["Username"] = crederntials.username;
        vars["Password"] = crederntials.password;
        // console.log("Test Data: ", testData);
        console.log("Credentials: ", crederntials.username, crederntials.password);
        console.log("Credentials:==> ", vars["Username"], vars["Password"]);
        const profileName = "Bid_Maps";
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const ChaseFieldName = profile.data[0]['ChaseFieldName'];
          vars["ChaseFieldName"] = ChaseFieldName;
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
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Create Bid Map up to Header Mapping ──────────────────────
      log.step('Creating Bid Map up to Header Mapping step');
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
        log.stepPass('Bid Map created up to Header Mapping — Step 4 of 4 is visible');
      } catch (e) {
        await log.stepFail(page, 'Creating Bid Map up to Header Mapping failed');
        throw e;
      }

      // ── Step 4: Select Chase Field Name and extract values ───────────────
      log.step('Selecting Chase Field Name and extracting Bid Sample Field and Chase Field Name values');
      try {
        await correspondentPortalPage.First_Checkbox_Header_Mapping.selectOption({ label: vars["ChaseFieldName"] });
        vars["Select Bid Sample Field Name"] = await correspondentPortalPage.Select_Bid_Sample_Field_Name.textContent() || '';
        vars["Chase Field Name"] = await correspondentPortalPage.Appraised_Value_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.stepPass('Chase Field Name selected and values extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Selecting Chase Field Name or extracting values failed');
        throw e;
      }

      // ── Step 5: Click Save Draft and capture Alert Pop Up values ─────────
      log.step('Clicking Save Draft button and capturing Alert Pop Up values');
      try {
        await correspondentPortalPage.Save_Draft_Button1.click();
        vars["BidSampleField"] = await amortizationTermPage.Bid_Sample_Field_in_Alert_Pop_Up.textContent() || '';
        vars["Chase Field Namepopup"] = await appraisedValuePage.Bid_Sample_Field_In_Alert_Pop_Up.textContent() || '';
        log.stepPass('Save Draft clicked and Alert Pop Up values captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Clicking Save Draft or capturing Alert Pop Up values failed');
        throw e;
      }

      // ── Step 6: Verify Bid Sample Field and Chase Field Name values ───────
      log.step('Verifying Bid Sample Field and Chase Field Name values match Alert Pop Up');
      try {
        expect(String(vars["Select Bid Sample Field Name"])).toBe(vars["BidSampleField"]);
        expect(String(vars["Chase Field Name"])).toBe(vars["Chase Field Namepopup"]);
        log.stepPass('Bid Sample Field and Chase Field Name values verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying Bid Sample Field or Chase Field Name values failed');
        throw e;
      }

      // ── Step 7: Verify Duplicate Chase Field Name error message ──────────
      log.step('Verifying duplicate Chase Field Name error message and Continue Editing button visibility');
      try {
        await expect(page.getByText("Multiple client headers are mapped to the same Chase Field name. Please review and make changes.")).toBeVisible();
        await expect(multipleClientHeadersAreMappedToTheSameChasePage.Multiple_client_headers_are_mapped_to_the_same_Chase).toBeVisible();
        await continueEditingButtonPage.Continue_Editing_Button.waitFor({ state: 'visible' });
        log.stepPass('Duplicate Chase Field Name error message and Continue Editing button verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying duplicate Chase Field Name error message failed');
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