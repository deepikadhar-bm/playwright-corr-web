import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const folders = [
  'REG_BidRequestsTestPlanDoneTestCases',
  'REG_BidRequestsTestPlanIndependentTestcases',
  'REG_Price_Offered_TestPlan',
  'REG_Commitment_List_Testplan'

];

function runTest(folder: string): Promise<void> {
  return new Promise((resolve) => {
    console.log(`\n==============================`);
    console.log(`▶ Running: ${folder}`);
    console.log(`==============================\n`);

    const child = spawn(
      'npx',
      [
        'playwright',
        'test',
        `tests/correspondant/${folder}`
      ],
      {
        stdio: 'inherit',
        shell: true
      }
    );

    child.on('exit', (code) => {
      if (code !== 0) {
        console.log(`❌ ${folder} failed (code ${code})`);
      } else {
        console.log(`✅ ${folder} completed`);
      }

      resolve();
    });
  });
}

async function runAll() {
  for (const folder of folders) {
    await runTest(folder);
  }

  console.log('\n🎯 All folders executed');
}

runAll();