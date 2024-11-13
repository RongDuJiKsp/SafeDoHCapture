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
            exec(`whereis ${command}`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error executing whereis: ${stderr || error.message}`);
                    return;
                }
                const paths = stdout.split(':')[1]?.trim();
                if (paths) {
                    resolve(paths);
                } else {
                    reject(`Executable for ${command} not found.`);
                }
            });
        });
    }
}