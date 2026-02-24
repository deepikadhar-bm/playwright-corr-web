/**
 * Step Group Generator - Converts Testsigma step groups into reusable
 * async TypeScript helper functions.
 */
const fs = require('fs');
const path = require('path');
const NlpParser = require('./nlp-parser');

class StepGroupGenerator {
  constructor(dataLoader) {
    this.dataLoader = dataLoader;
    this.nlpParser = new NlpParser(dataLoader);
    this.generatedGroups = new Map();
  }

  /**
   * Generate all step group helper files.
   */
  generateAll(outputDir) {
    const helperDir = path.join(outputDir, 'src', 'helpers', 'step-groups');
    fs.mkdirSync(helperDir, { recursive: true });

    // Also collect all step group IDs referenced in test steps
    const referencedGroupIds = this.collectReferencedStepGroupIds();

    const allGroupIds = new Set([
      ...this.dataLoader.stepGroups.keys(),
      ...referencedGroupIds,
    ]);

    console.log(`Step groups to generate: ${allGroupIds.size} (${this.dataLoader.stepGroups.size} loaded, ${referencedGroupIds.size} referenced)`);

    const functions = [];
    const warnings = [];
    const usedFnNames = new Set();

    for (const groupId of allGroupIds) {
      const groupData = this.dataLoader.stepGroups.get(groupId);

      if (!groupData) {
        // Referenced but not loaded - generate stub
        let fnName = this.getFunctionNameForId(groupId);
        fnName = this.deduplicateName(fnName, usedFnNames);
        functions.push(this.generateStub(groupId, fnName));
        warnings.push(`Step group ${groupId} referenced but not loaded - generated stub`);
        continue;
      }

      const generated = this.generateFunction(groupData, usedFnNames);
      functions.push(generated.code);
      warnings.push(...generated.warnings);
      this.generatedGroups.set(groupId, generated);
    }

    // Scan for missing function references and add stubs
    const allCode = functions.join('\n');
    const calledFns = [...allCode.matchAll(/await\s+(stepGroup_\w+)\s*\(/g)].map(m => m[1]);
    const definedFns = new Set([...allCode.matchAll(/export async function (stepGroup_\w+)/g)].map(m => m[1]));
    const missingFns = new Set(calledFns.filter(fn => !definedFns.has(fn)));
    for (const fn of missingFns) {
      functions.push([
        `/** Stub for missing step group reference */`,
        `export async function ${fn}(page: import('@playwright/test').Page, vars: Record<string, string>) {`,
        `  // TODO: Step group not found - implement manually`,
        `}`,
      ].join('\n'));
      warnings.push(`Missing step group reference: ${fn} - generated stub`);
    }

    // Write single index file with all step group functions
    const content = this.buildIndexFile(functions);
    const filePath = path.join(helperDir, 'index.ts');
    fs.writeFileSync(filePath, content);
    console.log(`  Written: ${filePath} (${functions.length} functions)`);

    return { count: functions.length, warnings };
  }

  collectReferencedStepGroupIds() {
    const ids = new Set();
    for (const [, steps] of this.dataLoader.stepsByTestCaseId) {
      for (const step of steps) {
        if (step.type === 'STEP_GROUP' && step.stepGroupId) {
          ids.add(step.stepGroupId);
        }
      }
    }
    return ids;
  }

  getFunctionNameForId(groupId) {
    // Look up from test steps to find the action name for this group
    for (const [, steps] of this.dataLoader.stepsByTestCaseId) {
      for (const step of steps) {
        if (step.stepGroupId === groupId && step.action) {
          return this.nlpParser.stepGroupToFunctionName(step.action);
        }
      }
    }
    return `stepGroup_${groupId}`;
  }

  deduplicateName(fnName, usedNames) {
    if (!usedNames.has(fnName)) {
      usedNames.add(fnName);
      return fnName;
    }
    let suffix = 2;
    while (usedNames.has(`${fnName}_${suffix}`)) suffix++;
    const unique = `${fnName}_${suffix}`;
    usedNames.add(unique);
    return unique;
  }

  generateFunction(groupData, usedFnNames) {
    const name = groupData.name || groupData.testCaseName || `Group_${groupData.id}`;
    let fnName = this.nlpParser.stepGroupToFunctionName(name);
    fnName = this.deduplicateName(fnName, usedFnNames);
    const warnings = [];
    const steps = groupData.steps || [];

    if (steps.length === 0) {
      warnings.push(`Step group "${name}" (${groupData.id}) has no steps`);
      return {
        code: this.generateStub(groupData.id, fnName, name),
        fnName,
        warnings,
      };
    }

    // Process steps with proper brace balancing
    const lines = [];
    const sortedSteps = [...steps].sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0));
    let currentIndentLevel = 0;

