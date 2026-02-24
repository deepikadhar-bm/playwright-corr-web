// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { BidMapsPage } from '../../../src/pages/correspondant/bid-maps';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { EnumertionPage } from '../../../src/pages/correspondant/enumertion';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let bidMapsPage: BidMapsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let enumertionPage: EnumertionPage;
  let headerMappingPage: HeaderMappingPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    bidMapsPage = new BidMapsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    enumertionPage = new EnumertionPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS13_TC02_ Enumeration Mapping _Verify that when the user performs the save draft action on each screen, a draft version is saved.1', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
    await stepGroups.stepGroup_Adding_Field_In_Enumeration_Mapping(page, vars);
    vars["NewFieldChaseValue"] = await enumerationMappingPage.Added_Chase_Value_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    await stepGroups.stepGroup_Editing_In_Enumeration_Mapping_Screen(page, vars);
    await stepGroups.stepGroup_Delete_In_Enumeration_Mapping(page, vars);
    await headerMappingPage.First_Header_Checkbox.check();
    await expect(headerMappingPage.First_Header_Checkbox).toBeVisible();
    vars["FirstBidSampleName"] = await enumerationMappingPage.First_Bid_Sample_Name_In_Enumeration.textContent() || '';
    await actionruleheaderPage.Second_Header_Checkbox.check();
    await expect(actionruleheaderPage.Second_Header_Checkbox).toBeVisible();
    vars["SecondBidSampleName"] = await enumerationMappingPage.Second_Bid_Sample_Name_In_Enumeration.textContent() || '';
    await correspondentPortalPage.Save_Draft_Button1.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["NewFieldChaseValueAfterSaveDraftExit"] = await correspondentPortalPage.New_Field_Chase_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    expect(String(vars["NewFieldChaseValue"])).toBe(vars["NewFieldChaseValueAfterSaveDraftExit"]);
    await expect(bidMapsPage.Edited_Chase_Value_After_Save_new).toHaveValue(vars["EditedChaseValue"]);
    await expect(enumerationMappingPage.Deleted_Field_In_Enumeration).toBeVisible();
    await expect(enumertionPage.Bid_Sample_Name_1).toBeVisible();
    await expect(enumerationMappingPage.Bid_Sample_Name_2).toBeVisible();
    await enumertionPage.Bid_Sample_Name_1.uncheck();
    await expect(enumertionPage.Bid_Sample_Name_1).toBeVisible();
    await correspondentPortalPage.Save_Draft_Button1.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(enumertionPage.Bid_Sample_Name_1).toBeVisible();
    await expect(enumerationMappingPage.Bid_Sample_Name_2).toBeVisible();
  });
});
