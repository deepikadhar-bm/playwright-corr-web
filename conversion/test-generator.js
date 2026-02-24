/**
 * Test Generator - Converts Testsigma test cases into Playwright .spec.ts files.
 * Handles step groups, conditions, loops, disabled steps, and prerequisites.
 */
const fs = require('fs');
const path = require('path');
const NlpParser = require('./nlp-parser');

class TestGenerator {
  constructor(dataLoader) {
    this.dataLoader = dataLoader;
    this.nlpParser = new NlpParser(dataLoader);
    this.report = {
      total: 0,
      generated: 0,
      skipped: 0,
      confidence: { high: 0, medium: 0, low: 0 },
      warnings: [],
      testFiles: [],
    };
  }

  /**
   * Generate all test files organized by suite.
   */
  generateAll(outputDir, project) {
    const testsDir = path.join(outputDir, 'tests', project);
    fs.mkdirSync(testsDir, { recursive: true });

    // Build suite-to-testcase mapping
    const suiteTests = this.buildSuiteTestMapping();

    // Generate tests per suite
    for (const [suiteName, testCaseIds] of suiteTests) {
      const suiteDir = path.join(testsDir, this.toDirectoryName(suiteName));
      fs.mkdirSync(suiteDir, { recursive: true });

      for (const tcId of testCaseIds) {
        const tc = this.dataLoader.testCasesById.get(tcId);
        const steps = this.dataLoader.stepsByTestCaseId.get(tcId);

        if (!tc || !steps) {
          this.report.skipped++;
          continue;
        }

        this.report.total++;
        const result = this.generateTestFile(tc, steps, suiteName);
        const fileName = this.toFileName(tc.name, tc.id);
        const filePath = path.join(suiteDir, fileName);
        fs.writeFileSync(filePath, result.code);

        this.report.generated++;
        this.report.confidence[result.overallConfidence]++;
        this.report.testFiles.push({
          file: path.relative(outputDir, filePath),
          testCase: tc.name,
          testCaseId: tc.id,
          steps: steps.length,
          confidence: result.overallConfidence,
          warningCount: result.warnings.length,
          todoCount: (result.code.match(/\/\/ TODO/g) || []).length,
        });

        if (result.warnings.length > 0) {
          this.report.warnings.push({
            testCaseId: tc.id,
            testCase: tc.name,
            warnings: result.warnings.slice(0, 5), // limit per test
          });
        }
      }
    }

    // Generate tests not in any suite
    const assignedIds = new Set();
    for (const ids of suiteTests.values()) ids.forEach(id => assignedIds.add(id));

    const unassigned = [...this.dataLoader.testCasesById.keys()].filter(id => !assignedIds.has(id));
    if (unassigned.length > 0) {
      const miscDir = path.join(testsDir, 'unassigned');
      fs.mkdirSync(miscDir, { recursive: true });

      for (const tcId of unassigned) {
        const tc = this.dataLoader.testCasesById.get(tcId);
        const steps = this.dataLoader.stepsByTestCaseId.get(tcId);
        if (!tc || !steps) { this.report.skipped++; continue; }

        this.report.total++;
        const result = this.generateTestFile(tc, steps, 'Unassigned');
        const fileName = this.toFileName(tc.name, tc.id);
        const filePath = path.join(miscDir, fileName);
        fs.writeFileSync(filePath, result.code);

        this.report.generated++;
        this.report.confidence[result.overallConfidence]++;
        this.report.testFiles.push({
          file: path.relative(outputDir, filePath),
          testCase: tc.name,
          testCaseId: tc.id,
          steps: steps.length,
          confidence: result.overallConfidence,
          warningCount: result.warnings.length,
          todoCount: (result.code.match(/\/\/ TODO/g) || []).length,
        });
      }
    }

    console.log(`  Tests generated: ${this.report.generated}/${this.report.total} (${this.report.skipped} skipped)`);
    return this.report;
  }

