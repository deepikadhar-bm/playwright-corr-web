// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AmortizationTypePage } from '../../../src/pages/correspondant/amortization-type';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let amortizationTypePage: AmortizationTypePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    amortizationTypePage = new AmortizationTypePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
  });

  test('REG_TS02_TC04_ Click on Select all, All the Field should be selected.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await expect(correspondentPortalPage.Select_All_Checkbox).toBeEnabled();
    await correspondentPortalPage.Select_All_Checkbox.check();
    vars["BidSampleFieldCount"] = String(await p24UnitDropdownPage.Bid_Sample_Field_Name_in_Header_Mapping.count());
    vars["Count"] = "2";
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["BidSampleFieldCount"]))) {
      await expect(amortizationTypePage.All_Header_Checkbox_In_Bid_Map).toBeVisible();
      vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
    }
  });
});
