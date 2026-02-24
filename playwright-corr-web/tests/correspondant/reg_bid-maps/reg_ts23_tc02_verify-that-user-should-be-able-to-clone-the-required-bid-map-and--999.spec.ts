// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyButtonForFiltersPage } from '../../../src/pages/correspondant/apply-button-for-filters';
import { BidmapDashboardPage } from '../../../src/pages/correspondant/bidmap-dashboard';
import { CompanybidmapPage } from '../../../src/pages/correspondant/companybidmap';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ImportRulePage } from '../../../src/pages/correspondant/import-rule';
import { MapHeaderPage } from '../../../src/pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1361 } from '../../../src/helpers/prereqs/prereq-1361';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let applyButtonForFiltersPage: ApplyButtonForFiltersPage;
  let bidmapDashboardPage: BidmapDashboardPage;
  let companybidmapPage: CompanybidmapPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let importRulePage: ImportRulePage;
  let mapHeaderPage: MapHeaderPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let newMapPage: NewMapPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1361(page, vars);
    applyButtonForFiltersPage = new ApplyButtonForFiltersPage(page);
    bidmapDashboardPage = new BidmapDashboardPage(page);
    companybidmapPage = new CompanybidmapPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    importRulePage = new ImportRulePage(page);
    mapHeaderPage = new MapHeaderPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    newMapPage = new NewMapPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS23_TC02_Verify that user should be able to clone the required bid map and a new bid map should be created with the status draft.[Verification]', async ({ page }) => {

    await bidmapDashboardPage.Clone_Button_of_BidMap.waitFor({ state: 'visible' });
    await bidmapDashboardPage.Clone_Button_of_BidMap.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Status).toContainText("DRAFT");
    vars[""] = String("Copy of") + ' ' + String(vars["Create New Map"]);
    await applyButtonForFiltersPage.Map_Name.click();
    await expect(page.getByText(vars["Create New Map"])).toBeVisible();
    await expect(companybidmapPage.New_Map_Name).toHaveValue(vars["Create New Map"]);
    await expect(newMapPage.Individual_Selected_Company).toContainText(vars["SelectedCompanyName"]);
    await expect(mapHeaderPage.Execution_Type_Dropdown_New).toHaveValue(vars["ExecutionType"]);
    await expect(p1MoreButtonPage.Uploaded_FileName).toContainText(vars["UploadedFileName"]);
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verification_Of_BidSampleNames_In_Header_Mapping_From_TDP(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    await page.waitForLoadState('networkidle');
    await stepGroups.stepGroup_Verifying_the_bidsample_to_bidtape_mapping_in_Enumpage_from_(page, vars);
    await stepGroups.stepGroup_Verifying_the_Mapping_of_ChaseField_and_ChaseValues_in_Enum_(page, vars);
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verification_of_Rules_and_Action_Values_Before_EditingActive(page, vars);
    await importRulePage.First_Active_Rule_Multiselected_Value.click();
    await expect(rulesAndActionsPage.Category_In_Dropdown).toBeVisible();
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
