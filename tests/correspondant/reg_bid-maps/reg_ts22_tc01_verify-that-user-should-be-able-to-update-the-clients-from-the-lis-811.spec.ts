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
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = "REG_TS22_TC01";
const TC_TITLE = "Verify that user should be able to update the clients from the list screen for the required bid"

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
  const credentials = ENV.getCredentials('internal');

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

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step("Step 1: Navigate to Client Association and select companies");
      try {
        // await correspondentPortalPage.Bid_Maps_name.hover();
        await clientAssociationPage.Client_Association.click();
        await expect(page.getByText(vars["CreateNewMap"]).first()).toBeVisible();
        await americanPacificPage.Select_First_Available_Company.check();
        await amix4MosnaCovdaCheckboxPage.Select_Second_Available_Company.check();
        await correspondentPortalPage.Backward_Arrow.click();
        vars["firstComany_from_client_acc"] = await correspondentPortalPage.FirstComapny_Client_Asscociation.textContent() || '';
        vars["secondComany_from_client_acc"] = await correspondentPortalPage.SecondComapny_Client_Asscociation.textContent() || '';
        vars["thirdComany_from_client_acc"] = await correspondentPortalPage.ThirdComapny_Client_Asscociation.textContent() || '';
        log.info(`First Company: ${vars["firstComany_from_client_acc"]}`);
        log.info(`Second Company: ${vars["secondComany_from_client_acc"]}`);
        log.info(`Third Company: ${vars["thirdComany_from_client_acc"]}`);
        log.stepPass("Step 1 passed");
      } catch (error) {
        log.stepFail(page, "Step 1 failed");
        throw error;
      }

      log.step("Step 2: Save clients and validate in list screen");
      try {
        await saveClientsButtonPage.Save_Clients_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // await correspondentPortalPage.Bid_Maps_name.hover();
        await p24UnitDropdownPage.Company_Count.click();
        // await expect(mappingListPage.getBid_Map_Name_New(vars["CreateNewMap"])).toContainText(vars["CreateNewMap"]);
        vars["FirstCompanyName"] = await correspondentPortalPage.Selecting_Company_Name_in_Map_Name.textContent() || '';
        log.info(`FirstCompanyName: ${vars["FirstCompanyName"]}`);
        expect(String(vars["FirstCompanyName"])).toContain(vars["firstComany_from_client_acc"]);
        vars["SecondCompanyName"] = await p24UnitDropdownPage.Second_Company_Name.textContent() || '';
        log.info(`SecondCompanyName: ${vars["SecondCompanyName"]}`);
        expect(String(vars["SecondCompanyName"])).toContain(vars["secondComany_from_client_acc"]);
        vars["ThirdCompanyName"] = await p1MoreButtonPage.Third_Company_Name.textContent() || '';
        log.info(`ThirdCompanyName: ${vars["ThirdCompanyName"]}`);
        expect(String(vars["ThirdCompanyName"])).toContain(vars["thirdComany_from_client_acc"]);
        log.stepPass("Step 2 passed");
      } catch (error) {
        log.stepFail(page, "Step 2 failed");
        throw error;
      }

      log.tcEnd('PASS');
    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});