const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const ROOT_DIR = path.join(__dirname, "..");
const REPORT_SRC = path.join(ROOT_DIR, "playwright-report");
const TEST_RESULTS_DIR = path.join(ROOT_DIR, "test-results");
const LOGS_DIR = path.join(ROOT_DIR, "logs");
const HTML_REPORTS_DIR = path.join(__dirname, "html-reports-zip");

function getTimestamp() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

/**
 @param {string} projectName
 @returns {{ zipFileName: string, zipPath: string } | null}
 */
function findExistingZip(projectName) {
    if (!fs.existsSync(HTML_REPORTS_DIR)) return null;

    const indexFilePath = path.join(REPORT_SRC, "index.html");
    const reportModifiedTime = fs.statSync(indexFilePath).mtimeMs;

    const zips = fs.readdirSync(HTML_REPORTS_DIR)
        .filter(f => f.startsWith(`${projectName}-`) && f.endsWith(".zip"))
        .map(f => ({
            zipFileName: f,
            zipPath: path.join(HTML_REPORTS_DIR, f),
            createdAt: fs.statSync(path.join(HTML_REPORTS_DIR, f)).mtimeMs,
        }))
        .filter(z => z.createdAt >= reportModifiedTime)
        .sort((a, b) => b.createdAt - a.createdAt);

    if (zips.length > 0) {
        return { zipFileName: zips[0].zipFileName, zipPath: zips[0].zipPath };
    }

    return null;
}

/**
 @param {string} projectName
 @returns {Promise<{ zipFileName: string, zipPath: string }>}
 */
async function generateReport(projectName = "project") {
    const indexFilePath = path.join(REPORT_SRC, "index.html");

    if (!fs.existsSync(REPORT_SRC)) {
        throw new Error(`playwright-report/ not found at "${REPORT_SRC}". Ensure Playwright tests ran successfully.`);
    }

    if (!fs.existsSync(indexFilePath)) {
        throw new Error(`index.html not found at "${indexFilePath}". The HTML report may not have generated correctly.`);
    }

    const existing = findExistingZip(projectName);
    if (existing) return existing;

    if (!fs.existsSync(HTML_REPORTS_DIR)) {
        fs.mkdirSync(HTML_REPORTS_DIR, { recursive: true });
    }

    const timestamp = getTimestamp();
    const zipFileName = `${projectName}-${timestamp}.zip`;
    const zipPath = path.join(HTML_REPORTS_DIR, zipFileName);

    // Only include files from the current run (modified at or after the report was generated)
    const runStartTime = fs.statSync(indexFilePath).mtimeMs;

    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => {
            const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(1);
            console.log(`Report ZIP: ${zipFileName} (${sizeMB} MB)`);
            resolve({ zipFileName, zipPath });
        });

        archive.on("warning", (warn) => {
            if (warn.code === "ENOENT") {
                console.warn(`Archive warning: ${warn.message}`);
            } else {
                reject(warn);
            }
        });

        archive.on("error", (err) => {
            console.error(`Archive error: ${err.message}`);
            reject(err);
        });

        archive.pipe(output);

        // Full Playwright HTML report
        archive.directory(REPORT_SRC, "playwright-report");

        // Traces and screenshots from test-results/ (Playwright clears this each run)
        if (fs.existsSync(TEST_RESULTS_DIR)) {
            archive.directory(TEST_RESULTS_DIR, "test-results");
        }

        // Only logs and screenshots from the current run (filter by modification time)
        if (fs.existsSync(LOGS_DIR)) {
            const screenshotsDir = path.join(LOGS_DIR, "screenshots");
            if (fs.existsSync(screenshotsDir)) {
                fs.readdirSync(screenshotsDir)
                    .filter(f => fs.statSync(path.join(screenshotsDir, f)).mtimeMs >= runStartTime)
                    .forEach(f => archive.file(path.join(screenshotsDir, f), { name: `logs/screenshots/${f}` }));
            }

            fs.readdirSync(LOGS_DIR)
                .filter(f => (f.endsWith(".log") || f.endsWith(".json")) &&
                             fs.statSync(path.join(LOGS_DIR, f)).mtimeMs >= runStartTime)
                .forEach(f => archive.file(path.join(LOGS_DIR, f), { name: `logs/${f}` }));
        }

        archive.finalize();
    });
}

module.exports = { generateReport };

if (require.main === module) {
    const pkg = (() => { try { return require("../package.json"); } catch { return {}; } })();
    const projectName = process.env.PROJECT_NAME || pkg.name || "project";
    generateReport(projectName)
        .then(({ zipFileName }) => console.log(`Done: ${zipFileName}`))
        .catch(err => { console.error(err.message); process.exit(1); });
}