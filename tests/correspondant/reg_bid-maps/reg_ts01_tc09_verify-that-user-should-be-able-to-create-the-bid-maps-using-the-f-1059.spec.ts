// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapNameFieldInBidMapsPage } from '../../../src/pages/correspondant/map-name-field-in-bid-maps';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let bidmapPage: BidmapPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let headerMappingPage: HeaderMappingPage;
  let mapNameFieldInBidMapsPage: MapNameFieldInBidMapsPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    bidmapPage = new BidmapPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS01_TC09_Verify that user should be able to create the bid maps using the file extenstion csv', async ({ page }) => {
    const testData: Record<string, string> = {
  "Parameter 1": "",
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
    vars["EnumValues"] = "Loan Purpose";
    // Loop over test data sets in "Enum_Type_Values_For_Happy_Flow" from set2 to set18
for (const testDataSet of testDataSets) {
      vars["EnumValues"] = String(testData["Parameter 1"]) + "," + String(vars["EnumValues"]);
    }
    vars["MappedChaseFieldCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
    vars["count"] = "1";
    vars["ChaseEnumValue"] = "sample";
    while (parseFloat(String(vars["count"])) < parseFloat(String(vars["MappedChaseFieldCount"]))) {
      vars["ChaseName"] = await headerMappingPage.Individual_Mapped_Chase_Name.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
      if (String(vars["EnumValues"]).includes(String(vars["ChaseName"]))) {
        vars["ChaseEnumValue"] = String(vars["ChaseName"]) + "," + String(vars["ChaseEnumValue"]);
        vars["CorrespondentBidName"] = await headerMappingPage.Correspondent_Bid_sample_name.textContent() || '';
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await bidmapPage.Yes_Proceed_Button_Text.click();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.waitFor({ state: 'visible' });
        await expect(enumerationMappingPage.Bid_Sample_Name_Field_Enumeration_Mapping).toContainText(vars["CorrespondentBidName"]);
        await correspondentPortalPage.Header_Mapping1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    // [DISABLED] Store Mortgage Types in BidFieldName
    // vars["BidFieldName"] = "Mortgage Types";
    // [DISABLED] Store Mortgage Limit in ChaseFieldValue
    // vars["ChaseFieldValue"] = "Mortgage Limit";
    // [DISABLED] Select option by text ChaseFieldValue in the Required Bid Field list
    // await headerMappingPage.Required_Bid_Field.selectOption({ label: vars["ChaseFieldValue"] });
    // [DISABLED] Store Product Name in BidFieldName
    // vars["BidFieldName"] = "Product Name";
    // [DISABLED] Store Mortgage Types in ChaseFieldValue
    // vars["ChaseFieldValue"] = "Mortgage Types";
    // [DISABLED] Select option by text ChaseFieldValue in the Required Bid Field list
    // await headerMappingPage.Required_Bid_Field.selectOption({ label: vars["ChaseFieldValue"] });
    // [DISABLED] Store Street in BidFieldName
    // vars["BidFieldName"] = "Street";
    // [DISABLED] Store Street in ChaseFieldValue
    // vars["ChaseFieldValue"] = "Street";
    // [DISABLED] Select option by text ChaseFieldValue in the Required Bid Field list
    // await headerMappingPage.Required_Bid_Field.selectOption({ label: vars["ChaseFieldValue"] });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    if (true) /* Element Yes Proceed Button is visible */ {
      await bidmapPage.Yes_Proceed_Button_Text.click();
    }
    if (true) /* Element Proceed with Saving Button is visible */ {
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    }
    vars["ChaseEnumNamesCount[Enumeration]"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
    vars["count1"] = "1";
    while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ChaseEnumNamesCount[Enumeration]"]))) {
      vars["ChaseName"] = await chaseFieldNamePage.Chase_Field_Name_common_one_Field.inputValue() || '';
      expect(String(vars["ChaseEnumValue"])).toBe(vars["ChaseName"]);
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
    }
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    if (true) /* Element Yes Proceed Button is visible */ {
      await bidmapPage.Yes_Proceed_Button_Text.click();
    }
    if (true) /* Element Proceed with Saving Button is visible */ {
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Add_Rule_For_Add_Condition_In_Rules_and_Actions(page, vars);
    await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
    await expect(rulesAndActionsButtonPage.Condition_BidField_1).toContainText(vars["RuleBidField"]);
    await expect(rulesAndActionsButtonPage.Condition_BidTape1).toContainText(vars["RuleBidTapeValue"]);
    // [DISABLED] Verify that the element Action Chase Field Name 1 display value ChaseFieldNameonAddActions and With Scrollable FALSE
    // await expect(actionruleheaderPage.Action_Chase_Field_Name_1).toHaveValue(vars["ChaseFieldNameonAddActions"]);
    await expect(actionruleheaderPage.Action_Chase_Field_Name_1).toContainText(vars["ChaseFieldNameonAddActions"]);
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await expect(mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row).toBeVisible();
  });
});
