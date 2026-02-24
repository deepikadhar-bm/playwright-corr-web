// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidmapPage = new BidmapPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS32_TC01_Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Bidmap Creation]', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Heading_Dashboard).toBeVisible();
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    vars["BidMapName1"] = vars["Create New Map"];
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await bidmapPage.Yes_Proceed_Button_Text.click();
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.waitFor({ state: 'visible' });
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    if (true) /* Element Yes Proceed Button Text is visible */ {
      await bidmapPage.Yes_Proceed_Button_Text.click();
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
    await stepGroups.stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page, vars);
    await saveAndPublishButtonPage.Save_and_Publish_Button.waitFor({ state: 'visible' });
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    vars["BidMapName2"] = vars["Create New Map"];
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
    await stepGroups.stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page, vars);
    await saveAndPublishButtonPage.Save_and_Publish_Button.waitFor({ state: 'visible' });
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Creating_New_Bid_Mapping_For_search_action_based_on_the_rule(page, vars);
    vars["Common Keyword"] = "TS_AdvanceSearch";
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    vars["BidMapName3"] = vars["Create New Map"];
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await bidmapPage.Yes_Proceed_Button_Text.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
    await stepGroups.stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page, vars);
    await saveDraftExitButtonPage.Save_Draft_Exit_Button.waitFor({ state: 'visible' });
    await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
