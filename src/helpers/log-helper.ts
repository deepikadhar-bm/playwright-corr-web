import * as fs from 'fs';
import * as path from 'path';
import { Page } from '@playwright/test';

type LogLevel = 'TC_START' | 'TC_END' | 'STEP' | 'PASS' | 'FAIL' | 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  tcId?: string;
  tcTitle?: string;
  step?: number;
  message: string;
  durationMs?: number;
  screenshotPath?: string;
  attachments?: string[];
}

/**
 * CICD-Ready Logger
 *
 * Usage:
 *   Logger.tcStart('TC-001', 'Verify Rate Filter');
 *   Logger.step('Click on Rate Min filter');
 *   Logger.stepPass('Rate Min filter is visible and clickable');
 *   await Logger.stepFail(page, 'Rate filter did not apply');
 *   await Logger.captureOnFailure(page, 'myMethodName', error);
 *   Logger.tcEnd('PASS');
 *
 * Environment variables:
 *   CI              - set by GitHub Actions / Jenkins / most CI systems
 *   GITHUB_ACTIONS  - GitHub Actions
 *   JENKINS_URL     - Jenkins
 *   CIRCLECI        - CircleCI
 *   LOG_LEVEL=debug - enable DEBUG level output
 */
export class Logger {
  // ─── CI detection ──────────────────────────────────────────────────────────
  private static readonly isCI: boolean =
    !!process.env.CI ||
    !!process.env.GITHUB_ACTIONS ||
    !!process.env.JENKINS_URL ||
    !!process.env.CIRCLECI ||
    !!process.env.AZURE_PIPELINES ||
    !!process.env.TF_BUILD; // Azure DevOps

  // ─── Paths ─────────────────────────────────────────────────────────────────
  private static readonly logDir: string = path.join(process.cwd(), 'logs');
  private static readonly sessionId: string = Logger.buildSessionId();
  private static readonly logFile: string = path.join(Logger.logDir, `test-log-${Logger.sessionId}.log`);
  private static readonly jsonFile: string = path.join(Logger.logDir, `test-log-${Logger.sessionId}.json`);

  // ─── State ─────────────────────────────────────────────────────────────────
  private static readonly entries: LogEntry[] = [];
  private static stepCounter = 0;
  private static tcStartTime: number | null = null;
  private static currentTcId: string | null = null;
  private static currentTcTitle: string | null = null;

  // ─── ANSI colors (disabled in CI so logs stay clean in CI output) ──────────
  private static readonly C = {
    reset:   Logger.isCI ? '' : '\x1b[0m',
    bold:    Logger.isCI ? '' : '\x1b[1m',
    dim:     Logger.isCI ? '' : '\x1b[2m',
    red:     Logger.isCI ? '' : '\x1b[31m',
    green:   Logger.isCI ? '' : '\x1b[32m',
    yellow:  Logger.isCI ? '' : '\x1b[33m',
    blue:    Logger.isCI ? '' : '\x1b[34m',
    magenta: Logger.isCI ? '' : '\x1b[35m',
    cyan:    Logger.isCI ? '' : '\x1b[36m',
    white:   Logger.isCI ? '' : '\x1b[37m',
    gray:    Logger.isCI ? '' : '\x1b[90m',
  };

  private static readonly LEVEL_COLOR: Record<LogLevel, string> = {
    TC_START: Logger.C.cyan   + Logger.C.bold,
    TC_END:   Logger.C.cyan   + Logger.C.bold,
    STEP:     Logger.C.blue   + Logger.C.bold,
    PASS:     Logger.C.green  + Logger.C.bold,
    FAIL:     Logger.C.red    + Logger.C.bold,
    INFO:     Logger.C.white,
    WARN:     Logger.C.yellow + Logger.C.bold,
    ERROR:    Logger.C.red    + Logger.C.bold,
    DEBUG:    Logger.C.gray,
  };

  // ─── Helpers ───────────────────────────────────────────────────────────────
  private static buildSessionId(): string {
    const now = new Date();
    const d = now.toISOString().split('T')[0];
    const t = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    return `${d}_${t}`;
  }

  private static ts(): string {
    return new Date().toISOString();
  }

  private static ensureLogDir(): void {
    if (!fs.existsSync(Logger.logDir)) {
      fs.mkdirSync(Logger.logDir, { recursive: true });
    }
  }

