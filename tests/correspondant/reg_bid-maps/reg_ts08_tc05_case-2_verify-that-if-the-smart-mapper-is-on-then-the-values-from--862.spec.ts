// [POM-APPLIED]
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
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import * as excelHelper from '../../../src/helpers/excel-helpers';

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
  let p24UnitDropdownPage: P24UnitDropdownPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
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
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
  });

  test('REG_TS08_TC05_CASE-2_Verify that if the smart mapper is on, then the values from the file should be fetched and auto mapped. if smart mapper is off then the auto map should not work.', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await stepGroups.stepGroup_Storing_All_Enum_TDP_Values_into_a_Variable(page, vars);
    // [DISABLED] Store the count of elements identified by locator Bid_Sample_Field_Name_in_Header_Mapping into a variable BidSampleFieldInHeader
    // vars["BidSampleFieldInHeader"] = String(await p24UnitDropdownPage.Bid_Sample_Field_Name_in_Header_Mapping.count());
    // [DISABLED] Store 1 in count
    // vars["count"] = "1";
    // [DISABLED] Store 0 in MappedHeaderCount
    // vars["MappedHeaderCount"] = "0";
    // [DISABLED] Store 0 in UnMappedHeaderCount
    // vars["UnMappedHeaderCount"] = "0";
    // [DISABLED] Store the count of elements identified by locator MappedChaseFieldName into a variable MappedFieldsCount
    // vars["MappedFieldsCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
    while (true) /* Verify if count <= MappedFieldsCount */ {
      // [DISABLED] Store the text of the selected option from Chase Field Name Drowpdown list into a variable MappedDataValue
      // vars["MappedDataValue"] = await correspondentPortalPage.Chase_Field_Name_Drowpdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
      // [DISABLED] Mouseover the element Chase Field Name Dropdown.
      // await dropdownSelectAmortizationTypeAppraisedValueAttPage.Chase_Field_Name_Dropdown.hover();
      if (true) /* Verify if MappedDataValue == Select */ {
        // [DISABLED] Perform addition on 1 and UnMappedHeaderCount and store the result inside a UnMappedHeaderCount considering 0 decimal places
        // vars["UnMappedHeaderCount"] = (parseFloat(String("1")) + parseFloat(String(vars["UnMappedHeaderCount"]))).toFixed(0);
      } else {
        if (true) /* Verify if Chase Fields Name contains MappedDataValue */ {
        }
        // [DISABLED] Perform addition on 1 and MappedHeaderCount and store the result inside a MappedHeaderCount considering 0 decimal places
        // vars["MappedHeaderCount"] = (parseFloat(String("1")) + parseFloat(String(vars["MappedHeaderCount"]))).toFixed(0);
      }
      // [DISABLED] Perform addition on 1 and count and store the result inside a count considering 0 decimal places
      // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Fetching Enum from Header Mapping and verifying them at Enumeration Mapping 
    // await stepGroups.stepGroup_Fetching_Enum_from_Header_Mapping_and_verifying_them_at_Enum(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Rename_File(page, vars);
    vars["ColumnCount"] = String(excelHelper.getColumnCount("BidmapsAugQA.xlsx,BidmapsAugBidQA.xlsx", "0"));
    vars["PerfectMatch"] = "0";
    vars["PartialMatch"] = "0";
    vars["IncorrectMatch"] = "0";
    vars["UnmappedCount"] = "0";
    vars["ColumnNum"] = "0";
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ColumnCount"]))) {
      await enumerationMappingPage.First_Checkbox_Enum.check();
      await enumerationMappingPage.First_Checkbox_Enum.uncheck();
      vars["ColumnHeader"] = excelHelper.readCell(vars['_lastDownloadPath'] || '', "0", vars["ColumnNum"], "0");
      if (true) /* Element Bid sample from file to UI is visible */ {
        vars["ChaseFieldUI"] = await enumerationMappingPage.Chase_Field_Of_BidSample.textContent() || '';
        if (String(vars["EnumValues"]).includes(String(vars["ChaseFieldUI"]))) {
          vars["UniqueBidTapeValuesFromExcel"] = excelHelper.readColumn(vars['_lastDownloadPath'] || '', vars["ColumnNum"], "1");
          vars["FirstValue"] = String(vars["UniqueBidTapeValuesFromExcel"]).split(",")["1"] || '';
          vars["UniqueBidTapeValuesFromExcel"] = String(vars["UniqueBidTapeValuesFromExcel"]).split("FirstValue")["2"] || '';
          vars["BidTapeCountUI"] = String(await enumerationMappingPage.BidTapeFieldCountForBidField.count());
          if (String(vars["BidTapeCountUI"]) > String("1")) {
            vars["count1"] = "1";
            while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["BidTapeCountUI"]))) {
              vars["IndividualBidTapeValueFromUI"] = await enumerationMappingPage.IndividualBidTapeValue.textContent() || '';
              expect(String(vars["UniqueBidTapeValuesFromExcel"])).toBe(vars["IndividualBidTapeValueFromUI"]);
              if (true) /* Element Unmapped Chase Value 1 is not visible */ {
                vars["IndividualChaseValueUI"] = await enumerationMappingPage.IndividualChaseValueUI.textContent() || '';
                if (String(vars["IndividualChaseValueUI"]).includes(String("Select"))) {
                  vars["IndividualChaseValueUI"] = await enumerationMappingPage.IndividualChaseValueUI.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
                }
              }
              if (true) /* Element Unmapped Chase Value 1 is visible */ {
                vars["UnmappedCount"] = (parseFloat(String("1")) + parseFloat(String(vars["UnmappedCount"]))).toFixed(0);
              } else if (String("N , False , FALSE , false").includes(String(vars["IndividualBidTapeValueFromUI"]))) {
                if (String("N , False , FALSE , false").includes(String(vars["IndividualChaseValueUI"]))) {
                  vars["PerfectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PerfectMatch"]))).toFixed(0);
                } else {
                  vars["IncorrectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["IncorrectMatch"]))).toFixed(0);
                }
              } else if (String("Y , True , true , TRUE").includes(String(vars["IndividualBidTapeValueFromUI"]))) {
                if (String("Y , True , true , TRUE").includes(String(vars["IndividualChaseValueUI"]))) {
                  vars["PerfectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PerfectMatch"]))).toFixed(0);
                } else {
                  vars["IncorrectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["IncorrectMatch"]))).toFixed(0);
                }
              } else if (String(vars["IndividualChaseValueUI"]) === String(vars["IndividualBidTapeValueFromUI"])) {
                vars["PerfectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PerfectMatch"]))).toFixed(0);
              } else if (String(vars["IndividualChaseValueUI"]).includes(String(vars["IndividualBidTapeValueFromUI"]))) {
                vars["PartialMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PartialMatch"]))).toFixed(0);
              } else if (String(vars["IndividualBidTapeValueFromUI"]).includes(String(vars["IndividualChaseValueUI"]))) {
                vars["PartialMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PartialMatch"]))).toFixed(0);
              } else {
                vars["IncorrectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["IncorrectMatch"]))).toFixed(0);
              }
              vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
            }
          } else {
            vars["BidTapeValueUI"] = await bidrequestPage.BidTapeValueUI.textContent() || '';
            expect(String(vars["UniqueBidTapeValuesFromExcel"])).toBe(vars["BidTapeValueUI"]);
            if (true) /* Element Unmapped Chase Value is not visible */ {
              vars["ChaseValueUI"] = await enumerationMappingPage.CorrespondentChaseValueUI.textContent() || '';
              if (String(vars["ChaseValueUI"]).includes(String("Select"))) {
                vars["ChaseValueUI"] = await enumerationMappingPage.CorrespondentChaseValueUI.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
              }
            }
            await stepGroups.stepGroup_Getting_PerfectPartialIncorrectUnmapped_Count_From_Enum_Mapp(page, vars);
            if (true) /* Verify if ChaseValueUI == BidTapeValueUI */ {
              // [DISABLED] Perform addition on 1 and PerfectMatch and store the result inside a PerfectMatch considering 0 decimal places
              // vars["PerfectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PerfectMatch"]))).toFixed(0);
            } else if (true) /* Verify if ChaseValueUI contains BidTapeValueUI */ {
              // [DISABLED] Perform addition on 1 and PartialMatch and store the result inside a PartialMatch considering 0 decimal places
              // vars["PartialMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PartialMatch"]))).toFixed(0);
            } else if (true) /* Element Unmapped Chase Value is visible */ {
              // [DISABLED] Perform addition on 1 and UnmappedCount and store the result inside a UnmappedCount considering 0 decimal places
              // vars["UnmappedCount"] = (parseFloat(String("1")) + parseFloat(String(vars["UnmappedCount"]))).toFixed(0);
            } else {
              // [DISABLED] Perform addition on 1 and IncorrectMatch and store the result inside a IncorrectMatch considering 0 decimal places
              // vars["IncorrectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["IncorrectMatch"]))).toFixed(0);
            }
          }
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      vars["ColumnNum"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnNum"]))).toFixed(0);
    }
    await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Smart_Mapper_from_On_to_Off(page, vars);
    await stepGroups.stepGroup_Navigation_to_Customer_Permission(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Add_New_Mapping_Button.click();
    await page.waitForLoadState('networkidle');
    await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
    vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: dd/MM/yyyy/HH:mm:ss */;
    vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
    await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
    await correspondentPortalPage.Create_Button.click();
    await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["Create New Map"])).toBeVisible();
    await newMapPage.New_Map.click();
    await correspondentPortalPage.Select_Companys_Dropdown.click();
    await statusInactivePage.Second_Selected_Company_Checkbox.click();
    await correspondentPortalPage.Apply_Selected.click();
    await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid Maps File.xlsx"));
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    expect(await appraisedvalueselectamDivDivPage.All_Select_in_header.textContent() || '').toContain(String("Select"));
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.getByText("No data Found").waitFor({ state: 'visible' });
    await correspondentPortalPage.Header_Mappingback_link.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await headerMappingPage.Loan_Purpose_chase_dropdown.selectOption({ label: "Loan Purpose" });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(enumerationMappingPage.Loan_Purpose_Chase_Dropdownenum).toHaveValue('');
    vars["PerfectMatchCount"] = vars["PerfectMatch"];
    vars["PartialMatchCount"] = vars["PartialMatch"];
    vars["UnmappedCount"] = vars["UnmappedCount"];
    vars["IncorrectMatchCount"] = vars["IncorrectMatch"];
    if (String(vars["PerfectMatchCount"]) >= String("1")) {
    } else if (String(vars["PartialMatchCount"]) >= String("1")) {
    } else {
      expect(String(vars["IncorrectMatchCount"])).toBe("1");
    }
  });
});
