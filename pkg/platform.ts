import {exec} from "node:child_process";

export class linux {
    static async whereIs(execFile: string): Promise<string> {
        return await linux.findExecutablePath(execFile)
    }

    static is(): boolean {
        return process.platform === 'linux'
    }

    private static findExecutablePath(command: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            exec(`which ${command}`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error executing which: ${stderr || error.message}`);
                    return;
                }
                const path = stdout.trim();
                if (path) {
                    resolve(path);
                } else {
                    reject(`Executable for ${command} not found.`);
                }
            });
        });
    }
}

export class windows {
    static is(): boolean {
        return process.platform === 'win32'
    }

    static async whereIs(execFile: string): Promise<string> {
        return await windows.findExecutablePath(execFile)
    }

    private static findExecutablePath(execFile: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            exec(`where ${execFile}`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error executing where: ${stderr || error.message}`);
                    return;
                }
                const paths = stdout.trim().split('\n');
                if (paths.length > 0) {
                    resolve(paths[0].trim());
                } else {
                    reject(`Executable for ${error} not found.`);
                }
            });
        });
    }
}

export class platform_fs {
    static async whereIs(execFile: string): Promise<string> {
        if (windows.is()) {
            return windows.whereIs(execFile)
        } else if (linux.is()) {
            return linux.whereIs(execFile)
        }
        throw new Error("not supported");
    }
}