// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { CorrespondentPortal16Page } from '../../../src/pages/correspondant/correspondent-portal-16';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let correspondentPortal16Page: CorrespondentPortal16Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let headerMappingPage: HeaderMappingPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidmapPage = new BidmapPage(page);
    correspondentPortal16Page = new CorrespondentPortal16Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
  });

  test('REG_TS08_TC04_CASE-1_ Fetch all the enum type values from header mapping and verify that it should be present in enumeration mapping.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_New_Map(page, vars);
    await headerMappingPage.File_Input.setInputFiles(path.resolve(__dirname, 'test-data', "Bid Maps File.xlsx"));
    await correspondentPortal16Page.File_Field.hover();
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.waitForLoadState('networkidle');
    await stepGroups.stepGroup_Fetching_the_data_based_on_Enum_value_in_Header_Mapping_and_(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
    if (true) /* Element Yes, Proceed Button is visible */ {
      await bidmapPage.Yes_Proceed_Button_Text.click();
    } else {
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verification_of_Chase_Enum_Values_From_Header_Mapping_To_Cha(page, vars);
    vars["Chase Enum Namescount2"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
    for (let dataIdx = -1; dataIdx <= parseInt(vars["Chase Enum Namescount2"]); dataIdx++) {
      await expect(statusInactivePage.Checking_both_chase_field_to_bid_sample_field_is_mapping).toBeVisible();
    }
  });
});
