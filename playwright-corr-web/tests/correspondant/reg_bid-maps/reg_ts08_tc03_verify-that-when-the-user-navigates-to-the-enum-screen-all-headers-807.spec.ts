// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { LoginPage } from '../../../src/pages/correspondant/login';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    loginPage = new LoginPage(page);
  });

  test('REG_TS08_TC03_Verify that when the user navigates to the enum screen, all headers of type enum are fetched, and if the uploaded file contains any values, then the corresponding matched records should ', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await stepGroups.stepGroup_Reading_files(page, vars);
    vars["names"] = vars["Total exl"];
    vars[""] = String('');
    while (parseFloat(String(vars["number"])) < parseFloat(String("5"))) {
      vars["Impound Type"] = await loginPage.Impound.inputValue() || '';
      expect(String(vars["names"])).toBe(vars["Impound Type"]);
      vars["number"] = (parseFloat(String("1")) + parseFloat(String(vars["number"]))).toFixed(0);
    }
  });
});
