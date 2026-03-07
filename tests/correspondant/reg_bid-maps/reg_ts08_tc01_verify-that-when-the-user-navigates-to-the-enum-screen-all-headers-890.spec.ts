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

  test('REG_TS08_TC01_Verify that when the user navigates to the enum screen, all headers of type enum are fetched, and if the uploaded file contains any values, then the corresponding matched records should ', async ({ page }) => {
    const testData: Record<string, string> = {
  "Enum Type": "Loan Purpose"
}; // Profile: "Enum Type Values.", row: 0
    const testDataSets: Record<string, string>[] = [
  {
    "Enum Type": "Loan Purpose"
  },
  {
    "Enum Type": "Mortgage Limit"
  },
  {
    "Enum Type": "Occupancy Type"
  },
  {
    "Enum Type": "Mortgage Types"
  },
  {
    "Enum Type": "Amortization Type"
  },
  {
    "Enum Type": "First Time Home Buyer"
  },
  {
    "Enum Type": "Attachment Type"
  },
  {
    "Enum Type": "Property Type"
  },
  {
    "Enum Type": "Aus List"
  },
  {
    "Enum Type": "Property Valuation Type"
  },
  {
    "Enum Type": "Buy Down"
  },
  {
    "Enum Type": "Impound Type"
  },
  {
    "Enum Type": "First Time Homebuyer Credit Fee Waiver"
  },
  {
    "Enum Type": "Interest Only"
  },
  {
    "Enum Type": "Ineligible"
  },
  {
    "Enum Type": "TPO"
  },
  {
    "Enum Type": "Loan Term"
  },
  {
    "Enum Type": "Product Name"
  }
];

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    vars["URl bids"] = page.url();
    vars["Count"] = "2";
    // Loop over test data sets in "Enum Type Values." from set1 to set18
// for (const testDataSet of testDataSets) {
//       await page.reload();
//       await page.waitForLoadState('networkidle');
//       await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
//       if (true) /* Element Headers Mapping Field is visible */ {
//         vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
//         vars["Enum + vars[Count]"] = await statusInactivePage.Headers_Mapping_Field(testDataSet["Enum Type"]).textContent() || '';
//       }
//     }
vars["Count"] = "2"; // Step 5: Store 2 in Count

for (const testDataSet of testDataSets) {
  //Step 6.1: Click the REFRESH button (browser reload)
  //await page.reload();

  //Step 6.2: Wait until the current page is loaded completely
  //await page.waitForLoadState('load');

  //Step 6.3: Wait until Enumeration Mapping Button is visible
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
  }
  else {
    console.log(`[DEBUG] Headers Mapping Field for "${testDataSet["Enum Type"]}" is NOT visible.`);
  }
}
console.log(`\n[DEBUG] Final Count after loop: ${vars["Count"]}`);
console.log(`[DEBUG] Final Enum Values: ${Object.keys(vars).filter(key => key.startsWith('Enum')).map(key => `${key}: ${vars[key]}`).join(', ')}`);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
    await expect(correspondentPortalPage.close_pop_up_bid_request_details).toBeVisible();
    await expect(correspondentPortal18Page.Yes_Proceed_Button).toBeVisible();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await headingBidmapPage.Bid_Sample_Field_Names_New.first().waitFor({ state: 'visible' });
    console.log('Enumeration Mapping Page is displayed and Bid Sample Field Names are visible.');
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
    
//const count = await headingBidmapPage.Bid_Sample_Field_Names.count();
// Check total without any filtering
// Debug: Check what's actually in the DOM

  });
});