  buildSuiteTestMapping() {
    const suiteTests = new Map();

    // First try loaded suite-testcase mappings
    if (this.dataLoader.suiteTestCases.size > 0) {
      for (const [suiteId, tcIds] of this.dataLoader.suiteTestCases) {
        const suite = this.dataLoader.testSuitesById.get(suiteId);
        const suiteName = suite?.name || `Suite_${suiteId}`;
        suiteTests.set(suiteName, tcIds);
      }
      return suiteTests;
    }

    // Fallback: assign test cases to suites by name pattern
    // Testsigma test names often follow: REG_TS01_TC01_... where TS01 maps to a suite
    const suiteNameMap = new Map();
    for (const suite of this.dataLoader.testSuites) {
      suiteNameMap.set(suite.name, []);
    }

    // Try to match by prefix
    for (const tc of this.dataLoader.testCases) {
      const match = tc.name.match(/^(?:REG_)?(TS\d+)/i);
      let assigned = false;

      if (match) {
        const tsNum = match[1];
        // Find suite with matching number in name or position
        for (const suite of this.dataLoader.testSuites) {
          if (suite.name.includes(tsNum) || suite.name.includes(tsNum.replace('TS', 'TS_'))) {
            suiteNameMap.get(suite.name).push(tc.id);
            assigned = true;
            break;
          }
        }
      }

      if (!assigned) {
        // Assign to first suite or create misc
        const defaultSuite = this.dataLoader.testSuites[0]?.name || 'Default';
        if (!suiteNameMap.has(defaultSuite)) suiteNameMap.set(defaultSuite, []);
        suiteNameMap.get(defaultSuite).push(tc.id);
      }
    }

    for (const [name, ids] of suiteNameMap) {
      if (ids.length > 0) suiteTests.set(name, ids);
    }

    return suiteTests;
  }

  generateTestFile(testCase, steps, suiteName) {
    const warnings = [];
    const lines = [];
    let overallConfidence = 'high';
    const confidenceCounts = { high: 0, medium: 0, low: 0 };

    // Build step code with proper nesting
    const stepResults = this.processSteps(steps);

    for (const sr of stepResults) {
      confidenceCounts[sr.confidence]++;
      warnings.push(...sr.warnings);
    }

    // Determine overall confidence
    if (confidenceCounts.low > steps.length * 0.3) overallConfidence = 'low';
    else if (confidenceCounts.medium > steps.length * 0.3 || confidenceCounts.low > 0) overallConfidence = 'medium';

    // Build test body
    for (const sr of stepResults) {
      lines.push(...sr.codeLines);
    }

    // Determine if data-driven
    const isDataDriven = testCase.isDataDriven && testCase.testDataName;

    // Generate the full file
    const code = this.buildSpecFile({
      testCase,
      suiteName,
      steps: lines,
      isDataDriven,
      hasPreRequisite: !!testCase.preRequisite,
    });

    return { code, overallConfidence, warnings };
  }

