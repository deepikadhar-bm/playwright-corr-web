import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AppraisedvalueselectamDivDivPage } from '../../../src/pages/correspondant/appraisedvalueselectam-div-div';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DropdownSelectAmortizationTypeAppraisedValueAttPage } from '../../../src/pages/correspondant/dropdown-select-amortization-type-appraised-value-att';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { testDataManager } from 'testdata/TestDataManager';
import { uploadFile } from '../../../src/helpers/file-helpers';


const TC_ID = 'REG_TS08_TC05_CASE-2';
const TC_TITLE = 'Verify that if the Smart Mapper is ON, values from the file should be fetched and auto mapped. If Smart Mapper is OFF then auto map should not work.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let appraisedvalueselectamDivDivPage: AppraisedvalueselectamDivDivPage;
  let bidrequestPage: BidrequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let dropdownSelectAmortizationTypeAppraisedValueAttPage: DropdownSelectAmortizationTypeAppraisedValueAttPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let headerMappingPage: HeaderMappingPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let newMapPage: NewMapPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    appraisedvalueselectamDivDivPage = new AppraisedvalueselectamDivDivPage(page);
    bidrequestPage = new BidrequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    dropdownSelectAmortizationTypeAppraisedValueAttPage = new DropdownSelectAmortizationTypeAppraisedValueAttPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    newMapPage = new NewMapPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    if (profile && profile.data) {
      vars["Companyname"] = profile.data[0]['CompanyName1'];

    }
    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Enable Smart Mapper and create Bid Map up to Header Mapping');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        const fileName = fileconstants.BID_QA_FILE_COMMON;
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileName);
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Store Enum TDP values and navigate to Enumeration Mapping');
      try {
        await stepGroups.stepGroup_Storing_All_Enum_TDP_Values_into_a_Variable(page, vars);
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Enum TDP values stored and navigated to Enumeration Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to store Enum TDP values or navigate to Enumeration Mapping');
        throw e;
      }

      vars['FilePathEnumMapping'] = path.join(process.cwd(), 'uploads', fileconstants.BID_QA_FILE_COMMON);
      excelHelper.readEntireRow(vars['FilePathEnumMapping'], 0, 0, 'Total Headers From Xls');
      log.step('Verify Smart Mapper ON — enumeration mapping auto-match counts');
      try {
        vars["ColumnCount"] = String(excelHelper.getColumnCount(vars['FilePathEnumMapping'], "0"));
        log.info('Column Count: ' + vars["ColumnCount"]);
        vars["PerfectMatch"] = "0";
        vars["PartialMatch"] = "0";
        vars["IncorrectMatch"] = "0";
        vars["UnmappedCount"] = "0";
        vars["ColumnNum"] = "0";
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ColumnCount"]))) {
          log.info('Iteration count: ' + vars["count"] + ' ColumnNum: ' + vars["ColumnNum"]);
          await enumerationMappingPage.First_Checkbox_Enum.check();
          await enumerationMappingPage.First_Checkbox_Enum.uncheck();
          vars["ColumnHeader"] = excelHelper.readCellByColAndRowIndex(vars['FilePathEnumMapping'], 0, 0, vars["ColumnNum"]);
          log.info('Column Header: ' + vars["ColumnHeader"]);
          if (await enumerationMappingPage.Chase_Field_Of_BidSample(vars['ColumnHeader']).isVisible()) {
            vars["ChaseFieldUI"] = await enumerationMappingPage.Chase_Field_Of_BidSample(vars['ColumnHeader']).textContent() || '';
            if (String(vars["EnumValues"]).includes(String(vars["ChaseFieldUI"]))) {
              vars["UniqueBidTapeValuesFromExcel"] = excelHelper.readEntireColumnByColIndex(vars['FilePathEnumMapping'], vars["ColumnNum"], 0);
              Methods.splitBySpecialChar(vars["UniqueBidTapeValuesFromExcel"], ',', '0', 'FirstValue');
              Methods.splitBySpecialChar(vars["UniqueBidTapeValuesFromExcel"], ',', '1', 'UniqueBidTapeValuesFromExcel');
              vars["BidTapeCountUI"] = String(await enumerationMappingPage.get_BidTapeFieldCountForBidField(vars['columnHeader']).count());
              if (parseFloat(String(vars["BidTapeCountUI"])) > 1) {
                vars["count1"] = appconstants.ONE;
                while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["BidTapeCountUI"]))) {
                  log.info('Inner iteration count1: ' + vars["count1"]);
                  vars["IndividualBidTapeValueFromUI"] = await enumerationMappingPage.IndividualBidTapeValue(vars['ColumnHeader'], vars['count1']).textContent() || '';
                  Methods.trimtestdata(vars['IndividualBidTapeValueFromUI'], 'IndividualBidTapeValueFromUI');
                  Methods.verifyString(vars["IndividualBidTapeValueFromUI"], 'equals', vars["UniqueBidTapeValuesFromExcel"]);

                  if (!(await enumerationMappingPage.IndividualChaseValueUI(vars['ColumnHeader'], vars['count1']).isVisible())) {
                    vars["IndividualChaseValueUI"] = await enumerationMappingPage.IndividualChaseValueUI(vars['ColumnHeader'], vars['count1']).textContent() || '';
                    log.info('Individual Chase Value UI: ' + vars["IndividualChaseValueUI"]);
                    if (String(vars["IndividualChaseValueUI"]).includes(String("Select"))) {
                      vars["IndividualChaseValueUI"] = await enumerationMappingPage.IndividualChaseValueUI(vars['ColumnHeader'], vars['count1']).evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
                    }
                  }

                  if (await enumerationMappingPage.IndividualChaseValueUI(vars['ColumnHeader'], vars['count1']).isVisible()) {
                    Methods.performArithmetic(vars["UnmappedCount"], 'ADDITION', '1', 'UnmappedCount', 0);
                  } else if (String("N , False , FALSE , false").includes(String(vars["IndividualBidTapeValueFromUI"]))) {
                    if (String("N , False , FALSE , false").includes(String(vars["IndividualChaseValueUI"]))) {
                      Methods.performArithmetic(vars["PerfectMatch"], 'ADDITION', '1', 'PerfectMatch', 0);
                    } else {
                      Methods.performArithmetic(vars["IncorrectMatch"], 'ADDITION', '1', 'IncorrectMatch', 0);
                    }
                  } else if (String("Y , True , true , TRUE").includes(String(vars["IndividualBidTapeValueFromUI"]))) {
                    if (String("Y , True , true , TRUE").includes(String(vars["IndividualChaseValueUI"]))) {
                      Methods.performArithmetic(vars["PerfectMatch"], 'ADDITION', '1', 'PerfectMatch', 0);
                    } else {
                      Methods.performArithmetic(vars["IncorrectMatch"], 'ADDITION', '1', 'IncorrectMatch', 0);
                    }
                  } else if (String(vars["IndividualChaseValueUI"]) === String(vars["IndividualBidTapeValueFromUI"])) {
                    Methods.performArithmetic(vars["PerfectMatch"], 'ADDITION', '1', 'PerfectMatch', 0);
                  } else if (String(vars["IndividualChaseValueUI"]).includes(String(vars["IndividualBidTapeValueFromUI"]))) {
                    Methods.performArithmetic(vars["PartialMatch"], 'ADDITION', '1', 'PartialMatch', 0);
                  } else if (String(vars["IndividualBidTapeValueFromUI"]).includes(String(vars["IndividualChaseValueUI"]))) {
                    Methods.performArithmetic(vars["PartialMatch"], 'ADDITION', '1', 'PartialMatch', 0);
                  } else {
                    Methods.performArithmetic(vars["IncorrectMatch"], 'ADDITION', '1', 'IncorrectMatch', 0);
                  }
                  Methods.performArithmetic(vars["count1"], 'ADDITION', '1', 'count1', 0);
                }
              } else {
                vars["BidTapeValueUI"] = await bidrequestPage.BidTapeValueUI(vars['ColumnHeader']).first().textContent() || '';
                log.info('Bid Tape Value UI: ' + vars['BidTapeValueUI']);
                Methods.trimtestdata(vars["BidTapeValueUI"], 'BidTapeValueUI');
                Methods.verifyString(vars["BidTapeValueUI"], 'equals', vars["UniqueBidTapeValuesFromExcel"]);
                if (!(await enumerationMappingPage.CorrespondentChaseValueUI(vars['ColumnHeader']).first().isVisible())) {
                  vars["ChaseValueUI"] = await enumerationMappingPage.CorrespondentChaseValueUI(vars['ColumnHeader']).textContent() || '';
                  if (String(vars["ChaseValueUI"]).includes(String("Select"))) {
                    vars["ChaseValueUI"] = await enumerationMappingPage.CorrespondentChaseValueUI(vars['ColumnHeader']).evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
                  }
                }
                await stepGroups.stepGroup_Getting_PerfectPartialIncorrectUnmapped_Count_From_Enum_Mapp(page, vars);
              }
            }
          }

          Methods.performArithmetic(vars["count"], 'ADDITION', '1', 'count', 0);
          Methods.performArithmetic(vars["ColumnNum"], 'ADDITION', '1', 'ColumnNum', 0);
        }
        log.stepPass('Smart Mapper ON enumeration mapping verified. PerfectMatch: ' + vars["PerfectMatch"] + ' PartialMatch: ' + vars["PartialMatch"] + ' IncorrectMatch: ' + vars["IncorrectMatch"] + ' UnmappedCount: ' + vars["UnmappedCount"]);
      } catch (e) {
        await log.stepFail(page, 'Smart Mapper ON enumeration mapping verification failed at count: ' + vars["count"]);
        throw e;
      }

      log.step('Save Draft and Exit, then turn Smart Mapper OFF');
      try {
        await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Smart_Mapper_from_On_to_Off(page, vars);
        log.stepPass('Draft saved, exited, and Smart Mapper turned OFF');
      } catch (e) {
        await log.stepFail(page, 'Failed to save draft or turn Smart Mapper OFF');
        throw e;
      }

      log.step('Navigate to Bid Maps and create a new map with Smart Mapper OFF');
      try {
        await stepGroups.stepGroup_Navigation_to_Customer_Permission(page, vars);
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
        // vars["Create New Map"] = new Date().toLocaleDateString('en-US');21
        Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_SLASH, 'Current Date', appconstants.ASIA_KOLKATA);
        Methods.concatenate(appconstants.Testsigma_, vars["Current Date"], "CreateNewMap");
        await correspondentPortalPage.Create_New_Map_Field.type(vars["CreateNewMap"]);
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["CreateNewMap"])).toBeVisible();
        log.stepPass('New Bid Map created with Smart Mapper OFF. Map: ' + vars["CreateNewMap"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to create new Bid Map with Smart Mapper OFF');
        throw e;
      }

      log.step('Configure new map — select company, upload file, and proceed to Header Mapping');
      try {
        await newMapPage.New_Map.click();
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        // await statusInactivePage.Second_Selected_Company_Checkbox(vars['Companyname']).click();
        await correspondentPortalPage.Required_Companys_Name_Value(vars["Companyname"]).first().click();
        await correspondentPortalPage.Apply_Selected.click();
        await correspondentPortalPage.Execution_Type_Dropdown.selectOption({ value: appconstants.EXECUTION_TYPE_STANDARD });
        await expect(correspondentPortalPage.Execution_Type_Dropdown.locator('option:checked')).toHaveText(appconstants.EXECUTION_TYPE_STANDARD);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Yes_Proceed_Button.click();
        // await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid Maps File.xlsx"));
        await uploadFile(page, correspondentPortalPage.Upload_File, fileconstants.Bid_Maps_File);
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Company selected, file uploaded, and navigated to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to configure new map or navigate to Header Mapping');
        throw e;
      }

      log.step('Verify Smart Mapper OFF — all header dropdowns show Select and Enumeration Mapping has no data');
      try {
        //all
        // expect(await appraisedvalueselectamDivDivPage.All_Select_in_header.textContent() || '').toContain(String("Select"));
        await Methods.verifySelectedOptionInMultipleDropdowns(appraisedvalueselectamDivDivPage.All_Select_in_header, undefined, 'contains', "Select");
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.getByText("No data Found").waitFor({ state: 'visible' });
        log.stepPass('Smart Mapper OFF verified: header dropdowns show Select and Enumeration Mapping shows No data Found');
      } catch (e) {
        await log.stepFail(page, 'Smart Mapper OFF verification failed');
        throw e;
      }

      log.step('Map Loan Purpose and verify Enumeration Mapping shows empty chase value');
      try {
        await correspondentPortalPage.Header_Mappingback_link.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await headerMappingPage.Loan_Purpose_chase_dropdown.selectOption({ label: "Loan Purpose" });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(enumerationMappingPage.Loan_Purpose_Chase_Dropdownenum).toHaveValue('');
        log.stepPass('Loan Purpose mapped and Enumeration Mapping chase value is empty as expected');
      } catch (e) {
        await log.stepFail(page, 'Failed to map Loan Purpose or verify Enumeration Mapping chase value');
        throw e;
      }

      log.step('Verify final match counts from Smart Mapper ON run');
      try {
        vars["PerfectMatchCount"] = vars["PerfectMatch"];
        vars["PartialMatchCount"] = vars["PartialMatch"];
        vars["UnmappedCount"] = vars["UnmappedCount"];
        vars["IncorrectMatchCount"] = vars["IncorrectMatch"];
        if (parseFloat(vars["PerfectMatchCount"]) >= 1) {
          log.info('At least one Perfect Match found — verification passed');
        } else if (parseFloat(vars["PartialMatchCount"]) >= 1) {
          log.info('At least one Partial Match found — verification passed');
        } else {
          Methods.verifyComparison(vars["IncorrectMatchCount"], '>=', '1');
        }
        log.stepPass('Final match count verification complete');
      } catch (e) {
        await log.stepFail(page, 'Final match count verification failed');
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