// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headerMappingPage: HeaderMappingPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidmapPage = new BidmapPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headerMappingPage = new HeaderMappingPage(page);
  });

  test('REG_TS10_TC02_Verify From header mapping screen store the values which is of type enum[store both bid sample and chase field name values\\\"} Now in the enum header mapping screen verify that the stored', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await stepGroups.stepGroup_Storing_All_Enum_TDP_Values_into_a_Variable(page, vars);
    vars["count"] = "1";
    vars["MappedChaseFieldCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
    await stepGroups.stepGroup_Fetching_Mapped_Enum_Values_From_Header_Mapping_and_Verifyin(page, vars);
    await correspondentPortalPage.Enumeration_Mapping_Button1.click();
    if (true) /* Element Yes Proceed Button is visible */ {
      await bidmapPage.Yes_Proceed_Button_Text.click();
    }
    await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
  });
});