  private static persist(entry: LogEntry): void {
    Logger.ensureLogDir();
    Logger.entries.push(entry);

    // ── Plain text log ──────────────────────────────────────────────────────
    const parts: string[] = [`[${entry.timestamp}]`, `[${entry.level.padEnd(8)}]`];
    if (entry.tcId)     parts.push(`[TC:${entry.tcId}]`);
    if (entry.step !== undefined) parts.push(`[Step:${entry.step}]`);
    if (entry.durationMs !== undefined) parts.push(`[${entry.durationMs}ms]`);
    parts.push(entry.message);
    if (entry.screenshotPath) parts.push(`| Screenshot: ${entry.screenshotPath}`);
    if (entry.attachments?.length) parts.push(`| Attachments: ${entry.attachments.join(', ')}`);

    const line = parts.join(' ');
    fs.appendFileSync(Logger.logFile, line + '\n');

    // ── JSON log (full structured output for CI dashboards) ─────────────────
    fs.writeFileSync(Logger.jsonFile, JSON.stringify(Logger.entries, null, 2));

    // ── Console output ───────────────────────────────────────────────────────
    const { C, LEVEL_COLOR } = Logger;
    const color = LEVEL_COLOR[entry.level] ?? '';
    let out = `${color}[${entry.level.padEnd(8)}]${C.reset}`;
    if (entry.tcId)     out += ` ${C.cyan}[TC:${entry.tcId}]${C.reset}`;
    if (entry.step !== undefined) out += ` ${C.gray}[Step:${entry.step}]${C.reset}`;
    out += ` ${entry.message}`;
    if (entry.durationMs !== undefined) out += ` ${C.gray}(${entry.durationMs}ms)${C.reset}`;
    console.log(out);

    if (entry.screenshotPath)  console.log(`  ${C.yellow}[Screenshot] ${entry.screenshotPath}${C.reset}`);
    if (entry.attachments?.length) {
      entry.attachments.forEach(a => console.log(`  ${C.gray}[Attachment] ${a}${C.reset}`));
    }
  }

  // ─── TC lifecycle ──────────────────────────────────────────────────────────

  /**
   * Log the START of a test case.
   * @param tcId   e.g. 'TC-001' or 'reg_ts01_tc01'
   * @param title  Human-readable test case title
   */
  static tcStart(tcId: string, title: string): void {
    Logger.stepCounter = 0;
    Logger.tcStartTime = Date.now();
    Logger.currentTcId = tcId;
    Logger.currentTcTitle = title;

    const sep = '═'.repeat(72);
    console.log(`\n${Logger.C.cyan}${Logger.C.bold}${sep}${Logger.C.reset}`);
    Logger.persist({
      timestamp: Logger.ts(),
      level: 'TC_START',
      tcId,
      tcTitle: title,
      message: `TEST CASE START  ►  ${tcId}: ${title}`,
    });
    console.log(`${Logger.C.cyan}${Logger.C.bold}${sep}${Logger.C.reset}\n`);
  }

  /**
   * Log the END of a test case.
   * @param status  'PASS' or 'FAIL'
   */
  static tcEnd(status: 'PASS' | 'FAIL' = 'PASS'): void {
    const durationMs = Logger.tcStartTime ? Date.now() - Logger.tcStartTime : undefined;
    const sep = '═'.repeat(72);

    console.log(`\n${Logger.C.cyan}${Logger.C.bold}${sep}${Logger.C.reset}`);
    Logger.persist({
      timestamp: Logger.ts(),
      level: status === 'PASS' ? 'TC_END' : 'TC_END',
      tcId:    Logger.currentTcId ?? undefined,
      tcTitle: Logger.currentTcTitle ?? undefined,
      durationMs,
      message: `TEST CASE END    ◄  ${Logger.currentTcId}: ${Logger.currentTcTitle} | Status: ${status}`,
    });
    console.log(`${Logger.C.cyan}${Logger.C.bold}${sep}${Logger.C.reset}\n`);

    Logger.tcStartTime = null;
    Logger.currentTcId = null;
    Logger.currentTcTitle = null;
  }

  // ─── Step-level logging ────────────────────────────────────────────────────

  /**
   * Log a test step (increment step counter).
   */
  static step(message: string): void {
    Logger.stepCounter++;
    Logger.persist({
      timestamp: Logger.ts(),
      level: 'STEP',
      tcId: Logger.currentTcId ?? undefined,
      step: Logger.stepCounter,
      message: `► ${message}`,
    });
  }

  /** Log a successful step outcome. */
  static stepPass(message: string): void {
    Logger.persist({
      timestamp: Logger.ts(),
      level: 'PASS',
      tcId: Logger.currentTcId ?? undefined,
      step: Logger.stepCounter,
      message: `✔ ${message}`,
    });
  }

