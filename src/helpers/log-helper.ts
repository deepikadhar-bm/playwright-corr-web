import * as fs from "fs";
import * as path from "path";



export class Logger {
    
    private static getDateTime(): string { // Helper method to get current date and time for log file naming

    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // replace : for Windows filename safety

    return `${date}_${time}`;
}


    private static logDir = path.join(process.cwd(), "logs");
    private static logFile = path.join(Logger.logDir,`test-log-${Logger.getDateTime()}.log`);

    private static getDate(): string {
        return new Date().toISOString().split("T")[0];
    }
    
    private static getTimestamp(): string {
        return new Date().toISOString();
    }

    private static writeLog(level: string, message: string) {
        if (!fs.existsSync(Logger.logDir)) {
            fs.mkdirSync(Logger.logDir);
        }
        const logMessage = `[${Logger.getTimestamp()}] [${level.toUpperCase()}]: ${message}\n`;
        fs.appendFileSync(Logger.logFile, logMessage);
        console.log(logMessage.trim());
    }

    static info(message: string) {
        this.writeLog("info", message);
    }

    static warn(message: string) {
        this.writeLog("warn", message);
    }

    static error(message: string) {
        this.writeLog("error", message);
    }

    static step(message: string) {
        this.writeLog("step", `${message}`);
    }

    static success(message: string) {
        this.writeLog("success", message);
    }

    static debug(message: string) {
        this.writeLog("debug", message);
    }

}