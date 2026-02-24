/**
 * Data Loader - Reads all extracted JSON chunks and builds in-memory indexes
 * for the conversion pipeline.
 */
const fs = require('fs');
const path = require('path');

class DataLoader {
  constructor(outputDir) {
    this.outputDir = outputDir;
    this.elements = [];
    this.elementsByName = new Map();
    this.elementsById = new Map();
    this.testCases = [];
    this.testCasesById = new Map();
    this.stepsByTestCaseId = new Map();
    this.testSuites = [];
    this.testSuitesById = new Map();
    this.suiteTestCases = new Map(); // suiteId -> [testCaseIds]
    this.testDataProfiles = [];
    this.testDataProfilesById = new Map();
    this.environmentVariables = [];
    this.envVarsByKey = new Map();
    this.stepGroups = new Map(); // stepGroupId -> { info, steps }
  }

  loadAll() {
    console.log(`Loading data from ${this.outputDir}...`);
    this.loadElements();
    this.loadTestCases();
    this.loadTestSteps();
    this.loadTestSuites();
    this.loadSuiteTestCases();
    this.loadTestDataProfiles();
    this.loadEnvironmentVariables();
    this.loadStepGroups();
    this.printSummary();
    return this;
  }

  // Load all chunk files matching a pattern
  loadChunks(dir, baseName) {
    const items = [];
    if (!fs.existsSync(dir)) return items;

    // Check for manifest first
    const manifestPath = path.join(dir, `${baseName}_manifest.json`);
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const chunkFiles = manifest.chunks || manifest.files || [];
      for (const chunkFile of chunkFiles) {
        const filePath = path.join(dir, chunkFile);
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          items.push(...data);
        }
      }
      return items;
    }

    // Fall back to scanning for chunk files
    const files = fs.readdirSync(dir)
      .filter(f => f.startsWith(baseName) && f.endsWith('.json') && !f.includes('manifest'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/chunk_(\d+)/)?.[1] || '0');
        const numB = parseInt(b.match(/chunk_(\d+)/)?.[1] || '0');
        return numA - numB;
      });

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      items.push(...data);
    }

    // If no chunks found, try single file
    if (items.length === 0) {
      const singleFile = path.join(dir, `${baseName}.json`);
      if (fs.existsSync(singleFile)) {
        const data = JSON.parse(fs.readFileSync(singleFile, 'utf8'));
        if (Array.isArray(data)) items.push(...data);
      }
    }

    return items;
  }

  loadElements() {
    const dir = path.join(this.outputDir, 'elements');
    this.elements = this.loadChunks(dir, 'elements');
    for (const el of this.elements) {
      this.elementsByName.set(el.name, el);
      this.elementsById.set(el.id, el);
    }
    console.log(`  Elements: ${this.elements.length} (${this.elementsByName.size} unique names)`);
  }

  loadTestCases() {
    const dir = path.join(this.outputDir, 'test-cases');
    this.testCases = this.loadChunks(dir, 'test_cases');
    for (const tc of this.testCases) {
      this.testCasesById.set(tc.id, tc);
    }
    console.log(`  Test Cases: ${this.testCases.length}`);
  }

  loadTestSteps() {
    const dir = path.join(this.outputDir, 'test-steps');
    const stepChunks = this.loadChunks(dir, 'test_steps');
    // Each entry is { testCaseId, testCaseName, stepCount, steps[] }
    for (const entry of stepChunks) {
      this.stepsByTestCaseId.set(entry.testCaseId, entry.steps);
    }
    console.log(`  Test Steps: ${stepChunks.length} test cases with steps`);
  }

  loadTestSuites() {
    const dir = path.join(this.outputDir, 'test-suites');
    this.testSuites = this.loadChunks(dir, 'test_suites');
    for (const suite of this.testSuites) {
      this.testSuitesById.set(suite.id, suite);
    }
    console.log(`  Test Suites: ${this.testSuites.length}`);
  }

  loadSuiteTestCases() {
    const filePath = path.join(this.outputDir, 'test-suites', 'suite_test_cases.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Array.isArray(data)) {
        for (const entry of data) {
          this.suiteTestCases.set(entry.suiteId, entry.testCaseIds || []);
        }
      } else if (typeof data === 'object') {
        for (const [suiteId, tcIds] of Object.entries(data)) {
          this.suiteTestCases.set(parseInt(suiteId), tcIds);
        }
      }
      console.log(`  Suite-TestCase mappings: ${this.suiteTestCases.size} suites`);
    } else {
      console.log(`  Suite-TestCase mappings: not found (will assign by name pattern)`);
    }
  }

  loadTestDataProfiles() {
    const dir = path.join(this.outputDir, 'test-data');
    const singleFile = path.join(dir, 'test_data_profiles.json');
    if (fs.existsSync(singleFile)) {
      this.testDataProfiles = JSON.parse(fs.readFileSync(singleFile, 'utf8'));
    }
    for (const profile of this.testDataProfiles) {
      this.testDataProfilesById.set(profile.id, profile);
    }
    console.log(`  Test Data Profiles: ${this.testDataProfiles.length}`);
  }

  loadEnvironmentVariables() {
    const filePath = path.join(this.outputDir, 'environments', 'environment_variables.json');
    if (fs.existsSync(filePath)) {
      this.environmentVariables = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      for (const v of this.environmentVariables) {
        this.envVarsByKey.set(v.key, v);
      }
    }
    console.log(`  Environment Variables: ${this.environmentVariables.length}`);
  }

  loadStepGroups() {
    const dir = path.join(this.outputDir, 'step-groups');
    if (!fs.existsSync(dir)) {
      console.log(`  Step Groups: directory not found`);
      return;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      if (Array.isArray(data)) {
        for (const sg of data) {
          this.stepGroups.set(sg.id, sg);
        }
      } else if (data.id) {
        this.stepGroups.set(data.id, data);
      }
    }
    console.log(`  Step Groups: ${this.stepGroups.size}`);
  }

  // Resolve element locator from step's testStepElements or global elements
  resolveElement(elementName, step) {
    // First try embedded element from step
    if (step?.testStepElements) {
      const embedded = step.testStepElements.find(e => e.name === elementName);
      if (embedded?.element) {
        return {
          name: elementName,
          locatorType: embedded.element.locatorType || 'xpath',
          definition: embedded.element.definition,
        };
      }
    }
    // Fall back to global elements index
    const el = this.elementsByName.get(elementName);
    if (el) {
      return {
        name: elementName,
        locatorType: el.locatorType || 'xpath',
        definition: el.definition,
      };
    }
    return null;
  }

  // Resolve step data value based on type
  resolveDataValue(dataEntry) {
    if (!dataEntry) return { code: "''", type: 'unknown' };

    switch (dataEntry.type) {
      case 'raw':
        return { code: JSON.stringify(dataEntry.value || ''), type: 'raw' };
      case 'runtime':
        return { code: `vars[${JSON.stringify(dataEntry.value)}]`, type: 'runtime' };
      case 'parameter':
        // Test data parameter - references a column in a test data profile
        return { code: `testData[${JSON.stringify(dataEntry.value)}]`, type: 'parameter' };
      case 'function':
        return this.resolveFunctionValue(dataEntry);
      case 'global':
        // Global variable - same as environment variable
        return { code: `vars[${JSON.stringify(dataEntry.value)}]`, type: 'global' };
      case 'upload_path':
        return { code: `path.resolve(__dirname, 'test-data', ${JSON.stringify(dataEntry.value)})`, type: 'upload_path' };
      default:
        return { code: JSON.stringify(dataEntry.value || ''), type: dataEntry.type };
    }
  }

  /**
   * Resolve a test data function entry into Playwright code.
   * Accepts either the full dataEntry object or a plain string (legacy).
   */
  resolveFunctionValue(entry) {
    // Legacy: plain string passed
    if (typeof entry === 'string') {
      return this._resolveFunctionByName(entry, null, null);
    }
    if (!entry) return { code: "''", type: 'function' };

    const functionStr = entry.value || '';
    const isKibbutz = entry.isKibbutzFn === true;

    if (isKibbutz) {
      // Kibbutz custom function
      const kFn = entry.testDataKibbutzFunction || {};
      const args = kFn.arguments || {};
      return this._resolveKibbutzFunction(functionStr, entry.testDataKibbutzFunctionId, args);
    }

    // Built-in function
    const fn = entry.testDataFunction || {};
    const argsMap = fn.argumentsMap || {};
    return this._resolveFunctionByName(functionStr, entry.testDataFunctionId, argsMap);
  }

  /** Resolve a variable reference like $|VarName| or @|VarName| or plain literal */
  _resolveVarRef(val) {
    if (!val) return "''";
    const runtimeMatch = val.match(/^\$\|(.+)\|$/);
    if (runtimeMatch) return `vars[${JSON.stringify(runtimeMatch[1])}]`;
    const envMatch = val.match(/^@\|(.+)\|$/);
    if (envMatch) return `vars[${JSON.stringify(envMatch[1])}]`;
    return JSON.stringify(val);
  }

  /** Resolve built-in Testsigma test data functions */
  _resolveFunctionByName(functionStr, functionId, argsMap) {
    if (!functionStr) return { code: "''", type: 'function' };
    argsMap = argsMap || {};

    // StringFunctions :: Concat (ID 112)
    if (functionId === 112 || (functionStr.includes('StringFunctions') && functionStr.includes('Concat'))) {
      const argKeys = Object.keys(argsMap).sort();
      if (argKeys.length === 0) return { code: "''", type: 'function' };
      const parts = argKeys.map(k => this._resolveVarRef(argsMap[k]));
      return { code: parts.join(' + '), type: 'function' };
    }

    // Number :: Random Number[Integer] (ID 22)
    if (functionId === 22 || (functionStr.includes('Number') && functionStr.includes('Random Number'))) {
      const min = argsMap.arg0 || '1';
      const max = argsMap.arg1 || '9999';
      return { code: `String(Math.floor(Math.random() * (${max} - ${min} + 1)) + ${min})`, type: 'function' };
    }

    // DateFunctions :: Current Date (ID 101)
    if (functionId === 101 || (functionStr.includes('DateFunctions') && functionStr.includes('Current Date'))) {
      const format = argsMap.arg0 || 'MM/dd/yyyy';
      return { code: `new Date().toLocaleDateString('en-US') /* format: ${format} */`, type: 'function' };
    }

    // DateFunctions :: Days After Given Date (ID 109)
    if (functionId === 109 || (functionStr.includes('DateFunctions') && functionStr.includes('Days After'))) {
      const baseDate = this._resolveVarRef(argsMap.arg0);
      const daysRef = this._resolveVarRef(argsMap.arg1 || '1');
      const format = argsMap.arg2 || 'MM/dd/yyyy';
      return { code: `(() => { const d = new Date(String(${baseDate})); d.setDate(d.getDate() + parseInt(String(${daysRef}))); return d.toLocaleDateString('en-US'); /* format: ${format} */ })()`, type: 'function' };
    }

    // RandomStringFunctions :: Random String From Given Characters With Length (ID 20)
    if (functionId === 20 || functionStr.includes('RandomStringFunctions')) {
      const len = argsMap.arg0 || '8';
      let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      if (argsMap.arg1) {
        try { chars = JSON.parse(argsMap.arg1).join(''); } catch(e) { /* use default */ }
      }
      return { code: `Array.from({length: ${len}}, () => ${JSON.stringify(chars)}.charAt(Math.floor(Math.random() * ${chars.length}))).join('')`, type: 'function' };
    }

    // Name :: Lastname (ID 36)
    if (functionId === 36 || functionStr.includes('Name') && functionStr.includes('Lastname')) {
      return { code: `['Smith','Johnson','Williams','Brown','Jones','Davis','Miller','Wilson'][Math.floor(Math.random() * 8)]`, type: 'function' };
    }

    // TestDataFromProfile :: Get TestData By SetName (ID 110)
    if (functionId === 110 || functionStr.includes('TestDataFromProfile')) {
      const setName = argsMap.arg1 || '';
      const paramName = argsMap.arg2 || '';
      return { code: `testData[${JSON.stringify(paramName)}] /* set: ${setName} */`, type: 'function' };
    }

    // Generic fallback
    return { code: `/* ${functionStr} */ ''`, type: 'function' };
  }

  /** Resolve Kibbutz (custom) test data functions */
  _resolveKibbutzFunction(functionStr, functionId, args) {
    args = args || {};

    // toUppercase(string) (Kibbutz ID 10)
    if (functionId === 10 || functionStr.includes('toUppercase')) {
      const input = this._resolveVarRef(args.string);
      return { code: `String(${input}).toUpperCase()`, type: 'function' };
    }

    // generateRandomString(length) (Kibbutz ID 5)
    if (functionId === 5 || functionStr.includes('generateRandomString')) {
      const len = args.length || '8';
      return { code: `Array.from({length: ${len}}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62))).join('')`, type: 'function' };
    }

    // countOfSubstrings(splitChar) (Kibbutz ID 4)
    if (functionId === 4 || functionStr.includes('countOfSubstrings')) {
      const splitChar = args.splitChar || ',';
      const input = this._resolveVarRef(args.string);
      return { code: `String((String(${input}).split(${JSON.stringify(splitChar)}).length - 1))`, type: 'function' };
    }

    // Generic fallback
    return { code: `/* ${functionStr} */ ''`, type: 'function' };
  }

  printSummary() {
    console.log(`\nData load complete.`);
    console.log(`  Total elements: ${this.elements.length}`);
    console.log(`  Total test cases: ${this.testCases.length}`);
    console.log(`  Total test cases with steps: ${this.stepsByTestCaseId.size}`);
    console.log(`  Total test suites: ${this.testSuites.length}`);
    console.log(`  Total step groups: ${this.stepGroups.size}`);
    console.log(`  Total test data profiles: ${this.testDataProfiles.length}`);
    console.log(`  Total env variables: ${this.environmentVariables.length}`);
  }
}

module.exports = DataLoader;
