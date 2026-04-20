import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { LoginPage } from '../../../src/pages/correspondant/login';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { ENV } from '@config/environments';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let loginPage: LoginPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    loginPage = new LoginPage(page);
    vars["filePath"] = path.resolve(__dirname, '../../../uploads', fileconstants.BID_QA_FILE_COMMON);
  });
  test.only('REG_TS08_TC03_Verify that when the user navigates to the enum screen, all headers of type enum are fetched, and if the uploaded file contains any values, then the corresponding matched records should ', async ({ page }) => {

    // if (profile && profile.data) {
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileconstants.BID_QA_FILE_COMMON);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    // await stepGroups.stepGroup_Reading_files(page, vars);
    vars["Total exl"] = await excelHelper.readEntireColumnByColIndex(vars["filePath"], appconstants.THREE);
    log.info('Total excel column data captured');
    log.info(vars["names"]);
    log.info(vars["Total exl"]);
    vars["names"] = vars["Total exl"];
    log.info(vars["names"]);
    vars[""] = String('');
    vars["number"] = String('1');

    console.log('number value before loop: ' + vars["number"]);
    const namesArray = String(vars["names"])
      .split(',')
      .map(val => val.trim())
      .filter(val => val !== "Impound Type" && val !== "");

    console.log(`Total records to verify: ${namesArray.length}`);
 for (let i = 0; i < namesArray.length; i++) {
  const expectedName = namesArray[i];

  // Find the container that specifically contains the label "Impound Type"
  
  const impoundSection = page.locator('div').filter({ hasText: /^Impound Type$/ }).first();

  // Locate the specific value within that section subtree
  
  const targetValue = impoundSection.getByText(expectedName, { exact: true });

  console.log(`Checking: Expecting "${expectedName}" within Impound Type section`);

  //  Verify visibility and text
 
  await expect(targetValue).toBeVisible({ timeout: 15000 });
  
  // Use a regex to allow for potential leading/trailing whitespace in the DOM
  await expect(targetValue).toHaveText(new RegExp(`^\\s*${expectedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`));

  vars["Impound Type"] = expectedName;
  log.info(`Verified: ${expectedName}`);



    // while (parseFloat(String(vars["number"])) < parseFloat(String("5"))) {
    //   console.log('Entered while loop');
    //   console.log('Current number value: ' + vars["number"]);
    //   console.log('Current names value: ' + vars["names"]);
    //   console.log('Current Impound Type value: ' + vars["Impound Type"]);
    //   vars["Impound Type"] = await loginPage.Impound(vars["number"]).innerText() || '';
    //   expect(String(vars["names"])).toBe(vars["Impound Type"]);
    //   log.info(vars["names"]);
    //   log.info(vars["Impound Type"]);  
    //   vars["number"] = (parseFloat(String("1")) + parseFloat(String(vars["number"]))).toFixed(0);
    // }
    }
  });
});
