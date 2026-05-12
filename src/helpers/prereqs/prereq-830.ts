import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidmapPage } from '../../pages/correspondant/bidmap';
import { BidMapPage } from '../../pages/correspondant/bid-map';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { DeleteIdPage } from '../../pages/correspondant/delete-id';
import { MappingListPage } from '../../pages/correspondant/mapping-list';
import { SaveDraftExitButtonPage } from '../../pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';


const TC_ID = 'PREREQ_830(REG_TS31_TC01)';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of bid map name, column hea';

export async function runPrereq_830(page: Page, vars: Record<string, string>): Promise<void> {
  const bidmapPage = new BidmapPage(page);
  const bidMapPage = new BidMapPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const deleteIdPage = new DeleteIdPage(page);
  const mappingListPage = new MappingListPage(page);
  const saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);
  const credentials = ENV.getCredentials('internal');
  let REG_TS31_TC01_testFailed = false;

  vars['Username'] = credentials.username;
  vars['Password'] = credentials.password;
  const Methods = new AddonHelpers(page, vars);

  const profileName = 'Search Functionality BidMaps';
  const profile = testDataManager.getProfileByName(profileName);
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
    REG_TS31_TC01_testFailed = true;
    throw e;
  }
  finally {
    log.afterTestSteps(TC_ID, REG_TS31_TC01_testFailed);
    if (REG_TS31_TC01_testFailed) {
      try {
        log.step('Executing after-test steps: Deleting the created maps');
        await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
        log.stepPass('After-test steps executed successfully. All maps deleted');
      } catch (e) {
        await log.stepFail(page, 'Failed to Delete maps');
        throw e;
      }
    }
  }
}