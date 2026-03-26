// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_794 } from '../../../src/helpers/prereqs/prereq-794';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = "REG_TS04_TC03";
const TC_TITLE = "Verify that the user is able to perform all Delete operations in the header mapping.";

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headerMappingPage: HeaderMappingPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_794(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Prepare delete data from Header Mapping after prereq");
      try {
        vars["DeleteHeaderMapping"] = (await headerMappingPage.Deleting_Header.textContent()) || '';
        log.stepPass("Step 1 passed: Header mapping to delete identified.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to read header mapping to delete.");
        throw error;
      }

      log.step("Step 2: Open delete dialog and verify confirmation message");
      try {
        await correspondentPortalPage.Delete_icon.click();
        await expect(correspondentPortalPage.Delete).toBeVisible();
        vars["BidSampleFieldName"] =(await statusInactivePage.getDelete_Message(vars["DeleteHeaderMapping"]).textContent()) || '';
        await expect(page.getByText(vars["BidSampleFieldName"])).toBeVisible();
        log.stepPass("Step 2 passed: Delete dialog opened and confirmation message verified.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to open delete dialog or verify confirmation message.");
        throw error;
      }

      log.step("Step 3: Confirm delete and verify header mapping delete state");
      try {
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await expect(
          statusInactive2Page.get_Error_Message_in_Header_Mapping(vars["DeleteHeaderMapping"])
        ).not.toBeVisible();
        await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
        log.stepPass("Step 3 passed: Delete confirmed and header mapping delete state verified.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to confirm delete or verify header mapping delete state.");
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
