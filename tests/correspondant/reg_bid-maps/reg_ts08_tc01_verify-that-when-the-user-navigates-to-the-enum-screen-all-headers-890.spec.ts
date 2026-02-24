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
for (const testDataSet of testDataSets) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
      if (true) /* Element Headers Mapping Field is visible */ {
        vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
        vars["Enum + vars[Count]"] = await statusInactivePage.Headers_Mapping_Field.textContent() || '';
      }
    }
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
    await expect(correspondentPortalPage.close_pop_up_bid_request_details).toBeVisible();
    await expect(correspondentPortal18Page.Yes_Proceed_Button).toBeVisible();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidSampleField"] = "1";
    vars["count"] = String(await headingBidmapPage.Bid_Sample_Field_Names.count());
    while (parseFloat(String(vars["BidSampleField"])) <= parseFloat(String(vars["count"]))) {
      vars["Bid Sample Names"] = await headingBidmapPage.Bid_Sample_Name.textContent() || '';
      vars["BidSampleField"] = (parseFloat(String(vars["BidSampleField"])) + parseFloat(String("1"))).toFixed(0);
    }
  });
});
