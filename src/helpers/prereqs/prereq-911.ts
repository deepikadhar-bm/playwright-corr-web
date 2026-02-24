import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidmapPage } from '../../pages/correspondant/bidmap';
import { CorrespondentPortal18Page } from '../../pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SaveDraftExitButtonPage } from '../../pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_911(page: Page, vars: Record<string, string>): Promise<void> {
  const bidmapPage = new BidmapPage(page);
  const correspondentPortal18Page = new CorrespondentPortal18Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
  const spinnerPage = new SpinnerPage(page);


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
}
