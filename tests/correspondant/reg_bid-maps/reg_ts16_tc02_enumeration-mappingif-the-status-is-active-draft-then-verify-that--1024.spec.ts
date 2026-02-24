// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { BidMapsPage } from '../../../src/pages/correspondant/bid-maps';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeleteDraftButtonPage } from '../../../src/pages/correspondant/delete-draft-button';
import { DeleteDraftPage } from '../../../src/pages/correspondant/delete-draft';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { EnumertionPage } from '../../../src/pages/correspondant/enumertion';
import { EnumFilterPage } from '../../../src/pages/correspondant/enum-filter';
import { HeaderamappingPage } from '../../../src/pages/correspondant/headeramapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapHeaderPage } from '../../../src/pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { MapNameFieldInBidMapsPage } from '../../../src/pages/correspondant/map-name-field-in-bid-maps';
import { MapNamePage } from '../../../src/pages/correspondant/map-name';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ViewActiveVersionButtonPage } from '../../../src/pages/correspondant/view-active-version-button';
import { ViewDraftButtonPage } from '../../../src/pages/correspondant/view-draft-button';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let bidMapsPage: BidMapsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deleteDraftButtonPage: DeleteDraftButtonPage;
  let deleteDraftPage: DeleteDraftPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let enumertionPage: EnumertionPage;
  let enumFilterPage: EnumFilterPage;
  let headeramappingPage: HeaderamappingPage;
  let headerMappingPage: HeaderMappingPage;
  let mapHeaderPage: MapHeaderPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let mapNameFieldInBidMapsPage: MapNameFieldInBidMapsPage;
  let mapNamePage: MapNamePage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let viewActiveVersionButtonPage: ViewActiveVersionButtonPage;
  let viewDraftButtonPage: ViewDraftButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidmapPage = new BidmapPage(page);
    bidMapsPage = new BidMapsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deleteDraftButtonPage = new DeleteDraftButtonPage(page);
    deleteDraftPage = new DeleteDraftPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    enumertionPage = new EnumertionPage(page);
    enumFilterPage = new EnumFilterPage(page);
    headeramappingPage = new HeaderamappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeaderPage = new MapHeaderPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
    mapNamePage = new MapNamePage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    viewActiveVersionButtonPage = new ViewActiveVersionButtonPage(page);
    viewDraftButtonPage = new ViewDraftButtonPage(page);
  });

  test('REG_TS16_TC02_(Enumeration Mapping)If the status is active draft, then verify that user should be able to switch the view between active draft and should be able to delete the defat version if not req', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Navigating_to_Customer_Permission_For_the_Chase_Direct_Compa(page, vars);
    await stepGroups.stepGroup_EditActions_In_CustomerPermission(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await stepGroups.stepGroup_Creating_Of_Bid_Maps(page, vars);
    // [DISABLED] Creation Of Bid Map_Upto_Header Mapping
    // await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await bidmapPage.Yes_Proceed_Button_Text.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await mapHeaderPage.Execution_Type_Dropdown_New.selectOption({ index: parseInt("2") });
    await correspondentPortalPage.Save_Draft_Button1.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await bidmapPage.Yes_Proceed_Button_Text.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Adding_Field_In_Enumeration_Mapping(page, vars);
    vars["NewFieldChaseValue"] = await enumerationMappingPage.Added_Chase_Value_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    await stepGroups.stepGroup_Editing_In_Enumeration_Mapping_Screen(page, vars);
    await stepGroups.stepGroup_Delete_In_Enumeration_Mapping(page, vars);
    await headerMappingPage.First_Header_Checkbox.check();
    await expect(headerMappingPage.First_Header_Checkbox).toBeVisible();
    vars["FirstBidSampleName"] = await enumerationMappingPage.First_Bid_Sample_Name_In_Enumeration.textContent() || '';
    // [DISABLED] Click on Save Draft Button
    // await correspondentPortalPage.Save_Draft_Button1.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Store the text of the selected option from Newly Added chase value list into a variable NewFieldChaseValueAfterSaveDraftExit
    // vars["NewFieldChaseValueAfterSaveDraftExit"] = await enumerationMappingPage.Newly_Added_chase_valueDisabled.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    // [DISABLED] Verify if NewFieldChaseValue == NewFieldChaseValueAfterSaveDraftExit
    // expect(String(vars["NewFieldChaseValue"])).toBe(vars["NewFieldChaseValueAfterSaveDraftExit"]);
    // [DISABLED] Verify that the Edited Chase Value After Save list has option with text EditedChaseValue selected and With Scrollable FALSE
    // await expect(enumerationMappingPage.Edited_Chase_Value_After_Save).toHaveValue(vars["EditedChaseValue"]);
    // [DISABLED] Verify that the element Deleted Field In Enumeration is not displayed and With Scrollable FALSE
    // await expect(enumerationMappingPage.Deleted_Field_In_Enumeration).toBeVisible();
    // [DISABLED] Verify that the element Bid Sample Name 1 is checked and With Scrollable FALSE
    // await expect(enumertionPage.Bid_Sample_Name_1).toBeVisible();
    // [DISABLED] Uncheck the checkbox Bid Sample Name 1
    // await enumertionPage.Bid_Sample_Name_1.uncheck();
    // [DISABLED] Check the checkbox Bid Sample Name 2
    // await enumerationMappingPage.Bid_Sample_Name_2.check();
    // [DISABLED] Verify that the element Bid Sample Name 2 is checked and With Scrollable FALSE
    // await expect(enumerationMappingPage.Bid_Sample_Name_2).toBeVisible();
    // [DISABLED] Verify that the element Bid Sample Name 1 is unchecked and With Scrollable FALSE
    // await expect(enumertionPage.Bid_Sample_Name_1).toBeVisible();
    await correspondentPortalPage.Save_Draft_Button1.click();
    await stepGroups.stepGroup_Verifying_Changes_After_SaveDraft_Action_In_Enumeration_Mapp(page, vars);
    // [DISABLED] Verify that the element Bid Sample Name 2 is checked and With Scrollable FALSE
    // await expect(enumerationMappingPage.Bid_Sample_Name_2).toBeVisible();
    // [DISABLED] Select option using value StreamLineRefinance in the Loan Purpose Dropdwon list
    // await enumerationMappingPage.Loan_Purpose_Dropdwon.selectOption({ label: "StreamLineRefinance" });
    // [DISABLED] Verify that the Loan Purpose Dropdwon list has option with value StreamLineRefinance selected and With Scrollable FALSE
    // await expect(enumerationMappingPage.Loan_Purpose_Dropdwon).toHaveValue("StreamLineRefinance");
    // [DISABLED] Verify that the element Save Draft Button is enabled and With Scrollable FALSE
    // await expect(correspondentPortalPage.Save_Draft_Button1).toBeVisible();
    // [DISABLED] Click on Save Draft Button
    // await correspondentPortalPage.Save_Draft_Button1.click();
    await expect(viewActiveVersionButtonPage.View_Active_Version_Button).toBeVisible();
    await viewActiveVersionButtonPage.View_Active_Version_Button.click();
    await headeramappingPage.Disabled_Headers.waitFor({ state: 'visible' });
    await expect(headeramappingPage.Disabled_Headers).toBeVisible();
    await expect(enumFilterPage.Bid_Tape_Value_Field_Added_in_Enumeration_Mapping_Disabled).not.toContainText(vars["AddedBidTapeValueEnumerationMapping"]);
    await expect(enumerationMappingPage.Newly_Added_chase_valueDisabled).not.toContainText(vars["NewFieldChaseValue"]);
    // [DISABLED] Verify that the text NewFieldChaseValue is not displayed in the element Added Chase Value Dropdown and With Scrollable FALSE
    // await expect(enumerationMappingPage.Added_Chase_Value_Dropdown).not.toContainText(vars["NewFieldChaseValue"]);
    await expect(bidMapsPage.Edited_Chase_Value_After_Save_new).not.toContainText(vars["EditedChaseValue"]);
    await expect(enumerationMappingPage.Deleted_Field_In_Enumeration).toBeVisible();
    await expect(enumertionPage.Bid_Sample_Name_1).toBeVisible();
    // [DISABLED] Verify that the element Bid Sample Name 2 is unchecked and With Scrollable FALSE
    // await expect(enumerationMappingPage.Bid_Sample_Name_2).toBeVisible();
    await viewDraftButtonPage.View_Draft_Button.click();
    await expect(headeramappingPage.Disabled_Headers).toBeVisible();
    await deleteDraftButtonPage.Delete_Draft_Button.waitFor({ state: 'visible' });
    await deleteDraftButtonPage.Delete_Draft_Button.click();
    await expect(deleteDraftPage.Text_In_Delete_Draft).toBeVisible();
    await deleteDraftPage.Yes_proceed_On_Delete_Draft.click();
    await expect(mapNamePage.Active_Map_Name).toContainText("ACTIVE");
  });
});