    for (const step of sortedSteps) {
      const parsed = this.nlpParser.parse(step);
      warnings.push(...parsed.warnings);

      if (parsed.disabled) {
        const disabledIndent = '  '.repeat((step.indent || 0) + 1);
        lines.push(`${disabledIndent}${parsed.code.split('\n').join('\n' + disabledIndent)}`);
        continue;
      }

      const stepIndent = step.indent || 0;

      // Close blocks when indent decreases
      if (step.conditionType === 'CONDITION_ELSE' || step.conditionType === 'CONDITION_ELSE_IF') {
        // Close to stepIndent+1 (the `}` in `} else` closes the remaining one)
        const targetLevel = stepIndent + 1;
        while (currentIndentLevel > targetLevel) {
          currentIndentLevel--;
          lines.push(`${'  '.repeat(currentIndentLevel + 1)}}`);
        }
        currentIndentLevel = stepIndent; // The `} else` closes the remaining one
      } else {
        while (currentIndentLevel > stepIndent) {
          currentIndentLevel--;
          lines.push(`${'  '.repeat(currentIndentLevel + 1)}}`);
        }
      }

      const indent = '  '.repeat(stepIndent + 1);

      if (step.conditionType === 'CONDITION_IF') {
        const condCode = parsed.isCondition ? parsed.code : `if (true) /* ${(step.action || '').substring(0, 60)} */`;
        lines.push(`${indent}${condCode} {`);
        currentIndentLevel = stepIndent + 1;
      } else if (step.conditionType === 'CONDITION_ELSE') {
        lines.push(`${indent}} else {`);
        currentIndentLevel = stepIndent + 1;
      } else if (step.conditionType === 'CONDITION_ELSE_IF') {
        const condCode = parsed.isCondition ? parsed.code : `if (true) /* ${(step.action || '').substring(0, 60)} */`;
        lines.push(`${indent}} else ${condCode} {`);
        currentIndentLevel = stepIndent + 1;
      } else if (step.conditionType === 'LOOP_WHILE' || step.conditionType === 'LOOP_FOR') {
        const loopCode = parsed.isLoop ? parsed.code : `while (true) /* ${(step.action || '').substring(0, 60)} */`;
        lines.push(`${indent}${loopCode} {`);
        currentIndentLevel = stepIndent + 1;
      } else if (step.type === 'BLOCK') {
        // Skip block containers
      } else {
        for (const line of parsed.code.split('\n')) {
          lines.push(`${indent}${line}`);
        }
      }
    }

    // Close remaining blocks
    while (currentIndentLevel > 0) {
      currentIndentLevel--;
      lines.push(`${'  '.repeat(currentIndentLevel + 1)}}`);
    }

    // Post-process: replace stepGroups. prefix with direct calls (same file)
    const processedLines = lines.map(line => line.replace(/await stepGroups\./g, 'await '));

    // Check if testData/testDataSets/testDataRows are used
    const bodyStr = processedLines.join('\n');
    const declarations = [];
    if (bodyStr.includes('testData[')) {
      declarations.push(`  const testData: Record<string, string> = {}; // TODO: Load from test data profile`);
    }
    if (bodyStr.includes('testDataSets')) {
      declarations.push(`  const testDataSets: Record<string, string>[] = []; // TODO: Load test data sets`);
    }
    if (bodyStr.includes('testDataRows')) {
      declarations.push(`  const testDataRows: Record<string, string>[] = []; // TODO: Load test data rows`);
    }

    const code = [
      `/**`,
      ` * Step Group: ${name}`,
      ` * ID: ${groupData.id}`,
      ` * Steps: ${steps.length}`,
      ` */`,
      `export async function ${fnName}(page: import('@playwright/test').Page, vars: Record<string, string>) {`,
      ...declarations,
      ...processedLines,
      `}`,
    ].join('\n');

    return { code, fnName, warnings };
  }

  generateStub(groupId, fnName, name) {
    return [
      `/**`,
      ` * Step Group Stub: ${name || fnName}`,
      ` * ID: ${groupId}`,
      ` * NOTE: Step group details not loaded - implement manually`,
      ` */`,
      `export async function ${fnName}(page: import('@playwright/test').Page, vars: Record<string, string>) {`,
      `  // TODO: Step group ${groupId} not loaded - implement manually`,
      `}`,
    ].join('\n');
  }

  buildIndexFile(functions) {
    const allCode = functions.join('\n');
    const imports = [
      `/**`,
      ` * Auto-generated step group helpers`,
      ` * Converted from Testsigma step groups`,
      ` */`,
      `import { Page } from '@playwright/test';`,
      `import { expect } from '@playwright/test';`,
      `import path from 'path';`,
    ];
    if (allCode.includes('excelHelper.')) {
      imports.push(`import * as excelHelper from '../excel-helpers';`);
    }
    if (allCode.includes('fileHelper.')) {
      imports.push(`import * as fileHelper from '../file-helpers';`);
    }
    imports.push(``);
    const header = imports.join('\n');

    return header + '\n' + functions.join('\n\n') + '\n';
  }
}

module.exports = StepGroupGenerator;
