// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AmericanPacificPage } from '../../../src/pages/correspondant/american-pacific';
import { Amix4MosnaCovdaCheckboxPage } from '../../../src/pages/correspondant/amix4-mosna-covda-checkbox';
import { ClientAssociationPage } from '../../../src/pages/correspondant/client-association';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MappingListPage } from '../../../src/pages/correspondant/mapping-list';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import { SaveClientsButtonPage } from '../../../src/pages/correspondant/save-clients-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_808 } from '../../../src/helpers/prereqs/prereq-808';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let americanPacificPage: AmericanPacificPage;
  let amix4MosnaCovdaCheckboxPage: Amix4MosnaCovdaCheckboxPage;
  let clientAssociationPage: ClientAssociationPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let mappingListPage: MappingListPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;
  let saveClientsButtonPage: SaveClientsButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_808(page, vars);
    americanPacificPage = new AmericanPacificPage(page);
    amix4MosnaCovdaCheckboxPage = new Amix4MosnaCovdaCheckboxPage(page);
    clientAssociationPage = new ClientAssociationPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    mappingListPage = new MappingListPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
    saveClientsButtonPage = new SaveClientsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS22_TC01_Verify that user should be able to update the clients from the list screen for the required bid', async ({ page }) => {

    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Bid_Maps_name.hover();
    await clientAssociationPage.Client_Association.click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(vars["Create New Map"])).toBeVisible();
    await americanPacificPage.Select_First_Available_Company.check();
    await amix4MosnaCovdaCheckboxPage.Select_Second_Available_Company.check();
    await correspondentPortalPage.Backward_Arrow.click();
    vars["firstComany_from_client_acc"] = await correspondentPortalPage.FirstComapny_Client_Asscociation.textContent() || '';
    vars["secondComany_from_client_acc"] = await correspondentPortalPage.SecondComapny_Client_Asscociation.textContent() || '';
    vars["thirdComany_from_client_acc"] = await correspondentPortalPage.ThirdComapny_Client_Asscociation.textContent() || '';
    await saveClientsButtonPage.Save_Clients_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Bid_Maps_name.hover();
    await p24UnitDropdownPage.Company_Count.click();
    await expect(mappingListPage.Bid_Map_Name_New).toContainText(vars["Create New Map"]);
    vars["FirstCompanyName"] = await correspondentPortalPage.Selecting_Company_Name_in_Map_Name.textContent() || '';
    expect(String(vars["FirstCompanyName"])).toBe(vars["firstComany_from_client_acc"]);
    vars["SecondCompanyName"] = await p24UnitDropdownPage.Second_Company_Name.textContent() || '';
    expect(String(vars["SecondCompanyName"])).toBe(vars["secondComany_from_client_acc"]);
    vars["ThirdCompanyName"] = await p1MoreButtonPage.Third_Company_Name.textContent() || '';
    expect(String(vars["ThirdCompanyName"])).toBe(vars["thirdComany_from_client_acc"]);
  });
});
