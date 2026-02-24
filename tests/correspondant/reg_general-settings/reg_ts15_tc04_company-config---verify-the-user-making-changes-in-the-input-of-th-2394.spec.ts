// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CompanyConfigPage } from '../../../src/pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let companyConfigPage: CompanyConfigPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headerMappingPage: HeaderMappingPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidmapPage = new BidmapPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    companyConfigPage = new CompanyConfigPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS15_TC04_Company Config - Verify the User making changes in the input of the Name, and Check whether it is get Reflected in the other Modules or Not. => Bid Maps., Commitment Timer.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Company_ConfigGenral_settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CompanyNameBeforeEdit"] = await companyConfigPage.Company_Name_InputCompany_Config.inputValue() || '';
    await companyConfigPage.Company_Name_InputCompany_Config.fill(String("Chase_Testing"));
    vars[""] = String("Chase_Testing") + ' ' + String("Field Name");
    await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await okButtonPage.Ok_Button.click();
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidmapPage.First_Bid_Map_Name.click();
    await headerMappingPage.Header_Mapping.waitFor({ state: 'visible' });
    await headerMappingPage.Header_Mapping.click();
    vars["ChaseFieldNameAfterEdit"] = await chaseFieldNamePage.Chase_Field_NameMapping_Creation.textContent() || '';
    expect(String(vars["ExpectedChaseFieldName"])).toBe(vars["ChaseFieldNameAfterEdit"]);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Company_ConfigGenral_settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await companyConfigPage.Company_Name_InputCompany_Config.fill(String(vars["CompanyNameBeforeEdit"]));
    await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Settings.click();
    await page.getByText("Company config updated successfully!").waitFor({ state: 'visible' });
    await okButtonPage.Ok_Button.click();
  });
});
