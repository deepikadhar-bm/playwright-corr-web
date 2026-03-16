// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  test('2160_2b57d892c7574f508c1e7db945db5573_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      if (true) /* Verify that the element Batch Processing Time Buffer Input d */ {
      } else {
        await correspondentPortalPage.Batch_Processing_Time_Buffer_Input.fill(String(vars["BufferTimeBefore"]));
      }
      await page.waitForLoadState('networkidle');
      if (true) /* Element Save Buffer(Bulk Batches) is enabled */ {
        await correspondentPortalPage.Save_BufferBulk_Batches.click();
      }
    }
  });
});
