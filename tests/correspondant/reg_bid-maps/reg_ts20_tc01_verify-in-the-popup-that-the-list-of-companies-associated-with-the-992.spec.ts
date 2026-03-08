// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
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

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let addedOn2Page: AddedOn2Page;
  let addedOnPage: AddedOnPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let mapNamePage: MapNamePage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;

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
  });

  test('REG_TS20_TC01_Verify in the popup that the list of companies associated with the map is displayed along with the proper date.', async ({ page }) => {

    await correspondentPortalPage.Added_Company.click();
    // await page.waitForLoadState('networkidle');
    vars["Create New Map"] = await mapNamePage.getMap_Name_2(vars["Create New Map"]).textContent() || '';
    console.log(`Map name in popup: ${vars["Create New Map"]}`);
    await expect(mapNamePage.getMap_Name_2(vars["Create New Map"])).toContainText(vars["Create New Map"]);
    // vars["CompanyName1"] = await addedOnPage.getcompany_1(vars["firstCompanySelected"]).textContent() || '';
    // vars["CompanyName2"] = await addedOnPage.getcompany_2(vars["secondCompanySelected"]).first().textContent() || '';
    // vars["CompanyName3"] = await addedOnPage.getcompany_3(vars["thirdCompanySelected"]).nth(1).textContent() || '';
    // vars["CompanyName4"] = await addedOn2Page.getcompany_4(vars["fourthCompanySelected"]).textContent() || '';
   
    
    vars["CompanyName1"] = (await addedOnPage.getcompany_1(vars["firstCompanySelected"]).textContent())?.trim() || '';
    vars["CompanyName2"] = (await addedOnPage.getcompany_2(vars["secondCompanySelected"]).first().textContent())?.trim() || '';
    vars["CompanyName3"] = (await addedOnPage.getcompany_3(vars["thirdCompanySelected"]).nth(1).textContent())?.trim() || '';
    vars["CompanyName4"] = (await addedOn2Page.getcompany_4(vars["fourthCompanySelected"]).textContent())?.trim() || '';

    

    
    expect(String(vars["firstCompanySelected"])).toBe(vars["CompanyName1"]);
    expect(String(vars["secondCompanySelected"])).toBe(vars["CompanyName2"]);
    expect(String(vars["thirdCompanySelected"])).toBe(vars["CompanyName3"]);
    expect(String(vars["fourthCompanySelected"])).toBe(vars["CompanyName4"]);

    vars["AddedOn"] = await statusInactivePage.Added_On.textContent() || '';
    vars["AddedOn"] = await chaseFieldNamePage.Added_On.textContent() || '';
    vars["AddedOn"] = await chaseFieldNamePage.Added_On_2.textContent() || '';
    vars["AddedOn"] = await statusInactive2Page.Added_On.textContent() || '';
    if (String(vars["CreatedOn"]) === String(vars["AddedOn"])) {
    } else if (String(vars["CreatedOn1"]) === String(vars["AddedOn"])) {
    } else {
      expect(String(vars["CreatedOn2"])).toBe(vars["AddedOn"]);
    }
  });
});
