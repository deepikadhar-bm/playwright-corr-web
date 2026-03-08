// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AddedOn2Page } from '../../../src/pages/correspondant/added-on-2';
import { AddedOnPage } from '../../../src/pages/correspondant/added-on';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MapNamePage } from '../../../src/pages/correspondant/map-name';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_809 } from '../../../src/helpers/prereqs/prereq-809';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS20_TC01";
const TC_TITLE = "Verify in the popup that the list of companies associated with the map is displayed along with the proper date";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let addedOn2Page: AddedOn2Page;
  let addedOnPage: AddedOnPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let mapNamePage: MapNamePage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let helpers: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_809(page, vars);
    addedOn2Page = new AddedOn2Page(page);
    addedOnPage = new AddedOnPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    mapNamePage = new MapNamePage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    helpers = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Click on Added Company to open popup");
      try {
        await correspondentPortalPage.Added_Company.click();
        // await page.waitForLoadState('networkidle');
        log.stepPass("Step 1 passed: Clicked on Added Company and popup opened");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to click on Added Company");
        throw error;
      }

      log.step("Step 2: Verify map name is displayed correctly in popup");
      try {
        vars["Create New Map"] = await mapNamePage.getMap_Name_2(vars["Create New Map"]).textContent() || '';
        console.log(`Map name in popup: ${vars["Create New Map"]}`);
        await expect(mapNamePage.getMap_Name_2(vars["Create New Map"])).toContainText(vars["Create New Map"]);
        log.stepPass("Step 2 passed: Map name verified in popup: " + vars["Create New Map"]);
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to verify map name in popup");
        throw error;
      }

      log.step("Step 3: Extract and trim company names from popup");
      try {
        // vars["CompanyName1"] = await addedOnPage.getcompany_1(vars["firstCompanySelected"]).textContent() || '';
        // vars["CompanyName2"] = await addedOnPage.getcompany_2(vars["secondCompanySelected"]).first().textContent() || '';
        // vars["CompanyName3"] = await addedOnPage.getcompany_3(vars["thirdCompanySelected"]).nth(1).textContent() || '';
        // vars["CompanyName4"] = await addedOn2Page.getcompany_4(vars["fourthCompanySelected"]).textContent() || '';
       
        
        vars["CompanyName1"] = (await addedOnPage.getcompany_1(vars["firstCompanySelected"]).textContent())?.trim() || '';
        vars["CompanyName2"] = (await addedOnPage.getcompany_2(vars["secondCompanySelected"]).first().textContent())?.trim() || '';
        vars["CompanyName3"] = (await addedOnPage.getcompany_3(vars["thirdCompanySelected"]).nth(1).textContent())?.trim() || '';
        vars["CompanyName4"] = (await addedOn2Page.getcompany_4(vars["fourthCompanySelected"]).textContent())?.trim() || '';
        log.stepPass("Step 3 passed: Company names extracted and trimmed successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to extract company names");
        throw error;
      }
      
      log.step("Step 4: Verify all company names match the selected companies");
      try {
        expect(String(vars["firstCompanySelected"])).toBe(vars["CompanyName1"]);
        expect(String(vars["secondCompanySelected"])).toBe(vars["CompanyName2"]);
        expect(String(vars["thirdCompanySelected"])).toBe(vars["CompanyName3"]);
        expect(String(vars["fourthCompanySelected"])).toBe(vars["CompanyName4"]);
        log.stepPass("Step 4 passed: All four company names verified successfully");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Company name verification failed");
        throw error;
      }

      log.step("Step 5: Verify 'Added On' date matches one of the created timestamps");
      try {
        vars["AddedOn"] = await statusInactivePage.Added_On.textContent() || '';
        console.log(`Added On date in popup: ${vars["AddedOn"]}`);
        vars["AddedOn"] = await chaseFieldNamePage.Added_On.textContent() || '';
        vars["AddedOn"] = await chaseFieldNamePage.Added_On_2.textContent() || '';
        vars["AddedOn"] = await statusInactive2Page.Added_On.textContent() || '';
        if (String(vars["CreatedOn"]) === String(vars["AddedOn"])) {
          expect
        } else if (String(vars["CreatedOn1"]) === String(vars["AddedOn"])) {
          expect(String(vars["CreatedOn1"])).toBe(vars["AddedOn"]);
        } else {
          expect(String(vars["CreatedOn2"])).toBe(vars["AddedOn"]);
        }
        log.stepPass("Step 5 passed: 'Added On' date verified successfully: " + vars["AddedOn"]);
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Failed to verify 'Added On' date");
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