  /**
   * Log a failed step and capture a screenshot.
   * @param page  Playwright Page object
   * @param message  Description of the failure
   */
  static async stepFail(page: Page, message: string): Promise<void> {
    const screenshotPath = await Logger.captureScreenshot(
      page,
      `fail-step${Logger.stepCounter}`
    );
    Logger.persist({
      timestamp: Logger.ts(),
      level: 'FAIL',
      tcId: Logger.currentTcId ?? undefined,
      step: Logger.stepCounter,
      message: `✘ STEP FAILED: ${message}`,
      screenshotPath,
    });
  }

  // ─── Failure artifact capture ──────────────────────────────────────────────

  /**
   * Take a full-page screenshot and save to logs/screenshots/.
   * @returns  Absolute path of the saved screenshot file.
   */
  static async captureScreenshot(page: Page, name = 'screenshot'): Promise<string> {
    Logger.ensureLogDir();
    const dir = path.join(Logger.logDir, 'screenshots');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '-');
    const filePath = path.join(dir, `${safeName}-${Date.now()}.png`);

    try {
      await page.screenshot({ path: filePath, fullPage: true });
      Logger.info(`[Screenshot saved] ${filePath}`);
    } catch (e) {
      Logger.warn(`[Screenshot failed] ${(e as Error).message}`);
    }
    return filePath;
  }

  /**
   * Call this in a catch block to capture screenshot and log
   * references to video & trace artifacts produced by Playwright.
   *
   * @param page        Playwright Page object
   * @param methodName  Name of the method / step that failed
   * @param error       The caught error
   */
  static async captureOnFailure(
    page: Page,
    methodName: string,
    error: unknown
  ): Promise<void> {
    const errorMsg = error instanceof Error ? error.message : String(error);
    Logger.error(`FAILURE in [${methodName}]: ${errorMsg}`);

    const screenshotPath = await Logger.captureScreenshot(
      page,
      `failure-${methodName.replace(/[\s/\\:*?"<>|]/g, '-')}`
    );

    // Playwright writes video + trace into test-results/ (configured in playwright.config)
    const testResultsDir = path.join(process.cwd(), 'test-results');
    const attachments: string[] = [
      `${testResultsDir}/**/*.webm  (video)`,
      `${testResultsDir}/**/*.zip   (trace - open with: npx playwright show-trace <file>)`,
    ];

    Logger.persist({
      timestamp: Logger.ts(),
      level: 'FAIL',
      tcId: Logger.currentTcId ?? undefined,
      step: Logger.stepCounter,
      message: `✘ FAILURE in [${methodName}]: ${errorMsg}`,
      screenshotPath,
      attachments,
    });
  }

  // ─── Standard log methods ──────────────────────────────────────────────────

  static info(message: string): void {
    Logger.persist({
      timestamp: Logger.ts(),
      level: 'INFO',
      tcId: Logger.currentTcId ?? undefined,
      message,
    });
  }

  static warn(message: string): void {
    Logger.persist({
      timestamp: Logger.ts(),
      level: 'WARN',
      tcId: Logger.currentTcId ?? undefined,
      message,
    });
  }

  static error(message: string): void {
    Logger.persist({
      timestamp: Logger.ts(),
      level: 'ERROR',
      tcId: Logger.currentTcId ?? undefined,
      message,
    });
  }

  static debug(message: string): void {
    if (process.env.LOG_LEVEL === 'debug' || !Logger.isCI) {
      Logger.persist({
        timestamp: Logger.ts(),
        level: 'DEBUG',
        tcId: Logger.currentTcId ?? undefined,
        message,
      });
    }
  }

static pass(message: string): void {
    Logger.persist({
      timestamp: Logger.ts(),
      level: 'PASS',
      // tcId: Logger.currentTcId ?? undefined,
      step: Logger.stepCounter,
      message: `✔ ${message}`,
    });
  }
 
  /**
   * Log a red [FAIL] — use only in verify* methods on failure.
   * Does NOT throw — caller is responsible for throwing the error.
   * @param message  e.g. `[verifyNumericOrder] Order broken at [2]: 5 > 3`
   */
  static fail(message: string): void {
    Logger.persist({
      timestamp: Logger.ts(),
      level: 'FAIL',
      // tcId: Logger.currentTcId ?? undefined,
      step: Logger.stepCounter,
      message: `✘ ${message}`,
    });
  }
}
