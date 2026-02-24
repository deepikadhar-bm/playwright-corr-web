#!/usr/bin/env node
/**
 * Conversion Pipeline - Orchestrates the full Testsigma-to-Playwright conversion.
 *
 * Usage:
 *   node pipeline.js [project]
 *
 * Projects: correspondant, ext-web
 */
const fs = require('fs');
const path = require('path');

const DataLoader = require('./data-loader');
const NlpParser = require('./nlp-parser');
const PageObjectGenerator = require('./page-object-generator');
const StepGroupGenerator = require('./step-group-generator');
const TestGenerator = require('./test-generator');

const PROJECT_CONFIGS = {
  correspondant: {
    name: 'Correspondent Portal',
    dataDir: path.resolve(__dirname, '../../output/correspondant'),
    outputProject: 'correspondant',
  },
  'ext-web': {
    name: 'EXT Application (Web)',
    dataDir: path.resolve(__dirname, '../../output/ext-application/web'),
    outputProject: 'ext-web',
  },
};

async function runPipeline(projectKey) {
  const config = PROJECT_CONFIGS[projectKey];
  if (!config) {
    console.error(`Unknown project: ${projectKey}. Available: ${Object.keys(PROJECT_CONFIGS).join(', ')}`);
    process.exit(1);
  }

  const outputDir = path.resolve(__dirname, '..');
  const startTime = Date.now();

  console.log(`\n========================================`);
  console.log(`  Testsigma -> Playwright Conversion`);
  console.log(`  Project: ${config.name}`);
  console.log(`========================================\n`);

  // Step 1: Load all data
  console.log('STEP 1: Loading extracted data...');
  const dataLoader = new DataLoader(config.dataDir);
  dataLoader.loadAll();

  // Step 2: Generate page objects
  console.log('\nSTEP 2: Generating page objects...');
  const pageObjGen = new PageObjectGenerator(dataLoader);
  const pageObjects = pageObjGen.generateAll(outputDir, config.outputProject);

  // Step 3: Generate step group helpers
  console.log('\nSTEP 3: Generating step group helpers...');
  const stepGroupGen = new StepGroupGenerator(dataLoader);
  const stepGroupResult = stepGroupGen.generateAll(outputDir);

  // Step 4: Generate test files
  console.log('\nSTEP 4: Generating test files...');
  const testGen = new TestGenerator(dataLoader);
  const testReport = testGen.generateAll(outputDir, config.outputProject);

  // Step 5: Generate environment config
  console.log('\nSTEP 5: Updating environment config...');
  generateEnvConfig(dataLoader, outputDir);

  // Step 6: Write conversion report
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nSTEP 6: Writing conversion report...`);

  const report = {
    project: config.name,
    timestamp: new Date().toISOString(),
    duration: `${duration}s`,
    summary: {
      testCasesTotal: dataLoader.testCases.length,
      testCasesGenerated: testReport.generated,
      testCasesSkipped: testReport.skipped,
      pageObjects: pageObjects.length,
      stepGroups: stepGroupResult.count,
      elementsTotal: dataLoader.elements.length,
      testSuites: dataLoader.testSuites.length,
    },
    confidence: testReport.confidence,
    nlpParserStats: testGen.nlpParser.getStats(),
    todoCount: testReport.testFiles.reduce((sum, f) => sum + f.todoCount, 0),
    warningCount: testReport.warnings.length,
    stepGroupWarnings: stepGroupResult.warnings.length,
    testFiles: testReport.testFiles,
    topWarnings: testReport.warnings.slice(0, 20),
  };

  const reportPath = path.join(outputDir, `conversion-report-${config.outputProject}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log(`\n========================================`);
  console.log(`  CONVERSION COMPLETE - ${config.name}`);
  console.log(`========================================`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Test Cases: ${testReport.generated}/${dataLoader.testCases.length} generated`);
  console.log(`  Page Objects: ${pageObjects.length} classes`);
  console.log(`  Step Groups: ${stepGroupResult.count} functions`);
  console.log(`  Confidence: ${testReport.confidence.high} high, ${testReport.confidence.medium} medium, ${testReport.confidence.low} low`);
  console.log(`  TODOs: ${report.todoCount}`);
  console.log(`  Warnings: ${report.warningCount}`);
  console.log(`  Report: ${reportPath}`);
  console.log(`========================================\n`);

  return report;
}

function generateEnvConfig(dataLoader, outputDir) {
  // Update .env.example with all discovered environment variables
  const envExamplePath = path.join(outputDir, '.env.example');
  const lines = ['# Auto-generated from Testsigma environment variables', ''];

  for (const v of dataLoader.environmentVariables) {
    const value = v.encrypted ? '# [ENCRYPTED]' : v.value;
    lines.push(`${v.key.replace(/\s+/g, '_').toUpperCase()}=${value}`);
  }

  lines.push('');
  fs.writeFileSync(envExamplePath, lines.join('\n'));
  console.log(`  Updated: ${envExamplePath} (${dataLoader.environmentVariables.length} variables)`);
}

// Main execution
const projectArg = process.argv[2];
const projects = projectArg ? [projectArg] : ['correspondant'];

(async () => {
  for (const project of projects) {
    await runPipeline(project);
  }
})().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