  processSteps(steps) {
    const results = [];
    const sortedSteps = [...steps].sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0));

    // Stack tracks indent levels where we actually opened blocks (if/else/while/for)
    const blockStack = [];

    for (let i = 0; i < sortedSteps.length; i++) {
      const step = sortedSteps[i];
      const parsed = this.nlpParser.parse(step);
      const codeLines = [];
      const stepIndent = step.indent || 0;

      // Close blocks opened at indent levels >= stepIndent
      if (step.conditionType === 'CONDITION_ELSE' || step.conditionType === 'CONDITION_ELSE_IF') {
        // For ELSE/ELSE_IF: close blocks opened DEEPER than this indent, keep the one at this indent
        while (blockStack.length > 0 && blockStack[blockStack.length - 1] > stepIndent) {
          const closedLevel = blockStack.pop();
          const closeI = '    ' + '  '.repeat(closedLevel);
          codeLines.push(`${closeI}}`);
        }
        // The `} else` will close the block at stepIndent (kept on stack for the else branch)
      } else {
        // Close all blocks opened at levels >= stepIndent
        while (blockStack.length > 0 && blockStack[blockStack.length - 1] >= stepIndent) {
          const closedLevel = blockStack.pop();
          const closeI = '    ' + '  '.repeat(closedLevel);
          codeLines.push(`${closeI}}`);
        }
      }

      const indent = '    ' + '  '.repeat(stepIndent);

      if (step.conditionType === 'CONDITION_IF') {
        const condCode = parsed.isCondition ? parsed.code : `if (true) /* ${(step.action || '').substring(0, 60)} */`;
        codeLines.push(`${indent}${condCode} {`);
        blockStack.push(stepIndent);
      } else if (step.conditionType === 'CONDITION_ELSE') {
        codeLines.push(`${indent}} else {`);
        // Keep the same block on stack (else continues the if)
      } else if (step.conditionType === 'CONDITION_ELSE_IF') {
        const condCode = parsed.isCondition ? parsed.code : `if (true) /* ${(step.action || '').substring(0, 60)} */`;
        codeLines.push(`${indent}} else ${condCode} {`);
        // Keep the same block on stack
      } else if (step.conditionType === 'LOOP_WHILE') {
        const loopCode = parsed.isLoop ? parsed.code : `while (true) /* ${(step.action || '').substring(0, 60)} */`;
        codeLines.push(`${indent}${loopCode} {`);
        blockStack.push(stepIndent);
      } else if (step.conditionType === 'LOOP_FOR') {
        const loopCode = parsed.isLoop ? parsed.code : `for (let i = 0; i < 1; i++) /* ${(step.action || '').substring(0, 60)} */`;
        codeLines.push(`${indent}${loopCode} {`);
        blockStack.push(stepIndent);
      } else if (step.type === 'BLOCK') {
        // Block container - skip
      } else {
        const codeStr = parsed.code;
        for (const line of codeStr.split('\n')) {
          codeLines.push(`${indent}${line}`);
        }
      }

      results.push({
        codeLines,
        confidence: parsed.confidence || 'medium',
        warnings: parsed.warnings || [],
      });
    }

    // Close any remaining open blocks
    const closingLines = [];
    while (blockStack.length > 0) {
      const closedLevel = blockStack.pop();
      const closeI = '    ' + '  '.repeat(closedLevel);
      closingLines.push(`${closeI}}`);
    }
    if (closingLines.length > 0) {
      results.push({ codeLines: closingLines, confidence: 'high', warnings: [] });
    }

    return results;
  }

  buildSpecFile({ testCase, suiteName, steps, isDataDriven, hasPreRequisite }) {
    const testName = this.sanitizeTestName(testCase.name);
    const lines = [];

    // Imports
    lines.push(`import { test, expect } from '@playwright/test';`);
    lines.push(`import path from 'path';`);

    // Always import step groups since most tests use them
    lines.push(`import * as stepGroups from '../../../src/helpers/step-groups';`);

    // Conditional imports based on step code
    const stepsJoined = steps.join('\n');
    if (stepsJoined.includes('excelHelper.')) {
      lines.push(`import * as excelHelper from '../../../src/helpers/excel-helpers';`);
    }
    if (stepsJoined.includes('fileHelper.')) {
      lines.push(`import * as fileHelper from '../../../src/helpers/file-helpers';`);
    }

    lines.push(``);

    // Test describe block
    lines.push(`test.describe('${this.escapeString(suiteName)}', () => {`);

    // Runtime vars fixture
    lines.push(`  let vars: Record<string, string> = {};`);
    lines.push(``);
    lines.push(`  test.beforeEach(async () => {`);
    lines.push(`    vars = {};`);
    lines.push(`  });`);
    lines.push(``);

    if (isDataDriven) {
      lines.push(`  // TODO: Data-driven test - load test data from "${testCase.testDataName}"`);
      lines.push(`  // for (const testData of testDataRows) {`);
    }

    // Test block
    lines.push(`  test('${this.escapeString(testName)}', async ({ page }) => {`);

    // Prerequisites
    if (hasPreRequisite) {
      const preReqId = testCase.preRequisite;
      const preReqCase = this.dataLoader.testCasesById.get(preReqId);
      const preReqName = (preReqCase?.name || String(preReqId)).replace(/[\r\n]+/g, ' ').substring(0, 100);
      lines.push(`    // Prerequisite: ${preReqName}`);
      lines.push(`    // TODO: Ensure prerequisite test passes first`);
      lines.push(``);
    }

    // Set up download handler if test uses download paths
    const stepsCode = steps.join('\n');
    if (stepsCode.includes('_lastDownloadPath')) {
      lines.push(`    // Set up download handler`);
      lines.push(`    page.on('download', async (download) => {`);
      lines.push(`      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());`);
      lines.push(`      await download.saveAs(filePath);`);
      lines.push(`      vars['_lastDownloadPath'] = filePath;`);
      lines.push(`    });`);
      lines.push(``);
    }

    // Declare testData if any step references it
    if (stepsCode.includes('testData[') || stepsCode.includes('testDataSets') || stepsCode.includes('testDataRows')) {
      lines.push(`    const testData: Record<string, string> = {}; // TODO: Load from test data profile`);
      if (stepsCode.includes('testDataSets')) {
        lines.push(`    const testDataSets: Record<string, string>[] = []; // TODO: Load test data sets`);
      }
      if (stepsCode.includes('testDataRows')) {
        lines.push(`    const testDataRows: Record<string, string>[] = []; // TODO: Load test data rows`);
      }
      lines.push(``);
    }

    // Step code
    lines.push(...steps);

    lines.push(`  });`);

    if (isDataDriven) {
      lines.push(`  // }`);
    }

    lines.push(`});`);
    lines.push(``);

    return lines.join('\n');
  }

  sanitizeTestName(name) {
    return name
      .replace(/[\r\n]+/g, ' ')
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .substring(0, 200);
  }

  escapeString(str) {
    return str
      .replace(/[\r\n]+/g, ' ')
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"');
  }

  toDirectoryName(name) {
    return name
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 60);
  }

  toFileName(name, id) {
    const clean = name
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 80);
    return `${clean}-${id}.spec.ts`;
  }

  getReport() {
    return this.report;
  }
}

module.exports = TestGenerator;
