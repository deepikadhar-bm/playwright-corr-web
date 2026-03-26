// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortal4Page } from '../../../src/pages/correspondant/correspondent-portal-4';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { NameCantBeEmptyPage } from '../../../src/pages/correspondant/name-cant-be-empty';
import { P1morePage } from '../../../src/pages/correspondant/p-1more';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { YouHaveSelectedToDeleteMappingDoYouWantPage } from '../../../src/pages/correspondant/you-have-selected-to-delete-mapping-do-you-want';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortal4Page: CorrespondentPortal4Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let nameCantBeEmptyPage: NameCantBeEmptyPage;
  let p1morePage: P1morePage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let youHaveSelectedToDeleteMappingDoYouWantPage: YouHaveSelectedToDeleteMappingDoYouWantPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortal4Page = new CorrespondentPortal4Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    nameCantBeEmptyPage = new NameCantBeEmptyPage(page);
    p1morePage = new P1morePage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    youHaveSelectedToDeleteMappingDoYouWantPage = new YouHaveSelectedToDeleteMappingDoYouWantPage(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test('REG_TS02_TC09_Click on \\\"Add New Header\\\" it will give a pop up.Verify Bid Sample Field Name cannot be blank. It should display error message.Verify add row functionality.Upon Edit.Verify CLM Field Na', async ({ page }) => {
    if (profile && profile.data) {
      // const customHeader = profile.data[0]['Custom Header'];
      const chaseFieldName = profile.data[0]['Chase Field Name']
      const customHeader = profile.data[0]["Custom Header"]
      const bidFields = profile.data[0]["BidFields"]
      const chaseFieldNames = profile.data[0]['ChaseFieldNames']
      // vars["Custom Header"] = customHeader;
      vars["Chase Field Name"] = chaseFieldName;
      vars['Custom Header'] = customHeader;
      vars['BidFields'] = bidFields;
      vars['ChaseFieldNames'] = chaseFieldNames;
      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;
    }

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars,"DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx");
    await expect(correspondentPortalPage.Add_New_Header_Button).toBeVisible();
    await correspondentPortalPage.Add_New_Header_Button.click();
    await expect(correspondentPortalPage.Insert_Header_Button).toBeVisible();
    await expect(correspondentPortal4Page.Custom_Header).toHaveValue('');
    await correspondentPortalPage.Insert_Header_Button.click();
    await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();
    await expect(correspondentPortalPage.Add_Row).toBeVisible();
    // await expect(correspondentPortalPage.Chase_Field_Name.locator('option', { hasText: vars["Chase Field Name"] })).toBeVisible();
    await correspondentPortalPage.Custom_Header_Field.pressSequentially(vars["Custom Header"]);
    await correspondentPortalPage.Chase_Field_Name.selectOption({ label: vars["Chase Field Name"] });
    await correspondentPortalPage.Add_Row.click();
    await expect(correspondentPortalPage.Add_Row_Field).toBeVisible();
    await expect(correspondentPortalPage.SelectAmortizationType_a_div).toBeVisible();
    await correspondentPortalPage.SelectAmortizationType_a_div.click();
    await expect(youHaveSelectedToDeleteMappingDoYouWantPage.You_have_selected_to_delete_mapping_Do_you_want).toBeVisible();
    await expect(correspondentPortalPage.Cross_Button_in_Header_Mapping).toBeVisible();
    await correspondentPortalPage.Cross_Button_in_Header_Mapping.click();
    await expect(correspondentPortalPage.Cross_Button_in_Header_Mapping).not.toBeVisible();
    await correspondentPortalPage.SelectAmortizationType_a_div.click();
    await expect(youHaveSelectedToDeleteMappingDoYouWantPage.You_have_selected_to_delete_mapping_Do_you_want).toBeVisible();
    await expect(correspondentPortal18Page.Yes_Proceed_Button).toBeVisible();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await expect(correspondentPortalPage.Added_CLM_Field).not.toBeVisible();
    await expect(correspondentPortalPage.Insert_Header_Button).toBeVisible();
    await correspondentPortalPage.Insert_Header_Button.click();
    vars["RGB_Yellow_Color"] = "rgba(255, 245, 192, 1)";
    // vars[""] = await correspondentPortalPage.Inserted_Header_Data.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor); //actual
    // vars["InsertedHeaderColor"] = await correspondentPortalPage.Inserted_Header_Data.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);
    vars["InsertedHeaderColor"] = await correspondentPortalPage.get_Inserted_Header_Data(vars["Custom Header"]).evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(String(vars["RGB_Yellow_Color"])).toContain(vars["InsertedHeaderColor"]);
    // expect(vars["InsertedHeaderColor"]).toBe("rgba(255, 245, 192, 1)");
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["Custom Header"])).toBeVisible();
    await expect(correspondentPortalPage.Inserted_Data_ChaseField_Name).toContainText(vars["Chase Field Name"]);
    await correspondentPortalPage.Edit_Button.click();
    await correspondentPortalPage.Chase_Field_Name.selectOption({ label: vars["ChaseFieldNames"] });
    await correspondentPortalPage.Chase_Field_Name.selectOption({ label: vars["BidFields"] });
    await expect(page.getByText(vars["BidFields"])).toBeVisible();
    await correspondentPortalPage.Update_Header_Button.click();
    await expect(statusInactivePage.Updated_Bid_Sample_Field_Name).toContainText(vars["BidFields"]);
    await expect(statusInactivePage.Updated_Bid_Sample_Field_Name).toBeVisible();
    await correspondentPortalPage.Editting_Chase_Field_Name.click();
    vars["Chase Field name"] = await p1morePage.Chase_Field_name_in_header_Mapping.textContent() || '';
    await correspondentPortalPage.Editting_Chase_Field_Name.selectOption({ index: parseInt(appconstants.THREE) });
    await expect(correspondentPortalPage.Editting_Chase_Field_Name).toBeVisible();
    await expect(p1morePage.Chase_Field_name_in_header_Mapping).toContainText(vars["Chase Field name"]);
  });
});
