// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('1688_f37362810bf04ec596daaff48073b789_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await priceOfferedPage.Other_Config.click();
      // [DISABLED] Store text from the element Commit Creation Cut Off into a variable CommitCreationTimeBefore
      // vars["CommitCreationTimeBefore"] = await priceOfferedPage.Commit_Creation_Cut_Off.textContent() || '';
      // [DISABLED] Store text from the element Commit Creation Time Standard into a variable CommitCreationTimeStandard
      // vars["CommitCreationTimeStandard"] = await correspondentPortalPage.Dropdown_selection_2.textContent() || '';
      vars["vars[CommitCreationTimeBefore]"] = await priceOfferedPage.Commit_Creation_Cut_Off.inputValue() || '';
      vars["CommitCreationTimeStandard"] = await correspondentPortalPage.Dropdown_selection_2.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
      await priceOfferedPage.Commit_Creation_Cut_Off.clear();
      await priceOfferedPage.Commit_Creation_Cut_Off.fill(vars["CommitCreationTimeBefore"]);
      await correspondentPortalPage.Dropdown_selection_2.click();
      await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: vars["CommitCreationTimeStandard"] });
      await bidRequestConfigPage.Save_Changes_Button.click();
    }
  });
});
