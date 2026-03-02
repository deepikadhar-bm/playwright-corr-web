import { test } from '@playwright/test';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';

test.describe('getCurrentTimestamp - Demo', () => {
  let vars: Record<string, string>;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars    = {};
    Methods = new AddonHelpers(page, vars);
  });

  test('Demo 01 - Date only formats', async ({ page }) => {
    Methods.getCurrentTimestamp('d-M-yyyy',    'fmt1', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('dd-MM-yyyy',  'fmt2', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('MM/dd/yyyy',  'fmt3', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('yyyy-MM-dd',  'fmt4', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('dd',          'fmt5', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('MM',          'fmt6', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('yyyy',        'fmt7', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('d',           'fmt8', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('M',           'fmt9', 'Asia/Kolkata');

    console.log('d-M-yyyy   :', vars['fmt1']);
    console.log('dd-MM-yyyy :', vars['fmt2']);
    console.log('MM/dd/yyyy :', vars['fmt3']);
    console.log('yyyy-MM-dd :', vars['fmt4']);
    console.log('dd         :', vars['fmt5']);
    console.log('MM         :', vars['fmt6']);
    console.log('yyyy       :', vars['fmt7']);
    console.log('d          :', vars['fmt8']);
    console.log('M          :', vars['fmt9']);
  });

  test('Demo 02 - Time only formats', async ({ page }) => {
    Methods.getCurrentTimestamp('HH:mm:ss',   'fmt1', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('hh:mm:ss a', 'fmt2', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('HH:mm',      'fmt3', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('hh:mm a',    'fmt4', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('HH',         'fmt5', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('mm',         'fmt6', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('ss',         'fmt7', 'Asia/Kolkata');

    console.log('HH:mm:ss   :', vars['fmt1']);
    console.log('hh:mm:ss a :', vars['fmt2']);
    console.log('HH:mm      :', vars['fmt3']);
    console.log('hh:mm a    :', vars['fmt4']);
    console.log('HH         :', vars['fmt5']);
    console.log('mm         :', vars['fmt6']);
    console.log('ss         :', vars['fmt7']);
  });

  test('Demo 03 - Date and Time combined formats', async ({ page }) => {
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss',   'fmt1', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('dd-MM-yyyy hh:mm:ss a', 'fmt2', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('yyyy-MM-dd HH:mm:ss',   'fmt3', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('MM/dd/yyyy hh:mm a',    'fmt4', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('d-M-yyyy HH:mm:ss',     'fmt5', 'Asia/Kolkata');

    console.log('dd-MM-yyyy HH:mm:ss   :', vars['fmt1']);
    console.log('dd-MM-yyyy hh:mm:ss a :', vars['fmt2']);
    console.log('yyyy-MM-dd HH:mm:ss   :', vars['fmt3']);
    console.log('MM/dd/yyyy hh:mm a    :', vars['fmt4']);
    console.log('d-M-yyyy HH:mm:ss     :', vars['fmt5']);
  });

  test('Demo 04 - Month and Day name formats', async ({ page }) => {
    Methods.getCurrentTimestamp('MMMM',           'fmt1', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('MMM',            'fmt2', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('EEEE',           'fmt3', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('EEE',            'fmt4', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('MMMM dd, yyyy',  'fmt5', 'Asia/Kolkata');
    Methods.getCurrentTimestamp('EEE, MMM d',     'fmt6', 'Asia/Kolkata');

    console.log('MMMM          :', vars['fmt1']);
    console.log('MMM           :', vars['fmt2']);
    console.log('EEEE          :', vars['fmt3']);
    console.log('EEE           :', vars['fmt4']);
    console.log('MMMM dd, yyyy :', vars['fmt5']);
    console.log('EEE, MMM d    :', vars['fmt6']);
  });

  test('Demo 05 - Timezone comparison', async ({ page }) => {
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'IST',  'Asia/Kolkata');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'UTC',  'UTC');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'EST',  'America/New_York');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'CST',  'America/Chicago');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'PST',  'America/Los_Angeles');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'SGT',  'Asia/Singapore');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'GST',  'Asia/Dubai');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'JST',  'Asia/Tokyo');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'AEST', 'Australia/Sydney');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'CET',  'Europe/Berlin');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'BST',  'Europe/London');

    console.log('IST  (Asia/Kolkata)       :', vars['IST']);
    console.log('UTC  (UTC)                :', vars['UTC']);
    console.log('EST  (America/New_York)   :', vars['EST']);
    console.log('CST  (America/Chicago)    :', vars['CST']);
    console.log('PST  (America/LA)         :', vars['PST']);
    console.log('SGT  (Asia/Singapore)     :', vars['SGT']);
    console.log('GST  (Asia/Dubai)         :', vars['GST']);
    console.log('JST  (Asia/Tokyo)         :', vars['JST']);
    console.log('AEST (Australia/Sydney)   :', vars['AEST']);
    console.log('CET  (Europe/Berlin)      :', vars['CET']);
    console.log('BST  (Europe/London)      :', vars['BST']);
  });

  test('Demo 06 - Default timezone is EST (America/New_York)', async ({ page }) => {
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'WithEST',     'America/New_York');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH:mm:ss', 'WithDefault');

    console.log('Explicit EST :', vars['WithEST']);
    console.log('Default EST  :', vars['WithDefault']);
  });
});