// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeadingBidmapPage } from '../../../src/pages/correspondant/heading-bidmap';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS08_TC01';
const TC_TITLE = 'Verify that when the user navigates to the enum screen, all headers of type enum are fetched, and if the uploaded file contains any values, then the corresponding matched records should be displayed.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headingBidmapPage: HeadingBidmapPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headingBidmapPage = new HeadingBidmapPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials ─────────────────────────────────────────
      log.step('Loading credentials');
      try {
        const crederntials = ENV.getCredentials('internal');
        vars["Username"] = crederntials.username;
        vars["Password"] = crederntials.password;
        // console.log("Test Data: ", testData);

        log.stepPass('Credentials loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials failed');
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

      // ── Step 3: Enable Smart Mapper ──────────────────────────────────────
      log.step('Enabling Smart Mapper from Off to On');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        log.stepPass('Smart Mapper enabled successfully');
      } catch (e) {
        await log.stepFail(page, 'Enabling Smart Mapper failed');
        throw e;
      }

      // ── Step 4: Create Bid Map up to Header Mapping ──────────────────────
      log.step('Creating Bid Map up to Header Mapping step');
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        vars["URl bids"] = page.url();
        vars["Count"] = "2";
        log.stepPass('Bid Map created up to Header Mapping successfully');
      } catch (e) {
        await log.stepFail(page, 'Creating Bid Map up to Header Mapping failed');
        throw e;
      }

      // ── Step 5: Loop over Enum Type datasets and collect visible headers ──
      log.step('Looping over Enum Type datasets and collecting visible header mapping fields');
      try {
        const testData: Record<string, string> = {
          "Enum Type": "Loan Purpose"
        }; // Profile: "Enum Type Values.", row: 0
        const testDataSets: Record<string, string>[] = [
          { "Enum Type": "Loan Purpose" },
          { "Enum Type": "Mortgage Limit" },
          { "Enum Type": "Occupancy Type" },
          { "Enum Type": "Mortgage Types" },
          { "Enum Type": "Amortization Type" },
          { "Enum Type": "First Time Home Buyer" },
          { "Enum Type": "Attachment Type" },
          { "Enum Type": "Property Type" },
          { "Enum Type": "Aus List" },
          { "Enum Type": "Property Valuation Type" },
          { "Enum Type": "Buy Down" },
          { "Enum Type": "Impound Type" },
          { "Enum Type": "First Time Homebuyer Credit Fee Waiver" },
          { "Enum Type": "Interest Only" },
          { "Enum Type": "Ineligible" },
          { "Enum Type": "TPO" },
          { "Enum Type": "Loan Term" },
          { "Enum Type": "Product Name" }
        ];

        vars["Count"] = "2"; // Step 5: Store 2 in Count

        for (const testDataSet of testDataSets) {

          await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });

          // Step 6.4: IF Element Headers Mapping Field is VISIBLE
          const headerElem = statusInactivePage.Headers_Mapping_Field(testDataSet["Enum Type"]);
          const isVisible = await headerElem.isVisible();

          if (isVisible) {
            // Step 6.4.1: Perform ADDITION on 1 and $Count, store result in Count (0 decimal places)
            vars["Count"] = (parseFloat(vars["Count"]) + 1).toFixed(0);
            //console.log(`\n[DEBUG] Updated Count: ${vars["Count"]}`);

            // Step 6.4.2: Store text from Headers Mapping Field into a variable using StringFunctions::Concat
            const headerText = (await headerElem.textContent() || '').trim();
            vars[`Enum${vars["Count"]}`] = headerText;
            console.log(`[DEBUG] Stored Enum${vars["Count"]}: ${vars[`Enum${vars["Count"]}`]}`);
          } else {
            console.log(`[DEBUG] Headers Mapping Field for "${testDataSet["Enum Type"]}" is NOT visible.`);
          }
        }

        console.log(`\n[DEBUG] Final Count after loop: ${vars["Count"]}`);
        console.log(`[DEBUG] Final Enum Values: ${Object.keys(vars).filter(key => key.startsWith('Enum')).map(key => `${key}: ${vars[key]}`).join(', ')}`);
        log.stepPass('Enum Type datasets looped and visible header fields collected successfully');
      } catch (e) {
        await log.stepFail(page, 'Looping over Enum Type datasets failed');
        throw e;
      }

      // ── Step 6: Click Enumeration Mapping and verify warning popup ────────
      log.step('Clicking Enumeration Mapping button and verifying unidentified fields warning popup');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await expect(correspondentPortalPage.close_pop_up_bid_request_details).toBeVisible();
        await expect(correspondentPortal18Page.Yes_Proceed_Button).toBeVisible();
        log.stepPass('Unidentified fields warning popup verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Clicking Enumeration Mapping or verifying warning popup failed');
        throw e;
      }

      // ── Step 7: Proceed and verify Enumeration Mapping page ──────────────
      log.step('Clicking Yes Proceed and verifying Enumeration Mapping page is displayed');
      try {
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await headingBidmapPage.Bid_Sample_Field_Names_New.first().waitFor({ state: 'visible' });
        console.log('Enumeration Mapping Page is displayed and Bid Sample Field Names are visible.');
        log.stepPass('Enumeration Mapping page displayed and Bid Sample Field Names are visible');
      } catch (e) {
        await log.stepFail(page, 'Proceeding to Enumeration Mapping page failed');
        throw e;
      }

      // ── Step 8: Iterate through Bid Sample Field Names ───────────────────
      log.step('Iterating through all Bid Sample Field Names and fetching their text');
      try {
        vars["count"] = String(await headingBidmapPage.Bid_Sample_Field_Names_New.count());
        console.log('Bid Sample Field Names Count:', vars["count"]);
        //page.waitForTimeout(5000);
        vars["BidSampleField"] = "1";
        //const count: number = await headingBidmapPage.Bid_Sample_Field_Names_New.count();
        //console.log(`Total Bid Sample Field Names found: ${vars["count"]}`);
        while (parseFloat(String(vars["BidSampleField"])) <= parseFloat(String(vars["count"]))) {
          //console.log(`Processing Bid Sample Field ${vars["BidSampleField"]} of ${vars["count"]}`);
          vars["Bid Sample Names"] = await headingBidmapPage.Bid_Sample_Name(vars["BidSampleField"]).textContent() || '';
          vars["BidSampleField"] = (parseFloat(String(vars["BidSampleField"])) + parseFloat(String("1"))).toFixed(0);
          console.log(`Fetched Bid Sample Name: ${vars["Bid Sample Names"]}`);
          //console.log(`vars[count] : ${vars["count"]} and vars[BidSampleField] : ${vars["BidSampleField"]}`);
        }
        log.stepPass('All Bid Sample Field Names iterated and fetched successfully');
      } catch (e) {
        await log.stepFail(page, 'Iterating through Bid Sample Field Names failed');
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