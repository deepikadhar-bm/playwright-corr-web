import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { BidMapPage } from '../../../src/pages/correspondant/bid-map';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeleteIdPage } from '../../../src/pages/correspondant/delete-id';
import { MappingListPage } from '../../../src/pages/correspondant/mapping-list';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS31_TC01';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of bid map name, column hea';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let bidMapPage: BidMapPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deleteIdPage: DeleteIdPage;
  let mappingListPage: MappingListPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;
  let REG_TS31_TC01testFailed = false;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'Search Functionality BidMaps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidmapPage = new BidmapPage(page);
    bidMapPage = new BidMapPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deleteIdPage = new DeleteIdPage(page);
    mappingListPage = new MappingListPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        vars['Company Name'] = profile.data[0]['Company Name'];
      }

      log.step('Login to CORR Portal and enable Smart Mapper');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        log.stepPass('Login to CORR Portal and Smart Mapper enabled successfully');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal or enabling Smart Mapper failed');
        throw e;
      }

      log.step('Create 5 new Bid Maps with company selection');
      try {
        vars['Companyname'] = vars['Company Name'];
        vars['count'] = appconstants.ONE;
        Methods.generateRandomChar('3', 'RandomString');
        log.info('Random String: ' + vars['RandomString']);
        while (parseFloat(String(vars['count'])) <= parseFloat(String('5'))) {
          log.info('Creation of map: ' + vars['count']);
          await stepGroups.stepGroup_Creating_New_Bid_Map(page, vars);
          await correspondentPortalPage.Select_Companys_Dropdown.click();
          await statusInactivePage.Second_Selected_Company_Checkbox(vars['Companyname']).click();
          await correspondentPortalPage.Apply_Selected.click();
          await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
          Methods.performArithmetic(vars['count'], 'ADDITION', appconstants.ONE, 'count', 0);
        }
        log.info('Companyname: ' + vars['Companyname']);
        log.stepPass('5 new Bid Maps created with company selection successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create 5 new Bid Maps');
        throw e;
      }

      log.step('Navigate to Bid Maps and search using common keyword');
      try {
        vars['CommonKeyword'] = vars['Common KeyWord'];
        log.info('CommonKeyword: ' + vars['CommonKeyword']);
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.waitFor({ state: 'visible' });
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await statusInactive2Page.SearchFilter_Fields.waitFor({ state: 'visible' });
        await statusInactive2Page.SearchFilter_Fields.type(vars['Common KeyWord']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Maps and searched using common keyword successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Maps or search using common keyword');
        throw e;
      }

      log.step('Verify keyword related Bid Maps popup and show all results');
      try {
        await correspondentPortalPage.BidMapTitle.waitFor({ state: 'visible' });
        vars['CommonKeyWord'] = vars['Common KeyWord'];
        await bidmapPage.KeyWord_Related_Bid_Maps(vars['CommonKeyWord']).first().waitFor({ state: 'visible' });
        await correspondentPortalPage.BidMapTitle.hover();
        await deleteIdPage.Click_on_Show_All.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidMaps Count on Mappings Page'] = String(await bidMapPage.BidMaps_Count_on_Mappings_Page(vars['CommonKeyWord']).count());
        log.info('BidMaps Count on Mappings Page: ' + vars['BidMaps Count on Mappings Page']);
        log.stepPass('Keyword related Bid Maps popup verified and all results shown successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify keyword related Bid Maps popup or show all results');
        throw e;
      }

      log.step('Select Bid Map checkbox and verify Export Selected button is enabled');
      try {
        await correspondentPortalPage.Check_box.check();
        await expect(correspondentPortalPage.Check_box).toBeChecked();
        await mappingListPage.Export_Selected_Button.waitFor({ state: 'visible' });
        await expect(mappingListPage.Export_Selected_Button).toBeEnabled();
        log.stepPass('Bid Map checkbox selected and Export Selected button verified as enabled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select Bid Map checkbox or verify Export Selected button');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS31_TC01testFailed = true;
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS31_TC01testFailed);
    if (REG_TS31_TC01testFailed) {
      try {
        log.step('Executing after-test steps: Deleting the created maps');
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
        log.stepPass('After-test steps executed successfully. All maps deleted');
      } catch (e) {
        await log.stepFail(page, 'Failed to Delete maps');
        throw e;
      }
    }
  });
});