import { test, expect } from '@playwright/test';
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
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'REG_TS23_TC02';
const TC_TITLE = 'Verify that user should be able to clone the required bid map and a new bid map should be created with the status draft.[Verification]';

test.describe('REG_Bid Maps', () => {
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

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Clone the Bid Map and verify DRAFT status');
      try {
        await bidmapDashboardPage.Clone_Button_of_BidMap(vars['BidMapName']).waitFor({ state: 'visible' });
        await bidmapDashboardPage.Clone_Button_of_BidMap(vars['BidMapName']).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Status).toContainText("DRAFT");
        vars["CreateNewMap"] = String("Copy of") + ' ' + String(vars["CreateNewMap"]);
        log.stepPass('Bid Map cloned successfully. Clone Name: ' + vars["CreateNewMap"] + ', Status: DRAFT');
      } catch (e) {
        await log.stepFail(page, 'Failed to clone Bid Map or verify DRAFT status');
        throw e;
      }

      log.step('Open cloned Bid Map and verify New Map screen fields');
      try {
        await applyButtonForFiltersPage.Map_Name(vars['CreateNewMap']).click();
        await expect(page.getByText(vars["CreateNewMap"])).toBeVisible();
        await expect(companybidmapPage.New_Map_Name).toHaveValue(vars["CreateNewMap"]);
        await expect(newMapPage.Individual_Selected_Company).toContainText(vars["SelectedCompanyName"]);
        await expect(mapHeaderPage.Execution_Type_Dropdown_New).toHaveValue(vars["ExecutionType"]);
        await expect(p1MoreButtonPage.Uploaded_FileName).toContainText(vars["UploadedFileName"]);
        log.stepPass('Cloned Bid Map New Map fields verified. Company: ' + vars["SelectedCompanyName"] + ', ExecutionType: ' + vars["ExecutionType"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify New Map screen fields of cloned Bid Map');
        throw e;
      }

      log.step('Verify Header Mapping Bid Sample Names from test data profile');
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Verification_Of_BidSampleNames_In_Header_Mapping_From_TDP(page, vars);
        log.stepPass('Header Mapping Bid Sample Names verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Header Mapping Bid Sample Names');
        throw e;
      }

      log.step('Verify Enumeration Mapping — Bid Tape and Chase Field/Value mappings');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        if (await correspondentPortalPage.Yes_Proceed_Button.isVisible()) {
          log.info('Yes Proceed Button visible — clicking to proceed');
          await correspondentPortalPage.Yes_Proceed_Button.click();
        } else {
          log.info('Yes Proceed Button not visible — clicking Proceed with Saving');
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Verifying_the_bidsample_to_bidtape_mapping_in_Enumpage_from_(page, vars);
        await stepGroups.stepGroup_Verifying_the_Mapping_of_ChaseField_and_ChaseValues_in_Enum_(page, vars);
        log.stepPass('Enumeration Mapping Bid Tape and Chase Field/Value mappings verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Enumeration Mapping values');
        throw e;
      }

      log.step('Verify Rules and Actions values and Category');
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        if (await correspondentPortalPage.Yes_Proceed_Button.isVisible()) {
          log.info('Yes Proceed Button visible — clicking to proceed');
          await correspondentPortalPage.Yes_Proceed_Button.click();
        } else {
          log.info('Yes Proceed Button not visible — clicking Proceed with Saving');
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["First Rule Name"] = vars['Rule Name'];
        await stepGroups.stepGroup_Verification_of_Rules_and_Action_Values_Before_EditingActive(page, vars);
        await importRulePage.First_Active_Rule_Multiselected_Value.click();
        await expect(rulesAndActionsPage.get_Category_In_Dropdown(vars['CategoryName'])).toBeVisible();
        log.stepPass('Rules and Actions values verified. Rule Name: ' + vars["First Rule Name"] + ', Category: ' + vars["CategoryName"]+', RuleBidField: '+vars['RuleBidField'] + ', RuleCondition: '+vars['RuleCondition'] + ', RuleBidTapeValue: '+vars['RuleBidTapeValue'] + ', ChaseFieldNameonAddActions: '+vars['ChaseFieldNameonAddActions'] + ', ChasevalueOnAddActions: '+vars['ChasevalueOnAddActions'] );
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Rules and Actions values');
        throw e;
      }

      log.step('Save and Publish the cloned Bid Map');
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Cloned Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to Save and Publish the cloned Bid Map');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});